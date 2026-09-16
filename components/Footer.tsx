"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t-[4px] border-[#1C1C1C] bg-[#F9F9F4] text-[#1C1C1C] pt-12 pb-8">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex justify-center mb-8">
           <h1 className="text-3xl font-serif font-black tracking-tighter uppercase">The Forecaster</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center font-sans text-[10px] uppercase tracking-widest font-bold border-t border-[#1C1C1C]/20 pt-8">
           <div className="text-[#1C1C1C]/60 mb-4 md:mb-0">
             &copy; 2026 ASAAN LABS. ALL RIGHTS RESERVED.
           </div>
           
           <div className="flex gap-8">
             <a href="#" className="text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors">Terms of Service</a>
             <a href="#" className="text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors">Privacy Policy</a>
             <a href="#" className="text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors">Editorial Standards</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
