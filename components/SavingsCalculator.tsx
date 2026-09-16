"use client";
import React, { useState } from "react";

export default function SavingsCalculator({ todayPrice, predictedPrice, expectedDelta, direction, fuelName, onLogSavings, onAutoSwitchFuel }: any) {
  const [liters, setLiters] = useState<number>(40);
  const isHike = direction === "HIKE";
  const difference = expectedDelta * liters;

  return (
    <section id="calculator" className="py-16 border-t-[2px] border-[#1C1C1C]">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-black mb-8 uppercase tracking-tight">Citizen Impact Calculator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <p className="font-serif text-lg leading-relaxed mb-8 text-[#1C1C1C]/80">
              Calculate your exact financial exposure to the upcoming midnight price revision. Enter your vehicle's tank capacity below to assess the impact.
            </p>
            <div className="flex flex-col gap-4 border-l-[3px] border-[#1C1C1C] pl-6">
               <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#1C1C1C]/60">
                 Fuel Volume (Liters)
               </label>
               <div className="flex items-center gap-4">
                 <input 
                   type="number" 
                   value={liters} 
                   onChange={e => setLiters(Number(e.target.value) || 0)} 
                   className="bg-transparent text-5xl sm:text-7xl font-mono font-black focus:outline-none pb-1 text-[#1C1C1C] placeholder-[#1C1C1C]/20 w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 border-[#1C1C1C]" 
                   placeholder="40"
                 />
                 <div className="flex flex-col border-2 border-[#1C1C1C]">
                   <button onClick={() => setLiters(l => l + 1)} className="px-3 py-1 bg-[#1C1C1C] text-[#F9F9F4] font-mono font-bold hover:bg-[#1C1C1C]/80 transition-colors border-b-2 border-[#F9F9F4]">+</button>
                   <button onClick={() => setLiters(l => Math.max(0, l - 1))} className="px-3 py-1 bg-transparent text-[#1C1C1C] font-mono font-bold hover:bg-[#1C1C1C]/10 transition-colors">-</button>
                 </div>
               </div>
            </div>
          </div>

          <div className="border-[2px] border-[#1C1C1C] p-8 bg-[#F9F9F4] shadow-[8px_8px_0px_0px_rgba(28,28,28,1)]">
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#1C1C1C] border-b-2 border-[#1C1C1C] pb-4 mb-6">
              Financial Ledger
            </h3>
            
            <div className="flex justify-between items-baseline font-serif mb-4 text-[#1C1C1C]/80">
              <span>Current Cost (Full Tank)</span>
              <span className="font-mono text-xl">Rs. {(todayPrice * liters).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-baseline font-serif mb-6 border-b border-[#1C1C1C]/20 pb-6 text-[#1C1C1C]/80">
              <span>Projected Cost (Full Tank)</span>
              <span className="font-mono text-xl">Rs. {(predictedPrice * liters).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-baseline font-serif font-bold text-2xl pt-2">
               <span>Net {isHike ? "Loss if delayed" : "Savings if delayed"}</span>
               <span className={`font-mono font-black text-3xl ${isHike ? 'text-[#991B1B]' : 'text-[#166534]'}`}>
                 Rs. {Math.abs(difference).toFixed(2)}
               </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
