# KalaMitra (कला मित्र) — 2-Minute 40-Second Video Demo Script
> **AWS "Campus to Cloud" Hackathon Video Submission**  
> *Target Duration: Exactly 2 minutes 40 seconds (160 seconds)*  
> *Tone: Empathetic, dynamic, technically rigorous, inspiring*

---

## Video Production Overview

| Section | Timestamp | Focus / Message | Key Visual |
| :--- | :--- | :--- | :--- |
| **Scene 1** | **0:00 – 0:20** (20s) | Problem & Target Persona | Real artisan context & digital divide |
| **Scene 2** | **0:20 – 0:50** (30s) | Photo Capture & Edge AI Cutout | Budget phone camera -> instant studio cutout |
| **Scene 3** | **0:50 – 1:30** (40s) | Voice-First Regional Catalog | Gujarati speech -> English + Hindi storytelling |
| **Scene 4** | **1:30 – 1:55** (25s) | Data-Grounded Price Assistant | Transparent cost floor & fair market margins |
| **Scene 5** | **1:55 – 2:15** (20s) | Live Public Storefront & Buyer Enquiry | One-tap WhatsApp sharing & buyer lead capture |
| **Scene 6** | **2:15 – 2:35** (20s) | 15-Second AWS Architecture | Clean Mermaid system architecture on AWS |
| **Scene 7** | **2:35 – 2:40** (5s) | Final Call to Action & Bharat Impact | KalaMitra tagline & closing vision |

---

## Shot-by-Shot Script

### Scene 1: Problem & Target Persona (0:00 – 0:20)
- **Visual / Shot List**:
  - *Shot 1.1 (0:00–0:08)*: Split-screen footage: Busy, crowded Indian handicraft fair (Surajkund Mela / Dilli Haat) transitioning to an empty rural artisan loom in Gujarat.
  - *Shot 1.2 (0:08–0:20)*: Close-up of our target persona, **Hansaben Vankar**, a handloom weaver in Kutch, holding her budget Android phone, struggling with a complex English e-commerce seller registration form with 25 text fields.
- **On-Screen Captions**:
  - `7 Million+ Traditional Artisans in Bharat`
  - `Depend on annual fairs like Surajkund Mela`
  - `Barriers: Photography • English Literacy • Catalog Writing • Pricing`
- **Voice-Over (VO)**:
  > *"Meet Hansaben, a master handloom weaver in Kutch, Gujarat. Like over 7 million Indian artisans, her livelihood depends entirely on 2-week annual fairs like Surajkund Mela. For the rest of the year, her shawls sit unsold. Why? Because selling online demands studio lighting, fluent English, and complex catalog forms she was never taught to fill. Meet KalaMitra—her AI-powered virtual business manager."*

---

### Scene 2: Snap Photo & In-Browser AI Studio (0:20 – 0:50)
- **Visual / Shot List**:
  - *Shot 2.1 (0:20–0:28)*: Mobile phone screen capture: KalaMitra PWA open on mobile browser. Tap large camera icon. Hansaben snaps a photo of an authentic handwoven Kutch stole lying on a plain cot.
  - *Shot 2.2 (0:28–0:38)*: The photo appears on the phone. Tap "Remove Background". A crisp progress ring animates. In seconds, the cluttered background vanishes, replaced by a pure studio white backdrop.
  - *Shot 2.3 (0:38–0:50)*: AWS Rekognition badges light up on screen: `[Textile: 98%]`, `[Pattern: 94%]`, `[Handicraft: 91%]`. Direct S3 presigned upload indicator completes with a green checkmark.
- **On-Screen Captions**:
  - `Step 1 & 2: Instant Photo Capture & AI Studio`
  - `Client-Side WebAssembly Background Removal (Zero Server GPU Cost)`
  - `Amazon Rekognition: Automated Craft & Material Detection`
- **Voice-Over (VO)**:
  > *"Hansaben takes a simple photo on her budget phone. Right inside her mobile browser, client-side WebAssembly isolates the craft onto a pristine studio backdrop—zero expensive photographers, zero server GPU bills. Behind the scenes, Amazon Rekognition analyzes the image texture, detecting handloom weave patterns and authentic materials."*

---

### Scene 3: Voice in Mother Tongue -> Bilingual Catalog (0:50 – 1:30)
- **Visual / Shot List**:
  - *Shot 3.1 (0:50–1:00)*: Language selector highlights Gujarati (`ગુજરાતી`). Tap the prominent saffron microphone button. Pulsing audio ripple appears.
  - *Shot 3.2 (1:00–1:15)*: Hansaben speaks naturally in Gujarati:  
    *«આ કચ્છી હાથવણાટનો શાલ છે, શુદ્ધ દેશી ઊનમાંથી બનાવેલો છે, જેમાં પરંપરાગત ભુજોડી મીરર વર્ક અને કુદરતી રંગો છે.»*  
    Gujarati text streams live onto the screen using the browser's Web Speech API.
  - *Shot 3.3 (1:15–1:30)*: Tap "Generate AI Catalog". In under 3 seconds, the screen displays a dual-language catalog card:
    - **English Title**: *"Handwoven Kutch Desi Wool Shawl with Traditional Bhujodi Mirror Work"*
    - **Hindi Title**: *"पारंपरिक भुजोड़ी मिरर वर्क वाली कच्छी देसी ऊन की हस्तनिर्मित शॉल"*
    - Cultural storytelling narrative highlighting heritage, care instructions, and export-ready tags. Tap speaker icon to hear the description read aloud.
- **On-Screen Captions**:
  - `Step 3: Voice-First Regional Interface (9 Indian Languages)`
  - `Browser Web Speech API: Native gu-IN Locale Transcription`
  - `Bilingual AI Storytelling: English + Hindi Export Catalog`
- **Voice-Over (VO)**:
  > *"No typing needed. Hansaben taps the microphone and speaks naturally in Gujarati. The browser's native Web Speech API transcribes her words with zero latency. Powered by our serverless AI pipeline, KalaMitra transforms her spoken dialect into a professional, dual-language English and Hindi catalog—complete with heritage storytelling, craft techniques, and buyer-ready SEO tags."*

---

### Scene 4: Fair Price Assistant Grounded in Data (1:30 – 1:55)
- **Visual / Shot List**:
  - *Shot 4.1 (1:30–1:42)*: Screen transitions to Step 4: "Price Assistant". Hansaben enters her raw material expense (`₹350`) and crafting time (`8 hours`).
  - *Shot 4.2 (1:42–1:55)*: The screen computes in real time:
    - Cost Floor Breakdown: `₹350 (Materials) + ₹800 (Labor @ ₹100/hr) + 35% margin = ₹1,550`
    - DynamoDB Benchmark query: Handloom Shawl Market Range: `₹1,800 – ₹2,400`
    - Hansaben selects recommended retail price: `₹1,850`. Tap "Save Product".
- **On-Screen Captions**:
  - `Step 4: Fair Price Assistant`
  - `Amazon DynamoDB: Real-Time Craft Price Benchmarks`
  - `Guaranteed Artisan Floor: Material + ₹100/hr Skilled Labor + 35% Fair Margin`
- **Voice-Over (VO)**:
  > *"Next, the Fair Price Assistant. Middlemen often buy Hansaben's shawls for ₹500 and sell them for ₹3,000. KalaMitra queries Amazon DynamoDB reference benchmarks, calculating a transparent cost floor: materials plus fair skilled labor at ₹100 per hour plus profit margin. Hansaben prices with confidence at ₹1,850—protecting her from distress selling."*

---

### Scene 5: Instant Public Shop & Buyer Inquiry (1:55 – 2:15)
- **Visual / Shot List**:
  - *Shot 5.1 (1:55–2:05)*: The product appears in "My Shop". Hansaben taps "Share on WhatsApp". WhatsApp opens with a pre-filled invitation link: `https://staging...amplifyapp.com/#/shop/demo-artisan`.
  - *Shot 5.2 (2:05–2:15)*: Cut to buyer's perspective on desktop/mobile (no login required). Buyer views the 8 authentic products with high-resolution imagery. Buyer clicks "Send Inquiry", enters name and contact, and submits. Hansaben receives the inquiry in DynamoDB instantly.
- **On-Screen Captions**:
  - `Step 5: Instant Zero-Login Public Storefront`
  - `One-Tap WhatsApp Sharing & Buyer Lead Capture`
  - `One-Click CSV Export for GeM & ONDC Marketplace Onboarding`
- **Voice-Over (VO)**:
  > *"In under two minutes, Hansaben's shop is live. Anyone in the world can visit her storefront without logging in, browse her creations, and enquire directly. With one click, she shares her store to WhatsApp customer groups or exports her entire catalog to CSV for bulk onboarding onto government marketplaces like GeM and ONDC."*

---

### Scene 6: Architecture in 15 Seconds (2:15 – 2:35)
- **Visual / Shot List**:
  - *Shot 6.1 (2:15–2:35)*: High-resolution animated Mermaid architecture diagram highlighting active AWS services:
    - AWS Amplify Hosting -> Amazon Cognito -> API Gateway HTTP API -> 9 AWS Lambda microservices -> Amazon DynamoDB + Amazon S3 + Amazon Rekognition + AWS SSM Parameter Store + Google Gemini API.
- **On-Screen Captions**:
  - `100% Free-Tier Serverless Architecture (Region: ap-southeast-2)`
  - `Amplify • Cognito • API Gateway • Lambda • DynamoDB • S3 • Rekognition • SSM`
  - `Zero Server GPU Costs • JWT Security • Daily AI Safety Caps`
- **Voice-Over (VO)**:
  > *"Under the hood, KalaMitra is 100% serverless on AWS: hosted on AWS Amplify, authenticated with Amazon Cognito, routed via API Gateway HTTP API to 9 Python 3.12 Lambdas, with data in DynamoDB and media in Amazon S3, secured with SSM Parameter Store and AWS Rekognition. Engineered to run entirely within the AWS Free Tier with zero server GPU overhead."*

---

### Scene 7: Why Bharat Should Care (2:35 – 2:40)
- **Visual / Shot List**:
  - *Shot 7.1 (2:35–2:40)*: Hansaben smiles holding her finished shawl, with the KalaMitra logo and URL displayed proudly on screen.
- **On-Screen Captions**:
  - `KalaMitra (कला मित्र) — Empowering 7 Million Hands That Weave Bharat`
  - `Live Demo: staging.d7fvd9ozmbri0.amplifyapp.com`
- **Voice-Over (VO)**:
  > *"KalaMitra bridges the gap from campus to cloud—empowering the hands that craft Bharat's soul with the dignity of digital independence."*
