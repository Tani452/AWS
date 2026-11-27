# KalaMitra (कला मित्र) — Build Summary & Architecture
> **AWS "Campus to Cloud" Hackathon Technical Documentation**  
> *Region: Strictly `ap-southeast-2` (Sydney)*  
> *Architecture: 100% Serverless, Free-Tier Eligible, Mobile-First PWA*

---

## 1. AWS Services Used & Rationale

Every AWS service in KalaMitra was intentionally selected to satisfy three strict hackathon constraints: **100% AWS Free Plan eligibility**, **zero maintenance serverless operations**, and **sub-second mobile latency for rural 4G connections**.

| AWS Service | Role in KalaMitra | Why We Chose It (Architectural Rationale) |
| :--- | :--- | :--- |
| **AWS Amplify Hosting** | Static PWA Web Hosting & Edge CDN | Delivers sub-100ms global static asset delivery for React/Vite. Native support for SPA hash routing, HTTP-to-HTTPS redirects, and zero-downtime atomic deployments directly via AWS CLI. |
| **Amazon Cognito** | Artisan Identity & Authentication | Provides secure user signup, login, and token issuance (JWT) with zero backend user management code. Integrates natively with API Gateway HTTP API for declarative token validation. |
| **Amazon API Gateway (HTTP API v2)** | Serverless REST API Gateway | 70% cheaper and lower latency than REST APIs. Provides native JWT authorizers connected to Cognito, granular path routing, CORS headers, and built-in throttling (burst 20, rate 10 req/s) to protect serverless backends from runaway costs. |
| **AWS Lambda (Python 3.12)** | Serverless Compute Microservices | Pure serverless compute with zero idle cost. 9 single-responsibility microservices with least-privilege IAM roles: `UploadUrlFunction`, `EnhanceFunction`, `CatalogFunction`, `PriceFunction`, `ProductsFunction`, `ShopFunction`, `EnquiryFunction`, `ExportFunction`, and `StatsFunction`. |
| **Amazon DynamoDB** | On-Demand NoSQL Database | True serverless database with Pay-Per-Request on-demand billing. Provides sub-10ms point lookups and composite key queries across 4 discrete tables: `ProductsTable`, `ReferencePricesTable`, `UsageTable`, and `EnquiriesTable`. |
| **Amazon S3** | Encrypted Media Object Storage | Private bucket with block public access enabled. Presigned PUT URLs enable client-to-S3 direct uploads without choking Lambda memory. Automated 1-day lifecycle expiration rule cleans up temporary staging images in `tmp/`. |
| **Amazon Rekognition** | Visual Craft Feature Detection | Serverless computer vision via `DetectLabels`. Analyzes craft textures, materials, and artisan categories (e.g., "pottery", "textile", "woodwork") directly from S3 objects to ground downstream AI generation. |
| **AWS Systems Manager (SSM) Parameter Store** | Secure Secret Management | Standard tier `SecureString` parameter at `/kalamitra/gemini-key`. Free tier eligible (unlike AWS Secrets Manager), keeping all API credentials completely decoupled from git, templates, and client-side code. |
| **External Google Gemini API (Free Tier)** | Multimodal Generative LLM | Provider-agnostic serverless LLM layer invoked solely from Lambda for bilingual cultural storytelling, dual-language translation (English + Hindi), and structured price recommendations. |

---

## 2. What We Deliberately Did NOT Use and Why

Honesty and real-world engineering constraints guided what we chose **not** to include:

1. **Amazon Bedrock**:
   - **Constraint**: On our AWS hackathon account, Bedrock was blocked with a **zero daily token quota** on all foundation models.
   - **Architectural Reality**: We designed our Lambda AI integration with a provider-agnostic interface (`backend/src/common/ai.py`). While an optional, dormant Bedrock adapter structure exists in code for enterprise portability, **no production requests depend on Bedrock**. All live hackathon inference routes safely through the free Gemini API.
2. **Amazon Nova Canvas / Server-Side Image Generation**:
   - **Constraint**: Nova Canvas is retired / end-of-life, and server-side GPU instances (EC2/SageMaker) incur high costs and cold-start latency unsuitable for rural PWAs.
   - **Architectural Solution**: KalaMitra performs **zero server-side image generation**. Background removal runs entirely **client-side in the artisan's browser** via `@imgly/background-removal` using WebAssembly and WebGPU. This achieves instant visual feedback on mobile devices at **₹0 server cost**.
3. **Amazon Transcribe & Amazon Translate**:
   - **Constraint**: Incur continuous per-second and per-character fees outside the Free Plan limit and introduce multi-second round-trip latency on mobile networks.
   - **Architectural Solution**: Voice-to-text is handled natively on-device by the browser's **Web Speech API** (`SpeechRecognition`), dynamically configured with native BCP-47 locale tags (`gu-IN`, `hi-IN`, `mr-IN`, `ta-IN`, `bn-IN`, `te-IN`, `kn-IN`, `pa-IN`, `en-IN`). Translation and cultural localization are performed in a single consolidated prompt pass by the serverless LLM, eliminating redundant network hops.
4. **AWS Secrets Manager, NAT Gateways, RDS & VPCs**:
   - **Constraint**: AWS NAT Gateways (~$32/month) and RDS instances incur significant fixed hourly costs that violate Free Plan hackathon guidelines.
   - **Architectural Solution**: Lambdas operate securely **outside a VPC**, connecting over encrypted AWS service endpoints to DynamoDB, S3, and SSM, while secrets are stored free of charge in SSM Parameter Store Standard Tier.

---

## 3. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Artisan & Buyer Device (PWA)"]
        UI["React + Vite PWA\n(Tailwind CSS)"]
        Speech["Browser Web Speech API\n(BCP-47 Voice Input)"]
        WASM["@imgly WebAssembly\n(In-Browser Cutout)"]
    end

    subgraph Edge["AWS Global Edge Infrastructure"]
        Amplify["AWS Amplify Hosting\n(Global CDN & Static S3)"]
    end

    subgraph Auth["Identity & Access"]
        Cognito["Amazon Cognito User Pool\n(JWT Tokens)"]
    end

    subgraph API["API & Ingress Layer (ap-southeast-2)"]
        HttpApi["Amazon API Gateway HTTP API v2\n(JWT Authorizer + Rate Throttling)"]
    end

    subgraph Compute["Serverless Microservices (AWS Lambda - Python 3.12)"]
        FnUpload["UploadUrlFunction"]
        FnEnhance["EnhanceFunction"]
        FnCatalog["CatalogFunction"]
        FnPrice["PriceFunction"]
        FnProducts["ProductsFunction"]
        FnShop["ShopFunction (Public)"]
        FnEnquiry["EnquiryFunction (Public)"]
        FnExport["ExportFunction"]
        FnStats["StatsFunction"]
    end

    subgraph Storage["Persistent Storage & AI Services"]
        S3["Amazon S3 Media Bucket\n(tmp/ with 1-Day Lifecycle | media/)"]
        Rekog["Amazon Rekognition\n(DetectLabels Visual Tagging)"]
        DDB_Prod[("DynamoDB: ProductsTable")]
        DDB_Ref[("DynamoDB: ReferencePricesTable")]
        DDB_Usage[("DynamoDB: UsageTable (Rate Limits)")]
        DDB_Enq[("DynamoDB: EnquiriesTable")]
        SSM["AWS SSM Parameter Store\n(SecureString: Gemini API Key)"]
    end

    subgraph External["External AI Provider"]
        Gemini["Google Gemini API\n(Multimodal & Bilingual Catalog)"]
    end

    %% Connections
    UI -.->|Static Assets| Amplify
    UI -->|Authenticate| Cognito
    UI -->|API Requests with Bearer JWT| HttpApi
    HttpApi -->|Validate Token| Cognito

    HttpApi -->|POST /upload-url| FnUpload
    HttpApi -->|POST /enhance| FnEnhance
    HttpApi -->|POST /catalog| FnCatalog
    HttpApi -->|POST /price| FnPrice
    HttpApi -->|GET,POST,DEL /products| FnProducts
    HttpApi -->|GET /shop/{shopId}| FnShop
    HttpApi -->|POST /enquiry| FnEnquiry
    HttpApi -->|GET /export/csv| FnExport
    HttpApi -->|GET /stats| FnStats

    FnUpload -->|Generate Presigned PUT| S3
    UI -->|Direct Upload Image| S3
    FnEnhance -->|Read S3 Object| S3
    FnEnhance -->|Detect Labels| Rekog
    FnCatalog -->|Fetch Key| SSM
    FnCatalog -->|Generate Listing| Gemini
    FnPrice -->|Lookup Benchmarks| DDB_Ref
    FnProducts -->|Persist Metadata| DDB_Prod
    FnProducts -->|Move tmp/ to media/| S3
    FnShop -->|Query Artisan Items| DDB_Prod
    FnShop -->|Presigned GET URLs| S3
    FnEnquiry -->|Store Buyer Inquiry| DDB_Enq
    FnUpload & FnEnhance & FnCatalog & FnPrice -->|Track Daily Limit| DDB_Usage
```

---

## 4. End-to-End Data Flow: "Add Product" Pipeline

```
[ Artisan Phone ]
  1. Capture photo -> Client resize (max 1600px JPEG)
  2. POST /upload-url -> Returns Presigned S3 PUT URL for tmp/<userId>/<uuid>.jpg
  3. Direct PUT from Browser to Amazon S3 tmp/ (Bypasses API Gateway & Lambda memory)
  4. In-Browser background removal runs via WebAssembly/Canvas (Zero server GPU)
  5. POST /enhance -> Rekognition inspects S3 image -> returns detected tags (e.g. "Textile", "Embroidery")
  6. Artisan taps mic -> Speaks in mother tongue (e.g., Gujarati) -> Web Speech API transcribes
  7. POST /catalog -> Lambda fetches SSM key -> calls Gemini -> returns English + Hindi listing
  8. POST /price -> Lambda checks material + labor + DynamoDB ReferencePrices -> returns floor & price band
  9. POST /products -> Lambda saves item in ProductsTable & atomically moves S3 asset from tmp/ to media/
  10. Product is immediately visible on Public Storefront /shop/<shopId> with WhatsApp order button
```

---

## 5. Security & Cost Protection Controls

KalaMitra implements enterprise-grade defense-in-depth across the entire stack:

| Security & Cost Control | Technical Implementation | Threat / Hazard Mitigated |
| :--- | :--- | :--- |
| **Declarative JWT Authorizer** | API Gateway HTTP API natively validates Cognito JWT signature, issuer, and audience before invoking any private Lambda. | Rejects unauthorized requests at edge; zero Lambda execution cost on invalid requests. |
| **Least-Privilege IAM Roles** | Each of the 9 Lambda functions has a distinct IAM role scoped strictly to required ARNs (e.g., `ShopFunction` only has `dynamodb:Query` on `ProductsTable` and `s3:GetObject` on `MediaBucket/*`). | Limits blast radius if any single microservice is compromised. |
| **Strict AI Daily Quota (Cost Cap)** | DynamoDB atomic counter in `UsageTable` tracks daily AI requests per artisan (`MAX_AI_ACTIONS_PER_DAY = 20`). | Prevents runaway LLM API consumption or billing surprises. |
| **Server-Side Payload Hardening** | `UploadUrlFunction` enforces 5MB maximum file size; Lambda rejects oversized payloads with HTTP 400. | Protects S3 storage capacity and prevents denial-of-wallet attacks. |
| **Client-Side Image Preprocessing** | Mobile HTML5 Canvas resizes all photos to max 1600px JPEG before upload. | Minimizes cellular data usage for rural artisans and accelerates processing. |
| **Private S3 & S3 Lifecycle Rule** | S3 bucket has Public Access Blocked. Images are accessed solely via temporary time-limited presigned URLs (1-hour expiry). `tmp/` objects expire after 1 day. | Prevents data exfiltration and automatically cleans up abandoned staging images. |
| **Anti-Bot Spam Protection** | Public `/enquiry` endpoint incorporates hidden Honeypot fields (`website`) that silently drop automated spambots. | Protects artisan inboxes and DynamoDB capacity from spam abuse. |
| **Credential Isolation** | Gemini API key resides solely in AWS SSM Parameter Store as a `SecureString` Standard Tier parameter. | Never exposed in code, git commits, SAM templates, environment variables, or frontend bundles. |

---

## 6. Key Decisions and Trade-offs

1. **Client-Side vs. Server-Side Background Removal**:
   - *Decision*: Adopted `@imgly/background-removal` running in-browser via WebAssembly and WebGPU.
   - *Trade-off*: Adds ~15–20 seconds on older budget phones during cutout, but eliminates expensive server GPUs, eliminates server cold-starts, and guarantees 100% Free Tier sustainability.
2. **Browser Web Speech API vs. Amazon Transcribe**:
   - *Decision*: Native browser speech recognition with BCP-47 locale switching.
   - *Trade-off*: Requires Chromium-based browser (Chrome/Edge/Brave) or Safari and an active network connection, but provides instant real-time transcription with zero API cost and native regional dialect support.
3. **Single S3 Bucket with Lifecycle Separation**:
   - *Decision*: Staging uploads to `tmp/<userId>/` and finalized catalog images to `media/<userId>/`.
   - *Trade-off*: Requires an S3 copy operation upon product save, but allows S3 automated lifecycle rules to continuously purge abandoned draft photos without manual cron workers.

---

## 7. Development Process & Quality Assurance

- **Test-Driven Reliability**: 46 automated unit tests (`backend/tests`) verifying payload validation, rate-limiting counters, AI error fallbacks, and deterministic price formulas.
- **Graceful Failure Fallbacks**: If external AI calls timeout or face rate limits, KalaMitra catches the exception and returns a pre-computed fallback listing and deterministic price floor (`Material + Labor @ ₹100/hr + 35% margin`), ensuring the app never crashes during live demonstrations.
- **HashRouter PWA Architecture**: Configured with React Router `HashRouter` to prevent 404 navigation conflicts on static edge hosting platforms without requiring complex server-side rewrite rules.
