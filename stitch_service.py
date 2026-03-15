import os
import io
import base64
from google import genai
from google.genai import types

def get_stitch_client():
    api_key = os.environ.get("STITCH_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

def extract_design_dna(image_folder="ui_design"):
    """
    Analyzes images in the ui_design folder to extract style patterns.
    """
    client = get_stitch_client()
    if not client:
        return "GEMINI_API_KEY not set. Cannot extract Design DNA."

    images = []
    if os.path.exists(image_folder):
        for file in os.listdir(image_folder):
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                images.append(os.path.join(image_folder, file))

    if not images:
        return "No UI design images found for DNA extraction."

    # Analyze first couple of images for DNA
    sample_images = images[:3]
    parts = ["Analyze these UI screenshots and extract the 'Design DNA' (color palette, typography choices, component styles, spacing, and overall aesthetic). Return the DNA as a concise Markdown summary."]
    
    for img_path in sample_images:
        with open(img_path, "rb") as f:
            img_data = f.read()
            parts.append(types.Part.from_bytes(data=img_data, mime_type="image/png"))

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=parts
        )
        return response.text
    except Exception as e:
        print(f"DNA Extraction Error: {e}")
        return "Design DNA is currently unavailable due to system limits. Please try again later."

def extract_stitch_theme(image_folder="ui_design"):
    """
    Extracts a structured JSON theme (CSS variables) from UI screenshots.
    Returns a dict with key-value pairs for CSS variables.
    """
    client = get_stitch_client()
    if not client:
        return {}

    images = []
    if os.path.exists(image_folder):
        for file in os.listdir(image_folder):
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                images.append(os.path.join(image_folder, file))

    if not images:
        return {}

    prompt = """Analyze these UI screenshots and provide a formal 'Stitch Design Theme' in JSON format.
Include these CSS variables:
- --bg-color: Main page background (use hex)
- --card-bg: Card background color (use hex)
- --text-primary: Main text color
- --text-secondary: Secondary/muted text
- --color-primary: The main accent/primary color (blue in screenshots)
- --color-primary-hover: A darker/lighter shade for hover
- --border-color: Standard border color
- --border-radius: The standard corner radius (e.g., '12px')

Return ONLY raw JSON, do not include any markdown formatting or code blocks."""
    
    parts = [prompt]
    for img_path in images[:3]:
        with open(img_path, "rb") as f:
            img_data = f.read()
            parts.append(types.Part.from_bytes(data=img_data, mime_type="image/png"))

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=parts
        )
        import json
        clean_json = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_json)
    except Exception as e:
        print(f"Error extracting theme: {e}")
        return {}

def generate_ui_design(template_content: str, source_context: str, design_dna: str = "", language: str = "en"):
    """
    Generates UI/UX code and documentation using the Google Stitch approach.
    """
    client = get_stitch_client()
    if not client:
        return f"Error: GEMINI_API_KEY not set.\n\n{template_content}"

    lang_instruction = "English" if language == "en" else "Indonesian (Bahasa Indonesia)"
    
    prompt = f"""You are a Google Stitch AI UI/UX Specialist.
Your goal is to generate high-fidelity UI documentation and production-ready code (HTML/CSS) based on the provided context and design DNA.

=== DESIGN DNA ===
{design_dna or "Maintain a modern, premium aesthetic with glassmorphism and subtle animations."}

=== SOURCE CONTEXT ===
{source_context}

=== TEMPLATE / COMPONENT TO GENERATE ===
{template_content}

INSTRUCTIONS:
1. Generate the content in {lang_instruction}.
2. If the template asks for UI/UX descriptions, provide professional analysis.
3. If applicable, include a section with "Production Ready Code" containing clean HTML and Vanilla CSS snippets.
4. Use the Design DNA to ensure consistency with existing project styles.
5. Output in Markdown format.

Do not use markdown code blocks like ```markdown...``` around your entire response.
"""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
            )
        )
        return response.text.strip()
    except Exception as e:
        return f"Error generating with Google Stitch: {e}\n\n{template_content}"
