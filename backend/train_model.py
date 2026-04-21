# This file trains a Random Forest model to predict PCOD risk based on symptoms.
import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_model():
    # Load dataset
    if not os.path.exists("pcod_data.csv"):
        print("Dataset not found! Run generate_data.py first.")
        return
        
    df = pd.read_csv("pcod_data.csv")
    
    # Features and Label
    X = df.drop("risk_label", axis=1)
    y = df["risk_label"]
    
    # Encode labels (Low=0, Medium=1, High=2 usually, but LabelEncoder sorts alphabetically)
    # Actually LabelEncoder will sort Low, Medium, High -> High (0), Low (1), Medium (2)
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Model
    model = RandomForestClassifier(
        n_estimators=100, 
        max_depth=8, 
        class_weight='balanced', 
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))
    
    # Save artifacts
    os.makedirs("model", exist_ok=True)
    joblib.dump(model, "model/model.pkl")
    joblib.dump(scaler, "model/scaler.pkl")
    joblib.dump(le, "model/label_encoder.pkl")
    print("\nModel and artifacts saved to model/ folder.")

if __name__ == "__main__":
    train_model()
