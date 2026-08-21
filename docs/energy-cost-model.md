# Energy cost model — Wallonia / ORES

Reference **and implementation blueprint** for the Energy page's cost &
self-consumption layer. It captures why cost in Wallonia behaves unlike
Flanders, the billing regime this household is on, the math validated against a
real ENGIE settlement, the tariff parameters, the entity mapping, and the
Home-Assistant-side architecture that should compute it.

> Personal identifiers from the source bill (name, address, EAN, client number)
> are intentionally omitted — only the derived tariff **model** lives here.

**Status:** documented, not yet implemented. Design reviewed and corrected
2026-08-21 (see the changelog at the end).

---

## 1. Scope and context

- **Region:** Wallonia · **DSO:** ORES (Brabant wallon) · **Regulator:** CWaPE
- **Supplier / contract:** ENGIE **Direct Online**, variable price, dual-rate
  (bihoraire HP/HC), 1-year term
- **Meter:** bidirectional smart meter, four cumulative registers
- **Solar:** prosumer ≤ 10 kVA, **annual compensation** regime (existing
  prosumer, energy-component compensation valid until end 2030)
- **Billing year:** ~ 1 July → 30 June

A naïve `grid_import × price` is materially wrong here. The bill is shaped by
**annual, register-specific solar compensation**, **gross-volume** network
charges, a **prosumer rebate**, and a **variable** ENGIE price whose final
monthly value is only known after the month closes. The model must therefore be
a small Belgian billing engine, not a price sensor.

### Two questions, kept separate

1. **Physical** — what is happening: import/export per register, gross import,
   compensation balance. *This can be exact.*
2. **Financial** — what the bill will be: ENGIE energy + ORES network + taxes +
   prosumer rebate + fixed fee + VAT. *This can only be an honest estimate* (§4.6,
   §5).

### Two cost concepts, also kept separate

- **A · Settlement estimate** — "if the annual settlement ran today, what would I
  owe?" The financially meaningful number; accounts for annual compensation,
  gross network, prosumer rebate, variable pricing, taxes, fixed fee.
- **B · Operational / marginal cost** — "what does the kWh I'm using *right now*
  cost, or save?" Useful for EV/HVAC/appliance decisions, but must **not** be
  presented as the bill, because a kWh imported today may be compensated by
  export later in the year (§6).

---

## 2. What the annual bill proves

Full settlement year (365 days ending 30 June 2026), reconstructed from the four
meter-index deltas:

| Register | Import | Export | Net (imp − exp) | Billed (energy) |
| --- | ---: | ---: | ---: | ---: |
| Heures pleines (HP / peak) | 1 432 | 1 658 | **−226** | **0** |
| Heures creuses (HC / off-peak) | 2 399 | 1 883 | **+516** | **516** |
| **Total** | **3 831** | **3 541** | **+290** | **516** |

The invoice bills **516 kWh** of energy — proving compensation is
**register-specific** (`max(0, imp−exp)` per register → 516), **not** total-net
(which would give 290). HP surplus does **not** offset HC consumption.

Network charges, by contrast, are on the **full 3 831 kWh gross import** (§4.3).
So the engine needs **both a gross-import ledger and a net-compensated ledger.**

---

## 3. Billing regime

- **Energy (commodity)** is netted **per tariff register**, over the billing
  year, capped at zero — no cross-register compensation, and **net surplus is
  unpaid** (no injection revenue on this contract):

  ```
  billable_HP = max(0, import_HP − export_HP)
  billable_HC = max(0, import_HC − export_HC)
  ```

- **Network (ORES distribution + transport)** on **gross import**, minus a
  separate **prosumer rebate** (§4.3) — *not* a cap.
- **Levies** (green certs, accise, cotisation) on **net** billable volume;
  **fixed redevance** flat/prorated; **VAT** on top (mostly 6%, one exception in
  §4.8).

---

## 4. The math (validated against the bill)

Notation: `B_HP`, `B_HC` = billable peak/off-peak kWh; `G` = gross import kWh.

### 4.1 Register-specific compensation
```
B_HP = max(0, import_HP − export_HP)      # = 0    for 2025-26
B_HC = max(0, import_HC − export_HC)      # = 516  for 2025-26
billable = B_HP + B_HC
```
Also expose the **compensation reserve** per register (surplus export not yet
absorbed by import) — it makes the invisible annual mechanism legible:
```
reserve_HP = max(0, export_HP − import_HP)   # = 226  (use-it-or-lose-it, resets 1 Jul)
reserve_HC = max(0, export_HC − import_HC)   # = 0
```
Reserve is intra-year and non-transferable across registers; it does not roll to
next year.

### 4.2 Gross import
```
G = import_HP + import_HC                  # = 3 831
```

### 4.3 Network — distribution + transport − rebate (NOT a cap)
The invoice lists distribution at **full volumetric** value and the prosumer
discount as a **separate credit line**. Model them as such:
```
distribution = G × distribution_rate − prosumer_rebate
transport    = G × transport_rate
network      = distribution + transport
```
> **Do not** model distribution as `min(G × rate, cap)`. A cap has wrong marginal
> behaviour — above it, an extra imported kWh would cost €0 of distribution,
> which would falsely tell the dashboard that importing is free past a threshold
> and destroy the self-consumption signal. The rebate is a rebate; the marginal
> distribution cost is always `distribution_rate`.

`prosumer_rebate` is a configurable line (≤10 kVA). Its exact basis (flat vs
per-kVA vs per-injected-kWh) is unconfirmed from a single year — see §9. Default
to the observed annual value but keep it editable.

### 4.4 Taxes and levies (on net billable)
```
taxes = billable × (energy_contribution + special_excise + connection_levy)
```
Applied to the **516 net**, not the 3 831 gross (per the invoice).

### 4.5 Green energy (separate — double-count guard)
Charged by ENGIE as a **distinct** line from energy:
```
green_energy = billable × green_energy_rate
```
> The extracted ENGIE formula (§4.6) reproduces the displayed monthly price
> **without** green included, so the displayed HP/HC prices are energy-only and
> green must be **added** separately. If a future ENGIE-supplied "all-in" price
> already includes green, do **not** add it again. Make this an explicit toggle,
> never a silent assumption.

### 4.6 ENGIE energy (variable — estimate, not exact)
The invoice states the contract formula (per kWh), indexed monthly on EPEX DAM:
```
price_HP = 0.0233560 + 0.0012570 × EPEX_DAM
price_HC = 0.0222660 + 0.0009970 × EPEX_DAM
supplier_variable = B_HP × price_HP + B_HC × price_HC
```
Use the **effective average price for the billing period so far**, not the
current month's price applied retroactively to every kWh since July — otherwise
history is silently repriced whenever ENGIE's monthly rate moves.

**Why this can only be estimated:** Direct Online's final monthly price is known
only after month close; the annually-compensated **net** kWh must be *allocated*
across price-periods (a regulated profile, not simply actual monthly P1 × monthly
price — and annual compensation means an early-year import can be cancelled by a
later export). Hence the output entity is `…_estimated_bill`, never `…_exact_bill`.

### 4.7 Fixed supplier fee
```
supplier_fixed = annual_fee × elapsed_days / 365     # annual_fee = 28.30 €/yr (current contract)
```

### 4.8 VAT
```
estimated_bill = (supplier_variable + green_energy + supplier_fixed
                  + distribution + transport + taxes) × (1 + vat)
```
VAT is 6% on electricity **except** the `redevance de raccordement` (connection
levy), which carried a different VAT marker on the invoice — apply its rate
separately rather than blanket-multiplying.

---

## 5. Historical validation (regression fixture)

The prior annual bill is the sanity check — the physical and network structure
reproduce it:

- **Compensation:** HP `1432−1658 = −226 → 0`; HC `2399−1883 = +516 → 516`.
  Total **516 kWh** — matches ENGIE.
- **Network:** distribution `3831 × 0.08852 ≈ €339.12`, rebate `−€38.71`,
  transport `3831 × 0.0269642 ≈ €103.30`, total **≈ €403.71** — matches the
  invoice.

Keep these as test fixtures for the engine.

---

## 6. Self-consumption economics (the behaviour metric)

Because network + taxes ride on **gross** import and export surplus is **unpaid**,
self-consumption dominates export — more sharply than a simple ratio suggests.
State it honestly, by register:

- **Self-consuming 1 kWh always avoids a gross import** → saves at least
  `distribution_rate + transport_rate + levies` ≈ **0.12–0.15 €/kWh**.
- **When it reduces a net-import (billable) register** (e.g. HC), it *also*
  avoids the energy commodity → **up to ~0.30 €/kWh** all-in.
- **Exported surplus earns ≈ €0** on this contract (no injection payment; surplus
  only offsets same-register import, and beyond that is lost).

So the panel's message is *"self-consume — every kWh saves 0.12–0.30 €; exporting
the surplus earns nothing,"* not a single blanket multiple. (This corrects an
earlier draft that assumed a ~0.06 €/kWh injection credit — this contract has
none.) This is the financial justification for the existing solar-EV-charging
automation.

---

## 7. Derived tariff parameters

€/kWh ex-VAT unless noted. Energy prices are **variable** (monthly) — inputs, not
constants.

| Parameter | Value | Source / note |
| --- | --- | --- |
| ENGIE HP formula | `0.0233560 + 0.0012570 × EPEX_DAM` | invoice contract formula |
| ENGIE HC formula | `0.0222660 + 0.0009970 × EPEX_DAM` | invoice contract formula |
| ENGIE HP (Aug 2026 ref) | `0.202` | formula at EPEX ≈ 142 €/MWh |
| ENGIE HC (Aug 2026 ref) | `0.164` | formula at EPEX ≈ 142 €/MWh |
| ENGIE green energy | `0.0292` | **separate** line; do not double-count |
| ENGIE fixed fee | `28.30 €/yr` | current contract |
| ORES distribution | `0.0885200` | invoice rate |
| ORES transport | `0.0269642` | invoice rate |
| ORES prosumer rebate ≤10 kVA | `≈ 38.71 €/yr` | **separate rebate, not a cap**; basis to confirm |
| Cotisation énergie | `0.0019261` | on net |
| Accise spéciale | `0.0474806` | on net |
| Redevance raccordement | `0.0007500` | on net; **non-6% VAT** |
| VAT | `0.06` | except raccordement |

Recent ENGIE monthly prices (for trend/reference): Aug 0.164/0.202 · Jul
0.139/0.170 · Jun 0.142/0.174 · May 0.121/0.147 · Apr 0.107/0.130 (HC/HP).

---

## 8. Entity mapping (all live today — no new integration)

| Model input | Home Assistant entity |
| --- | --- |
| import HP | `sensor.p1_meter_energy_import_tariff_1` |
| import HC | `sensor.p1_meter_energy_import_tariff_2` |
| export (injection) HP | `sensor.p1_meter_energy_export_tariff_1` |
| export (injection) HC | `sensor.p1_meter_energy_export_tariff_2` |
| active register (live) | `sensor.p1_meter_tariff` (1 = HP, 2 = HC) |
| solar produced | `sensor.goodwe_total_pv_generation` |

> **Verify the register mapping before trusting it.** `sensor.p1_meter_tariff`
> read `1` at 18:45 on a weekday (pre-22h → HP), implying tariff 1 = HP. Confirm
> with a night sample; a silent HP/HC swap corrupts the whole split.

---

## 9. Home-Assistant-side architecture

The billing engine lives in **HA config as real, inspectable entities** — not in
panel TypeScript. The panel becomes a presentation layer over these sensors.
Rationale: the July→June billing year needs `utility_meter` cron resets (the
panel's calendar-period Statistics model can't express it); the compensation
logic benefits from being visible HA entities; and the result is reusable in
native dashboards, automations, and alerts.

```
P1 registers ──► annual utility_meters ──► ledger/compensation templates
              (reset 1 Jul)                        │
                                                    ▼
        input_number tariff helpers ──►  cost templates  ──►  estimated bill
                                                    │
                                                    ▼
                                        panel widget (presentation)
```

### Layer 1 — annual billing-year meters

Four `utility_meter`s pointed at the physical P1 registers, reset at the billing
year boundary. `periodically_resetting: false` because the source is a
lifetime-cumulative meter counter.

```yaml
utility_meter:
  electricity_import_peak_billing_year:
    source: sensor.p1_meter_energy_import_tariff_1
    cron: "0 0 1 7 *"
    periodically_resetting: false
  electricity_import_offpeak_billing_year:
    source: sensor.p1_meter_energy_import_tariff_2
    cron: "0 0 1 7 *"
    periodically_resetting: false
  electricity_export_peak_billing_year:
    source: sensor.p1_meter_energy_export_tariff_1
    cron: "0 0 1 7 *"
    periodically_resetting: false
  electricity_export_offpeak_billing_year:
    source: sensor.p1_meter_energy_export_tariff_2
    cron: "0 0 1 7 *"
    periodically_resetting: false
```

### Layer 2 — ledger (physical, exact)

Billable per register, gross import, and the reserve sensors. Example (HC
billable; the others follow the §4 formulas):

```yaml
template:
  - sensor:
      - name: "Electricity Billable Off-Peak"
        unique_id: electricity_billable_offpeak
        unit_of_measurement: "kWh"
        device_class: energy
        state_class: total
        state: >
          {% set i = states('sensor.electricity_import_offpeak_billing_year') | float(0) %}
          {% set e = states('sensor.electricity_export_offpeak_billing_year') | float(0) %}
          {{ [i - e, 0] | max | round(3) }}
```

Mirror for `Billable Peak`, `Gross Import Billing Year` (sum of the two imports),
and `Peak/Off-Peak Compensation Reserve` (`max(0, export − import)`).

### Layer 3 — tariff helpers (`input_number`)

Every rate that can change is a helper, so tariffs update without editing
templates: ENGIE HP/HC (effective average) · green · fixed fee · ORES
distribution · ORES transport · **prosumer rebate** · cotisation · accise ·
raccordement · VAT. Use `step: 0.000001`, `mode: box` for €/kWh rates.

### Layer 4 — cost templates

`device_class: monetary` sensors implementing §4.3–4.8, e.g. distribution as
`G × rate − rebate` (no `min()`), taxes on billable, green separate, then the
`_estimated_bill` sum × VAT. Prorate the fixed fee by elapsed billing-year days.

---

## 10. Coexistence — do not replace the native Energy dashboard

Two different jobs, both kept:

- **Native HA Energy dashboard + panel time-travel widgets** — physical energy
  flows (import/export/solar) over arbitrary day/week/month, from the Statistics
  API. Unchanged.
- **This billing engine** — the fixed July→June settlement estimate, from
  `utility_meter`s. Additive.

```
                       ┌─► Native Energy dashboard + panel period widgets (physical)
P1 / GoodWe ───────────┤
                       └─► Belgian billing engine ─► panel cost widget (financial)
```

---

## 11. Panel widget — `Coûts & autoconsommation` (presentation layer)

- **Placement / size:** Energy view, `4×2`; follows the shared page period only
  for the *operational* view; the *settlement* view is billing-year scoped.
- **Reads computed HA entities** (Layers 2 & 4) — it does not recompute billing.
- **Segmented toggle** (widget state), both modes agreed:
  - **Économies** (default hero) — self-consumption savings today and the
    honest per-register framing from §6; export surplus shown as earning ≈ €0.
  - **Facture** — settlement estimate: billable HP/HC, gross import, reserve,
    network (dist/transport/rebate), ENGIE HP/HC, and the `estimated_bill`, split
    Énergie (net) / Réseau ORES (brut) / Taxes-TVA with network as the dominant
    slice.
- A detail drawer can show the full calculation breakdown.

---

## 12. Open items to confirm

1. **Register mapping** — night sample to lock tariff 1 = HP (§8).
2. **Prosumer rebate basis** — flat vs per-kVA vs per-injected-kWh; needs a
   second year's bill (§4.3).
3. **Green in or out of the displayed price** — confirm the displayed HP/HC are
   energy-only (formula suggests yes) so green is added, not double-counted (§4.5).
4. **Net-surplus payment** — confirm surplus is truly unpaid on this contract
   (bill shows no injection revenue) vs a separate injection tariff (§6).
5. **ENGIE settlement allocation** — how annually-compensated net kWh is spread
   across monthly variable prices; sets how close the estimate can get (§4.6).
6. **Fixed fee / VAT-on-raccordement** — small, but pin the exact treatment.

---

## 13. Phased implementation

1. **Physical ledger (exact)** — Layers 1–2: annual import/export HP/HC, billable
   HP/HC, reserves, gross import.
2. **ORES** — distribution (`G × rate − rebate`), transport, taxes; editable
   helpers.
3. **ENGIE** — effective average HP/HC, green (separate), fixed fee; expose the
   `_estimated_bill`.
4. **Automation** — update the monthly ENGIE effective-average helper so history
   is never retrospectively repriced.
5. **Projection** — after a few weeks of a new billing year, add a seasonally
   adjusted projected annual bill (not year-to-date average × 365).

---

## 14. Correction to the Energy page audit

This model supersedes two Flanders-calibrated audit findings:

- **Retract** the `capaciteitstarief` monthly demand-peak gauge — ORES bills
  proportionally per gross kWh (§2–§3); there is no peak-demand line for this
  site.
- **Promote** the cost / self-consumption layer to the top finding, with the
  gross-import-network economics (§6) as the rationale.

---

## Changelog

- **2026-08-21** — initial Wallonia model.
- **2026-08-21** — reworked into an HA-side `utility_meter` engine with
  register-specific compensation validated against the annual bill; separated
  ORES distribution/transport rates; added the ENGIE EPEX formula and
  compensation-reserve sensors. Corrected the prosumer discount from a *cap* to a
  *rebate line* (right marginal behaviour), flagged the green-cert double-count,
  removed the assumed ~0.06 €/kWh injection credit (this contract pays none for
  surplus), and noted the raccordement VAT exception. Origin: a design proposal
  reviewed and merged in part.
