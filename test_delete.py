import requests
import hashlib

# Fake auth token
token = hashlib.md5(b'admin:admin123SALT').hexdigest()
headers = {"Authorization": f"Bearer {token}"}

# Create a dummy workspace first
print("Creating dummy workspace...")
res = requests.post("http://127.0.0.1:8000/api/workspaces", json={"title": "Test Deletion WS"}, headers=headers)
print("Create response:", res.status_code, res.text)

if res.status_code == 200:
    ws_id = res.json()['id']
    print(f"Deleting workspace {ws_id}...")
    
    # Try deleting it
    del_res = requests.delete(f"http://127.0.0.1:8000/api/workspaces/{ws_id}", headers=headers)
    print("Delete response:", del_res.status_code, del_res.text)
