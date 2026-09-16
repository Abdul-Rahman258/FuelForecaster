import fs from "fs";
import path from "path";

export interface SavingsEntry {
  id: string;
  timestamp: string;
  carModel: string;
  fuelType: string;
  litersSaved: number;
  pkrSaved: number;
}

export interface SavingsLedgerData {
  totalCarsHelped: number;
  totalPkrSaved: number;
  totalLitersSaved: number;
  carBreakdown: Record<string, number>;
  fuelBreakdown: {
    petrol: number;
    diesel: number;
    hobc: number;
  };
  recentSavings: SavingsEntry[];
}

const LEDGER_PATH = path.join(process.cwd(), "ml", "data", "savings_ledger.json");

const defaultLedger: SavingsLedgerData = {
  totalCarsHelped: 18452,
  totalPkrSaved: 6843580,
  totalLitersSaved: 428900,
  carBreakdown: {
    "Suzuki Alto VXL AGS": 6420,
    "Toyota Corolla Altis 1.6": 3810,
    "Honda Civic Oriel / RS": 2950,
    "Suzuki Cultus VXL": 1940,
    "Changan Alsvin Lumiere": 1120,
    "Kia Sportage AWD": 860,
    "Toyota Yaris ATIV X": 780,
    "Hyundai Tucson FWD": 410,
    "Haval H6 HEV": 162,
  },
  fuelBreakdown: {
    petrol: 14210,
    diesel: 2972,
    hobc: 1270,
  },
  recentSavings: [],
};

let inMemoryLedger: SavingsLedgerData = { ...defaultLedger };

export function getSavingsLedger(): SavingsLedgerData {
  try {
    if (fs.existsSync(LEDGER_PATH)) {
      const content = fs.readFileSync(LEDGER_PATH, "utf-8");
      inMemoryLedger = JSON.parse(content);
      return inMemoryLedger;
    }
  } catch (e) {
    // In-memory fallback
  }
  return inMemoryLedger;
}

export function recordSavings(entry: {
  carModel: string;
  fuelType?: string;
  litersSaved: number;
  pkrSaved: number;
}): SavingsLedgerData {
  const ledger = getSavingsLedger();

  const safePkr = Math.max(0, Math.round(Number(entry.pkrSaved) || 0));
  const safeLiters = Math.max(0, Math.round(Number(entry.litersSaved) * 10) / 10);
  const carName = String(entry.carModel || "Custom Vehicle").trim();
  const fuel = String(entry.fuelType || "petrol").toLowerCase();

  ledger.totalCarsHelped += 1;
  ledger.totalPkrSaved += safePkr;
  ledger.totalLitersSaved = Math.round((ledger.totalLitersSaved + safeLiters) * 10) / 10;

  ledger.carBreakdown[carName] = (ledger.carBreakdown[carName] || 0) + 1;

  if (fuel.includes("diesel")) {
    ledger.fuelBreakdown.diesel += 1;
  } else if (fuel.includes("octane") || fuel.includes("hobc")) {
    ledger.fuelBreakdown.hobc += 1;
  } else {
    ledger.fuelBreakdown.petrol += 1;
  }

  const newEntry: SavingsEntry = {
    id: "sv-" + Date.now(),
    timestamp: new Date().toISOString(),
    carModel: carName,
    fuelType: entry.fuelType || "Super Petrol (92 RON)",
    litersSaved: safeLiters,
    pkrSaved: safePkr,
  };

  ledger.recentSavings = [newEntry, ...(ledger.recentSavings || [])].slice(0, 50);

  try {
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), "utf-8");
  } catch (err) {
    // Disk write notice
  }

  inMemoryLedger = ledger;
  return ledger;
}
