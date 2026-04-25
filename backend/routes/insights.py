# This file generates personalized health insights based on historical cycle data.
from flask import Blueprint, jsonify
from db import cycles_collection

insights_bp = Blueprint('insights', __name__)

@insights_bp.route('/insights/<user_id>', methods=['GET'])
def get_insights(user_id):
    if cycles_collection is None:
        return jsonify({"message": "Database not connected", "error": True}), 503
        
    # Fetch all cycles for user sorted by start_date ascending
    cycles = list(cycles_collection.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("start_date", 1))
    
    if not cycles:
        return jsonify({"message": "No data yet"}), 200
        
    # Compute metrics
    cycle_lengths = [c['cycle_length'] for c in cycles if c.get('cycle_length') is not None]
    start_dates = [c['start_date'] for c in cycles]
    
    avg_cycle_length = 0
    variation = 0
    if cycle_lengths:
        avg_cycle_length = round(sum(cycle_lengths) / len(cycle_lengths), 1)
        variation = max(cycle_lengths) - min(cycle_lengths)
    
    # Symptom averages
    avg_acne = round(sum(c['acne_score'] for c in cycles) / len(cycles), 1) if cycles else 0
    avg_stress = round(sum(c['stress_level'] for c in cycles) / len(cycles), 1) if cycles else 0
    avg_mood = round(sum(c['mood_swings'] for c in cycles) / len(cycles), 1) if cycles else 0
    
    # Notification logic
    notification = None
    if cycle_lengths:
        last_cycle_length = cycle_lengths[-1]
        if last_cycle_length > 45:
            notification = "Your last cycle gap was over 45 days. Consider seeing a doctor."
        elif variation > 15:
            notification = "High variation in your cycle lengths detected."
        
    return jsonify({
        "cycle_trend": {
            "lengths": cycle_lengths,
            "dates": start_dates
        },
        "avg_cycle_len": avg_cycle_length,
        "total_cycles": len(cycles),
        "variation": variation,
        "avg_acne": avg_acne,
        "avg_stress": avg_stress,
        "avg_mood": avg_mood,
        "notification": notification
    })
