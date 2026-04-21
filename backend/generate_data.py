# This file generates a simulated dataset for PCOD risk prediction training.
import pandas as pd
import numpy as np
import random

def generate_pcod_data(num_rows=500):
    data = []
    for _ in range(num_rows):
        cycle_length = random.randint(21, 60)
        gap_variation = random.randint(0, 20)
        flow_intensity = random.randint(1, 4)
        acne_score = random.randint(0, 10)
        stress_level = random.randint(0, 10)
        weight_gain = random.randint(0, 15)
        mood_swings = random.randint(0, 10)
        hair_loss = random.randint(0, 5)
        age = random.randint(14, 40)
        
        # Scoring rule for risk_label
        score = 0
        if cycle_length > 35: score += 2
        if gap_variation > 10: score += 2
        if acne_score > 6: score += 1
        if weight_gain > 8: score += 1
        if hair_loss > 3: score += 1
        
        if score <= 2:
            risk_label = "Low"
        elif score <= 4:
            risk_label = "Medium"
        else:
            risk_label = "High"
            
        data.append([
            cycle_length, gap_variation, flow_intensity, acne_score,
            stress_level, weight_gain, mood_swings, hair_loss, age, risk_label
        ])
    
    columns = [
        "cycle_length", "gap_variation", "flow_intensity", "acne_score",
        "stress_level", "weight_gain", "mood_swings", "hair_loss", "age", "risk_label"
    ]
    df = pd.DataFrame(data, columns=columns)
    df.to_csv("pcod_data.csv", index=False)
    print("Generated pcod_data.csv with 500 rows.")

if __name__ == "__main__":
    generate_pcod_data()
