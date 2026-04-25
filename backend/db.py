import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
ca = certifi.where()

# Connect to MongoDB
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsCAFile=ca)
    client.server_info()
    print("MongoDB connected successfully")
    db = client['pcod_db']
    cycles_collection = db['cycles']
    users_collection = db['users']
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    print("Check your MONGO_URI in the .env file")
    # Provide dummy collections to avoid crashes during startup, though tests will fail
    db = None
    cycles_collection = None
    users_collection = None
