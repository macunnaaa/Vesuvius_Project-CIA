from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io, base64, numpy as np
from PIL import Image
from database import login_user, register_user  # database.py 
from model import run_vesuvius_ai               # model.py 

app = FastAPI()

# Frontend (React) 
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# JSON  
class Auth(BaseModel):
    username: str
    password: str

#  1. (Login)
@app.post("/login")
async def login(data: Auth):
    # // Check if the user exists in the database
    if login_user(data.username, data.password): 
        return {"status": "success", "username": data.username}
    raise HTTPException(status_code=401, detail="Invalid Credentials")

#  2. (Register) 
@app.post("/register")
async def register(data: Auth):
    # // Persist new user information in the vesuvius_db2 database
    if register_user(data.username, data.password): 
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Registration failed")

#  3. Kaggle algorithem (AI Analysis) ---
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    # 1. // Read the uploaded image in binary format
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert('L')
    
    # 2. // Execute the original Kaggle 0.295 algorithm from model.py
    mask = run_vesuvius_ai(np.array(img))
    
    # 3. # Convert the result to PNG and encode it as a Base64 string
    res = Image.fromarray(mask)
    buf = io.BytesIO()
    res.save(buf, format="PNG")
    img_str = base64.b64encode(buf.getvalue()).decode()
    
    # 4. // Send the results to the React frontend
    return {
        "status": "Success", 
        "image": img_str, 
        "score": "0.295"
    }