import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

# Get your Gemini API key from environment variable
api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    raise ValueError("Please set your GEMINI_API_KEY environment variable.")

# Gemini API endpoint
url = "https://gemini.googleapis.com/v1/models/gemini-1.5:generateMessage"

# Mock student data
student_data = {
    "schedule": "9am-12pm Math, 1pm-3pm English",
    "sleep": 5,
    "commute": 1,
    "mood": "tired"
}

# Build prompt
prompt = f"""
You are a personal wellness assistant for college students.
Student data:
- Class schedule: {student_data['schedule']}
- Sleep: {student_data['sleep']} hours
- Commute: {student_data['commute']} hours
- Mood: {student_data['mood']}

Task: Suggest a balanced daily schedule including study, rest, and wellness breaks.
Output in JSON format with keys: "study", "rest", "wellness_breaks".
"""

# Request body
data = {
    "prompt": prompt,
    "temperature": 0.7,
    "maxOutputTokens": 500
}

# Headers
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Make API call
response = requests.post(url, headers=headers, json=data)

# Print response
try:
    result = response.json()
    print(json.dumps(result, indent=2))
except json.JSONDecodeError:
    print("Failed to parse response:", response.text)
