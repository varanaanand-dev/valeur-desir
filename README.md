# Valeur & Désir

**Luxury is a family drama. With a stock ticker.**

## The name

The great luxury houses are named for their founders — *Van Cleef & Arpels*, *Moët & Chandon*. This one is named for the two forces that founded luxury itself:

- **Valeur** *(va-LUR)* — worth. In French finance, a *valeur* is also a share: a stock traded on the market.
- **Désir** *(day-ZEER)* — want; the force that makes a thing precious long before it is priced.

Every page measures the distance between the two.

## What it is

Valeur & Désir tells the hidden histories of luxury's five great dynasties — LVMH, Hermès, Kering, Richemont and Prada — and sets how much the world *desires* each house beside what the market *values* it at.

- **The Dynasties** — each house opens as a sealed letter. Break the seal to reveal the story the label never tells you.
- **A house in six objects** — every dynasty is told through six objects, from Hermès' 1837 harness to Prada's 2011 listing in Hong Kong under the code *1913*.
- **Who owns desire** — a family tree of which families control which maisons.
- **The ledger (Valeur)** — live closing prices and a one-year chart for each house, refreshed every weekday.
- **The Désir Score** *(in progress)* — a desirability index built from resale premiums, search interest and scarcity signals, compared against share price to spot where desire and valuation diverge.

## How it works

| Layer | Detail |
|---|---|
| Front end | Hand-designed static pages (HTML, CSS, vanilla JavaScript), no framework |
| Data pipeline | A scheduled GitHub Action runs `scripts/fetch-prices.mjs` each weekday, pulls end-of-day prices from the EODHD API and commits `data/prices.json` |
| Hosting | Vercel, redeployed automatically on every commit |
| Secrets | The API key lives in GitHub Secrets, never in the code |

## Tickers

| House | Exchange | Ticker |
|---|---|---|
| LVMH | Euronext Paris | MC.PA |
| Hermès | Euronext Paris | RMS.PA |
| Kering | Euronext Paris | KER.PA |
| Richemont | SIX Swiss Exchange | CFR.SW |
| Prada Group | Hong Kong Stock Exchange | 1913.HK |

---

An independent project, not affiliated with or endorsed by any company named. Not investment advice. Historical details were checked against public sources; corrections are welcome.

Built by Vani.
