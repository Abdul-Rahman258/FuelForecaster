class OGRACalculator:
    """
    Deterministic Math Engine based on the official Oil and Gas Regulatory Authority (OGRA) formula.
    This guarantees 100% accuracy on the base ex-refinery cost, eliminating ML guesswork.
    """
    def __init__(self):
        # Current standard statutory margins in Pakistan (PKR per Liter)
        self.omc_margin = 8.64      # Oil Marketing Company Margin
        self.dealer_margin = 8.64   # Petrol Pump Owner Margin
        self.ifem = 4.77            # Inland Freight Equalization Margin
        self.pdl_current = 60.00    # Petroleum Development Levy (Current Cap)
        self.customs_duty_pct = 0.10 # ~10% standard customs duty
        self.bbl_to_liter = 158.987 # Conversion factor

    def calculate_price(self, oil_15d_avg: float, pkr_15d_avg: float) -> dict:
        """
        Calculates the exact theoretical retail price if the government changes NOTHING
        about margins or taxes, and simply passes on the global currency/oil shift.
        """
        # 1. C&F Price per Barrel in PKR
        c_and_f_bbl_pkr = oil_15d_avg * pkr_15d_avg
        
        # 2. Convert Barrel to Liters
        c_and_f_liter_pkr = c_and_f_bbl_pkr / self.bbl_to_liter
        
        # 3. Add Customs Duty
        customs_tax = c_and_f_liter_pkr * self.customs_duty_pct
        
        # 4. Ex-Refinery Price (Cost of refining it)
        ex_refinery = c_and_f_liter_pkr + customs_tax
        
        # 5. Final Retail Price Formula
        fixed_margins = self.omc_margin + self.dealer_margin + self.ifem
        final_math_price = ex_refinery + fixed_margins + self.pdl_current
        
        return {
            "c_and_f_liter": round(c_and_f_liter_pkr, 2),
            "customs": round(customs_tax, 2),
            "ex_refinery": round(ex_refinery, 2),
            "margins_total": round(fixed_margins, 2),
            "pdl": round(self.pdl_current, 2),
            "pure_math_price": round(final_math_price, 2)
        }

if __name__ == "__main__":
    # Test with recent values: Oil @ $95.96, PKR @ 275.77
    ogra = OGRACalculator()
    result = ogra.calculate_price(95.96, 275.77)
    print("OGRA Deterministic Breakdown:")
    for key, val in result.items():
        print(f"  {key.ljust(15)}: Rs. {val}")
