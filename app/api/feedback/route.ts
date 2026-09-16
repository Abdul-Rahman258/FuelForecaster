import { NextRequest, NextResponse } from "next/server";
import { recordSavings } from "@/lib/savingsLedger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      carModel = "Suzuki Alto VXL AGS",
      fuelType = "Super Petrol (92 RON)",
      litersSaved = 20,
      pkrSaved = 150,
      helped = true,
    } = body;

    const safePkr = Math.max(0, Math.round(Number(pkrSaved) || 0));
    const safeLiters = Math.max(0, Math.round(Number(litersSaved) * 10) / 10);

    if (helped) {
      const updatedLedger = recordSavings({
        carModel: String(carModel),
        fuelType: String(fuelType),
        litersSaved: safeLiters,
        pkrSaved: safePkr,
      });

      return NextResponse.json({
        success: true,
        updatedStats: {
          totalCarsHelped: updatedLedger.totalCarsHelped,
          totalPkrSaved: updatedLedger.totalPkrSaved,
          totalLitersSaved: updatedLedger.totalLitersSaved,
        },
        loggedVehicle: carModel,
        persisted: "savings-ledger-json",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Feedback acknowledged",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log feedback" },
      { status: 500 }
    );
  }
}


