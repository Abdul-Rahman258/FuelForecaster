"use client";
import React, { useState } from "react";

export default function WorldEconomyRadar() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: "Global Crude",
      content: "The international petroleum landscape remains highly volatile. Middle Eastern production cuts continue to place upward pressure on Brent Crude benchmarks, forcing importing nations like Pakistan to absorb significantly higher freight premiums on every barrel."
    },
    {
      title: "FBR Deficit",
      content: "The Federal Board of Revenue's ongoing struggle to meet strict IMF-mandated tax collection targets has necessitated an aggressive reliance on the Petroleum Development Levy (PDL). Any global price relief is immediately offset by local taxation requirements."
    },
    {
      title: "Exchange Rate",
      content: "Our macro-radar indicates that until the central bank stabilizes its foreign exchange reserves, the government will maintain a highly inelastic pricing floor, making timely fuel purchases absolutely critical for household budget preservation."
    }
  ];

  return (
    <section id="world-economy" className="py-12 bg-[#F9F9F4] border-t border-[#1C1C1C]/20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-black mb-6 uppercase tracking-tight">Geopolitical Briefing</h2>
        
        <div className="border-[2px] border-[#1C1C1C] flex flex-col md:flex-row">
          {/* Tab Navigation (Left Sidebar) */}
          <div className="md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-[#1C1C1C]">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`p-4 text-left font-sans text-xs uppercase tracking-widest font-bold transition-colors ${
                  activeTab === idx 
                    ? "bg-[#1C1C1C] text-[#F9F9F4]" 
                    : "bg-transparent text-[#1C1C1C] hover:bg-[#1C1C1C]/10"
                } ${idx !== tabs.length - 1 ? "border-b border-[#1C1C1C]" : ""}`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content (Right Side) */}
          <div className="md:w-2/3 p-6 md:p-8 flex items-center bg-[#F9F9F4]">
            <p className="font-serif text-lg leading-relaxed text-[#1C1C1C]/90 text-justify">
              {tabs[activeTab].content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
