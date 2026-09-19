# Real Web Backtest (Sept 14 - 18, 2026)
data = [
    {"date": "Sept 14", "brent": 108.49, "pkr": 277.25, "actual_petrol": 380.24},
    {"date": "Sept 15", "brent": 108.69, "pkr": 277.16, "actual_petrol": 380.24},
    {"date": "Sept 16", "brent": 105.70, "pkr": 277.27, "actual_petrol": 384.34},
    {"date": "Sept 17", "brent": 104.82, "pkr": 277.25, "actual_petrol": 391.22},
    {"date": "Sept 18", "brent": 102.41, "pkr": 277.25, "actual_petrol": 390.79}
]

print("| Date | Brent ($) | USD/PKR | Actual Jump | Raw Math | Pol. Subsidy | Final AI Pred |")
print("|---|---|---|---|---|---|---|")

for i in range(1, len(data)):
    prev = data[i-1]
    curr = data[i]
    
    actual_jump = round(curr['actual_petrol'] - prev['actual_petrol'], 2)
    
    # 1. C&F Math: (Current Oil * PKR) - (Prev Oil * PKR) / 158.987
    prev_cf = prev['brent'] * prev['pkr']
    curr_cf = curr['brent'] * curr['pkr']
    
    raw_cf_delta = (curr_cf - prev_cf) / 158.987
    e1_math = raw_cf_delta * 1.10
    
    raw_unsubsidized = e1_math
    projected_price = prev['actual_petrol'] + raw_unsubsidized
    
    # Political Circuit Breaker
    pol_subsidy = 0.0
    if projected_price >= 395.0 and raw_unsubsidized > 6.0:
        pol_subsidy = -(raw_unsubsidized * 0.58)
    elif raw_unsubsidized > 12.0:
        pol_subsidy = -(raw_unsubsidized * 0.45)
        
    final_pred = raw_unsubsidized + pol_subsidy
    
    print(f"| {curr['date']} |  | {curr['pkr']:.2f} | {actual_jump:+.2f} PKR | {raw_unsubsidized:+.2f} PKR | {pol_subsidy:+.2f} PKR | {final_pred:+.2f} PKR |")
