# FuelForecast PK 🇵🇰
### AI-Powered Predictive Petrol Analysis & Savings Engine for Pakistan

> **Critical Domain Knowledge (July 2026 Pricing Mechanism):**
> Petrol prices in Pakistan are no longer revised on a fortnightly schedule. They are revised **DAILY** by OGRA based on a **7-working-day rolling average** of international oil prices (Platts/Brent Crude) and the State Bank of Pakistan (SBP) USD to PKR interbank exchange rate.
>
> FuelForecast PK predicts **tomorrow's pump price** before midnight by calculating these 7-working-day rolling windows, training an **XGBoost Regressor**, and giving citizens personalized car-wise fuel recommendations.

---

## 🏗️ Architecture & Tech Stack

```
                     ┌──────────────────────────────────────────────┐
                     │          Yahoo Finance API / Market          │
                     │       (Brent: BZ=F, USD/PKR: PKR=X)          │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │  ml/data_pipeline.py (Feature Engineering)   │
                     │  - 7_day_avg_oil                             │
                     │  - 7_day_avg_pkr                             │
                     │  - estimated_c_and_f_pkr                     │
                     │  - petrol_price_yesterday                    │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │  ml/train.py (XGBoost Regressor Training)    │
                     │  - 80/20 Chronological Split (No Leakage)    │
                     │  - Test R² Score: 0.9699, MAE: PKR 2.39/L    │
                     │  - Exports: petrol_xgboost_model.pkl         │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
┌──────────────────────────────┐     ┌──────────────────────────────┐
│  ml/daily_cron.py            │     │  ml/main.py (FastAPI)        │
│  - Scheduled: 6:00 PM PKT    │────▶│  - POST /predict             │
│  - Ingests feeds & triggers  │     │  - GET  /features/current    │
│  - Writes to PostgreSQL      │     │  - GET  /health              │
└──────────────┬───────────────┘     └──────────────┬───────────────┘
               │                                    │
               ▼                                    ▼
┌──────────────────────────────┐     ┌──────────────────────────────┐
│  PostgreSQL (Prisma ORM)     │◀────│  Next.js 14 App Router       │
│  - PetrolPriceRecord         │     │  - /api/predictions/today    │
│  - DailyPrediction           │     │  - /api/feedback             │
│  - GlobalStats               │     │  - /api/stats                │
│  - UserFeedback              │     │  - /api/history              │
└──────────────────────────────┘     └──────────────────────────────┘
```

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React, Framer Motion, Recharts.
- **ML Microservice**: Python 3.14, FastAPI, Pandas, Scikit-learn, XGBoost 3.4.1, Joblib.
- **Database & ORM**: PostgreSQL with Prisma ORM.
- **Automation**: Python-based daily cron job (`daily_cron.py`) running at 6:00 PM PKT.

---

## 🚀 Quick Start Guide

### 1. Python ML Microservice Setup

```bash
# 1. Install Python requirements
pip install -r ml/requirements.txt

# 2. Run data pipeline to fetch/engineer features
python ml/data_pipeline.py

# 3. Train XGBoost model
python ml/train.py

# 4. Launch FastAPI microservice (port 8000)
uvicorn ml.main:app --host 0.0.0.0 --port 8000 --reload
```

Test inference endpoint:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "avg_oil_7d": 78.50,
    "avg_pkr_7d": 278.20,
    "estimated_c_and_f_pkr": 21838.70,
    "petrol_price_yesterday": 268.40
  }'
```

### 2. Daily Cron Automation (6:00 PM PKT)

Run a dry-run test immediately:
```bash
python ml/daily_cron.py --dry-run
```

Run as background daemon scheduled for 18:00 PKT:
```bash
python ml/daily_cron.py --daemon
```

### 3. Next.js 14 Web Application

```bash
# Generate Prisma Client
npx prisma generate

# Build application
npm run build

# Start production server
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💎 Core Features

1. **Daily Predictor Bento Grid**:
   - Today's official pump price (PKR/Liter).
   - Tomorrow's predicted price (with expected change and confidence score).
   - **Action Card**:
     - ⚠️ Price Hike: Crimson alert &mdash; *"Fill up before midnight!"*
     - ✨ Price Drop: Emerald alert &mdash; *"Hold on! Wait until tomorrow morning."*
   - OGRA 7-working-day market drivers indicator (Brent 7d average, USD/PKR 7d average, C&F parity).

2. **Personalized Car-Wise Savings Calculator**:
   - Pakistani vehicles supported:
     - **Suzuki Alto** (27L)
     - **Suzuki Cultus / Wagon R** (35L)
     - **Suzuki Swift** (37L)
     - **Honda City** (40L)
     - **Toyota Yaris** (42L)
     - **Honda Civic** (47L)
     - **Toyota Corolla** (50L)
     - **Changan Oshan X7** (55L)
     - **Kia Sportage / Hyundai Tucson** (62L)
     - **Toyota Fortuner / Hilux Revo** (80L)
     - Custom vehicle tank capacity
   - Interactive Fuel Level Slider (0% - 100%) with real-time tank gauge.
   - Computes exact liters required and net PKR saved by following the Action Card advice.

3. **Global Impact & Feedback Loop**:
   - Live counters for **"Total Cars Helped"** and **"Total PKR Saved for Pakistanis"**.
   - Interactive feedback widget (*"Did this prediction help you save money today?"*).
   - Automatically increments the global database counters via `/api/feedback`.

4. **Data Visualization (The "Why")**:
   - Interactive Recharts line chart comparing **Actual Retail Pump Prices** vs. **7-Day Rolling Imported C&F Parity**.
   - Interactive tooltips explaining OGRA formula lag and Platts crude dynamics.
