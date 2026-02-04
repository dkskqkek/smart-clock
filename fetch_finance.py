import yfinance as yf
import json
import time
import os

# Tickers
TICKERS = {
    'KOSPI': '^KS11',
    'Gold': 'GC=F',
    'Bitcoin': 'BTC-USD',
    'NASDAQ': '^IXIC'
}

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), 'public', 'finance.json')

def fetch_data():
    results = []
    print("Fetching data from Yahoo Finance...")
    
    for name, symbol in TICKERS.items():
        try:
            ticker = yf.Ticker(symbol)
            # fast_info is often faster/more reliable for real-time
            price = ticker.fast_info.last_price
            prev_close = ticker.fast_info.previous_close
            change = price - prev_close
            change_percent = (change / prev_close) * 100
            
            # Currency mapping
            currency = 'KRW' if name == 'KOSPI' else 'USD'
            
            results.append({
                'name': name,
                'symbol': symbol,
                'price': price,
                'change': change_percent, # storing as % directly
                'currency': currency
            })
            print(f"  {name}: {price:.2f} ({change_percent:+.2f}%)")
        except Exception as e:
            print(f"  Error fetching {name}: {e}")
            # Fallback/Error entry? Or just skip
            results.append({
                'name': name,
                'symbol': symbol,
                'price': 0,
                'change': 0,
                'currency': 'USD'
            })

    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    fetch_data()
    # Optional: Loop if running persistently
    # while True:
    #     fetch_data()
    #     time.sleep(60)
