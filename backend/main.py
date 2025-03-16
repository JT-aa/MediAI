from fastapi import FastAPI, File, UploadFile, Depends, Form
from sqlalchemy import Column, Integer, String, create_engine, Date, \
  LargeBinary, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.mysql import LONGBLOB
from sqlalchemy.orm import sessionmaker, Session
# import onnxruntime as ort
# import numpy as np
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response  # <-- Import Response
from fastapi.exceptions import HTTPException  # <-- Import HTTPException
from PyPDF2 import PdfReader
import math
import api
import json
import pymysql

pymysql.install_as_MySQLdb()

# MySQL Database setup
DATABASE_URL = "mysql://root:12345678@localhost:3306/mediai"  # Update with your actual credentials

# Set up SQLAlchemy
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


#Set up AnythingLLM Api
token = "9F79ZPK-XV640VK-Q3C4841-7CP94Z5"
base_url = "http://localhost:3001/api"
slug = "my-workplace"
anythingllmapi = api.Api(token, base_url, slug)


def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()


# Define User model
class User(Base):
  __tablename__ = "users"
  user_id = Column(Integer, primary_key=True, index=True)
  name = Column(String(255), index=True)
  age = Column(Integer, index=True)
  gender = Column(String(255), index=True)
  height_ft = Column(Integer, index=True)
  height_in = Column(Integer, index=True)
  weight = Column(Integer, index=True)
  body_fat = Column(Integer, index=True)
  trend = Column(String(1000), index=True)


# Define Lab report model
class LabReport(Base):
  __tablename__ = "lab_reports"
  report_id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, index=True)
  name = Column(String(255), index=True)
  date = Column(Date, index=True)
  file_blob = Column(LONGBLOB, nullable=False)
  extracted_text = Column(Text)
  analysis = Column(Text)
  lifestyle_change_suggestions = Column(Text)
  medical_recommendations = Column(Text)
  risk_level = Column(Integer)
  health_score = Column(Integer)


# Create the tables in the database (usually done once during app initialization)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allowed origins (frontend URL)
origins = [
  "http://localhost:5173",  # Your frontend Vite app
]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend to access
    allow_credentials=True,
    allow_methods=["*"],
    # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Load ONNX Model (Example)
# onnx_model = ort.InferenceSession("model.onnx")

def read_pdf(file) -> str:
  """Read content from a PDF file-like object."""
  try:
    reader = PdfReader(file)
    text = "\n".join(
        page.extract_text() for page in reader.pages if page.extract_text())
    return text
  except Exception as e:
    raise ValueError(f"Error reading PDF file: {e}")



def calculate_health_score(health_scores, alpha=0.07):
  """
  Calculate the overall health score based on a list of risk scores.

  Parameters:
      health_scores (list of float): A list of risk scores (0-100).
      alpha (float): Sensitivity factor that controls how much high-risk values impact the score.

  Returns:
      float: The health score (0-100), where 100 is the healthiest.
  """
  if not health_scores:
    return 100  # If no risk scores are provided, assume perfect health

  penalty = sum(math.exp(alpha * (r - 50)) for r in health_scores)
  health_score = 100 / (1 + penalty)

  return round(health_score, 2)


@app.get("/")
def read_root():
  return {"message": "Welcome to MediAI Backend!"}

@app.get("/trend")
def get_trend(db: Session = Depends(get_db)):
  user = db.query(User).filter(User.user_id == 1).first()
  if user is None:
    return {"message": "User not found"}
  trend = user.trend
  if trend is None:
    return {"message": "No trend data available"}
  return {"trend": trend}

@app.put("/trend")
def update_trend(db: Session = Depends(get_db)):
  lab_reports = db.query(LabReport).filter(LabReport.user_id == 1).all()
  # print(lab_reports)
  user = db.query(User).filter(User.user_id == 1).first()
  user.trend = anythingllmapi.generate_overall_report(lab_reports)
  db.commit()
  db.refresh(user)
  return 


# get user information from the mysql database
@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
  user = db.query(User).filter(User.user_id == user_id).first()
  if user is None:
    return {"message": "User not found"}
  return user


# Define Pydantic model for user update
class UserUpdate(BaseModel):
  name: str
  age: int
  gender: str
  height_ft: int
  height_in: int
  weight: int
  body_fat: int


# update user information in the mysql database
@app.put("/users/{user_id}")
def update_user(user_id: int, user_data: UserUpdate,
    db: Session = Depends(get_db)):
  user = db.query(User).filter(User.user_id == user_id).first()
  if user is None:
    return {"message": "User not found"}
  user.name = user_data.name
  user.age = user_data.age
  user.gender = user_data.gender
  user.height_ft = user_data.height_ft
  user.height_in = user_data.height_in
  user.weight = user_data.weight
  user.body_fat = user_data.body_fat
  db.commit()
  return user


@app.post("/lab_reports/")
async def create_lab_report(
    user_id: int = Form(...),
    date: str = Form(...),
    name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
  try:
    file_content = await file.read()  # Read file content as binary
    await file.seek(0)  # Reset the pointer to allow re-reading
    extracted_text = read_pdf(file.file)  # Pass file-like object
    user_info = db.query(User).filter(User.user_id == user_id).first()
    if user_info is None:
      return {"message": "User not found"}
    print("User info:", user_info)
    # Extract user information and append to extracted text
    user_info_str = f"User ID: {user_info.user_id}, Name: {user_info.name}, Age: {user_info.age}, Gender: {user_info.gender}, Height: {user_info.height_ft}ft {user_info.height_in}in, Weight: {user_info.weight}lbs, Body Fat: {user_info.body_fat}%"
    extracted_text = user_info_str + "\n" + extracted_text

    print("Extracted text:", extracted_text)

    lab_report = LabReport(
        user_id=user_id,
        name=name,
        date=date,
        file_blob=file_content,
        extracted_text=extracted_text
    )

    db.add(lab_report)
    db.commit()
    db.refresh(lab_report)

    return {
      "report_id": lab_report.report_id,
      "user_id": lab_report.user_id,
      "date": lab_report.date,
      "name": lab_report.name,
      "message": "Lab report uploaded successfully"
    }
  except Exception as e:
    raise HTTPException(status_code=500,
                        detail=f"Error processing lab report: {e}")


# get lab report information by report_id from the mysql database
@app.get("/lab_reports/{report_id}")
def read_lab_report(report_id: int, db: Session = Depends(get_db)):
  lab_report = db.query(LabReport).filter(
    LabReport.report_id == report_id).first()
  if lab_report is None:
    return {"message": "Lab report not found"}
  return {
    "report_id": lab_report.report_id,
    "user_id": lab_report.user_id,
    "date": lab_report.date,
    "risk_level": lab_report.risk_level,
    "health_score": lab_report.health_score,
    "name": lab_report.name,
    "analysis": lab_report.analysis,
    "lifestyle_change_suggestions": lab_report.lifestyle_change_suggestions,
    "medical_recommendations": lab_report.medical_recommendations,
  }


# get lab report information by user_id from the mysql database
@app.get("/lab_reports/user/{user_id}")
def read_lab_reports(user_id: int, db: Session = Depends(get_db)):
  lab_reports = db.query(LabReport).filter(LabReport.user_id == user_id).all()

  if not lab_reports:
    return {"message": "Lab reports not found"}

  # Return only metadata (report_id, user_id, date) for each lab report
  return [
    {
      "report_id": report.report_id,
      "user_id": report.user_id,
      "date": report.date,
      "risk_level": report.risk_level,
      "name": report.name,
      "health_score": report.health_score
    }
    for report in lab_reports
  ]


@app.delete("/lab_reports/{report_id}")
def delete_lab_report(report_id: int, db: Session = Depends(get_db)):
  lab_report = db.query(LabReport).filter(
    LabReport.report_id == report_id).first()
  if lab_report is None:
    return {"message": "Lab report not found"}
  db.delete(lab_report)
  db.commit()
  return {"message": "Lab report deleted"}


# get lab report PDF by report_id from the mysql database
@app.get("/lab_reports/{report_id}/pdf")
def get_pdf(report_id: int, db: Session = Depends(get_db)):
  lab_report = db.query(LabReport).filter(
    LabReport.report_id == report_id).first()
  if not lab_report:
    raise HTTPException(status_code=404, detail="Lab report not found")
  pdf_data = lab_report.file_blob  # Assuming `pdf_file` holds the PDF binary data in the DB
  return Response(pdf_data, media_type="application/pdf")


@app.get("/health_score/{user_id}")
def get_health_score(user_id: int, db: Session = Depends(get_db)):
  lab_reports = db.query(LabReport).filter(LabReport.user_id == user_id).all()
  lastest_report_by_date = sorted(lab_reports, key=lambda x: x.date)[-1]
  health_score = lastest_report_by_date.health_score
  print("id of the latest report:", lastest_report_by_date.report_id)
  
  # health_scores = [report.health_score for report in lab_reports if
                #  report.health_score is not None]
  # health_score = calculate_health_score(health_scores)
  return {"user_id": user_id, "health_score": health_score}

@app.get("/lab_reports/health_score/{report_id}")
def get_health_score_by_report_id(report_id: int, db: Session = Depends(get_db)):
    lab_report = db.query(LabReport).filter(LabReport.report_id == report_id).first()
    if not lab_report:
        raise HTTPException(status_code=404, detail="Lab report not found")
    health_score = lab_report.health_score
    return {"report_id": report_id, "health_score": health_score}

@app.put("/lab_reports/{report_id}/analysis")
def update_analysis(report_id: int, db: Session = Depends(get_db)):
    lab_report = db.query(LabReport).filter(LabReport.report_id == report_id).first()
    
    if not lab_report:
        raise HTTPException(status_code=404, detail="Lab report not found")

    # Call API to update analysis
    print("Extracted text:", lab_report.extracted_text)
    print("Calling API...")
    lab_report.analysis = anythingllmapi.send_prompt(lab_report.extracted_text)
    print("API response:", lab_report.analysis)
    # Update risk level and health_score based on analysis
    # Assuming the API returns a JSON object with only "health_score"
    # if health_score is 70 - 100, risk_level is 1
    # if health_score is 40 - 69, risk_level is 2
    # if health_score is 0 - 39, risk_level is 3
    analysis_dict = json.loads(lab_report.analysis)
    lab_report.health_score = analysis_dict["health_score"]["score"]
    lab_report.risk_level = 1 if lab_report.health_score >= 70 else 2 if lab_report.health_score >= 40 else 3
    db.commit()
    db.refresh(lab_report)

    # Return the response **without** the `file_blob`
    return {
        "report_id": lab_report.report_id,
        "user_id": lab_report.user_id,
        "name": lab_report.name,
        "date": lab_report.date,
        "analysis": lab_report.analysis,
        "risk_level": lab_report.risk_level,
        "health_score": lab_report.health_score
    }
