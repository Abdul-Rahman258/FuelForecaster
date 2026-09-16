"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Clock,
  Fuel,
  Zap,
} from "lucide-react";

export interface FuelData {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  todayPrice: number;
  predictedPrice: number;
  expectedDelta: number;
  direction: "HIKE" | "DROP" | "STABLE";
  advice: string;
}

interface HeroProps {
  fuels: Record<string, FuelData>;
  selectedFuelKey: string;
  onSelectFuelKey: (key: string) => void;
  confidenceScore?: number;
}

export default function DailyPredictorHero({
  fuels,
  selectedFuelKey,
  onSelectFuelKey,
  confidenceScore = 0.9712,
}: HeroProps) {
  const currentFuel: FuelData = fuels[selectedFuelKey] || fuels["petrol"] || {
    id: "petrol",
    name: "Super Petrol (92 RON)",
    shortName: "Super 92",
    badge: "OGRA Regulated",
    todayPrice: 370.81,
    predictedPrice: 368.75,
    expectedDelta: -2.06,
    direction: "DROP",
    advice: "Hold on! Wait until tomorrow morning.",
  };

  const isHike = currentFuel.direction === "HIKE";

  return (
    <section className="pt-4 pb-8">
      <div className="mx-auto max-w-5xl px-6">
        {/* Main Headline Section (Newspaper style) */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-[#1C1C1C] leading-[1.05]">
            {isHike ? "PETROL PRICES PROJECTED TO SURGE" : "PETROL PRICES EXPECTED TO DROP"}
          </h1>
          <p className="mt-3 max-w-3xl mx-auto text-base sm:text-lg text-[#1C1C1C]/80 leading-relaxed font-serif">
            Institutional tracking of IMF mandates and Federal Board of Revenue deficits reveals a highly probable {isHike ? "increase" : "decrease"} in petroleum levies before midnight. 
          </p>
        </div>

        {/* 3-Way Fuel Type Switcher (Editorial style tabs moved to the top) */}
        <div className="flex flex-wrap justify-center items-center gap-6 font-sans text-[10px] uppercase tracking-widest font-bold border-y-2 border-[#1C1C1C] py-2 mb-6">
          <span className="text-[#1C1C1C]/50">Select Commodity:</span>
          {[
            { key: "petrol", label: "Super 92" },
            { key: "diesel", label: "HSD" },
            { key: "hobc", label: "HOBC 97" },
          ].map((item) => {
            const isSelected = selectedFuelKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectFuelKey(item.key)}
                className={`transition-colors relative ${
                  isSelected
                    ? "text-[#1C1C1C]"
                    : "text-[#1C1C1C]/40 hover:text-[#1C1C1C]"
                }`}
              >
                {item.label}
                {isSelected && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#1C1C1C]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Multi-Column Data Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left Column: The Narrative / Advice */}
          <div className="md:col-span-7">
            <h2 className="text-xl font-serif font-bold mb-3">Market Advisory</h2>
            <p className="text-sm text-[#1C1C1C]/80 font-serif leading-relaxed mb-4">
              Our automated macro-economic scraping engine has detected significant movements in the underlying price structures. 
              According to the latest calculations, {currentFuel.name} is currently officially priced at <strong className="font-mono">Rs. {currentFuel.todayPrice.toFixed(2)}</strong>.
            </p>
            <p className="text-sm text-[#1C1C1C]/80 font-serif leading-relaxed mb-6">
              However, due to {isHike ? "tax collection shortfalls and rising global benchmarks" : "stabilizing global oil costs"}, we calculate a <strong className="font-mono">{currentFuel.expectedDelta > 0 ? "+" : ""}{currentFuel.expectedDelta.toFixed(2)} PKR</strong> adjustment for tomorrow.
            </p>

            <div className="border-t-[2px] border-[#1C1C1C] pt-4">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-1 text-[#1C1C1C]/60">Action Required</h3>
              <div className={`text-3xl font-serif font-black ${isHike ? 'text-[#991B1B]' : 'text-[#166534]'}`}>
                {currentFuel.advice}
              </div>
              <div className="mt-3 pt-3 border-t border-[#1C1C1C]/20">
                <a href="#calculator" className="font-serif italic text-xs text-[#1C1C1C]/70 hover:text-[#1C1C1C] flex items-center gap-2 group">
                  <span>Did we help you save? Calculate your exact exposure</span>
                  <span className="font-sans text-xs transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: The Hard Numbers */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest border-b-[2px] border-[#1C1C1C] pb-2">The Figures</h2>
            
            <div className="flex justify-between items-baseline border-b border-[#1C1C1C]/20 pb-3">
              <span className="font-serif text-sm text-[#1C1C1C]/80">Current Official Rate</span>
              <span className="font-mono text-xl font-bold">Rs. {currentFuel.todayPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-[#1C1C1C]/20 pb-3">
              <span className="font-serif text-sm text-[#1C1C1C]/80">Projected Adjustment</span>
              <span className={`font-mono text-xl font-bold ${isHike ? 'text-[#991B1B]' : 'text-[#166534]'}`}>
                {currentFuel.expectedDelta > 0 ? "+" : ""}{currentFuel.expectedDelta.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b-[2px] border-[#1C1C1C] pb-3">
              <span className="font-serif text-base font-bold text-[#1C1C1C]">Expected New Rate</span>
              <span className="font-mono text-2xl font-black">Rs. {currentFuel.predictedPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1C1C1C]/60">System Confidence</span>
              <span className="font-mono text-xs font-bold">{(confidenceScore * 100).toFixed(1)}%</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
