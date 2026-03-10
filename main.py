from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from routers import router as api_router
import database

# Initialize DB on startup
database.init_db()

app = FastAPI(title="DocuGenAI - Project Intelligence")

# Mount API
app.include_router(api_router)

# Mount static files folder
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)
    
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/", response_class=HTMLResponse)
def serve_spa():
    # Serve the frontend single page app
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        return "<html><body><h1>DocuGenAI Frontend Not Built Yet</h1><p>Please check the static folder.</p></body></html>"

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
