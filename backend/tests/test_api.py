import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "AI Personal Tutor Agent" in data["message"]

def test_subjects_list():
    response = client.get("/api/subjects")
    assert response.status_code == 200
    subjects = response.json()
    assert len(subjects) >= 13
    titles = [s["title"] for s in subjects]
    assert "Java" in titles
    assert "Python" in titles
    assert "Computer Networks" in titles

def test_coding_problems():
    response = client.get("/api/coding/problems")
    assert response.status_code == 200
    problems = response.json()
    assert len(problems) > 0

def test_register_and_login():
    import random
    rand_id = random.randint(1000, 9999)
    email = f"testuser{rand_id}@tutor.ai"
    password = "password123"

    # Register
    reg_res = client.post("/api/auth/register", json={
        "name": "Test Student",
        "email": email,
        "password": password
    })
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == email

    # Login
    login_res = client.post("/api/auth/login", json={
        "email": email,
        "password": password
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data

    # Profile check with token
    token = login_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    profile_res = client.get("/api/auth/profile", headers=headers)
    assert profile_res.status_code == 200
    assert profile_res.json()["email"] == email
