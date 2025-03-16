# MediAI
On-Device Medical Diagnosis and Recommendations

## Description
MediAI is an AI-powered medical assistant designed to help users analyze their medical examination reports. Our application allows users to upload lab reports, extracts relevant health metrics, and provides insights such as:

1. **Health Score Calculation & Trend:** Generates a personalized health score based on lab results. Analyze the health trend.
2. **Analysis & Risk Assessment**: Identifies potential health risks based on medical data.
3. **Personalized Recommendations**: Suggests lifestyle adjustments and medical follow-ups.
4. **Secure On-Device Processing**: Ensures user privacy by running the AI analysis locally.
By leveraging AI and medical data interpretation, MediAI aims to empower users with actionable insights for better health management.
## Contributors
- Jingtao Han han.jingt@northeastern.edu
- Ruiyi Li li.ruiyi@northeastern.edu
- Yan Zhao zhao.y4@northeastern.edu
- Songling Zhou zhou.son@northeastern.edu
- Han Yang yang.han4@northeastern.edu

## Tech Stack
- **React.js** with **Vite** for frontend
- **Python FastAPI** for backend
- **Llama Optimized for Snapdragon** in **AnythingLLM** for on device LLM
- Local **LanceDB** as vector database for better medical understanding

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
create a schema called "mediai" in local mysql database.
replace the credentials in DATABASE_URL in main.py with your own.
do not enter the comments.
```
cd MediAI/backend

python -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate (Linux/Mac)
venv\Scripts\activate  # Activate (Windows)

pip install -r requirements.txt
uvicorn main:app --reload
```
the backend will be running locally on http://127.0.0.1:8000/

## Run and Usage

- **My Health Score**
- **My Health Journey**
- **My Health Trend**
- **Potential Problems**
- **Medical Recommendations**
- **Lifestyle Change Suggestions**

  
Open the Application

Launch a web browser and navigate to:
http://localhost:5173/  
Upload a Lab Report



On the right side of the page, click "Upload New Lab Report."
Select and upload a PDF version of your medical examination report.
Then the system will the Report

Wait approximately 30 seconds for the AI to analyze your report.
The risk level will update from "Pending" to its corresponding category based on your health data.
View Detailed Analysis

Click "View Report" to access a comprehensive breakdown of your lab results, including:
Health Score
Potential Risks
Personalized Recommendations
