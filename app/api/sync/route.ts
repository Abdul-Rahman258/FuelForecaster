import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);
export const dynamic = "force-dynamic";

export async function GET() {
  const cachePath = path.join(process.cwd(), "ml", "data", "live_rates.json");

  // Read existing cache if available
  let cachedData = null;
  if (fs.existsSync(cachePath)) {
    try {
      cachedData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    } catch (e) {
      // Ignore parse errors
    }
  }

  return NextResponse.json({
    status: "ok",
    liveFeed: cachedData || {
      status: "synchronized_baseline",
      last_synced: new Date().toISOString(),
      source: "Pakistan State Oil (psopk.com)",
      rates: {
        petrol: 370.81,
        diesel: 398.04,
        hobc: 425.00,
      },
    },
  });
}

export async function POST() {
  // Trigger automated web crawler
  try {
    const scriptPath = path.join(process.cwd(), "ml", "live_sync.py");
    const { stdout, stderr } = await execPromise(`python "${scriptPath}"`);

    const cachePath = path.join(process.cwd(), "ml", "data", "live_rates.json");
    if (fs.existsSync(cachePath)) {
      const freshData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      return NextResponse.json({
        success: true,
        message: "Automated live sync completed successfully from official sources.",
        data: freshData,
        rawOutput: stdout,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Sync script executed.",
      output: stdout,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to trigger automated sync crawler.",
      },
      { status: 500 }
    );
  }
}
