#simple FastAPI route 
#Befor enything We should set up a Python backend with a React frontend
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI backend!"}