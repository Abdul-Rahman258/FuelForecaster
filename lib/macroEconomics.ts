export interface MacroIndicator {
  id: string;
  name: string;
  category: 'Supply' | 'Currency' | 'Geopolitics' | 'Freight' | 'Demand';
  currentValue: string;
  change24h: string;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  pakistanImpact: string;
  summary: string;
}

export interface WorldEconomyReport {
  date: string;
  oilBenchmark: {
    name: string;
    spotPrice: number;
    change24hPercent: number;
    sevenDayAverage: number;
  };
  geopoliticalRiskScore: number;
  supplyTightnessScore: number;
  currencyPressureScore: number;
  executiveBriefing: {
    title: string;
    headline: string;
    macroSummary: string;
    geopoliticalContext: string;
    localTransmissionChannel: string;
    strategicTakeaway: string;
  };
  indicators: MacroIndicator[];
}

export const WORLD_ECONOMY_ANALYSIS: WorldEconomyReport = {
  date: new Date().toISOString().split('T')[0],
  oilBenchmark: {
    name: 'Brent Crude (ICE Europe)',
    spotPrice: 101.21,
    change24hPercent: 3.36,
    sevenDayAverage: 95.96,
  },
  geopoliticalRiskScore: 78,
  supplyTightnessScore: 84,
  currencyPressureScore: 72,
  executiveBriefing: {
    title: 'Global Oil Market and Geopolitical Intelligence Memorandum',
    headline: 'OPEC+ Supply Restraint and Maritime Freight Surcharges Drive Crude Past /bbl',
    macroSummary: 'International crude markets are navigating a confluence of disciplined OPEC+ production ceilings and tightening prompt physical supplies. The decision by core OPEC+ members (Saudi Arabia, UAE, Russia) to maintain 2.2M bpd voluntary output restrictions into late 2026 has drawn down OECD commercial petroleum inventories below their 5-year seasonal averages.',
    geopoliticalContext: 'Heightened naval friction across the Red Sea corridor (Bab-el-Mandeb) continues to force 65 percent of East-West commercial tankers to detour around Africa Cape of Good Hope, adding 10 to 14 days in transit time. Concurrently, heightened surveillance around the Strait of Hormuz carrying 20.5 million bpd (21 percent of global petroleum consumption) has injected an estimated +.20/barrel geopolitical risk premium into frontline Brent futures.',
    localTransmissionChannel: 'For Pakistan, which imports over 80 percent of its refined petroleum and crude feedstocks, these international movements transmit directly into domestic pump meters via OGRA 7-working-day rolling C&F import parity formula. With international crude rising +.70/bbl on a rolling 7-day basis and SBP interbank USD/PKR holding at Rs. 277.15, the landed import cost per liter has surged by +2.94 PKR.',
    strategicTakeaway: 'Domestic retail fuel prices are positioned for a mandatory upward revision (+2.94 PKR on Petrol, +3.29 PKR on Diesel) at the midnight regulatory sync. Motorists and fleet operators are advised to complete all fleet refills prior to 11:59 PM PKT to insulate against this international price wave.',
  },
  indicators: [
    {
      id: 'opec-quota',
      name: 'OPEC+ Production Discipline',
      category: 'Supply',
      currentValue: '2.2M bpd Voluntary Cut',
      change24h: 'Strict Compliance (98.4%)',
      trend: 'BULLISH',
      riskLevel: 'ELEVATED',
      pakistanImpact: 'Restricts prompt Middle East cargo availability for PSO and private refiners.',
      summary: 'Saudi Arabia and Russia have maintained production caps, keeping global crude balances in an intentional 0.8M bpd deficit through Q3 2026.',
    },
    {
      id: 'geopolitical-risk',
      name: 'Middle East and Hormuz Risk Premium',
      category: 'Geopolitics',
      currentValue: '+.20 / bbl Premium',
      change24h: '+0.85 $/bbl',
      trend: 'BULLISH',
      riskLevel: 'CRITICAL',
      pakistanImpact: 'Directly increases Platts Arab Gulf benchmark quotation used by OGRA.',
      summary: 'Naval posturing and drone threats along regional maritime transit lanes require additional hull risk insurance on Gulf-to-Karachi shipping lanes.',
    },
    {
      id: 'freight-routing',
      name: 'Red Sea and Maritime Freight Rates',
      category: 'Freight',
      currentValue: 'Cape Detour Active',
      change24h: '+18.5% Surcharge',
      trend: 'BULLISH',
      riskLevel: 'ELEVATED',
      pakistanImpact: 'Inflates Inland Freight Equalization Margin (IFEM) and port clearance costs.',
      summary: 'Clean tanker rates (LR2) have expanded due to extended voyage durations, raising landed product costs across Asian import terminals.',
    },
    {
      id: 'usd-dxy',
      name: 'US Dollar Strength (DXY Index)',
      category: 'Currency',
      currentValue: '103.45 DXY',
      change24h: '+0.42%',
      trend: 'BULLISH',
      riskLevel: 'MODERATE',
      pakistanImpact: 'Exerts depreciation pressure on SBP interbank exchange rate (~Rs. 277.15).',
      summary: 'High US bond yields sustain dollar strength, increasing import financing costs for emerging energy-importing nations.',
    },
    {
      id: 'china-demand',
      name: 'China Refining Throughput and Demand',
      category: 'Demand',
      currentValue: '15.2M bpd Intake',
      change24h: '+1.2% MoM',
      trend: 'BULLISH',
      riskLevel: 'MODERATE',
      pakistanImpact: 'Tightens regional Asian gasoil and motor gasoline crack spreads.',
      summary: 'China industrial manufacturing PMI expanding at 50.4, supporting heavy commercial diesel demand in the Asia-Pacific basin.',
    },
    {
      id: 'us-inventories',
      name: 'US Crude Inventories (EIA Commercial)',
      category: 'Supply',
      currentValue: '418.5M Barrels',
      change24h: '-3.8M bbl Draw',
      trend: 'BULLISH',
      riskLevel: 'ELEVATED',
      pakistanImpact: 'Reinforces global inventory tightness, preventing downward price corrections.',
      summary: 'Cushing storage hubs reported another weekly withdrawal, signaling strong refinery utilization across North America.',
    },
  ],
};
