from fastapi import FastAPI, File, UploadFile, Depends, Form
from sqlalchemy import Column, Integer, String, create_engine, Date, LargeBinary, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.mysql import LONGBLOB
from sqlalchemy.orm import sessionmaker, Session
import onnxruntime as ort
import numpy as np
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response  # <-- Import Response
from fastapi.exceptions import HTTPException  # <-- Import HTTPException


import pymysql
pymysql.install_as_MySQLdb()

# MySQL Database setup
DATABASE_URL = "mysql://root:12345678@localhost:3306/mediai"  # Update with your actual credentials

# Set up SQLAlchemy
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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
    risk_level = Column(Integer)

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
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Load ONNX Model (Example)
# onnx_model = ort.InferenceSession("model.onnx")

@app.get("/")
def read_root():
    return {"message": "Welcome to MediAI Backend!"}

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
def update_user(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
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
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    try:
        # Log input data for debugging
        print(f"Received user_id: {user_id}, date: {date}, file size: {len(await file.read())}")
        
        # Re-read the file as the read() call above consumes the content
        await file.seek(0)  # Reset the pointer to the start of the file
        
        file_content = await file.read()  # Now read the content asynchronously
        lab_report = LabReport(user_id=user_id, date=date, file_blob=file_content)
        
        db.add(lab_report)
        db.commit()  # Commit the transaction
        
        # Refresh and log the inserted lab report
        db.refresh(lab_report)
        print(f"Inserted LabReport with report_id: {lab_report.report_id}")
        
        # Return metadata excluding the binary file content
        return {
            "report_id": lab_report.report_id,
            "user_id": lab_report.user_id,
            "date": lab_report.date,
            "message": "Lab report uploaded successfully"
        }
    except Exception as e:
        print(f"Error inserting lab report: {e}")
        return {"error": str(e)}

# get lab report information by report_id from the mysql database
@app.get("/lab_reports/{report_id}")
def read_lab_report(report_id: int, db: Session = Depends(get_db)):
    lab_report = db.query(LabReport).filter(LabReport.report_id == report_id).first()
    if lab_report is None:
        return {"message": "Lab report not found"}
    return {
            "report_id": lab_report.report_id,
            "user_id": lab_report.user_id,
            "date": lab_report.date,
            "risk_level": lab_report.risk_level,
            "name": lab_report.name,
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
        }
        for report in lab_reports
    ]

@app.delete("/lab_reports/{report_id}")
def delete_lab_report(report_id: int, db: Session = Depends(get_db)):
    lab_report = db.query(LabReport).filter(LabReport.report_id == report_id).first()
    if lab_report is None:
        return {"message": "Lab report not found"}
    db.delete(lab_report)
    db.commit()
    return {"message": "Lab report deleted"}

# get lab report PDF by report_id from the mysql database
@app.get("/lab_reports/{report_id}/pdf")
def get_pdf(report_id: int, db: Session = Depends(get_db)):
    lab_report = db.query(LabReport).filter(LabReport.report_id == report_id).first()
    if not lab_report:
        raise HTTPException(status_code=404, detail="Lab report not found")
    pdf_data = lab_report.file_blob  # Assuming `pdf_file` holds the PDF binary data in the DB
    return Response(pdf_data, media_type="application/pdf")



# @app.post("/predict/")
# async def predict(file: UploadFile = File(...)):
#     # Dummy inference - Replace with real processing
#     data = np.random.rand(1, 10).astype(np.float32)
#     result = onnx_model.run(None, {"input": data})
#     return {"prediction": result}