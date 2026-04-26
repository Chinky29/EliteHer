# AuraCycle - Main entry point for the Flask backend API.
from flask import Flask, jsonify
from flask_cors import CORS
from routes.cycle import cycle_bp
from routes.predict import predict_bp
from routes.insights import insights_bp
from db import client

app = Flask(__name__)

# Enable CORS for all /api/* routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(cycle_bp, url_prefix='/api')
app.register_blueprint(predict_bp, url_prefix='/api')
app.register_blueprint(insights_bp, url_prefix='/api')

@app.route('/api/health', methods=['GET'])
def health():
    db_status = "connected"
    try:
        if client:
            client.server_info()
        else:
            db_status = "disconnected (client is None)"
    except Exception as e:
        db_status = f"error: {str(e)}"
        
    return jsonify({
        "status": "ok",
        "database": db_status
    })

if __name__ == '__main__':
    # Run on port 5000 with debug mode enabled, listening on all interfaces
    app.run(host='0.0.0.0', port=5000, debug=True)
