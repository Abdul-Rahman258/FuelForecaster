import pandas as pd
df = pd.read_csv('ml/data/pakistan_petrol_engineered.csv')
last_5 = df.tail(6)

print("Historical Backtest (Sept 7 to Sept 11, 2026)")
print("-" * 110)
print(f"| {'Date':<10} | {'Actual Today':<12} | {'Actual Jump':<12} | {'Raw Math':<10} | {'Pol. Correction':<16} | {'Final AI Pred':<15} | {'Accuracy':<10} |")
print("-" * 110)

for i in range(len(last_5)-1):
    row = last_5.iloc[i]
    next_row = last_5.iloc[i+1]
    
    date = row['Date']
    actual_price = row['petrol_price_today']
    next_price = next_row['petrol_price_today']
    actual_jump = round(next_price - actual_price, 2)
    
    # We reconstruct the Orchestrator logic
    raw_delta = row['c_and_f_delta_pkr']
    e1_math = raw_delta * 1.10
    
    raw_unsubsidized = e1_math
    
    projected_price = actual_price + raw_unsubsidized
    pol_subsidy = 0.0
    
    if projected_price >= 395.0 and raw_unsubsidized > 6.0:
        pol_subsidy = -(raw_unsubsidized * 0.58)
    elif raw_unsubsidized > 12.0:
        pol_subsidy = -(raw_unsubsidized * 0.45)
        
    final_pred = raw_unsubsidized + pol_subsidy
    error = abs(actual_jump - final_pred)
    acc = "PERFECT" if error < 0.50 else f"Off by {error:.2f}"
    
    print(f"| {date:<10} | {actual_price:>12.2f} | {actual_jump:>11.2f} | {raw_unsubsidized:>10.2f} | {pol_subsidy:>16.2f} | {final_pred:>15.2f} | {acc:<10} |")

