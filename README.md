# ExportHub — Exporter Management App

A lightweight web app for exporters to manage buyers, products, shipments, and generate **Commercial Invoices** and **Packing Lists**.

## Features

- Dashboard with open shipment pipeline
- Buyer (consignee) management
- Product catalog with HS codes, weights, and CBM
- Shipment workflow with Incoterms, ports, ETD/ETA
- One-click Commercial Invoice + Packing List generation
- Print / Save as PDF from the browser
- Company profile (GSTIN, IEC, bank details)
- Local demo data saved in browser `localStorage`

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- React Router

## Getting started

```bash
cd exporter-app
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Notes

- Data stays in your browser; use **Company → Reset demo data** to restore sample records.
- The ChatGPT share link from the original request could not be read (JS/Cloudflare protected), so this MVP was built from a standard exporter workflow: buyers → products → shipments → documents.
