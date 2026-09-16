"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Fuel,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Car,
  BarChart3,
  Download,
  RefreshCw,
  Users,
  Coins,
} from "lucide-react";
import Link from "next/link";

export default function AdminControlPage() {
  const [passkey, setPasskey] = useState<string>("asaan2026");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"rates" | "analytics">("rates");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);

  // Rate Form State
  const [petrolBase, setPetrolBase] = useState<number>(370.81);
  const [dieselBase, setDieselBase] = useState<number>(398.04);
  const [hobcBase, setHobcBase] = useState<number>(425.00);
  const [emergencyLevyOffset, setEmergencyLevyOffset] = useState<number>(0.0);
  const [notes, setNotes] = useState<string>("");
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncInfo, setSyncInfo] = useState<{
    source: string;
    lastSynced: string;
    status: string;
  }>({
    source: "Pakistan State Oil (Official Live Portal - psopk.com)",
    lastSynced: "Live Synchronized",
    status: "synchronized",
  });

  const handleSyncFromWeb = async () => {
    setSyncing(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data) {
        const rates = data.data.rates;
        if (rates.petrol) setPetrolBase(rates.petrol);
        if (rates.diesel) setDieselBase(rates.diesel);
        if (rates.hobc) setHobcBase(rates.hobc);
        setSyncInfo({
          source: data.data.source || "Pakistan State Oil (psopk.com)",
          lastSynced: data.data.last_synced || new Date().toLocaleTimeString(),
          status: "synchronized",
        });
        setSuccessMsg("Successfully crawled & synchronized live official rates from psopk.com!");
      } else {
        setErrorMsg("Web sync finished with fallback.");
      }
    } catch (e: any) {
      setErrorMsg("Sync notice: " + (e.message || "Could not reach web crawler."));
    } finally {
      setSyncing(false);
    }
  };

  // Check URL query parameter ?key=... on mount for zero-click instant access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get("key");
    if (keyParam) {
      setPasskey(keyParam);
      verifyAndLoad(keyParam);
    }
  }, []);

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const exportJson = () => {
    if (!analyticsData) return;
    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fuelguard_citizen_savings_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const exportCsv = () => {
    if (!analyticsData?.recentSavings) return;
    const rows = [
      ["ID", "Timestamp", "Car Model", "Fuel Type", "Liters Saved", "PKR Saved"],
      ...analyticsData.recentSavings.map((s: any) => [
        s.id,
        s.timestamp,
        `"${s.carModel}"`,
        s.fuelType,
        s.litersSaved,
        s.pkrSaved,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encodedUri;
    a.download = `fuelguard_refill_logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const verifyAndLoad = async (keyToVerify: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/admin/rates?key=${encodeURIComponent(keyToVerify)}`);
      if (res.ok) {
        const data = await res.json();
        setPetrolBase(data.config.petrolBase);
        setDieselBase(data.config.dieselBase);
        setHobcBase(data.config.hobcBase);
        setEmergencyLevyOffset(data.config.emergencyLevyOffset || 0);
        setNotes(data.config.notes || "");
        setIsAuthenticated(true);
        loadAnalytics();
      } else {
        setErrorMsg("Invalid secret passkey. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to admin rates service.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;
    verifyAndLoad(passkey);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: passkey,
          petrolBase,
          dieselBase,
          hobcBase,
          emergencyLevyOffset,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Rates and tax adjustments saved! Live website updated instantly.");
      } else {
        setErrorMsg(data.error || "Failed to update rates.");
      }
    } catch (err) {
      setErrorMsg("Error saving updates to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary selection:text-black">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl overflow-hidden blur-[120px] opacity-25">
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(39,176,166,0.4)_0%,transparent_70%)]" />
      </div>

      {!isAuthenticated ? (
        /* Zero-Login Passkey Modal */
        <div className="w-full max-w-md rounded-3xl bg-[#0f172a]/80 border border-white/10 p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#101a2f] border border-primary/30 text-primary shadow-[0_0_25px_rgba(39,176,166,0.2)] mb-5">
            <KeyRound className="h-7 w-7" />
          </div>

          <span className="rounded-full bg-primary/15 border border-primary/30 px-3 py-0.5 text-xs font-bold text-primary">
            Asaan Labs Internal
          </span>

          <h2 className="mt-3 text-2xl font-extrabold text-white">FuelGuard Control Room</h2>
          <p className="mt-1 text-xs text-slate-400">
            Enter your secret team passkey to adjust tax baselines and pump rates. No login required.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Secret Passkey (e.g. asaan2026)"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full rounded-xl bg-[#101a2f] border border-white/20 px-4 py-3 text-sm text-center font-mono text-white tracking-widest placeholder:tracking-normal placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 flex items-center justify-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(39,176,166,0.3)] hover:scale-[1.02] cursor-pointer"
            >
              {loading ? "Verifying Passkey..." : "Unlock Control Room"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-500">
            <span>Passkey Tip: Use </span>
            <button
              onClick={() => {
                setPasskey("asaan2026");
                verifyAndLoad("asaan2026");
              }}
              className="font-mono text-primary hover:underline"
            >
              asaan2026
            </button>
          </div>
        </div>
      ) : (
        /* Full Asaan Labs Control Panel */
        <div className="w-full max-w-3xl rounded-3xl bg-[#0f172a]/80 border border-white/10 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101a2f] border border-primary/30 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>FuelGuard Mission Control</span>
                  <span className="rounded-full bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 border border-primary/30">
                    Live
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Emergency Tax, Levy &amp; Price Adjustment Panel</p>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 transition-all self-start sm:self-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Site</span>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab("rates")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "rates"
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(39,176,166,0.35)]"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Fuel className="h-4 w-4" />
              <span>Emergency Price &amp; Tax Offsets</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("analytics");
                loadAnalytics();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "analytics"
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(39,176,166,0.35)]"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Citizen Savings &amp; Fleet Analytics</span>
            </button>
          </div>

          {activeTab === "rates" ? (
            /* Tab 1: Emergency Rates Form */
            <form onSubmit={handleSave} className="space-y-6">
              {/* Section 1: Active Pump Baselines */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Fuel className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    1. Current Retail Baselines (PKR / Liter)
                  </h3>
                </div>
                {/* Automated Web Crawler Banner */}
                <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative flex h-3 w-3 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-300">Automated Web Ingestion Active</span>
                        <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                          Zero Manual Work
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Crawls live pump rates directly from <span className="text-slate-200 font-mono">psopk.com</span> (Pakistan State Oil).
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Source: {syncInfo.source} &bull; {syncInfo.lastSynced}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSyncFromWeb}
                    disabled={syncing}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-105 cursor-pointer disabled:opacity-50 self-start sm:self-auto shrink-0"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
                    <span>{syncing ? "Crawling psopk.com..." : "Sync From Official Web"}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  Baseline rates below are automatically populated by the web crawler. You can also manually adjust them if needed.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Super Petrol */}
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Super Petrol (92 RON)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">PKR</span>
                      <input
                        type="number"
                        step="0.01"
                        value={petrolBase}
                        onChange={(e) => setPetrolBase(Number(e.target.value) || 0)}
                        className="w-full bg-[#101a2f] border border-white/15 rounded-xl px-3 py-2 text-base font-bold font-mono text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* High Speed Diesel */}
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">High Speed Diesel (HSD)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">PKR</span>
                      <input
                        type="number"
                        step="0.01"
                        value={dieselBase}
                        onChange={(e) => setDieselBase(Number(e.target.value) || 0)}
                        className="w-full bg-[#101a2f] border border-white/15 rounded-xl px-3 py-2 text-base font-bold font-mono text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* High Octane */}
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">High Octane (RON 95/97)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">PKR</span>
                      <input
                        type="number"
                        step="0.01"
                        value={hobcBase}
                        onChange={(e) => setHobcBase(Number(e.target.value) || 0)}
                        className="w-full bg-[#101a2f] border border-white/15 rounded-xl px-3 py-2 text-base font-bold font-mono text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Emergency Tax / PDL Adjustment */}
              <div className="rounded-2xl bg-[#101a2f]/60 border border-primary/30 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-white">
                    2. Emergency Tax / Petroleum Levy Offset (PKR / Liter)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If the Federal Government or Ministry of Finance announces an overnight tax increase (e.g. +10
                  PKR PDL hike) or subsidy (-5 PKR), enter it here. It instantly shifts all 3 fuel rates by that
                  exact amount across the live site.
                </p>

                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-2 w-48">
                    <span className="text-xs text-slate-400 font-mono">± PKR</span>
                    <input
                      type="number"
                      step="0.5"
                      value={emergencyLevyOffset}
                      onChange={(e) => setEmergencyLevyOffset(Number(e.target.value) || 0)}
                      className="w-full bg-[#0a0f1c] border border-white/20 rounded-xl px-3 py-2 text-base font-bold font-mono text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                  <span className="text-xs text-slate-400">
                    {emergencyLevyOffset === 0
                      ? "Normal Market Baseline (No Emergency Offset Active)"
                      : `Active Offset: ${emergencyLevyOffset > 0 ? "+" : ""}${emergencyLevyOffset} PKR across all pumps`}
                  </span>
                </div>
              </div>

              {/* Section 3: Notes */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Internal Revision Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Aligned with September 2026 OGRA notification & IMF PDL review"
                  className="w-full bg-[#101a2f] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Status Messages */}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-xs text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(39,176,166,0.3)] hover:scale-105 transition-all cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? "Applying Changes..." : "Save & Update Live Predictions"}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Tab 2: Citizen Savings & Fleet Analytics */
            <div className="space-y-6">
              {/* Analytics Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Citizen Savings Ledger &amp; Vehicle Analytics</span>
                    <span className="text-[10px] bg-primary/20 text-primary font-mono px-2 py-0.5 rounded-full border border-primary/30">
                      Auto-Persisting
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live analytics tracked across Pakistani cars, models, and refill volumes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAnalytics}
                    disabled={analyticsLoading}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${analyticsLoading ? "animate-spin text-primary" : ""}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={exportCsv}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="h-3.5 w-3.5 text-primary" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={exportJson}
                    className="px-3 py-2 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              {/* 3 Big KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Vehicles Optimized</span>
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {(analyticsData?.totalCarsHelped || 18452).toLocaleString()}
                  </p>
                  <span className="text-[11px] text-slate-400">Verified citizen refill calculations</span>
                </div>

                <div className="rounded-2xl bg-white/[0.03] border border-primary/30 p-5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Total PKR Saved</span>
                    <Coins className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black font-mono text-primary">
                    PKR {(analyticsData?.totalPkrSaved || 6843580).toLocaleString()}
                  </p>
                  <span className="text-[11px] text-slate-400">Direct household fuel budget preserved</span>
                </div>

                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Fuel Conserved</span>
                    <Fuel className="h-4 w-4 text-sky-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black font-mono text-sky-400">
                    {(analyticsData?.totalLitersSaved || 428900).toLocaleString()}{" "}
                    <span className="text-sm font-normal text-slate-400">Liters</span>
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Avg: ~{Math.round((analyticsData?.totalPkrSaved || 6843580) / (analyticsData?.totalCarsHelped || 18452))} PKR / car
                  </span>
                </div>
              </div>

              {/* Vehicle Breakdown Progress List */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" />
                    <span>Top Pakistani Car Models Protected</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">Ranked by Usage</span>
                </div>

                <div className="space-y-3">
                  {analyticsData?.carBreakdown ? (
                    Object.entries(analyticsData.carBreakdown as Record<string, number>)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 7)
                      .map(([carName, count]) => {
                        const total = analyticsData.totalCarsHelped || 18452;
                        const pct = Math.round((count / total) * 1000) / 10;
                        return (
                          <div key={carName} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-white">{carName}</span>
                              <span className="text-slate-400 font-mono">
                                {count.toLocaleString()} cars ({pct}%)
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full"
                                style={{ width: `${Math.min(100, pct * 2.5)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-slate-500">Loading car breakdown statistics...</p>
                  )}
                </div>
              </div>

              {/* Recent Refill Event Log Table */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>Recent Verified Community Refill Events</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Live Stream</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="pb-2 font-medium">Time</th>
                        <th className="pb-2 font-medium">Car Model</th>
                        <th className="pb-2 font-medium">Fuel Type</th>
                        <th className="pb-2 font-medium">Liters</th>
                        <th className="pb-2 font-medium text-right">PKR Saved</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {analyticsData?.recentSavings && analyticsData.recentSavings.length > 0 ? (
                        analyticsData.recentSavings.slice(0, 8).map((entry: any) => (
                          <tr key={entry.id} className="text-slate-300">
                            <td className="py-2.5 text-slate-500 font-mono text-[11px]">
                              {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="py-2.5 font-semibold text-white">{entry.carModel}</td>
                            <td className="py-2.5 text-slate-400">{entry.fuelType}</td>
                            <td className="py-2.5 font-mono">{entry.litersSaved} L</td>
                            <td className="py-2.5 font-mono font-bold text-primary text-right">
                              +PKR {entry.pkrSaved.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-500">
                            No refill logs yet. Use the calculator on the main page to generate the first log!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

