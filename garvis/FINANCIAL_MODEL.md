# Garvis Monitoring Intelligence — Financial Model (Explainer)

**Companion to `financial_model.csv`. All figures are illustrative** and exist to show the *shape* of the business and which levers matter. Replace every assumption with primary research before using these numbers with investors or partners.

---

## How to use this
Open `financial_model.csv` in Excel or Google Sheets. The top block is **assumptions** — change those and recompute the revenue/cost blocks. The model is deliberately simple (annual, single blended building type) so the drivers are transparent.

## Key assumptions (illustrative)
| Driver | Value | Why it matters |
|---|---|---|
| Sensors per building | 12 | Sets hardware revenue & COGS per deployment |
| Hardware price / sensor | $300 | Upfront revenue; lease model would shift this into recurring |
| Install / setup | $2,000 / building | One-time services revenue |
| SaaS price | $600 / building / month ($7,200/yr) | The compounding recurring engine |
| Annual churn | 5% | Low churn assumed because the structural record raises switching cost |
| Gross margins | SaaS 80% / HW 35% / Svcs 40% | Blended margin rises as SaaS mix grows |

## Growth assumption (illustrative)
| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| New buildings added | 30 | 150 | 300 |
| Ending active buildings | 30 | 178 | 469 |

## Headline outputs (illustrative)
| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Total revenue | $276K | $1.59M | $4.01M |
| Gross margin | 54% | 57% | 62% |
| EBITDA | ($1.25M) | ($1.59M) | ($1.12M) |
| Exit ARR | $216K | $1.28M | $3.38M |

**Reading the curve:** classic early-stage SaaS+hardware shape — invest ahead of revenue, gross margin climbs as the high-margin recurring base compounds, and the business approaches breakeven as ARR scales past the fixed opex base. The single most important lever is **net new buildings × low churn**, because SaaS revenue compounds while CAC is paid once.

## Sensitivities worth modeling next
1. **Lease vs. sell hardware** — moves upfront revenue into recurring, smooths cash, raises LTV.
2. **Channel mix** — partner-sourced deals lower CAC (and S&M) materially; model a partner-sourced % and its CAC discount.
3. **Tier mix** — Enterprise/Portfolio (cities, REITs, insurers) raises ACV per logo; add a multi-building expansion multiplier.
4. **Churn** — even 2–3 points changes the compounding curve significantly given multi-year contracts.
5. **Sensors per building** — large towers/bridges need more sensors → higher ACV and hardware revenue.

## Inputs that require primary research (do not ship as-is)
- Real count of SB 4-D-affected buildings and public assets in the tri-county market (drives the addressable funnel).
- Verified hardware BOM cost and target margin.
- Validated SaaS price points from a pricing study vs. legacy SHM project costs.
- Actual CAC and sales-cycle length by segment.
- Churn benchmarks once reference deployments are live.

---
*Companion docs: BUSINESS_PLAN.md · MARKETING_PLAN.md · INVESTOR_TEASER.md · PITCH_DECK_OUTLINE.md*
