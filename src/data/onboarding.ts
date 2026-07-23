import type { OnboardingState } from '../types'

export const FIRST_CALL_SCRIPTS = [
  {
    id: 'script_vendor',
    title: 'First call/WhatsApp to Guntur vendor',
    who: 'Chilli supplier / broker',
    script: `Namaste, main {{company}} se bol raha/rahi hoon.
Hume export ke liye Teja S17 Stemless Super Deluxe chahiye.
Quantity: 12,000 kg (1x20 ft), packing 25 kg new PP bags.
Kya aaj/kal ready stock ya sorting possible hai?
Rate ex-godown kitna hai? Moisture/broken % kya guarantee karoge?
Sample photo + written rate bhej digiye. Payment terms kya rahenge?`,
  },
  {
    id: 'script_cha',
    title: 'First call to CHA (customs broker)',
    who: 'CHA at JNPT / Nhava Sheva',
    script: `Hello, hum pehli spices export shipment prepare kar rahe hain.
Product: dry red chilli (HS 09042120), FOB JNPT to Jebel Ali, 1x20 ft.
Kya aap chilli/spices handle karte ho?
1x20 ke liye aapka all-in documentation/CHA package kitna hai?
Kaunse documents aapko chahiye, aur phyto/COO mein aap help karoge?
Please written quote bhej dena.`,
  },
  {
    id: 'script_forwarder',
    title: 'First call to sea freight forwarder',
    who: 'Freight forwarder (SEA, not flight)',
    script: `Hello, hume JNPT to Jebel Ali 20ft booking guidance chahiye.
Shipment FOB hai — ocean freight buyer side ho sakta hai, lekin schedule/B/L process samajhna hai.
Next possible ETD kya hai? B/L original/telex/seaway mein kya issue kar sakte ho?
Local transport + THC approximate kitna padega? Written quote please.`,
  },
  {
    id: 'script_bank',
    title: 'First visit/call to bank trade desk',
    who: 'AD branch / LC desk',
    script: `Namaste, mere IEC/AD code linked account par export LC handling karni hai.
Buyer UAE se LC at Sight open karega.
Please batao: LC advising charges, negotiation charges, aur document lodgement process.
Ek sample checklist de digiye ki sight LC par kaunse documents lagte hain.
Tariff sheet bhi share kar digiye.`,
  },
  {
    id: 'script_transporter',
    title: 'First call to transporter',
    who: 'Guntur → JNPT trucker',
    script: `Bhaiya, Guntur se JNPT/CFS ke liye 1x20 chilli consignment ka rate chahiye.
Transit kitne din ka hai? Loading responsibility kiski? Insurance option hai?
All-in written rate bhej do with validity date.`,
  },
]

export function createOnboardingState(): OnboardingState {
  return {
    seenWelcome: false,
    completedAt: null,
    checklist: [
      {
        id: 'ob_beginner',
        label: 'Read Absolute Beginner Guide (Who/Where/Costing)',
        detail: 'CHA, forwarder, vendor, bank — ABCD clear karo',
        to: '/beginner',
        done: false,
      },
      {
        id: 'ob_company',
        label: 'Fill Company Setup (IEC, bank, GST)',
        detail: 'Legal name exact as bank/IEC',
        to: '/company',
        done: false,
      },
      {
        id: 'ob_scripts',
        label: 'Copy first-call scripts for vendor/CHA/forwarder/bank',
        detail: 'Start Here page par scripts milenge',
        to: '/start-here',
        done: false,
      },
      {
        id: 'ob_rules',
        label: 'Read Playbook Rules 1–6',
        detail: 'Price discipline + LC discipline',
        to: '/rules',
        done: false,
      },
      {
        id: 'ob_clarify',
        label: 'Open Buyer Clarify (never quote blind)',
        detail: 'Morning email ke baad pehla kaam',
        to: '/clarify',
        done: false,
      },
      {
        id: 'ob_cost',
        label: 'Open Cost Sheet + ₹→USD math',
        detail: 'Estimated/Quoted/Actual discipline',
        to: '/cost-sheet',
        done: false,
      },
    ],
  }
}
