import type { Metadata } from "next";
import { Merriweather, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ["latin"], variable: "--font-merriweather" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "The Fuel Forecaster | Institutional Fuel Intelligence",
  description:
    "An Asaan Labs Initiative. Institutional grade petrol price forecasting and macro-economic radar.",
  keywords: [
    "Asaan Labs",
    "FuelForecaster",
    "Pakistan Petrol Price Tomorrow",
    "Petrol Price Prediction",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${merriweather.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-[#F9F9F4] text-[#1C1C1C] antialiased selection:bg-[#1C1C1C] selection:text-[#F9F9F4] font-sans">
        {children}
      </body>
    </html>
  );
}
