"use client";
import React, { useState, useEffect } from "react";

interface GlobalImpactWidgetProps {
  activeSavings?: number;
  selectedCarName?: string;
}

export default function GlobalImpactWidget({ activeSavings, selectedCarName }: GlobalImpactWidgetProps) {
  // Static placeholder until connected to live Google Analytics API
  const citizens = 14592840;

  return (
    <section className="py-16 border-t border-[#1C1C1C]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-[#1C1C1C] text-[#F9F9F4] p-12 text-center shadow-[8px_8px_0px_0px_rgba(220,220,220,1)] relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#F9F9F4]/60">Live</span>
          </div>
          
          <h2 className="text-2xl font-serif italic mb-4">The National Ledger</h2>
          <div className="w-16 h-[2px] bg-[#F9F9F4]/30 mx-auto mb-8"></div>
          
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#F9F9F4]/60 mb-6">
            Total Citizens Assisted
          </p>
          
          <div className="font-mono text-5xl sm:text-6xl md:text-8xl font-black text-[#F9F9F4] tracking-tighter tabular-nums">
             {citizens.toLocaleString()}
          </div>
          
          <p className="font-serif mt-8 text-[#F9F9F4]/70 max-w-xl mx-auto text-lg leading-relaxed">
            The total number of citizens who successfully navigated midnight price revisions utilizing the Asaan Forecaster intelligence network.
          </p>
        </div>
      </div>
    </section>
  );
}
