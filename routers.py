from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse, FileResponse
from typing import List
import os
import json
import uuid
import datetime
import hashlib

# Auth settings
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
STATIC_TOKEN = hashlib.md5(f"{ADMIN_USERNAME}:{ADMIN_PASSWORD}SALT".encode()).hexdigest()

security = HTTPBearer()

def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != STATIC_TOKEN:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials

import database as db
import models
import services
import stitch_service

router = APIRouter(prefix="/api")

# --- AUTH ---
@router.post("/login", response_model=models.TokenResponse)
def login(request: models.LoginRequest):
    if request.username == ADMIN_USERNAME and request.password == ADMIN_PASSWORD:
        return {"access_token": STATIC_TOKEN, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Incorrect username or password")

# --- WORKSPACES ---

@router.get("/workspaces", response_model=List[models.WorkspaceResponse])
def get_workspaces(token: str = Depends(verify_admin)):
    conn = db.get_db()
    rows = conn.execute("SELECT id, title, created_at FROM workspaces ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]

@router.post("/workspaces", response_model=models.WorkspaceResponse)
def create_workspace(workspace: models.WorkspaceCreate, token: str = Depends(verify_admin)):
    conn = db.get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO workspaces (title) VALUES (?)", (workspace.title,))
    workspace_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": workspace_id, "title": workspace.title, "created_at": datetime.datetime.now().isoformat()}

@router.get("/workspaces/{workspace_id}")
def get_workspace_details(workspace_id: int, token: str = Depends(verify_admin)):
    conn = db.get_db()
    workspace = conn.execute("SELECT * FROM workspaces WHERE id = ?", (workspace_id,)).fetchone()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    sources = conn.execute("SELECT id, filename, uploaded_at FROM workspace_sources WHERE workspace_id = ?", (workspace_id,)).fetchall()
    documents = conn.execute("SELECT * FROM documents WHERE workspace_id = ?", (workspace_id,)).fetchall()
    
    # We also need to map the available templates against generated documents to track progress
    all_templates = services.get_templates()
    
    docs_by_path = {doc['template_path']: dict(doc) for doc in documents}
    
    enriched_templates = []
    for t in all_templates:
        existing_doc = docs_by_path.get(t['path'])
        if existing_doc:
            enriched_templates.append({
                "template": t,
                "document": existing_doc,
                "status": existing_doc['status']
            })
        else:
            enriched_templates.append({
                "template": t,
                "document": None,
                "status": "Pending"
            })
            
    conn.close()
    
    return {
        "workspace": dict(workspace),
        "sources": [dict(s) for s in sources],
        "templates_progress": enriched_templates
    }

@router.put("/workspaces/{workspace_id}", response_model=models.WorkspaceResponse)
def update_workspace(workspace_id: int, update: models.WorkspaceUpdate, token: str = Depends(verify_admin)):
    conn = db.get_db()
    cursor = conn.cursor()
    workspace = cursor.execute("SELECT * FROM workspaces WHERE id = ?", (workspace_id,)).fetchone()
    if not workspace:
        conn.close()
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    if update.title is not None:
        cursor.execute("UPDATE workspaces SET title = ? WHERE id = ?", (update.title, workspace_id))
        conn.commit()
        
    updated = cursor.execute("SELECT * FROM workspaces WHERE id = ?", (workspace_id,)).fetchone()
    conn.close()
    return dict(updated)

@router.delete("/workspaces/{workspace_id}")
def delete_workspace(workspace_id: int, token: str = Depends(verify_admin)):
    conn = db.get_db()
    cursor = conn.cursor()
    workspace = cursor.execute("SELECT id FROM workspaces WHERE id = ?", (workspace_id,)).fetchone()
    if not workspace:
        conn.close()
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    # Manual cascade deletes since SQLite PRAGMA foreign_keys might be disabled
    cursor.execute("DELETE FROM workspace_sources WHERE workspace_id = ?", (workspace_id,))
    cursor.execute("DELETE FROM documents WHERE workspace_id = ?", (workspace_id,))
    cursor.execute("DELETE FROM workspaces WHERE id = ?", (workspace_id,))
    
    conn.commit()
    conn.close()
    return {"message": "Workspace deleted successfully"}

# --- SOURCES ---

@router.post("/workspaces/{workspace_id}/sources")
async def upload_source(workspace_id: int, file: UploadFile = File(...), token: str = Depends(verify_admin)):
    conn = db.get_db()
    workspace = conn.execute("SELECT id FROM workspaces WHERE id = ?", (workspace_id,)).fetchone()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    contents = await file.read()
    filename = file.filename.lower()
    extracted_text = ""
    
    if filename.endswith(".pdf"):
        extracted_text = services.extract_text_from_pdf(contents)
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        extracted_text = services.extract_text_from_docx(contents)
    elif filename.endswith(".md") or filename.endswith(".txt"):
        extracted_text = services.extract_text_from_md(contents)
    else:
        # Fallback raw extraction
        extracted_text = services.extract_text_from_md(contents)
        
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO workspace_sources (workspace_id, filename, content) VALUES (?, ?, ?)",
        (workspace_id, file.filename, extracted_text)
    )
    conn.commit()
    conn.close()
    
    return {"message": "Source uploaded successfully", "filename": file.filename}

@router.post("/workspaces/{workspace_id}/sources/text")
def upload_source_text(workspace_id: int, source: models.SourceCreate, token: str = Depends(verify_admin)):
    conn = db.get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO workspace_sources (workspace_id, filename, content) VALUES (?, ?, ?)",
        (workspace_id, 'Pasted Text: ' + source.title, source.content)
    )
    conn.commit()
    conn.close()
    return {"message": "Text source added successfully"}

@router.delete("/workspaces/{workspace_id}/sources/{source_id}")
def delete_source(workspace_id: int, source_id: int, token: str = Depends(verify_admin)):
    conn = db.get_db()
    cursor = conn.cursor()
    
    # Verify it exists in this workspace
    existing = cursor.execute("SELECT id FROM workspace_sources WHERE workspace_id = ? AND id = ?", (workspace_id, source_id)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Source not found")
        
    cursor.execute("DELETE FROM workspace_sources WHERE id = ?", (source_id,))
    conn.commit()
    conn.close()
    return {"message": "Source deleted successfully"}

@router.get("/workspaces/{workspace_id}/sources/content")
def get_sources_content(workspace_id: int, token: str = Depends(verify_admin)):
    conn = db.get_db()
    sources = conn.execute("SELECT filename, content FROM workspace_sources WHERE workspace_id = ?", (workspace_id,)).fetchall()
    conn.close()
    
    combined = "\n\n=== SOURCE SEPARATOR ===\n\n".join([f"Source [{s['filename']}]:\n{s['content']}" for s in sources])
    return {"combined_context": combined}

# --- GENERATION ---

@router.post("/workspaces/{workspace_id}/documents/generate")
def generate_documents(workspace_id: int, request: models.DocumentGenerateRequest, token: str = Depends(verify_admin)):
    conn = db.get_db()
    cursor = conn.cursor()
    
    # getting combined context
    sources = cursor.execute("SELECT content FROM workspace_sources WHERE workspace_id = ?", (workspace_id,)).fetchall()
    context = "\n".join([s['content'] for s in sources if s['content']])
    
    all_templates = services.get_templates()
    templates_dict = {t['path']: t for t in all_templates}
    
    results = []
    
    for template_path in request.template_paths:
        if template_path not in templates_dict:
            continue
            
        t_info = templates_dict[template_path]
        template_text = services.get_template_content(template_path)
        
        # simulated generation
        generated_content = services._generate_document_content(template_text, context, request.language)
        
        # Save or update DB
        existing = cursor.execute("SELECT id FROM documents WHERE workspace_id=? AND template_path=?", (workspace_id, template_path)).fetchone()
        
        now = datetime.datetime.now().isoformat()
        if existing:
            cursor.execute("""
                UPDATE documents SET content=?, status='Ready', generated_at=? WHERE id=?
            """, (generated_content, now, existing['id']))
            results.append({"path": template_path, "status": "updated"})
        else:
            cursor.execute("""
                INSERT INTO documents (workspace_id, template_path, title, category, content, status, generated_at)
                VALUES (?, ?, ?, ?, ?, 'Ready', ?)
            """, (workspace_id, template_path, t_info['title'], t_info['category'], generated_content, now))
            results.append({"path": template_path, "status": "created"})
            
    conn.commit()
    conn.close()
    
    return {"message": "Generation complete", "results": results}

# --- STITCH ---

@router.get("/workspaces/{workspace_id}/stitch/dna")
def get_stitch_dna(workspace_id: int, token: str = Depends(verify_admin)):
    # In a real app, we might store DNA per workspace, here we extract it on demand
    dna = stitch_service.extract_design_dna()
    return {"dna": dna}

@router.get("/workspaces/{workspace_id}/stitch/theme")
def get_stitch_theme(workspace_id: int, token: str = Depends(verify_admin)):
    # Extract structural theme variables from Stitch images
    theme = stitch_service.extract_stitch_theme()
    return theme

@router.post("/stitch/generate")
def generate_with_stitch(request: models.StitchGenerateRequest, token: str = Depends(verify_admin)):
    conn = db.get_db()
    cursor = conn.cursor()
    
    # getting combined context
    workspace_id = request.workspace_id
    sources = cursor.execute("SELECT content FROM workspace_sources WHERE workspace_id = ?", (workspace_id,)).fetchall()
    context = "\n".join([s['content'] for s in sources if s['content']])
    
    # Extract DNA
    dna = stitch_service.extract_design_dna()
    
    all_templates = services.get_templates()
    templates_dict = {t['path']: t for t in all_templates}
    
    results = []
    
    for template_path in request.template_paths:
        if template_path not in templates_dict:
            continue
            
        t_info = templates_dict[template_path]
        template_text = services.get_template_content(template_path)
        
        # Generation with Stitch
        generated_content = stitch_service.generate_ui_design(template_text, context, dna, request.language)
        
        # Save or update DB
        existing = cursor.execute("SELECT id FROM documents WHERE workspace_id=? AND template_path=?", (workspace_id, template_path)).fetchone()
        
        now = datetime.datetime.now().isoformat()
        if existing:
            cursor.execute("""
                UPDATE documents SET content=?, status='Ready', generated_at=? WHERE id=?
            """, (generated_content, now, existing['id']))
            results.append({"path": template_path, "status": "updated"})
        else:
            cursor.execute("""
                INSERT INTO documents (workspace_id, template_path, title, category, content, status, generated_at)
                VALUES (?, ?, ?, ?, ?, 'Ready', ?)
            """, (workspace_id, template_path, t_info['title'], t_info['category'], generated_content, now))
            results.append({"path": template_path, "status": "created"})
            
    conn.commit()
    conn.close()
    
    return {"message": "Stitch generation complete", "results": results}

@router.get("/documents/{document_id}")
def get_document(document_id: int, token: str = Depends(verify_admin)):
    conn = db.get_db()
    doc = conn.execute("SELECT * FROM documents WHERE id = ?", (document_id,)).fetchone()
    conn.close()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return dict(doc)

# --- EXPORT ---

@router.get("/documents/{document_id}/download")
def download_single_document(document_id: int, token: str = Depends(verify_admin)):
    conn = db.get_db()
    doc = conn.execute("SELECT title, content FROM documents WHERE id = ?", (document_id,)).fetchone()
    conn.close()
    
    if not doc or not doc['content']:
        raise HTTPException(status_code=404, detail="Document content not available")
        
    return Response(
        content=doc['content'], 
        media_type="text/markdown", 
        headers={"Content-Disposition": f"attachment; filename={doc['title']}.md"}
    )
    
@router.get("/workspaces/{workspace_id}/export")
def export_workspace_zip(workspace_id: int, token: str = Depends(verify_admin)):
    conn = db.get_db()
    docs = conn.execute("SELECT category, title, content FROM documents WHERE workspace_id = ? AND status = 'Ready'", (workspace_id,)).fetchall()
    conn.close()
    
    if not docs:
         raise HTTPException(status_code=404, detail="No ready documents found to export in this workspace.")
         
    zip_buffer = services.create_zip_archive([dict(d) for d in docs])
    
    return Response(
        content=zip_buffer.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=workspace_{workspace_id}_export.zip"}
    )
