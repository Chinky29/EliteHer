# This file handles the MongoDB database connection using the URI from the .env file.
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client.get_database("eliteher")

# Collections
cycles_collection = db["cycles"]
users_collection = db["users"]
