"use client";
import React from "react";

export default function TrendChart({ oil7d, pkr7d, estimatedCAndF }: any) {
  return (
    <section className="py-16 border-t border-[#1C1C1C]">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-serif font-bold mb-8">Core Macro Indicators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-y border-l border-[#1C1C1C] font-mono text-sm">
           
           <div className="border-r border-[#1C1C1C] p-6 bg-white">
              <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1C1C1C]/60 mb-4">
                Global Brent (7D Avg)
              </div>
              <div className="text-3xl font-black tracking-tight text-[#1C1C1C]">
                ${oil7d?.toFixed(2) || '95.96'} <span className="text-sm font-normal text-[#1C1C1C]/60">/ bbl</span>
              </div>
           </div>
           
           <div className="border-r border-[#1C1C1C] p-6 bg-white">
              <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1C1C1C]/60 mb-4">
                Exchange Rate (USD/PKR)
              </div>
              <div className="text-3xl font-black tracking-tight text-[#1C1C1C]">
                Rs. {pkr7d?.toFixed(2) || '275.77'}
              </div>
           </div>
           
           <div className="border-r border-[#1C1C1C] p-6 bg-[#1C1C1C] text-[#F9F9F4]">
              <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#F9F9F4]/60 mb-4">
                Estimated Ex-Refinery
              </div>
              <div className="text-3xl font-black tracking-tight">
                Rs. {((estimatedCAndF || 26462.89) / 158.987).toFixed(2)} <span className="text-sm font-normal text-[#F9F9F4]/60">/ L</span>
              </div>
           </div>

        </div>
      </div>
    </section>
  );
}
