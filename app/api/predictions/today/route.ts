import { NextResponse } from "next/server";
import { adminStore } from "@/lib/adminStore";
import cacheData from "@/ml/data/predictions_cache.json";

export const dynamic = "force-dynamic";

export async function GET() {
  const { emergencyLevyOffset } = adminStore.config;

  // We simply read the globally bundled cacheData which is guaranteed to be up to date 
  // because GitHub Actions commits the file, triggering a fresh Vercel rebuild every 2 AM.
  let returnData = JSON.parse(JSON.stringify(cacheData));

  if (returnData && returnData.fuels) {
      // Apply any admin emergency offsets dynamically
      if (emergencyLevyOffset) {
          returnData.emergencyLevyOffset = emergencyLevyOffset;
          returnData.fuels.petrol.todayPrice += emergencyLevyOffset;
          returnData.fuels.diesel.todayPrice += emergencyLevyOffset;
          returnData.fuels.hobc.todayPrice += emergencyLevyOffset;
          
          returnData.fuels.petrol.predictedPrice += emergencyLevyOffset;
          returnData.fuels.diesel.predictedPrice += emergencyLevyOffset;
          returnData.fuels.hobc.predictedPrice += emergencyLevyOffset;
      }
      return NextResponse.json(returnData);
  }

  // Fallback if somehow the JSON is malformed
  return NextResponse.json({ status: "error", message: "Failed to load cached predictions" }, { status: 500 });
}
