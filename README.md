# MediAI
On-Device Medical Diagnosis and Recommendations

## Description
## Contributors
## Setup
Clone the project to local 
```
git clone https://github.com/JT-aa/MediAI.git
```
### Frontend Setup
```
cd MediAI/frontend
npm install
npm run dev
```
the frontend will be running locally on http://localhost:5173/

### Backend Setup
do not enter the comments
```
cd MediAI/backend

python -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate (Linux/Mac)
venv\Scripts\activate  # Activate (Windows)
pip install fastapi uvicorn onnxruntime pydantic numpy sqlalchemy pymysql mysqlclient cryptography

uvicorn main:app --reload
```
the backend will be running locally on http://127.0.0.1:8000/

## Run and Usage
