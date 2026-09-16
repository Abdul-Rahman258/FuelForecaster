import { NextResponse } from "next/server";
import { WORLD_ECONOMY_ANALYSIS } from "@/lib/macroEconomics";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(WORLD_ECONOMY_ANALYSIS);
}
