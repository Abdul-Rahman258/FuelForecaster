"use client";

import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
  }, []);

  return (
    <header className="w-full bg-[#F9F9F4] text-[#1C1C1C] border-b-2 border-[#1C1C1C] pt-3 pb-2">
      <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-2">
        {/* Date / Left side */}
        <div className="text-[10px] font-mono uppercase tracking-widest text-center sm:text-left flex-1">
          {currentDate || "Wednesday, September 16, 2026"}
        </div>

        {/* Masthead / Center */}
        <div className="text-center flex-1 flex flex-col items-center">
          <p className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] mb-1 text-[#1C1C1C]/70">An Asaan Labs Initiative</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tighter uppercase leading-none">
            The Fuel Forecaster
          </h1>
        </div>

        {/* Edition / Right side */}
        <div className="text-[10px] font-mono uppercase tracking-widest text-center sm:text-right flex-1">
          National Edition
        </div>
      </div>
      <div className="mx-auto max-w-5xl mt-2 px-6">
        <div className="border-t border-[#1C1C1C] flex justify-center gap-8 pt-2 text-[10px] font-sans font-bold uppercase tracking-widest">
           <a href="#calculator" className="hover:underline">Calculator</a>
           <a href="#world-economy" className="hover:underline">Macro Radar</a>
           <a href="https://www.asaanlabs.tech" target="_blank" rel="noopener noreferrer" className="hover:underline">Visit Asaan Labs</a>
        </div>
      </div>
    </header>
  );
}
