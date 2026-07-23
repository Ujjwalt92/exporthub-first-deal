# ExportHub — First Deal Playbook

Live export training project (not a generic ERP).

## The deal

UAE buyer asks for best price on **1 × 20 ft container Teja S17 Stemless Red Chilli**.

Seller: **Tiwari's Spices International**  
Route: **FOB JNPT → Jebel Ali**  
Qty: **12,000 kg** in **25 kg PP bags (480 bags)**  
Payment: **Irrevocable LC at Sight**  
HSN: **09042120**

## Playbook rules baked into the app

1. **Never send final price** until the quotation checklist / cost sheet is complete.
2. Every cost has **Estimated → Quoted → Actual Paid**.
4. **Proforma Invoice first**; Commercial Invoice only at dispatch.
5. **Never start production/shipment** before reading the LC fully.

## App sections

- **Deal Home** — morning UAE email + stage snapshot
- **Playbook Rules**
- **Buyer Clarify** — ask before you quote
- **Cost Sheet** — INR working sheet + USD FOB suggestion
- **Proforma Invoice** — unit price stays empty until cost lock
- **Document Map** — IEC, RCMC, PI, PO, LC, CI, PL, SB, Phyto, COO, B/L…
- **Today’s Lesson** — the core teaching moment

## Run

```bash
cd exporter-app
npm install
npm run dev
```

## Build

```bash
npm run build
```

Data is stored in browser `localStorage`.
