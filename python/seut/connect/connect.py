# js/node/connect/connect.py
import requests

async def connect(data):
    try:
        response = requests.post('http://localhost:8000', json=data)
        response.raise_for_status()
        data = response.json()
        print('Response:', data)
        return data
    except requests.RequestException as error:
        print('Error:', error)
        return False