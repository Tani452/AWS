# KalaMitra (कलामित्र)

> **AI Virtual Business Manager for Bharat Artisans, Weavers, and Micro-Entrepreneurs**  
> Built for the AWS "Campus to Cloud" Hackathon.

## Overview
KalaMitra empowers grassroots Indian artisans—many with low formal literacy—to digitize their craftsmanship into professional, bilingual (English & Hindi) e-commerce catalogs. With voice-first multilingual interaction, client-side background removal, Rekognition-driven visual enhancement, and AI-guided fair pricing, KalaMitra bridges the digital divide for Bharat micro-enterprises.

## Core Features
1. **Low-Literacy First UX**: Big buttons, intuitive iconography, high contrast, step-by-step wizard, zero jargon.
2. **Multilingual Voice-First**: Web Speech API supporting 9 Indian locales (`gu-IN`, `hi-IN`, `mr-IN`, `ta-IN`, `bn-IN`, `te-IN`, `kn-IN`, `pa-IN`, `en-IN`) with typing fallback.
3. **Browser-Based Photo Studio**: Client-side background removal (`@imgly/background-removal`), image resizing to max 1600px, and direct presigned S3 uploads.
4. **AI Catalog Generation**: Automated bilingual title, description, materials, and care instructions via Gemini API (stored securely in AWS SSM Parameter Store).
5. **Fair Price Assistant**: Reference pricing from regional handicraft benchmarks combined with AI market positioning.
6. **Public Storefront & Enquiries**: Instant shareable shop at `/shop/<shopId>` with direct buyer enquiry capture.
7. **B2B / ONDC / GeM CSV Export**: One-click standardized catalog export for onboarding onto government and enterprise marketplaces.

## Architecture
- **Cloud Provider**: AWS Free Tier eligible architecture in **`ap-southeast-2` (Sydney)**.
- **Backend**: AWS SAM with Python 3.12 Lambdas (512MB, 25s timeout), HTTP API Gateway with Cognito JWT Authorizer.
- **Storage & Database**: Amazon S3 (private with CORS & lifecycle cleanup), Amazon DynamoDB (on-demand: Products, Enquiries, Usage with TTL, ReferencePrices).
- **Frontend**: React + Vite + Tailwind CSS mobile-first Progressive Web App (PWA).
- **Security & Cost Guardrails**: SSM Parameter Store for secrets, max 20 AI actions/user/day, 5MB server-side payload cap, no base64 payloads through API Gateway.
