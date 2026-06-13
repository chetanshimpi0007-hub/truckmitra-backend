import urllib.request
import json

def register():
    url = "http://localhost:8080/api/auth/register"
    data = {
        "fullName": "Test Guy",
        "mobile": "9998887776",
        "email": "testguy1@example.com",
        "password": "Password123",
        "role": "DRIVER",
        "preferredLoginType": "EMAIL_PASSWORD"
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        response = urllib.request.urlopen(req)
        print("Register:", response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("Register Error:", e.read().decode('utf-8'))

def login():
    url = "http://localhost:8080/api/auth/login"
    data = {
        "loginType": "EMAIL_PASSWORD",
        "email": "testguy1@example.com",
        "password": "Password123"
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        response = urllib.request.urlopen(req)
        print("Login:", response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("Login Error:", e.read().decode('utf-8'))

register()
login()
