// In-Memory & Database-backed Store for Emergency Tax/Rate Adjustments
// Zero-login: Secured via ADMIN_SECRET_KEY

export interface AdminRatesConfig {
  petrolBase: number;
  dieselBase: number;
  hobcBase: number;
  emergencyLevyOffset: number; // e.g. +5.00 or -3.00
  lastUpdated: string;
  notes: string;
}

const globalForAdmin = globalThis as unknown as {
  adminRatesConfig: AdminRatesConfig | undefined;
};

export const adminStore: { config: AdminRatesConfig } = {
  config: globalForAdmin.adminRatesConfig ?? {
    petrolBase: 375.81,
    dieselBase: 403.04,
    hobcBase: 430.00,
    emergencyLevyOffset: 0.0,
    lastUpdated: new Date().toISOString(),
    notes: "Official rates calibrated post-Rs. 5.00 revision (September 12, 2026)",
  },
};

if (process.env.NODE_ENV !== "production") {
  globalForAdmin.adminRatesConfig = adminStore.config;
}

export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "asaan2026";
