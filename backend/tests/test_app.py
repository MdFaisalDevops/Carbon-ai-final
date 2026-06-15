import pytest
from fastapi.testclient import TestClient
import os
import sys

# Add the parent directory to the path so python can find backend.app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db_users

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"app": "CarbonMind AI API", "status": "operational", "engine": "FastAPI"}

def test_get_leaderboard():
    response = client.get("/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    # Verify sorted descending by carbon score
    scores = [u["carbon_score"] for u in data]
    assert scores == sorted(scores, reverse=True)

def test_get_user_rank_success():
    response = client.get("/user/rank/user_1")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "user_1"
    assert "rank" in data
    assert "total_competitors" in data
    assert data["user_data"]["name"] == "Kunal Shah"

def test_get_user_rank_not_found():
    response = client.get("/user/rank/nonexistent_user")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

def test_get_user_badges_success():
    response = client.get("/user/badges/user_1")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "user_1"
    assert "badges" in data
    assert isinstance(data["badges"], list)

def test_get_user_badges_not_found():
    response = client.get("/user/badges/nonexistent_user")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

def test_sync_user_data_existing():
    payload = {
        "user_id": "user_self",
        "carbon_score": 600,
        "level": "Eco Beginner",
        "badges": ["consistency", "plant_based"],
        "weekly_co2_saved": 55.5,
        "streak_days": 13
    }
    response = client.post("/user/sync", json=payload)
    assert response.status_code == 200
    assert response.json() == {"message": "Sync successful", "status": "synchronized"}
    
    # Check that mock db is updated
    assert db_users["user_self"]["carbon_score"] == 600
    assert db_users["user_self"]["streak_days"] == 13
    assert "plant_based" in db_users["user_self"]["badges"]

def test_sync_user_data_new():
    payload = {
        "user_id": "user_new",
        "carbon_score": 850,
        "level": "Balanced User",
        "badges": ["low_car"],
        "weekly_co2_saved": 75.0,
        "streak_days": 5
    }
    response = client.post("/user/sync", json=payload)
    assert response.status_code == 200
    assert response.json() == {"message": "Sync successful", "status": "synchronized"}
    assert "user_new" in db_users
    assert db_users["user_new"]["carbon_score"] == 850

def test_ask_ai_coach_offline_fallback():
    # Make sure env is empty to force offline reasoning check
    if "OPENAI_API_KEY" in os.environ:
        del os.environ["OPENAI_API_KEY"]
        
    payload = {
        "user_id": "user_self",
        "question": "How do I optimize my AC footprint in Bangalore?",
        "lifestyle": {
            "transport_habits": "car_single",
            "diet_pattern": "meat_heavy",
            "electricity_usage": "high",
            "waste_generation": "none",
            "shopping_frequency": "medium"
        }
    }
    response = client.post("/coach/ask", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "carbon_personality_type" in data
    assert "total_footprint_estimate" in data
    assert "impact_hotspots" in data
    assert "top_3_actions" in data
    assert len(data["top_3_actions"]) == 3
    assert "micro_actions" in data
    assert "future_projection_30_days" in data
    assert "motivational_insight" in data
