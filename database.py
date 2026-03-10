import sqlite3
import os

DB_PATH = "data.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Workspaces
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS workspaces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Sources uploaded to workspace
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS workspace_sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workspace_id INTEGER,
            filename TEXT NOT NULL,
            content TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(workspace_id) REFERENCES workspaces(id)
        )
    """)
    
    # Generated documents
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workspace_id INTEGER,
            template_path TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            content TEXT,
            status TEXT DEFAULT 'Pending',
            generated_at TIMESTAMP,
            FOREIGN KEY(workspace_id) REFERENCES workspaces(id)
        )
    """)
    
    conn.commit()
    conn.close()

if not os.path.exists(DB_PATH):
    init_db()
else:
    init_db() # Ensure tables exist
