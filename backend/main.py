from fastapi import FastAPI, File, UploadFile
import onnxruntime as ort
import numpy as np

app = FastAPI()

# Load ONNX Model (Example)
# onnx_model = ort.InferenceSession("model.onnx")

@app.get("/")
def read_root():
    return {"message": "Welcome to MediAI Backend!"}

# @app.post("/predict/")
# async def predict(file: UploadFile = File(...)):
#     # Dummy inference - Replace with real processing
#     data = np.random.rand(1, 10).astype(np.float32)
#     result = onnx_model.run(None, {"input": data})
#     return {"prediction": result}