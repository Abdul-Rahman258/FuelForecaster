"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DailyPredictorHero, { FuelData } from "@/components/DailyPredictorHero";
import SavingsCalculator from "@/components/SavingsCalculator";
import TrendChart from "@/components/TrendChart";
import GlobalImpactWidget from "@/components/GlobalImpactWidget";
import WorldEconomyRadar from "@/components/WorldEconomyRadar";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedFuelKey, setSelectedFuelKey] = useState<string>("petrol");

  // Multi-fuel rates state anchored to September 2026 Pakistan prices
  const [fuels, setFuels] = useState<Record<string, FuelData>>({
    petrol: {
      id: "petrol",
      name: "Super Petrol (92 RON)",
      shortName: "Super 92",
      badge: "OGRA Regulated",
      todayPrice: 375.81,
      predictedPrice: 375.81,
      expectedDelta: 0.0,
      direction: "STABLE",
      advice: "Weekend rates stable. Regular filling recommended.",
    },
    diesel: {
      id: "diesel",
      name: "High Speed Diesel (HSD)",
      shortName: "Diesel HSD",
      badge: "Commercial / SUV",
      todayPrice: 403.04,
      predictedPrice: 403.04,
      expectedDelta: 0.0,
      direction: "STABLE",
      advice: "Weekend rates stable. Regular filling recommended.",
    },
    hobc: {
      id: "hobc",
      name: "High Octane (RON 95 / 97)",
      shortName: "High Octane 95/97",
      badge: "Turbo & Luxury",
      todayPrice: 430.00,
      predictedPrice: 430.00,
      expectedDelta: 0.0,
      direction: "STABLE",
      advice: "Weekend rates stable. Regular filling recommended.",
    },
  });

  const [rollingMeta, setRollingMeta] = useState({
    oil7d: 95.96,
    pkr7d: 275.77,
    estimatedCAndF: 26462.89,
    confidenceScore: 0.9712,
  });

  const [activeCarSavings, setActiveCarSavings] = useState<number>(185);
  const [activeCarName, setActiveCarName] = useState<string>("Suzuki Alto VXL AGS");

  useEffect(() => {
    fetch(`/api/predictions/today?t=${new Date().getTime()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.fuels) {
          setFuels(json.fuels);
          setRollingMeta({
            oil7d: json["7_day_avg_oil"] || 95.96,
            pkr7d: json["7_day_avg_pkr"] || 275.77,
            estimatedCAndF: json["estimated_c_and_f_pkr"] || 26462.89,
            confidenceScore: json["confidence_score"] || 0.9712,
          });
        }
      })
      .catch((err) => console.log("Prediction fetch notice:", err));
  }, []);

  const activeFuel = fuels[selectedFuelKey] || fuels["petrol"];

  const handleLogSavings = (carName: string, liters: number, pkr: number) => {
    setActiveCarName(carName);
    setActiveCarSavings(pkr);

    // Auto-record to Citizen Savings Ledger
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carModel: carName,
        fuelType: activeFuel.name,
        litersSaved: liters,
        pkrSaved: pkr,
        helped: true,
      }),
    }).catch((e) => console.log("Auto-log notice:", e));

    const impactElem = document.getElementById("impact");
    if (impactElem) {
      impactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F4] text-[#1C1C1C] flex flex-col selection:bg-[#1C1C1C] selection:text-[#F9F9F4] font-sans">
      {/* Navigation with Glassmorphism & Blur */}
      <Navbar />

      {/* Hero with 3-Way Fuel Switcher: Super 92, Diesel HSD, High Octane 95/97 */}
      <DailyPredictorHero
        fuels={fuels}
        selectedFuelKey={selectedFuelKey}
        onSelectFuelKey={(key) => setSelectedFuelKey(key)}
        confidenceScore={rollingMeta.confidenceScore}
      />

      <div className="mx-auto max-w-7xl px-6 w-full">
        {/* Car-Wise Savings Calculator with Active Fuel Sync */}
        <SavingsCalculator
          todayPrice={activeFuel.todayPrice}
          predictedPrice={activeFuel.predictedPrice}
          expectedDelta={activeFuel.expectedDelta}
          direction={activeFuel.direction}
          fuelName={activeFuel.name}
          onLogSavings={handleLogSavings}
          onAutoSwitchFuel={(fuelKey) => setSelectedFuelKey(fuelKey)}
        />

        {/* Visual Trend Chart with Technical Data at the Bottom */}
        <TrendChart
          oil7d={rollingMeta.oil7d}
          pkr7d={rollingMeta.pkr7d}
          estimatedCAndF={rollingMeta.estimatedCAndF}
        />

        {/* World Economy & Geopolitical Intelligence Terminal */}
        <WorldEconomyRadar />

        {/* Global Impact & Feedback Loop */}
        <GlobalImpactWidget
          activeSavings={activeCarSavings}
          selectedCarName={activeCarName}
        />
      </div>

      {/* Asaan Labs Footer with Heavy Glassmorphism and Blur */}
      <Footer />
    </main>
  );
}
