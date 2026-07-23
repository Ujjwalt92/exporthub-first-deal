export interface BeginnerActor {
  id: string
  name: string
  alsoCalled: string[]
  plainMeaning: string
  whenYouNeedThem: string
  whereToFind: string[]
  whatToAsk: string[]
  whatTheyChargeRoughly: string
  redFlags: string[]
  linkedStages: string[]
}

export interface BeginnerCostRange {
  id: string
  item: string
  beginnerPlain: string
  typicalRangeInr: string
  dependsOn: string
  whoQuotesIt: string
}

export interface BeginnerStep {
  id: string
  dayLabel: string
  title: string
  forSomeoneWhoKnowsNothing: string
  whoToMeet: string[]
  where: string
  whatYouWalkAwayWith: string
  commonMistake: string
}

export const BEGINNER_ACTORS: BeginnerActor[] = [
  {
    id: 'dgft_iec',
    name: 'DGFT / IEC help desk / CA / Export consultant',
    alsoCalled: ['Import Export Code office', 'DGFT portal helper'],
    plainMeaning:
      'IEC is like your export licence number. Without IEC, Indian customs will not let you ship goods abroad.',
    whenYouNeedThem: 'Day 0 — before first commercial shipment.',
    whereToFind: [
      'DGFT website: dgft.gov.in (apply online with PAN + bank details)',
      'Local CA who handles GST + IEC',
      'District Industry Centre / export promotion events',
    ],
    whatToAsk: [
      'What documents do I need for IEC?',
      'Should IEC be on proprietorship / partnership / company?',
      'How do I link AD code with bank?',
    ],
    whatTheyChargeRoughly: 'IEC itself is government process; CA/consultant may charge ₹2,000–₹10,000 depending on city/service.',
    redFlags: ['Anyone promising IEC in 1 hour without PAN/bank KYC', 'Paying large cash to “agents” with no invoice'],
    linkedStages: ['company'],
  },
  {
    id: 'spices_board',
    name: 'Spices Board / RCMC support',
    alsoCalled: ['Spices Board registration', 'RCMC'],
    plainMeaning:
      'For chilli/spices exporters, Spices Board registration (RCMC) builds credibility and may be needed for some benefits/schemes.',
    whenYouNeedThem: 'Early setup, especially if you will export spices regularly.',
    whereToFind: [
      'Spices Board India website / regional office',
      'Local spice exporters association in Guntur / Unjha / similar markets',
    ],
    whatToAsk: ['Do I need RCMC before first shipment?', 'What quality/documentation expectations exist for chilli?'],
    whatTheyChargeRoughly: 'Membership/registration fees vary; confirm current schedule on official site.',
    redFlags: ['Fake “Board certificate agents” with no acknowledgment number'],
    linkedStages: ['company', 'documents'],
  },
  {
    id: 'vendor',
    name: 'Supplier / Mandi trader / Processor (Guntur)',
    alsoCalled: ['Vendor', 'Stockist', 'Miller/processor'],
    plainMeaning:
      'The person who sells you Teja chilli. You buy in India in rupees, then export.',
    whenYouNeedThem: 'After LC is clear (or with very controlled risk if buying earlier).',
    whereToFind: [
      'Guntur chilli market / brokers',
      'Existing exporter references',
      'B2B portals + physical lot inspection (never only WhatsApp photos)',
    ],
    whatToAsk: [
      'Stemless Super Deluxe exact spec?',
      'Moisture % and sorting quality?',
      'Ready quantity and packing in 25 kg PP bags?',
      'Rate ₹/kg ex-godown or delivered?',
    ],
    whatTheyChargeRoughly: 'Commodity price swings daily. Demo baseline used in app: around ₹265/kg (must re-quote live).',
    redFlags: ['No sample', 'No written rate', 'Pressure to full advance to unknown party'],
    linkedStages: ['vendor', 'production', 'quality'],
  },
  {
    id: 'cha',
    name: 'CHA (Customs House Agent)',
    alsoCalled: ['Customs broker', 'Clearing agent'],
    plainMeaning:
      'CHA is the licensed person/company who files your Shipping Bill and handles customs paperwork at the port. Think: “customs paperwork doctor”.',
    whenYouNeedThem: 'Before cargo reaches port / during dispatch planning.',
    whereToFind: [
      'JNPT/Nhava Sheva CHA associations',
      'Ask freight forwarder for trusted CHA',
      'Other exporters’ references (best)',
    ],
    whatToAsk: [
      'Have you handled spices/chilli before?',
      'What is your all-in charge for 1x20’ FOB shipment?',
      'What documents do you need from me?',
      'How do you handle phyto coordination?',
    ],
    whatTheyChargeRoughly:
      'Often ₹8,000–₹25,000+ per shipment agency/documentation bundle (varies a lot by port/service). App demo uses estimates — always take written quote.',
    redFlags: ['No written quote', 'Asks you to sign blank forms', 'Cannot explain Shipping Bill basics'],
    linkedStages: ['customs', 'cha-checklist', 'dispatch'],
  },
  {
    id: 'forwarder',
    name: 'Freight Forwarder',
    alsoCalled: ['FF', 'Forwarding agent', 'Logistics partner'],
    plainMeaning:
      'Freight forwarder books vessel space, helps with container movement, and coordinates Bill of Lading. For sea shipments (not “flight” unless air cargo). For chilli 20ft, usually SEA freight forwarder.',
    whenYouNeedThem: 'Once quantity/date is clear — ideally around production readiness.',
    whereToFind: [
      'Google + exporter references at JNPT corridor',
      'NVOCC / liner agents',
      'Ask CHA whom they work with daily',
    ],
    whatToAsk: [
      'JNPT → Jebel Ali rate for 20ft (buyer pays ocean freight on FOB, but you still need schedule)',
      'Earliest ETD matching my LC date',
      'What B/L type can you issue (original/telex/seaway)?',
      'Local transport + THC estimate?',
    ],
    whatTheyChargeRoughly:
      'Forwarder may charge documentation + handling; ocean freight itself for JNPT–Jebel Ali fluctuates (often quoted in USD per container). On FOB, buyer usually pays ocean freight.',
    redFlags: ['Guaranteed impossible ETD', 'Unclear if they are actual forwarder or only broker'],
    linkedStages: ['vessel', 'dispatch'],
  },
  {
    id: 'transporter',
    name: 'Transporter (Guntur → JNPT)',
    alsoCalled: ['Trailer', 'Container trucker', 'Inland haulier'],
    plainMeaning: 'Moves goods/container by road from Guntur area to port/CFS.',
    whenYouNeedThem: 'When cargo is almost packed/ready.',
    whereToFind: ['Local transport unions', 'Forwarder-arranged transport', 'Vendor’s regular truckers'],
    whatToAsk: ['Transit days', 'All-in rate', 'Insurance', 'Who arranges loading labour'],
    whatTheyChargeRoughly: 'Demo estimate around ₹50,000–₹90,000+ depending on fuel/season/container movement mode. Always re-quote.',
    redFlags: ['Cash-only with no bilty/LR', 'No transit insurance discussion'],
    linkedStages: ['dispatch', 'cost-sheet'],
  },
  {
    id: 'pq_phyto',
    name: 'Plant Quarantine / Phyto office',
    alsoCalled: ['PQ', 'Phytosanitary authority'],
    plainMeaning:
      'For agri products like chilli, many countries want a phytosanitary certificate saying the consignment meets plant-health rules.',
    whenYouNeedThem: 'Before or during customs — do not leave to last hour.',
    whereToFind: ['Plant Quarantine / PQIS offices linked to your port/region', 'Ask CHA to guide application'],
    whatToAsk: ['Lead time', 'Sampling needs', 'Exact consignee wording required by buyer/LC'],
    whatTheyChargeRoughly: 'Govt fee + agent facilitation; demo uses a few thousand rupees estimate.',
    redFlags: ['Someone selling “ready phyto” without inspection process'],
    linkedStages: ['customs', 'documents'],
  },
  {
    id: 'chamber_coo',
    name: 'Chamber of Commerce / COO issuer',
    alsoCalled: ['Certificate of Origin office'],
    plainMeaning: 'Issues Certificate of Origin — proof goods are from India (wording as needed by buyer/LC).',
    whenYouNeedThem: 'Around customs/shipment docs stage.',
    whereToFind: ['Local Chamber of Commerce', 'Some digital COO systems via authorized bodies'],
    whatToAsk: ['Required invoice copies', 'Same-day vs next-day', 'Exact origin declaration format'],
    whatTheyChargeRoughly: 'Usually a few thousand INR per certificate/service (varies).',
    redFlags: ['COO with wrong HS/exporter name'],
    linkedStages: ['customs', 'bank-docs'],
  },
  {
    id: 'bank',
    name: 'Bank (AD branch) — Forex / LC desk',
    alsoCalled: ['Authorised Dealer bank', 'Trade finance desk'],
    plainMeaning:
      'Your bank advises/negotiates LC and receives export documents for payment. Also issues FIRC/e-BRC after money comes.',
    whenYouNeedThem: 'When LC arrives, and again when lodging documents after shipment.',
    whereToFind: [
      'Your current bank’s trade finance / forex branch (AD code linked)',
      'Ask relationship manager for “LC advising + export bill lodging” team',
    ],
    whatToAsk: [
      'LC advising charges?',
      'Document negotiation/collection charges?',
      'What exact set do you need for this LC?',
      'Expected timeline for payment at sight after clean presentation?',
    ],
    whatTheyChargeRoughly: 'LC advising + negotiation can be thousands to tens of thousands INR + percentage components; get tariff sheet.',
    redFlags: ['No trade desk experience with export LCs', 'Cannot explain discrepancies'],
    linkedStages: ['po-lc', 'payment', 'bank-docs'],
  },
  {
    id: 'lab',
    name: 'Testing lab (optional but important)',
    alsoCalled: ['NABL lab', 'QA lab'],
    plainMeaning: 'Tests moisture, pesticide residue, etc., if buyer/LC asks for COA/test reports.',
    whenYouNeedThem: 'If buyer asks special tests — confirm BEFORE final price.',
    whereToFind: ['NABL accredited labs', 'Spices Board recommended labs', 'Ask buyer which lab they trust'],
    whatToAsk: ['Parameters', 'Turnaround time', 'Sample quantity needed'],
    whatTheyChargeRoughly: '₹2,000–₹25,000+ depending on test panel.',
    redFlags: ['Non-traceable “certificate shop”'],
    linkedStages: ['clarify', 'quality', 'cost-sheet'],
  },
]

export const BEGINNER_COST_RANGES: BeginnerCostRange[] = [
  {
    id: 'c_vendor',
    item: 'Chilli purchase (Teja)',
    beginnerPlain: 'The biggest cost — paying Guntur supplier for goods.',
    typicalRangeInr: 'Market-linked; demo ₹265/kg × 12,000 kg ≈ ₹31.8 lakh',
    dependsOn: 'Season, quality, stemless sorting, payment terms',
    whoQuotesIt: 'Vendor / broker',
  },
  {
    id: 'c_packing',
    item: 'Export packing',
    beginnerPlain: 'New PP bags + packing labour.',
    typicalRangeInr: 'Often ₹20–₹60 per bag equivalent (demo uses estimate)',
    dependsOn: 'Bag quality, labelling, labour',
    whoQuotesIt: 'Vendor or packing unit',
  },
  {
    id: 'c_transport',
    item: 'Guntur → JNPT transport',
    beginnerPlain: 'Road movement to port.',
    typicalRangeInr: 'Roughly ₹50,000–₹1,00,000+ (volatile)',
    dependsOn: 'Diesel, container availability, urgency',
    whoQuotesIt: 'Transporter / forwarder',
  },
  {
    id: 'c_cha',
    item: 'CHA + customs documentation',
    beginnerPlain: 'Paying the customs broker team.',
    typicalRangeInr: 'Roughly ₹8,000–₹25,000+ agency/docs bundle',
    dependsOn: 'Port, urgency, inclusions',
    whoQuotesIt: 'CHA',
  },
  {
    id: 'c_port',
    item: 'Port handling / THC (FOB side)',
    beginnerPlain: 'Port-side handling costs linked to container.',
    typicalRangeInr: 'Tens of thousands INR possible; get current quote',
    dependsOn: 'Terminal, container type, liner',
    whoQuotesIt: 'Forwarder / terminal via forwarder',
  },
  {
    id: 'c_certs',
    item: 'Phyto + COO + misc docs',
    beginnerPlain: 'Certificates needed for agri export/buyer.',
    typicalRangeInr: 'Often ₹2,000–₹15,000 combined (case-by-case)',
    dependsOn: 'Authority fees + agent help',
    whoQuotesIt: 'CHA / Chamber / PQ facilitator',
  },
  {
    id: 'c_bank',
    item: 'Bank LC charges',
    beginnerPlain: 'Bank fees to handle LC and documents.',
    typicalRangeInr: 'Can be material — take bank tariff before final quote',
    dependsOn: 'Bank, LC value, discrepancy handling',
    whoQuotesIt: 'Bank trade desk',
  },
  {
    id: 'c_ocean',
    item: 'Ocean freight JNPT → Jebel Ali',
    beginnerPlain: 'Ship cost on sea. On FOB, buyer usually pays this.',
    typicalRangeInr: 'Quoted in USD/container; market changes weekly',
    dependsOn: 'Carrier, season, fuel surcharges',
    whoQuotesIt: 'Freight forwarder / liner',
  },
]

export const BEGINNER_JOURNEY: BeginnerStep[] = [
  {
    id: 'b0',
    dayLabel: 'Day 0',
    title: 'Become legally ready',
    forSomeoneWhoKnowsNothing:
      'Before selling abroad, you need identity as an exporter: business registration, PAN, bank account, IEC, GST as applicable, and AD code linked at bank.',
    whoToMeet: ['CA / consultant', 'Bank RM (AD branch)', 'DGFT portal support if stuck'],
    where: 'Your city + online DGFT/bank portals',
    whatYouWalkAwayWith: 'IEC number + bank AD code linkage + basic letterhead/export profile',
    commonMistake: 'Chasing buyers before IEC/bank trade setup is ready',
  },
  {
    id: 'b1',
    dayLabel: 'Day 1 morning',
    title: 'Enquiry comes — do not quote yet',
    forSomeoneWhoKnowsNothing:
      'An enquiry is only interest. A professional first asks details, then calculates all costs, then sends Proforma Invoice.',
    whoToMeet: ['No outside meeting yet — use clarify checklist'],
    where: 'Email/WhatsApp',
    whatYouWalkAwayWith: 'Clear spec: product, packing, port, incoterm, payment, timeline, tests',
    commonMistake: 'Sending a random USD price in first reply',
  },
  {
    id: 'b2',
    dayLabel: 'Day 1–2',
    title: 'Collect quotes for every cost line',
    forSomeoneWhoKnowsNothing:
      'Call/message vendor, transporter, CHA, forwarder, bank. Write Estimated then replace with Quoted.',
    whoToMeet: ['Vendor', 'Transporter', 'CHA', 'Forwarder', 'Bank trade desk'],
    where: 'Guntur market + JNPT service providers + bank',
    whatYouWalkAwayWith: 'Filled cost sheet + proposed FOB USD/kg',
    commonMistake: 'Forgetting bank/certificate costs and underquoting',
  },
  {
    id: 'b3',
    dayLabel: 'Day 2–3',
    title: 'Send Proforma Invoice',
    forSomeoneWhoKnowsNothing:
      'PI is your official offer. Not tax invoice. Buyer uses it to open PO/LC.',
    whoToMeet: ['Buyer (email)'],
    where: 'Email with PDF PI',
    whatYouWalkAwayWith: 'Accepted PI / negotiation notes',
    commonMistake: 'Sending Commercial Invoice too early',
  },
  {
    id: 'b4',
    dayLabel: 'Day 4–7',
    title: 'Receive PO + LC and read every line',
    forSomeoneWhoKnowsNothing:
      'LC is a bank conditional promise: if documents match, you get paid. If documents mismatch, money can delay or fail.',
    whoToMeet: ['Bank LC desk', 'Buyer (for amendments)'],
    where: 'Your advising bank',
    whatYouWalkAwayWith: 'Clean LC (or amendment request)',
    commonMistake: 'Starting packing on a wrong LC',
  },
  {
    id: 'b5',
    dayLabel: 'Week 2',
    title: 'Buy, pack, QC, dispatch',
    forSomeoneWhoKnowsNothing:
      'Only after LC is safe: confirm vendor, pack 480 bags, check quality, truck to port, stuff container, make CI/PL.',
    whoToMeet: ['Vendor', 'Transporter', 'Forwarder', 'Lab if needed'],
    where: 'Guntur + CFS/port',
    whatYouWalkAwayWith: 'Stuffed sealed container + commercial docs',
    commonMistake: 'No written vendor confirmation / no QC',
  },
  {
    id: 'b6',
    dayLabel: 'Week 2–3',
    title: 'Customs + certificates + vessel',
    forSomeoneWhoKnowsNothing:
      'CHA files Shipping Bill. Phyto/COO arranged. After LEO, vessel loads and B/L is issued.',
    whoToMeet: ['CHA', 'PQ/COO offices', 'Freight forwarder'],
    where: 'Port ecosystem (JNPT/CFS) + online filings via CHA',
    whatYouWalkAwayWith: 'LEO + B/L + certificate set',
    commonMistake: 'Leaving phyto/COO to the last evening before cut-off',
  },
  {
    id: 'b7',
    dayLabel: 'After sailing',
    title: 'Lodge documents and follow payment',
    forSomeoneWhoKnowsNothing:
      'Take the exact LC document set to bank. If clean, sight LC should move toward payment. Then collect FIRC/e-BRC and update actual costs.',
    whoToMeet: ['Bank trade desk', 'Buyer if waiver needed'],
    where: 'Your bank',
    whatYouWalkAwayWith: 'Payment realized + deal closed lessons',
    commonMistake: 'Lodging mismatched documents and discovering issues too late',
  },
]

export const BEGINNER_MYTHS = [
  {
    myth: 'Export means I need my own factory.',
    truth: 'Many first deals are trading/merchant export: buy from Guntur supplier, pack to buyer spec, ship.',
  },
  {
    myth: 'Freight forwarder and CHA are the same.',
    truth: 'CHA focuses on customs filing. Forwarder focuses on vessel/container/B/L logistics. Sometimes one group offers both — still understand separately.',
  },
  {
    myth: 'FOB price should include ship ocean freight.',
    truth: 'On FOB, seller’s responsibility is broadly till loading at origin port. Ocean freight usually buyer’s side. Still track freight for knowledge/CIF upgrades.',
  },
  {
    myth: 'LC means 100% guaranteed money no matter what.',
    truth: 'LC pays when documents comply. Wrong documents can block payment.',
  },
  {
    myth: 'I can learn all costs from one Google number.',
    truth: 'Costs move. Always take live quotes and keep Estimated/Quoted/Actual.',
  },
]
