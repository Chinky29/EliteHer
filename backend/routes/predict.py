# This file handles PCOD risk prediction using the trained Machine Learning model.
from flask import Blueprint, request, jsonify
import joblib
import os
import numpy as np

predict_bp = Blueprint('predict', __name__)

# Load model artifacts at module level
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'model', 'scaler.pkl')
LE_PATH = os.path.join(BASE_DIR, 'model', 'label_encoder.pkl')

model = None
scaler = None
label_encoder = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(LE_PATH)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not trained yet"}), 500
        
    data = request.json
    
    # Required feature fields
    FEATURES = [
        "cycle_length", "gap_variation", "flow_intensity", "acne_score",
        "stress_level", "weight_gain", "mood_swings", "hair_loss", "age"
    ]
    
    missing = [f for f in FEATURES if f not in data]
    if missing:
        return jsonify({"error": "Missing fields", "missing": missing}), 400
        
    # Prepare input for prediction
    features = [data[f] for f in FEATURES]
    features_arr = np.array(features).reshape(1, -1)
    
    # Scale and Predict
    try:
        scaled_features = scaler.transform(features_arr)
        prediction_idx = model.predict(scaled_features)[0]
        probabilities = model.predict_proba(scaled_features)[0]
        
        risk_level = label_encoder.classes_[prediction_idx]
        
        # Map probabilities to classes
        prob_map = {}
        for i, cls in enumerate(label_encoder.classes_):
            prob_map[cls] = round(probabilities[i] * 100, 1)
            
        confidence = prob_map[risk_level]
        
        # Build alert string
        alert = None
        if risk_level == "High":
            alert = "High PCOD risk detected. Please consult a doctor."
        elif risk_level == "Medium":
            alert = "Moderate irregularity detected. Monitor your symptoms."
            
        return jsonify({
            "risk_level": risk_level,
            "confidence": confidence,
            "alert": alert,
            "probabilities": prob_map
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {e}"}), 500
