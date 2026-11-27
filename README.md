# KalaMitra (कला मित्र)

> **AI Virtual Business Manager for Bharat Artisans, Weavers, and Micro-Entrepreneurs**  
> *Built for the AWS "Campus to Cloud" Hackathon.*  
> **Region:** `ap-southeast-2` (Sydney) | **Architecture:** 100% AWS Free-Tier Eligible Serverless

---

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [The Solution: KalaMitra](#the-solution-kalamitra)
3. [Architecture Overview](#architecture-overview)
4. [Mermaid Architecture Diagram](#mermaid-architecture-diagram)
5. [AWS Services and Rationale](#aws-services-and-rationale)
6. [How to Deploy](#how-to-deploy)
7. [How to Run Tests](#how-to-run-tests)
8. [Known Limitations](#known-limitations)
9. [Future Roadmap](#future-roadmap)

---

## Problem Statement

India is home to over 200 million traditional artisans, weavers, and village micro-entrepreneurs. They preserve centuries of living cultural heritage—from Patan Patola silk weaving and Channapatna toy making to Bastar Dhokra metalcraft and Madhubani paintings. 

However, grassroots artisans face systemic barriers in the digital economy:
1. **Digital & Language Divide**: Most artisans have low formal literacy and speak regional languages. English-dominated e-commerce seller portals feel intimidating and unusable.
2. **Poor Photography & Visual Presentation**: Without professional studio lighting or background editing skills, craft photos taken in cluttered workshop corners fail to inspire buyer confidence.
3. **Unfair Pricing & Middlemen Exploitation**: Lacking transparent market data, artisans frequently underprice their labor, failing to recover raw material costs and earning below minimum subsistence wages.
4. **Marketplace Onboarding Barriers**: Modern digital commerce channels (such as ONDC, GeM, and export marketplaces) require structured bilingual product catalogs, tags, materials, and care instructions that artisans cannot easily draft.

---

## The Solution: KalaMitra

**KalaMitra** ("Friend of Art") is a mobile-first, installable Progressive Web App (PWA) designed from first principles for low-literacy artisans:

- **Ultra-Minimal, Dignity-First UX**: Extra-large tap targets (≥44px), high contrast visuals, simple iconography, read-aloud voice support, and zero technical jargon.
- **9 Indian Languages Supported**: Native localization across Gujarati (`gu-IN`), Hindi (`hi-IN`), Marathi (`mr-IN`), Tamil (`ta-IN`), Bengali (`bn-IN`), Telugu (`te-IN`), Kannada (`kn-IN`), Punjabi (`pa-IN`), and English (`en-IN`).
- **Browser-Based AI Photo Studio**: Uses client-side `@imgly/background-removal` (WASM) to isolate handcrafted items, applies auto-contrast/lighting enhancements on canvas, composites onto studio backgrounds (White / Warm Cream / Rich Black), and provides an interactive Before/After comparison slider.
- **Amazon Rekognition Image Advisor**: Analyzes craft photo brightness, sharpness, and contrast to provide warm, plain-language lighting recommendations (e.g. *"Photo is dark: move near a window"*).
- **Voice-to-Catalog with Gemini AI**: Artisans tap a microphone and speak in their native tongue. The system transforms spoken dialect into professional, compelling bilingual (English & Hindi) e-commerce titles, storytelling descriptions, materials, and search tags.
- **Fair-Trade Pricing Assistant**: Evaluates raw material expenses, artisan hours worked, and seeded handicraft reference price ranges to calculate a dignity-wage price floor (benchmark ₹100/hr minimum) and recommended selling price.
- **Zero-Login Public Storefront**: Instant public shop page (`/#/shop/:shopId`) enabling direct buyer inquiries via an anti-bot protected form and one-click WhatsApp sharing.
- **ONDC / GeM CSV Export**: Downloads a standardized CSV catalog ready for bulk upload to enterprise and government marketplaces.

---

## Architecture Overview

KalaMitra is engineered as an entirely serverless, secure, cost-controlled cloud application deployed in `ap-southeast-2` (Sydney):

- **Frontend**: Single Page Application built with React, Vite, and Tailwind CSS. Packaged as a Progressive Web App (PWA) with offline service worker caching and deployed to **AWS Amplify Hosting**.
- **Security & Identity**: **Amazon Cognito User Pool** provides secure authentication. Protected API routes require a verified Cognito JWT `idToken`.
- **API Gateway**: **Amazon API Gateway HTTP API (v2)** provides sub-10ms routing with default burst (20) and rate (10 req/s) throttling.
- **Compute**: Nine discrete **AWS Lambda** functions (Python 3.12, 512MB RAM, 25s timeout) packaged with shared common utilities.
- **Storage & Databases**:
  - **Amazon S3** (`kalamitra-media`): Fully private bucket with Server-Side Encryption (AES256), strict CORS policy, and automatic 1-day lifecycle expiration for temporary uploads (`tmp/`).
  - **Amazon DynamoDB** (On-Demand): Four tables (`Products`, `Enquiries`, `Usage` with TTL, `ReferencePrices`).
- **Vision & AI Layer**:
  - **Amazon Rekognition**: Detects craft category labels and computes image quality metrics.
  - **Google Gemini 1.5 Flash API**: Invoked via urllib from Lambda through a provider-agnostic abstraction layer. Decrypted API keys are retrieved securely at runtime from **AWS Systems Manager Parameter Store** (`/kalamitra/gemini-key`).

---

## Mermaid Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Artisan & Buyer Clients (Mobile PWA)"]
        Browser["React 18 + Vite PWA\n(Offline SW + Web Speech API + WASM Studio)"]
    end

    subgraph AWSCloud["AWS Cloud (ap-southeast-2 Sydney)"]
        subgraph Edge["Hosting & Content Delivery"]
            Amplify["AWS Amplify Hosting\nGlobal CDN & HTTPS"]
        end

        subgraph Security["Identity & Secret Management"]
            Cognito["Amazon Cognito\nUser Pool & JWT Auth"]
            SSM["AWS SSM Parameter Store\n/kalamitra/gemini-key (SecureString)"]
        end

        subgraph API["API Management"]
            HttpApi["Amazon API Gateway (HTTP API v2)\nJWT Authorizer & Rate Throttling (10 rps / 20 burst)"]
        end

        subgraph ServerlessCompute["AWS Lambda Functions (Python 3.12)"]
            UploadUrlFn["UploadUrlFunction\n(Presigned S3 URLs)"]
            EnhanceFn["EnhanceFunction\n(Quality Tips & Category)"]
            CatalogFn["CatalogFunction\n(Bilingual Copywriting)"]
            PriceFn["PriceFunction\n(Fair-Wage Pricing)"]
            ProductsFn["ProductsFunction\n(Artisan Product CRUD)"]
            ShopFn["ShopFunction\n(Public Storefront Query)"]
            EnquiryFn["EnquiryFunction\n(Buyer Enquiry Capture)"]
            StatsFn["StatsFunction\n(Impact & Analytics)"]
            ExportFn["ExportFunction\n(ONDC / GeM CSV Export)"]
        end

        subgraph AWSVision["AWS Computer Vision"]
            Rekognition["Amazon Rekognition\nDetectLabels & ImageProperties"]
        end

        subgraph Persistence["Storage & Databases"]
            S3Bucket[("Amazon S3 Media Bucket\nPrivate + AES256 + 1-Day TTL")]
            DynamoProducts[("DynamoDB: Products\n(On-Demand)")]
            DynamoEnquiries[("DynamoDB: Enquiries\n(On-Demand)")]
            DynamoUsage[("DynamoDB: Usage\n(20 AI Limit / Day + TTL)")]
            DynamoRefPrices[("DynamoDB: ReferencePrices\n(Regional Craft Benchmarks)")]
        end
    end

    subgraph ExternalAI["External AI Services"]
        GeminiAPI["Google Gemini 1.5 Flash\n(Structured Bilingual JSON)"]
    end

    %% Client Interactions
    Browser -->|Static Assets| Amplify
    Browser -->|Authenticate| Cognito
    Browser -->|API Requests with JWT| HttpApi
    Browser -->|Direct Image Upload PUT| S3Bucket

    %% API Routing
    HttpApi -->|Auth Check| Cognito
    HttpApi -->|/upload-url| UploadUrlFn
    HttpApi -->|/enhance| EnhanceFn
    HttpApi -->|/catalog| CatalogFn
    HttpApi -->|/price| PriceFn
    HttpApi -->|/products| ProductsFn
    HttpApi -->|/shop/{id}| ShopFn
    HttpApi -->|/enquiry| EnquiryFn
    HttpApi -->|/stats| StatsFn
    HttpApi -->|/export.csv| ExportFn

    %% Lambda Operations
    UploadUrlFn -->|Generate Presigned PUT| S3Bucket
    EnhanceFn -->|Read Image| S3Bucket
    EnhanceFn -->|Analyze Quality| Rekognition
    EnhanceFn -->|Track Action Limit| DynamoUsage

    CatalogFn -->|Fetch Key| SSM
    CatalogFn -->|Generate Copy| GeminiAPI
    CatalogFn -->|Track Action Limit| DynamoUsage

    PriceFn -->|Read Benchmarks| DynamoRefPrices
    PriceFn -->|Fetch Key| SSM
    PriceFn -->|Pricing Tips| GeminiAPI
    PriceFn -->|Track Action Limit| DynamoUsage

    ProductsFn -->|Promote tmp to media| S3Bucket
    ProductsFn -->|Store Product| DynamoProducts

    ShopFn -->|Query Storefront| DynamoProducts
    ShopFn -->|Presigned Image GET| S3Bucket

    EnquiryFn -->|Store Lead| DynamoEnquiries
    StatsFn -->|Aggregate Metrics| DynamoProducts
    StatsFn -->|Aggregate Leads| DynamoEnquiries
    ExportFn -->|Read Catalog| DynamoProducts
```

---

## AWS Services and Rationale

| AWS Service | Architecture Purpose | Why Selected |
|---|---|---|
| **AWS Amplify Hosting** | Host and distribute the mobile-first React PWA | Provides automated HTTPS, fast global edge distribution, seamless SPA routing fallbacks, and zero server maintenance within the Free Tier. |
| **Amazon Cognito** | Artisan authentication & user management | Offloads secure user signup, password hashing, and ID token generation. Enables stateless JWT verification on API Gateway without database lookups on every request. |
| **Amazon API Gateway (HTTP API v2)** | Unified API front door with rate limiting | Built for serverless workloads. Offers significantly lower latency and 70% lower cost than REST APIs, with built-in JWT authorizers and native rate/burst throttling. |
| **AWS Lambda (Python 3.12)** | Event-driven backend compute | Executes business logic on demand with zero idle costs. 512MB RAM and 25s timeout balance fast cold-starts and responsive AI invocations. |
| **Amazon DynamoDB** | Operational data store & rate limit tracker | Fully managed NoSQL database with single-digit millisecond latency. On-demand billing means zero cost when idle. Atomic counters enforce the 20 AI actions/day limit, and DynamoDB TTL automatically cleans up expired limit records. |
| **Amazon S3** | Secure image asset storage | Industry standard for scalable object storage. Default bucket public access block ensures complete privacy; pre-signed URLs permit secure direct client uploads/downloads without routing image bytes through Lambda. |
| **Amazon Rekognition** | Computer vision for craft quality assessment | Native AWS managed vision service. Calculates objective image quality scores (brightness, sharpness, contrast) and identifies handicraft categories without requiring custom model training. |
| **AWS SSM Parameter Store** | Secure secret management | Standard-tier SecureString stores the Gemini API key encrypted under AWS KMS in Sydney (`ap-southeast-2`). Eliminates plain-text keys in code, templates, environment variables, or logs. |

---

## How to Deploy

### Prerequisites
1. **AWS CLI** configured with administrator credentials in region `ap-southeast-2`.
2. **AWS SAM CLI** installed (`sam --version` ≥ 1.100).
3. **Node.js** (v18+) and **Python** (3.11 or 3.12).
4. Store your Gemini API key in SSM Parameter Store:
   ```bash
   aws ssm put-parameter \
     --name "/kalamitra/gemini-key" \
     --type "SecureString" \
     --value "YOUR_GEMINI_API_KEY" \
     --region ap-southeast-2
   ```

### 1. Deploy Backend Infrastructure (SAM)
```bash
cd backend
sam build
sam deploy --config-file samconfig.toml
```

### 2. Seed Reference Prices and Demo Products
```bash
# Seed 25 Indian handicraft market price benchmarks
python backend/seed_reference_prices.py

# Seed 8 realistic artisan products with images for live demo
python backend/seed_demo_products.py --shop-id demo-artisan artisan-1
```

### 3. Build & Deploy Frontend (Amplify Hosting)
1. Ensure `frontend/.env` reflects your CloudFormation outputs:
   ```env
   VITE_MOCK=false
   VITE_API_URL=https://<api-id>.execute-api.ap-southeast-2.amazonaws.com
   VITE_USER_POOL_ID=ap-southeast-2_xxxxxxxxx
   VITE_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   VITE_MEDIA_BUCKET=kalamitra-mediabucket-xxxxxxxxx
   ```
2. Build production assets:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy to Amplify Hosting:
   Upload `frontend/dist.zip` via the AWS Amplify Console ("Deploy without Git") or use the AWS CLI deployment flow:
   ```bash
   # Create Amplify deployment
   aws amplify create-deployment --app-id <app-id> --branch-name <branch> --region ap-southeast-2
   # Upload zip via PUT
   curl.exe -X PUT -T frontend/dist.zip "<zipUploadUrl>"
   # Start deployment
   aws amplify start-deployment --app-id <app-id> --branch-name <branch> --job-id <job-id> --region ap-southeast-2
   ```

---

## How to Run Tests

### Backend Unit Tests (46 Tests)
Run the test suite using `pytest`:
```bash
python -m pytest backend/tests -v
```
**Test Coverage Includes:**
- **HTTP Utilities**: JSON serialization, Decimal encoding, CORS headers, error response formats.
- **Cost & Safety Limits**: 20 AI actions/day counter logic, DynamoDB conditional update checks, 429 rate limit enforcement, and server-side 5MB payload rejection.
- **AI Abstraction Layer**: Gemini REST API urllib invocation, exponential backoff retries, JSON response cleanup, and friendly failure handling.
- **Lambda Functions**: Mocked end-to-end tests for all 9 Lambda endpoints with valid and invalid JWT contexts.

### Frontend Verification
```bash
cd frontend
npm run build
```
Verify that the build completes with zero errors and generates optimized production bundles.

---

## Known Limitations

1. **No Live Commodity Market Price Feed**: Raw material prices (e.g. pure silver, silk yarn, brass) fluctuate daily. In this prototype, reference prices are seeded indicative benchmarks derived from regional handicraft guild surveys.
2. **Indicative Fair Price Guidance**: Recommended prices are mathematical guidance based on ₹100/hr minimum wage floor + material costs; they are not legally binding market guarantees.
3. **Browser-Dependent Speech Recognition**: Voice input utilizes the browser's standard Web Speech API (`webkitSpeechRecognition`). In environments where Web Speech is restricted (e.g. certain desktop browsers without microphone access), a fluid typing fallback is seamlessly provided.
4. **Gemini API Layer for Generative AI**: Google Gemini 1.5 Flash was integrated via an abstraction layer because Bedrock daily token quotas were zero on the newly provisioned AWS hackathon account. The architecture is modular and ready to switch to Bedrock Converse API when quotas are enabled.

---

## Future Roadmap

1. **Phone-Number & WhatsApp OTP Login**: Replace email/password authentication with phone OTP (via Amazon SNS or WhatsApp Cloud API) to make access frictionless for low-literacy rural artisans.
2. **Direct ONDC & GeM Network Integration**: Implement the Beckn protocol to publish artisan product catalogs directly to live ONDC buyer apps (Paytm, Mystore, Magicpin) and the Government e-Marketplace (GeM).
3. **Offline-First Synchronization**: Extend the service worker with IndexedDB to queue product creations and photo uploads when artisans are working in remote craft clusters with intermittent cellular connectivity.
4. **Conversational WhatsApp Bot**: Allow artisans to send a craft photo and a 30-second voice note directly to an official WhatsApp number, with AWS Lambda automatically returning their live storefront link.
