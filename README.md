# AgentSA - Project Intelligence

AgentSA is a powerful, locally-hosted web application that automates the generation of comprehensive project documents (like Technical Proposals, Business Requirement Documents (BRD), User Stories, etc.) from raw source materials (such as Terms of Reference / RFPs).

It leverages the **FastAPI** backend framework and seamlessly integrates with **Google Gemini 2.5 Flash** to intelligently process source contexts (PDFs, DOCX, TXT) and fill out predefined Markdown templates. 

## ✨ Key Features
* **Intelligent Document Generation**: Automatically maps uploaded source material context into multiple structured `.md` templates simultaneously using the Gemini AI API.
* **Workspace Management**: Organizes your tasks into discrete project workspaces.
* **Smart Context Extraction**: Natively extracts text from uploaded `.pdf`, `.docx`, `.doc`, `.md`, and `.txt` files.
* **Drag-and-Drop Interface**: Built with an intuitive, modern, reactive Vanilla JS and CSS frontend layout.
* **Bulk Export**: Download fully generated documentation suites as a single `.zip` archive.

---

## 🏗️ Architecture

The application operates as a Single Page Application (SPA) utilizing a lightweight tech stack:

### Backend
* **Python 3 / FastAPI**: Extremely fast RESTful API core.
* **SQLite**: Lightweight local database (`data.db`) for storing Workspace metadata and document states.
* **google-genai**: Official Google Generative AI SDK used for prompt execution and content generation.
* **pymupdf & python-docx**: Document parsing libraries used to extract context.

### Frontend
* **Vanilla JavaScript (`app.js`)**: Modern asynchronous app management handling routing and component state.
* **Vanilla CSS (`style.css`)**: Beautiful, responsive layout with an intuitive drag-and-drop file uploader and panel view.

---

## 🚀 Setup & Installation

### Prerequisites
* Python 3.10+
* A valid Google Gemini API Key

### 1. Clone & Set Up Virtual Environment

Open your terminal in the project directory:

```powershell
# Create a virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

1. Locate the `.env.example` file in the root directory.
2. Make a copy of it and name it exactly `.env`.
3. Open `.env` and configure your API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Development Server

Start the FastAPI application using Uvicorn:

```powershell
python -m uvicorn main:app --reload
```
The application will be instantly available at **http://127.0.0.1:8000**.

---

## 📂 Project Structure

```text
├── .env                # Secret API configuration (Not in version control)
├── .gitignore          # standard python and web ignore file
├── main.py             # Entry point, mounts API routers and serves static files
├── routers.py          # API endpoints (Workspaces, Generation, Sources)
├── services.py         # Business logic, Document parsing & LLM execution
├── models.py           # Pydantic schemas for API validation
├── database.py         # SQLite connection and initialization
├── requirements.txt    # Python dependencies
├── document_template/  # Directory holding your foundational Markdown templates
│   ├── 01-category/
│   │   └── template.md
│   └── ...
└── static/             # Frontend Application
    ├── index.html      # Main Layout and HTML Templates
    ├── app.js          # Client-side Logic
    └── style.css       # Client-side UI styles
```

---

## 🛠️ Usage Workflow
1. Click **New Project** and enter your workspace details.
2. Upload a Technical Reference document (PDF, DOCX) or utilize the drag-and-drop functionality to upload multiple context sources.
3. Click **Generate** on specific templates to invoke Gemini and await completion.
4. Review the generated `.md` files in-app.
5. Hit **Export to ZIP** to download all completed resources instantly.
