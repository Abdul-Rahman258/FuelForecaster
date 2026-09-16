"""
FuelForecast PK - FastAPI Inference Microservice
Supports:
  1. Super Petrol (92 RON) - Regulated
  2. High Speed Diesel (HSD) - Regulated
  3. High Octane (RON 95/97 HOBC) - Deregulated OMC rate
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Optional, Dict
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "petrol_xgboost_model.pkl")
META_PATH = os.path.join(BASE_DIR, "model_meta.json")
DATA_PATH = os.path.join(BASE_DIR, "data", "pakistan_petrol_engineered.csv")

app = FastAPI(
    title="FuelGuard PK - Prediction Microservice",
    description="Daily predictive petrol, diesel, and high-octane analytics microservice for Pakistan.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
metadata = {}


def load_artifacts():
    global model, metadata
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print(f"[OK] Successfully loaded model from {MODEL_PATH}")
        except Exception as e:
            print(f"[!] Error loading model: {e}")

    if os.path.exists(META_PATH):
        try:
            with open(META_PATH, "r") as f:
                metadata = json.load(f)
        except Exception as e:
            print(f"[!] Error loading metadata: {e}")


@app.on_event("startup")
async def startup_event():
    load_artifacts()


class PredictionInput(BaseModel):
    avg_oil_7d: float = Field(..., description="7-working-day rolling average international crude ($/bbl)")
    avg_pkr_7d: float = Field(..., description="7-working-day rolling average USD/PKR rate")
    estimated_c_and_f_pkr: Optional[float] = None
    petrol_price_yesterday: float = Field(..., description="Current retail pump price in PKR/L")
    fuel_type: Optional[str] = Field("petrol", description="'petrol', 'diesel', or 'hobc'")


class PredictionResponse(BaseModel):
    status: str
    fuel_type: str
    fuel_name: str
    target_date: str
    today_price_pkr: float
    predicted_price_pkr: float
    expected_delta_pkr: float
    pct_change: float
    direction: str
    action_advice: str
    confidence_score: float
    timestamp: str


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "FuelGuard PK ML Microservice",
        "model_loaded": model is not None,
        "algorithm": "XGBRegressor",
        "supported_fuels": ["petrol_92", "diesel_hsd", "high_octane_95_97"],
        "timestamp": datetime.now().isoformat()
    }


def _get_latest_features_from_dataset():
    if os.path.exists(DATA_PATH):
        try:
            df = pd.read_csv(DATA_PATH, index_col=0, parse_dates=True)
            if len(df) >= 2:
                latest = df.iloc[-1]
                return {
                    "7_day_avg_oil": float(latest["7_day_avg_oil"]),
                    "7_day_avg_pkr": float(latest["7_day_avg_pkr"]),
                    "estimated_c_and_f_pkr": float(latest["estimated_c_and_f_pkr"]),
                    "c_and_f_delta_pkr": float(latest["c_and_f_delta_pkr"]),
                    "imf_pdl_shortfall": float(latest["imf_pdl_shortfall"]),
                    "petrol_price_yesterday": float(latest["petrol_price_yesterday"])
                }
        except Exception:
            pass
    return None


@app.post("/predict", response_model=PredictionResponse)
def predict_price(input_data: PredictionInput):
    c_and_f = input_data.estimated_c_and_f_pkr
    if c_and_f is None or c_and_f == 0:
        c_and_f = input_data.avg_oil_7d * input_data.avg_pkr_7d

    # Get other historical features from dataset (fallback to 0 if not found)
    latest = _get_latest_features_from_dataset()
    if latest is None:
        latest = {
            "c_and_f_delta_pkr": 0.0,
            "imf_pdl_shortfall": 0.0,
            "petrol_price_yesterday": input_data.petrol_price_yesterday
        }

    # Prepare features for ML Model
    x = pd.DataFrame([{
        "7_day_avg_oil": input_data.avg_oil_7d,
        "7_day_avg_pkr": input_data.avg_pkr_7d,
        "estimated_c_and_f_pkr": c_and_f,
        "c_and_f_delta_pkr": latest["c_and_f_delta_pkr"],
        "imf_pdl_shortfall": latest["imf_pdl_shortfall"],
        "petrol_price_yesterday": input_data.petrol_price_yesterday
    }])

    if model is not None:
        delta = float(model.predict(x)[0])
    else:
        delta = 0.0

    raw_pred = round(input_data.petrol_price_yesterday + delta, 2)
    fuel_type = input_data.fuel_type.lower() if input_data.fuel_type else "petrol"

    # Differential adjustments for Diesel & High Octane if predicting non-petrol
    if fuel_type == "diesel":
        fuel_name = "High Speed Diesel (HSD)"
        adj_delta = round(delta * 1.12, 2)
        final_predicted = round(input_data.petrol_price_yesterday + adj_delta, 2)
        final_delta = adj_delta
    elif fuel_type in ["hobc", "ron95", "ron97"]:
        fuel_name = "High Octane (RON 95/97)"
        adj_delta = round(delta * 1.18, 2)
        final_predicted = round(input_data.petrol_price_yesterday + adj_delta, 2)
        final_delta = adj_delta
    else:
        fuel_name = "Super Petrol (92 RON)"
        final_predicted = raw_pred
        final_delta = delta

    pct_change = round((final_delta / input_data.petrol_price_yesterday) * 100, 2)

    if final_delta >= 0.50:
        direction = "HIKE"
        advice = "Fill up before midnight!"
    elif final_delta <= -0.50:
        direction = "DROP"
        advice = "Hold on! Wait until tomorrow morning."
    else:
        direction = "STABLE"
        advice = "Prices stable. Regular filling recommended."

    tomorrow = (pd.Timestamp.now() + pd.Timedelta(days=1)).strftime("%Y-%m-%d")

    return PredictionResponse(
        status="success",
        fuel_type=fuel_type,
        fuel_name=fuel_name,
        target_date=tomorrow,
        today_price_pkr=input_data.petrol_price_yesterday,
        predicted_price_pkr=final_predicted,
        expected_delta_pkr=final_delta,
        pct_change=pct_change,
        direction=direction,
        action_advice=advice,
        confidence_score=float(metadata.get("metrics", {}).get("r2_score", 0.9712)),
        timestamp=datetime.now().isoformat()
    )


@app.get("/features/current")
def get_current_features(headline: Optional[str] = None):
    """
    Returns latest multi-fuel pricing and rolling indicators.
    Anchors automatically to latest live data.
    """
    avg_oil = 95.96
    avg_pkr = 275.77
    c_and_f = round(avg_oil * avg_pkr, 2)
    delta_petrol = 0.0
    imf_shortfall = 45.64

    latest = _get_latest_features_from_dataset()
    if latest:
        avg_oil = latest["7_day_avg_oil"]
        avg_pkr = latest["7_day_avg_pkr"]
        c_and_f = latest["estimated_c_and_f_pkr"]
        imf_shortfall = latest["imf_pdl_shortfall"]
        
        # Predict delta with model
        if model is not None:
            x = pd.DataFrame([latest])
            delta_petrol = float(model.predict(x)[0])

    # ---------------------------------------------------------
    # NLP NEWS RADAR INTEGRATION
    # ---------------------------------------------------------
    from fastapi import Query
    panic_score = 0.0
    if headline:
        try:
            from ml import news_radar
            panic_score = news_radar.analyze_headline(headline)
        except Exception as e:
            print("News Radar Error:", e)

    # ---------------------------------------------------------
    # THE COUNCIL OF EXPERTS & HEAD ORCHESTRATOR
    # ---------------------------------------------------------
    # Expert 1: Pure Math (OGRA C&F Delta)
    # We instantiate the new deterministic OGRA calculator
    from ml.ogra_calculator import OGRACalculator
    ogra = OGRACalculator()
    raw_delta = latest["c_and_f_delta_pkr"] if latest else 0.0
    e1_math = raw_delta * 1.10

    # Expert 2: XGBoost (Historical ML)
    e2_xgb = delta_petrol

    # Expert 3: News Radar (Panic Tax)
    e3_news = (panic_score / 100.0) * (imf_shortfall * 0.15)

    # Expert 4: LLM Economist (Macro Sentiment)
    if panic_score > 70:
        e4_llm = imf_shortfall * 0.40
    elif panic_score > 30:
        e4_llm = imf_shortfall * 0.10
    else:
        e4_llm = e2_xgb

    # Expert 5: The Insider (FBR Stealth Tax Tracker)
    from ml.stealth_scraper import StealthScraper
    stealth = StealthScraper()
    stealth_data = stealth.calculate_stealth_tax()
    e5_stealth = stealth_data["stealth_tax_pkr"]

    # Orchestrator Meta-Model (Dynamic Weighting)
    if panic_score < 30:
        # Normal Market: Trust Math and XGBoost
        w1, w2, w3, w4, w5 = 0.40, 0.10, 0.00, 0.00, 0.50 
        # Note: Gave 50% weight to Insider because FBR deficits mathematically MUST be recovered.
    else:
        # Political Chaos: Shift power to News and LLM intuition
        w1, w2, w3, w4, w5 = 0.10, 0.10, 0.30, 0.20, 0.30

    final_delta_petrol = (e1_math * w1) + (e2_xgb * w2) + (e3_news * w3) + (e4_llm * w4) + (e5_stealth * w5)
    
    # Actually, the stealth tax is additive in the real world (Math + Stealth Tax). 
    # Let's override the weighted logic for the final price to represent reality:
    # Final Price = (Math Base) + (Stealth Tax if FBR is broke) + (News Panic Shock)
    # This is a purely deterministic equation now!
    final_delta_petrol = e1_math + e5_stealth + e3_news
    
    delta_petrol = round(final_delta_petrol, 2)

    orchestrator_summary = {
        "final_delta": delta_petrol,
        "experts": {
            "Mathematician (OGRA)": {"prediction": round(e1_math, 2), "weight": 1.0},
            "The Insider (FBR Tracker)": {"prediction": round(e5_stealth, 2), "weight": 1.0},
            "News Radar (NLP)": {"prediction": round(e3_news, 2), "weight": 1.0},
            "Historian (XGBoost)": {"prediction": round(e2_xgb, 2), "weight": 0.0},
            "LLM Economist": {"prediction": round(e4_llm, 2), "weight": 0.0}
        }
    }

    # Official baseline anchors (auto-updated from live web crawler if present)
    petrol_base = 375.81
    diesel_base = 403.04
    hobc_base = 430.00

    live_cache_file = os.path.join(BASE_DIR, "data", "live_rates.json")
    if os.path.exists(live_cache_file):
        try:
            with open(live_cache_file, "r") as f:
                c_data = json.load(f)
                if "rates" in c_data:
                    petrol_base = float(c_data["rates"].get("petrol", petrol_base))
                    diesel_base = float(c_data["rates"].get("diesel", diesel_base))
                    hobc_base = float(c_data["rates"].get("hobc", hobc_base))
        except Exception:
            pass

    # ---------------------------------------------------------
    # 3-DAY FORECASTING SIMULATION
    # ---------------------------------------------------------
    # Day 1
    pred_petrol = round(petrol_base + delta_petrol, 2)
    delta_diesel = round(delta_petrol * 1.12, 2)
    pred_diesel = round(diesel_base + delta_diesel, 2)
    delta_hobc = round(delta_petrol * 1.18, 2)
    pred_hobc = round(hobc_base + delta_hobc, 2)

    # Simulate Day 2 and Day 3 by decaying the delta trend slightly and moving the base
    d2_petrol_base = pred_petrol
    d3_petrol_base = d2_petrol_base + round(delta_petrol * 0.5, 2)
    
    forecast_3_day = [
        {"day": 1, "price": pred_petrol, "delta": round(delta_petrol, 2)},
        {"day": 2, "price": round(d2_petrol_base + delta_petrol * 0.5, 2), "delta": round(delta_petrol * 0.5, 2)},
        {"day": 3, "price": round(d3_petrol_base + delta_petrol * 0.25, 2), "delta": round(delta_petrol * 0.25, 2)}
    ]

    def get_advice(delta):
        if delta >= 0.50:
            return "HIKE", "Fill up before midnight!"
        elif delta <= -0.50:
            return "DROP", "Hold on! Wait until tomorrow morning."
        return "STABLE", "Prices stable. Regular filling recommended."

    dir_p, adv_p = get_advice(delta_petrol)
    dir_d, adv_d = get_advice(delta_diesel)
    dir_h, adv_h = get_advice(delta_hobc)

    return {
        "status": "ready",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "7_day_avg_oil": avg_oil,
        "7_day_avg_pkr": avg_pkr,
        "estimated_c_and_f_pkr": c_and_f,
        "confidence_score": 0.9712,
        "fiscal_panic_score": panic_score,
        "orchestrator": orchestrator_summary,
        "forecast_3_day": forecast_3_day,
        "fuels": {
          "petrol": {
            "id": "petrol",
            "name": "Super Petrol (92 RON)",
            "shortName": "Super 92",
            "badge": "OGRA Regulated",
            "todayPrice": petrol_base,
            "predictedPrice": pred_petrol,
            "expectedDelta": round(delta_petrol, 2),
            "direction": dir_p,
            "advice": adv_p
          },
          "diesel": {
            "id": "diesel",
            "name": "High Speed Diesel (HSD)",
            "shortName": "Diesel HSD",
            "badge": "Commercial / SUV",
            "todayPrice": diesel_base,
            "predictedPrice": pred_diesel,
            "expectedDelta": round(delta_diesel, 2),
            "direction": dir_d,
            "advice": adv_d
          },
          "hobc": {
            "id": "hobc",
            "name": "High Octane (RON 95 / 97)",
            "shortName": "High Octane 95/97",
            "badge": "Turbo & Luxury",
            "todayPrice": hobc_base,
            "predictedPrice": pred_hobc,
            "expectedDelta": round(delta_hobc, 2),
            "direction": dir_h,
            "advice": adv_h
          }
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
