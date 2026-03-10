from pydantic import BaseModel
from typing import List, Optional

class WorkspaceCreate(BaseModel):
    title: str

class WorkspaceResponse(BaseModel):
    id: int
    title: str
    created_at: str

class SourceCreate(BaseModel):
    title: str
    content: str
	
class TemplateInfo(BaseModel):
    category: str
    path: str
    title: str

class DocumentGenerateRequest(BaseModel):
    template_paths: List[str]

class DocumentResponse(BaseModel):
    id: int
    workspace_id: int
    template_path: str
    title: str
    category: str
    status: str
    content: Optional[str] = None
    generated_at: Optional[str] = None
