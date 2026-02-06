import FinanceDataReader as fdr
import json
import time
import os
import math
from datetime import datetime, timezone, timedelta

# Tickers config
# KOSPI: ^KS11 (Yahoo via FDR) - More stable than KRX source for now
# Gold, Bitcoin, NASDAQ: Yahoo symbols
TICKERS = {"KOSPI": "^KS11", "Gold": "GC=F", "Bitcoin": "BTC-USD", "NASDAQ": "IXIC"}

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "public", "finance.json")


def fetch_with_retry(symbol, retries=3):
    """Fetch recent history with retry logic."""
    for i in range(retries):
        try:
            # Use dynamic start date: 10 days ago to ensure we have enough history even with holidays
            start_date = (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d")
            df = fdr.DataReader(symbol, start=start_date)

            if df.empty:
                raise ValueError(f"Empty dataframe for {symbol}")

            return df
        except Exception as e:
            print(f"  Attempt {i + 1} failed for {symbol}: {e}")
            time.sleep(2**i)  # Exponential backoff
    return None


def fetch_data():
    results = []
    print("Fetching data using FinanceDataReader...")

    current_time_iso = datetime.now(timezone(timedelta(hours=9))).isoformat()  # KST
    success_count = 0

    for name, symbol in TICKERS.items():
        try:
            df = fetch_with_retry(symbol)

            if df is None or len(df) < 2:
                print(f"  Failed to fetch valid data for {name}")
                results.append(
                    {
                        "name": name,
                        "symbol": symbol,
                        "price": 0,
                        "change": 0,
                        "currency": "KRW" if name == "KOSPI" else "USD",
                        "status": "failed",
                    }
                )
                continue

            # Get last two rows
            latest = df.iloc[-1]
            prev = df.iloc[-2]

            price = float(latest["Close"])
            prev_close = float(prev["Close"])

            # Change calculation with safety checks
            if prev_close == 0 or math.isnan(prev_close):
                change_percent = 0.0
            else:
                change = price - prev_close
                change_percent = (change / prev_close) * 100

            if math.isnan(change_percent):
                change_percent = 0.0

            currency = "KRW" if name == "KOSPI" else "USD"

            results.append(
                {
                    "name": name,
                    "symbol": symbol,
                    "price": price,
                    "change": change_percent,
                    "currency": currency,
                    "status": "success",
                }
            )
            success_count += 1
            print(f"  {name}: {price:,.2f} ({change_percent:+.2f}%)")

        except Exception as e:
            print(f"  Critical error processing {name}: {e}")
            results.append(
                {
                    "name": name,
                    "symbol": symbol,
                    "price": 0,
                    "change": 0,
                    "currency": "USD",
                    "status": "error",
                }
            )

    output_data = {
        "meta": {
            "updated_at": current_time_iso,
            "status": "partial_success" if success_count < len(TICKERS) else "success",
            "source": "FinanceDataReader",
        },
        "data": results,
    }

    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    with open(OUTPUT_PATH, "w") as f:
        json.dump(output_data, f, indent=2)
    print(f"Saved to {OUTPUT_PATH} (Status: {output_data['meta']['status']})")


if __name__ == "__main__":
    fetch_data()
