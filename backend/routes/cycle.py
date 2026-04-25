# This file defines the routes for logging and fetching period cycle data.
from flask import Blueprint, request, jsonify
from datetime import datetime
from db import cycles_collection
from bson import ObjectId

cycle_bp = Blueprint('cycle', __name__)

@cycle_bp.route('/log-cycle', methods=['POST'])
def log_cycle():
    if cycles_collection is None:
        return jsonify({"success": False, "error": "Database not connected. Check your MONGO_URI."}), 503
        
    data = request.json
    
    # Required fields
    user_id = data.get('user_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    prev_start = data.get('prev_start') # Can be null for first entry
    
    # ML Features / Symptoms
    flow_intensity = int(data.get('flow_intensity', 2))
    acne_score = int(data.get('acne_score', 0))
    stress_level = int(data.get('stress_level', 0))
    mood_swings = int(data.get('mood_swings', 0))
    weight_gain = float(data.get('weight_gain', 0))
    hair_loss = int(data.get('hair_loss', 0))
    age = int(data.get('age', 25))

    # Calculate cycle_length (days between prev_start and start_date)
    cycle_length = None # Default if no prev_start
    if prev_start:
        try:
            d1 = datetime.strptime(prev_start, '%Y-%m-%d')
            d2 = datetime.strptime(start_date, '%Y-%m-%d')
            cycle_length = (d2 - d1).days
        except Exception:
            pass

    # Prepare document
    new_cycle = {
        "user_id": user_id,
        "start_date": start_date,
        "end_date": end_date,
        "prev_start": prev_start,
        "cycle_length": cycle_length,
        "flow_intensity": flow_intensity,
        "acne_score": acne_score,
        "stress_level": stress_level,
        "mood_swings": mood_swings,
        "weight_gain": weight_gain,
        "hair_loss": hair_loss,
        "age": age,
        "logged_at": datetime.utcnow()
    }

    result = cycles_collection.insert_one(new_cycle)
    
    return jsonify({"success": True, "id": str(result.inserted_id)}), 201

@cycle_bp.route('/cycles/<user_id>', methods=['GET'])
def get_cycles(user_id):
    if cycles_collection is None:
        return jsonify({"cycles": [], "count": 0, "error": "Database not connected"}), 503
        
    # Fetch last 12 cycles sorted by start_date descending
    cycles = list(cycles_collection.find(
        {"user_id": user_id},
        {"_id": 0} # Exclude MongoDB ID
    ).sort("start_date", -1).limit(12))
    
    return jsonify({"cycles": cycles, "count": len(cycles)})
