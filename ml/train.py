"""
FuelForecast PK - XGBoost Regressor Training Pipeline
Domain: Pakistan Daily Petrol Price Prediction (Post-July 2026 OGRA Mechanism)

Features:
  - 7_day_avg_oil: 7-working-day rolling average international crude ($/bbl)
  - 7_day_avg_pkr: 7-working-day rolling average USD/PKR exchange rate
  - estimated_c_and_f_pkr: 7-day rolling avg_oil * avg_pkr
  - c_and_f_delta_pkr: Change in import parity
  - imf_pdl_shortfall: Shortfall from IMF tax target (predicts tax hikes)
  - petrol_price_yesterday: Lag-1 pump price (PKR/L)

Target:
  - price_delta_tomorrow: Predicted change in next-day retail pump price (PKR/L)

Chronological time-series split is strictly enforced (no future data leakage).
The trained model is exported via joblib to petrol_xgboost_model.pkl.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "pakistan_petrol_engineered.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "petrol_xgboost_model.pkl")
META_PATH = os.path.join(os.path.dirname(__file__), "model_meta.json")

FEATURE_COLUMNS = [
    "7_day_avg_oil",
    "7_day_avg_pkr",
    "estimated_c_and_f_pkr",
    "c_and_f_delta_pkr",
    "imf_pdl_shortfall",
    "petrol_price_yesterday"
]
TARGET_COLUMN = "price_delta_tomorrow"


def load_and_validate_data(filepath: str) -> pd.DataFrame:
    """Loads engineered dataset and validates presence of OGRA features."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset not found at {filepath}. Please execute data_pipeline.py first.")
    
    df = pd.read_csv(filepath, index_col=0, parse_dates=True)
    
    required_cols = FEATURE_COLUMNS + [TARGET_COLUMN]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required feature column: {col}")
    
    # Sort chronologically to guarantee no temporal inversion
    df = df.sort_index()
    return df


def train_model():
    print("[+] Loading engineered dataset for training...")
    df = load_and_validate_data(DATA_PATH)
    print(f"[OK] Loaded {len(df)} records spanning {df.index.min()} to {df.index.max()}.")

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    # Chronological Time-Series Split: 80% train, 20% test (NO SHUFFLING)
    train_size = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:train_size], X.iloc[train_size:]
    y_train, y_test = y.iloc[:train_size], y.iloc[train_size:]

    print(f"[+] Time-Series Split: {len(X_train)} training days, {len(X_test)} out-of-time test days.")

    # Initialize XGBRegressor with robust hyperparameters for time-series continuous pricing
    model = XGBRegressor(
        n_estimators=500,
        learning_rate=0.01,
        max_depth=6,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=2,
        objective="reg:squarederror",
        random_state=42,
        n_jobs=-1
    )

    print("[+] Training XGBoost Regressor on Pakistan daily petrol price dynamics (Predicting Delta)...")
    model.fit(
        X_train, 
        y_train,
        eval_set=[(X_train, y_train), (X_test, y_test)],
        verbose=False
    )

    # Out-of-time evaluation
    y_pred_test = model.predict(X_test)
    y_pred_train = model.predict(X_train)

    mae_train = mean_absolute_error(y_train, y_pred_train)
    mae_test = mean_absolute_error(y_test, y_pred_test)
    rmse_test = np.sqrt(mean_squared_error(y_test, y_pred_test))
    r2_test = r2_score(y_test, y_pred_test)
    
    # MAPE is not well-defined for delta predictions that can be close to 0, so we use absolute error percentages instead.
    # We will just print MAE and RMSE.

    print("\n=======================================================")
    print("        XGBoost Regressor Model Performance             ")
    print("=======================================================")
    print(f" Train MAE      : PKR {mae_train:.2f} Delta / Liter")
    print(f" Test MAE       : PKR {mae_test:.2f} Delta / Liter")
    print(f" Test RMSE      : PKR {rmse_test:.2f} Delta / Liter")
    print(f" Test R² Score  : {r2_test:.4f}")
    print("=======================================================")

    # Feature Importances
    importances = dict(zip(FEATURE_COLUMNS, [round(float(v), 4) for v in model.feature_importances_]))
    print("[+] Feature Importances:")
    for feat, imp in sorted(importances.items(), key=lambda x: x[1], reverse=True):
        print(f"    - {feat:<24}: {imp * 100:.2f}%")

    # Export Model with joblib
    joblib.dump(model, MODEL_PATH)
    print(f"\n[OK] Model successfully saved to: {MODEL_PATH}")

    # Export Metadata
    metadata = {
        "model_name": "FuelForecast PK XGBoost Regressor",
        "algorithm": "XGBRegressor",
        "features": FEATURE_COLUMNS,
        "target": TARGET_COLUMN,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "metrics": {
            "test_mae_pkr": round(float(mae_test), 2),
            "test_rmse_pkr": round(float(rmse_test), 2),
            "r2_score": round(float(r2_test), 4)
        },
        "feature_importances": importances,
        "trained_at": str(pd.Timestamp.now())
    }

    with open(META_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] Metadata exported to: {META_PATH}")

    return model, metadata


if __name__ == "__main__":
    train_model()
