// Comprehensive Pakistani Automotive Database
// Cascading Hierarchy: Make -> Model -> Generation/Year -> Variant -> Tank Capacity (Liters)

export interface CarVariant {
  name: string;
  tankCapacity: number; // in Liters
  engine: string;
  transmission: string;
  fuelType: "Petrol" | "Hybrid" | "Diesel";
}

export interface CarYearRange {
  yearLabel: string;
  variants: CarVariant[];
}

export interface CarModelData {
  modelName: string;
  category: string;
  yearRanges: CarYearRange[];
}

export interface CarMakeData {
  make: string;
  country: string;
  models: CarModelData[];
}

export const PAKISTAN_CAR_REGISTRY: CarMakeData[] = [
  {
    make: "Suzuki",
    country: "Pakistan (Pak Suzuki)",
    models: [
      {
        modelName: "Alto",
        category: "Economy Hatchback",
        yearRanges: [
          {
            yearLabel: "2019 - 2026 (8th Gen 660cc)",
            variants: [
              { name: "VXL AGS (Automatic)", tankCapacity: 27, engine: "658cc R06A", transmission: "5-Speed AGS", fuelType: "Petrol" },
              { name: "VXR (Manual)", tankCapacity: 27, engine: "658cc R06A", transmission: "5-Speed Manual", fuelType: "Petrol" },
              { name: "VX (Base)", tankCapacity: 27, engine: "658cc R06A", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
          {
            yearLabel: "2000 - 2012 (Old 1000cc)",
            variants: [
              { name: "Alto VXR 1000cc", tankCapacity: 37, engine: "993cc F10A", transmission: "4-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Cultus",
        category: "Compact Hatchback",
        yearRanges: [
          {
            yearLabel: "2017 - 2026 (New Shape)",
            variants: [
              { name: "Auto Gear Shift (AGS)", tankCapacity: 35, engine: "998cc K10B", transmission: "5-Speed AGS", fuelType: "Petrol" },
              { name: "VXL (Manual)", tankCapacity: 35, engine: "998cc K10B", transmission: "5-Speed Manual", fuelType: "Petrol" },
              { name: "VXR (Base Manual)", tankCapacity: 35, engine: "998cc K10B", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
          {
            yearLabel: "2000 - 2017 (Old Shape Euro II)",
            variants: [
              { name: "Cultus Euro II VXR", tankCapacity: 40, engine: "993cc G10B", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Swift",
        category: "B-Segment Hatchback",
        yearRanges: [
          {
            yearLabel: "2022 - 2026 (4th Gen)",
            variants: [
              { name: "GLX CVT (Top-line)", tankCapacity: 37, engine: "1197cc K12M", transmission: "CVT Automatic", fuelType: "Petrol" },
              { name: "GL CVT", tankCapacity: 37, engine: "1197cc K12M", transmission: "CVT Automatic", fuelType: "Petrol" },
              { name: "GL Manual", tankCapacity: 37, engine: "1197cc K12M", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
          {
            yearLabel: "2010 - 2021 (1.3L Classic)",
            variants: [
              { name: "Swift 1.3 Automatic (DLX)", tankCapacity: 43, engine: "1328cc M13A", transmission: "4-Speed Automatic", fuelType: "Petrol" },
              { name: "Swift 1.3 Manual (DX/DLX)", tankCapacity: 43, engine: "1328cc M13A", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Wagon R",
        category: "Tall Boy Hatchback",
        yearRanges: [
          {
            yearLabel: "2014 - 2026",
            variants: [
              { name: "VXL AGS", tankCapacity: 35, engine: "998cc K10B", transmission: "5-Speed AGS", fuelType: "Petrol" },
              { name: "VXL Manual", tankCapacity: 35, engine: "998cc K10B", transmission: "5-Speed Manual", fuelType: "Petrol" },
              { name: "VXR Manual", tankCapacity: 35, engine: "998cc K10B", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
    ],
  },
  {
    make: "Toyota",
    country: "Pakistan (Indus Motor)",
    models: [
      {
        modelName: "Yaris",
        category: "Subcompact Sedan",
        yearRanges: [
          {
            yearLabel: "2020 - 2026",
            variants: [
              { name: "ATIV X 1.5 CVT (Black Edition / Aero)", tankCapacity: 42, engine: "1496cc 2NR-FE", transmission: "7-Speed CVT", fuelType: "Petrol" },
              { name: "ATIV X 1.5 CVT", tankCapacity: 42, engine: "1496cc 2NR-FE", transmission: "7-Speed CVT", fuelType: "Petrol" },
              { name: "ATIV 1.3 CVT", tankCapacity: 42, engine: "1329cc 1NR-FE", transmission: "7-Speed CVT", fuelType: "Petrol" },
              { name: "GLI 1.3 CVT", tankCapacity: 42, engine: "1329cc 1NR-FE", transmission: "7-Speed CVT", fuelType: "Petrol" },
              { name: "GLI 1.3 Manual", tankCapacity: 42, engine: "1329cc 1NR-FE", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Corolla",
        category: "Compact Sedan",
        yearRanges: [
          {
            yearLabel: "2014 - 2026 (11th Gen Facelift)",
            variants: [
              { name: "Altis Grande 1.8 CVT-i", tankCapacity: 50, engine: "1798cc 2ZR-FE", transmission: "7-Speed Super CVT-i", fuelType: "Petrol" },
              { name: "Altis 1.6 Special Edition", tankCapacity: 50, engine: "1598cc 1ZR-FE", transmission: "Super ECT Automatic", fuelType: "Petrol" },
              { name: "Altis 1.6 Automatic", tankCapacity: 50, engine: "1598cc 1ZR-FE", transmission: "4-Speed Automatic", fuelType: "Petrol" },
              { name: "GLi 1.3 Automatic (Legacy)", tankCapacity: 55, engine: "1298cc 2NZ-FE", transmission: "4-Speed Automatic", fuelType: "Petrol" },
              { name: "GLi 1.3 Manual (Legacy)", tankCapacity: 55, engine: "1298cc 2NZ-FE", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Fortuner",
        category: "Mid-Size 7-Seater SUV",
        yearRanges: [
          {
            yearLabel: "2017 - 2026",
            variants: [
              { name: "Fortuner 2.7G Petrol", tankCapacity: 80, engine: "2694cc 2TR-FE", transmission: "6-Speed Automatic", fuelType: "Petrol" },
              { name: "Fortuner Sigma 4 (Diesel 1GD)", tankCapacity: 80, engine: "2755cc 1GD-FTV", transmission: "6-Speed Automatic", fuelType: "Diesel" },
              { name: "Fortuner Legender 2.8 (Diesel)", tankCapacity: 80, engine: "2755cc 1GD-FTV", transmission: "6-Speed Automatic", fuelType: "Diesel" },
            ],
          },
        ],
      },
      {
        modelName: "Corolla Cross",
        category: "Compact Hybrid SUV",
        yearRanges: [
          {
            yearLabel: "2023 - 2026 (Locally Assembled)",
            variants: [
              { name: "1.8 Hybrid Premium High", tankCapacity: 36, engine: "1798cc Hybrid 2ZR-FXE", transmission: "e-CVT", fuelType: "Hybrid" },
              { name: "1.8 Hybrid Mid", tankCapacity: 36, engine: "1798cc Hybrid 2ZR-FXE", transmission: "e-CVT", fuelType: "Hybrid" },
              { name: "1.8 Pure Petrol 1.8L", tankCapacity: 47, engine: "1798cc 2ZR-FE", transmission: "CVT", fuelType: "Petrol" },
            ],
          },
        ],
      },
    ],
  },
  {
    make: "Honda",
    country: "Pakistan (Atlas Honda)",
    models: [
      {
        modelName: "Civic",
        category: "Compact Executive Sedan",
        yearRanges: [
          {
            yearLabel: "2022 - 2026 (11th Gen)",
            variants: [
              { name: "Civic RS 1.5 Turbo (Top)", tankCapacity: 47, engine: "1498cc VTEC Turbo", transmission: "LL-CVT", fuelType: "Petrol" },
              { name: "Civic Oriel 1.5 Turbo", tankCapacity: 47, engine: "1498cc VTEC Turbo", transmission: "M-CVT", fuelType: "Petrol" },
              { name: "Civic Standard 1.5 Turbo", tankCapacity: 47, engine: "1498cc VTEC Turbo", transmission: "M-CVT", fuelType: "Petrol" },
            ],
          },
          {
            yearLabel: "2016 - 2021 (10th Gen 'X')",
            variants: [
              { name: "Civic 1.8 i-VTEC Oriel", tankCapacity: 47, engine: "1799cc R18Z1", transmission: "CVT", fuelType: "Petrol" },
              { name: "Civic 1.5 Turbo RS", tankCapacity: 47, engine: "1498cc Turbo L15B7", transmission: "CVT", fuelType: "Petrol" },
            ],
          },
          {
            yearLabel: "2012 - 2016 (9th Gen 'Rebirth')",
            variants: [
              { name: "Civic Rebirth 1.8 VTi Oriel Prosmatec", tankCapacity: 50, engine: "1799cc R18A", transmission: "5-Speed Automatic", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "City",
        category: "Subcompact Sedan",
        yearRanges: [
          {
            yearLabel: "2021 - 2026 (6th Gen Pakistan)",
            variants: [
              { name: "City 1.5 Aspire CVT", tankCapacity: 40, engine: "1497cc i-VTEC", transmission: "CVT", fuelType: "Petrol" },
              { name: "City 1.5 CVT Standard", tankCapacity: 40, engine: "1497cc i-VTEC", transmission: "CVT", fuelType: "Petrol" },
              { name: "City 1.2 CVT", tankCapacity: 40, engine: "1199cc i-VTEC", transmission: "CVT", fuelType: "Petrol" },
              { name: "City 1.2 Manual", tankCapacity: 40, engine: "1199cc i-VTEC", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
          {
            yearLabel: "2009 - 2021 (5th Gen Iconic)",
            variants: [
              { name: "City 1.5 Aspire Prosmatec", tankCapacity: 42, engine: "1497cc i-VTEC", transmission: "5-Speed Automatic", fuelType: "Petrol" },
              { name: "City 1.3 i-VTEC Prosmatec", tankCapacity: 42, engine: "1339cc i-VTEC", transmission: "5-Speed Automatic", fuelType: "Petrol" },
              { name: "City 1.3 i-VTEC Manual", tankCapacity: 42, engine: "1339cc i-VTEC", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "HR-V / Vezel",
        category: "Compact Crossover",
        yearRanges: [
          {
            yearLabel: "2022 - 2026",
            variants: [
              { name: "HR-V VTi-S 1.5L", tankCapacity: 40, engine: "1498cc i-VTEC", transmission: "CVT", fuelType: "Petrol" },
              { name: "HR-V VTi 1.5L", tankCapacity: 40, engine: "1498cc i-VTEC", transmission: "CVT", fuelType: "Petrol" },
            ],
          },
        ],
      },
    ],
  },
  {
    make: "Changan",
    country: "Pakistan (Master Changan)",
    models: [
      {
        modelName: "Oshan X7",
        category: "Mid-Size Luxury SUV",
        yearRanges: [
          {
            yearLabel: "2022 - 2026",
            variants: [
              { name: "FutureSense (7-Seater Luxury)", tankCapacity: 55, engine: "1499cc Blue Core Turbo", transmission: "7-Speed Wet DCT", fuelType: "Petrol" },
              { name: "Comfort (5-Seater)", tankCapacity: 55, engine: "1499cc Blue Core Turbo", transmission: "7-Speed Wet DCT", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Alsvin",
        category: "Subcompact Sedan",
        yearRanges: [
          {
            yearLabel: "2021 - 2026",
            variants: [
              { name: "1.5L Lumiere DCT (Sunroof)", tankCapacity: 40, engine: "1480cc Blue Core", transmission: "5-Speed Dual Clutch", fuelType: "Petrol" },
              { name: "1.5L DCT Comfort", tankCapacity: 40, engine: "1480cc Blue Core", transmission: "5-Speed Dual Clutch", fuelType: "Petrol" },
              { name: "1.37L Manual Comfort", tankCapacity: 40, engine: "1370cc Blue Core", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Karvaan",
        category: "Multi-Purpose Van",
        yearRanges: [
          {
            yearLabel: "2019 - 2026",
            variants: [
              { name: "Karvaan Plus (1000cc)", tankCapacity: 40, engine: "999cc C10", transmission: "5-Speed Manual", fuelType: "Petrol" },
              { name: "Karvaan Standard", tankCapacity: 40, engine: "999cc C10", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
    ],
  },
  {
    make: "Kia",
    country: "Pakistan (Lucky Motor Corp)",
    models: [
      {
        modelName: "Sportage",
        category: "Crossover SUV",
        yearRanges: [
          {
            yearLabel: "2019 - 2026",
            variants: [
              { name: "Sportage AWD (All Wheel Drive)", tankCapacity: 62, engine: "1999cc Nu 2.0L", transmission: "6-Speed Automatic", fuelType: "Petrol" },
              { name: "Sportage FWD (Front Wheel Drive)", tankCapacity: 62, engine: "1999cc Nu 2.0L", transmission: "6-Speed Automatic", fuelType: "Petrol" },
              { name: "Sportage Alpha", tankCapacity: 62, engine: "1999cc Nu 2.0L", transmission: "6-Speed Automatic", fuelType: "Petrol" },
              { name: "Sportage Black Edition", tankCapacity: 62, engine: "1999cc Nu 2.0L", transmission: "6-Speed Automatic", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Picanto",
        category: "City Hatchback",
        yearRanges: [
          {
            yearLabel: "2019 - 2026",
            variants: [
              { name: "Picanto 1.0L Automatic", tankCapacity: 35, engine: "998cc MPI", transmission: "4-Speed Automatic", fuelType: "Petrol" },
              { name: "Picanto 1.0L Manual", tankCapacity: 35, engine: "998cc MPI", transmission: "5-Speed Manual", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Stonic",
        category: "Subcompact Crossover",
        yearRanges: [
          {
            yearLabel: "2021 - 2026",
            variants: [
              { name: "Stonic EX+", tankCapacity: 45, engine: "1368cc 1.4L", transmission: "6-Speed Automatic", fuelType: "Petrol" },
              { name: "Stonic EX", tankCapacity: 45, engine: "1368cc 1.4L", transmission: "6-Speed Automatic", fuelType: "Petrol" },
            ],
          },
        ],
      },
    ],
  },
  {
    make: "Hyundai",
    country: "Pakistan (Hyundai Nishat)",
    models: [
      {
        modelName: "Tucson",
        category: "Compact SUV",
        yearRanges: [
          {
            yearLabel: "2020 - 2026",
            variants: [
              { name: "Tucson AWD (Ultimate)", tankCapacity: 62, engine: "1999cc 2.0L MPI", transmission: "6-Speed Automatic", fuelType: "Petrol" },
              { name: "Tucson FWD (GLS)", tankCapacity: 62, engine: "1999cc 2.0L MPI", transmission: "6-Speed Automatic", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Elantra",
        category: "C-Segment Sedan",
        yearRanges: [
          {
            yearLabel: "2021 - 2026",
            variants: [
              { name: "Elantra 2.0 GLS", tankCapacity: 50, engine: "1999cc Nu 2.0L", transmission: "6-Speed Automatic", fuelType: "Petrol" },
              { name: "Elantra 1.6 GL", tankCapacity: 50, engine: "1591cc 1.6L MPI", transmission: "6-Speed Automatic", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "Sonata",
        category: "D-Segment Executive Sedan",
        yearRanges: [
          {
            yearLabel: "2021 - 2026",
            variants: [
              { name: "Sonata 2.5L", tankCapacity: 60, engine: "2497cc Smartstream", transmission: "8-Speed Automatic", fuelType: "Petrol" },
              { name: "Sonata 2.0L", tankCapacity: 60, engine: "1999cc Smartstream", transmission: "6-Speed Automatic", fuelType: "Petrol" },
            ],
          },
        ],
      },
    ],
  },
  {
    make: "Haval / MG",
    country: "Pakistan (GWM / SAIC)",
    models: [
      {
        modelName: "Haval H6",
        category: "Premium SUV",
        yearRanges: [
          {
            yearLabel: "2022 - 2026",
            variants: [
              { name: "H6 HEV (1.5T Hybrid)", tankCapacity: 60, engine: "1497cc Hybrid Turbo", transmission: "2-Speed DHT", fuelType: "Hybrid" },
              { name: "H6 2.0T AWD", tankCapacity: 60, engine: "1998cc Turbo", transmission: "7-Speed DCT", fuelType: "Petrol" },
              { name: "H6 1.5T FWD", tankCapacity: 60, engine: "1497cc Turbo", transmission: "7-Speed DCT", fuelType: "Petrol" },
            ],
          },
        ],
      },
      {
        modelName: "MG HS",
        category: "Compact Crossover SUV",
        yearRanges: [
          {
            yearLabel: "2020 - 2026",
            variants: [
              { name: "MG HS 1.5T Trophy Edition", tankCapacity: 55, engine: "1490cc Turbo GDI", transmission: "7-Speed DCT", fuelType: "Petrol" },
              { name: "MG HS PHEV (Plug-in Hybrid)", tankCapacity: 37, engine: "1490cc Turbo + Motor", transmission: "10-Speed EDU", fuelType: "Hybrid" },
            ],
          },
        ],
      },
    ],
  },
];
