import json
import os
import sys

# Add ml to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import get_current_features

def generate():
    print("Running orchestrator prediction model...")
    data = get_current_features()
    
    out_path = os.path.join(os.path.dirname(__file__), "data", "predictions_cache.json")
    with open(out_path, "w") as f:
        json.dump(data, f, indent=4)
        
    print(f"Successfully generated predictions to {out_path}")
    print(f"Predicted Delta: {data['fuels']['petrol']['expectedDelta']}")

if __name__ == "__main__":
    generate()
