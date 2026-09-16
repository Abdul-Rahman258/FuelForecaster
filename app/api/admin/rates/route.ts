import { NextRequest, NextResponse } from "next/server";
import { adminStore, ADMIN_SECRET_KEY } from "@/lib/adminStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") || req.headers.get("x-admin-key");

  if (key !== ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Invalid Secret Passkey" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    config: adminStore.config,
    marketParityEstimate: 166.30,
    derivedTaxBase: {
      petrolTax: adminStore.config.petrolBase - 166.30,
      dieselTax: adminStore.config.dieselBase - 166.30,
      hobcTax: adminStore.config.hobcBase - 166.30,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, petrolBase, dieselBase, hobcBase, emergencyLevyOffset, notes } = body;

    if (key !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: "Invalid Secret Passkey" }, { status: 401 });
    }

    if (petrolBase !== undefined) adminStore.config.petrolBase = Number(petrolBase);
    if (dieselBase !== undefined) adminStore.config.dieselBase = Number(dieselBase);
    if (hobcBase !== undefined) adminStore.config.hobcBase = Number(hobcBase);
    if (emergencyLevyOffset !== undefined) adminStore.config.emergencyLevyOffset = Number(emergencyLevyOffset);
    if (notes) adminStore.config.notes = String(notes);

    adminStore.config.lastUpdated = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: "Rates and tax overrides updated successfully!",
      updatedConfig: adminStore.config,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 500 });
  }
}
