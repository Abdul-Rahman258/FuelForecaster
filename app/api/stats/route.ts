import { NextResponse } from "next/server";
import { getSavingsLedger } from "@/lib/savingsLedger";

export const dynamic = "force-dynamic";

export async function GET() {
  const ledger = getSavingsLedger();
  return NextResponse.json({
    totalCarsHelped: ledger.totalCarsHelped,
    totalPkrSaved: ledger.totalPkrSaved,
    totalLitersSaved: ledger.totalLitersSaved,
    carBreakdown: ledger.carBreakdown,
    fuelBreakdown: ledger.fuelBreakdown,
    recentSavings: ledger.recentSavings,
    source: "persistent-savings-ledger",
  });
}



