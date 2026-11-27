# KalaMitra (कला मित्र) — Submission Checklist & Google Drive Contents
> **AWS "Campus to Cloud" Hackathon Final Submission Package**  
> *Project Name: KalaMitra (कला मित्र)*  
> *Track: Bharat Impact & Cloud Innovation*

---

## 1. Project URLs & Identifiers

| Item | Details / Value | Status |
| :--- | :--- | :--- |
| **Live PWA URL** | `https://staging.d7fvd9ozmbri0.amplifyapp.com` | Verified Live & Deployed |
| **Public Storefront Demo URL** | `https://staging.d7fvd9ozmbri0.amplifyapp.com/#/shop/demo-artisan` | Verified Live (8 Seeded Products) |
| **AWS Region** | `ap-southeast-2` (Sydney) | Confirmed Across All Services |
| **CloudFormation Stack Name** | `kalamitra` | Confirmed `UPDATE_COMPLETE` |
| **API Gateway Endpoint** | `https://8k0jeaua1l.execute-api.ap-southeast-2.amazonaws.com` | Confirmed Live & Verified |
| **Amplify App ID & Branch** | App ID: `d7fvd9ozmbri0`, Branch: `staging` | Confirmed `SUCCEED` (Job 6) |
| **Cognito User Pool ID** | `ap-southeast-2_vfpfS1f9W` | Confirmed |
| **Cognito App Client ID** | `4fcfgssps8bbgkoqsbt2bsbb8p` | Confirmed |
| **Video Demonstration Link** | `[TODO: Paste YouTube / Google Drive public video link here]` | Pending Video Upload |
| **Project GitHub / Code Link** | `[TODO: Paste GitHub repository link if required by submission portal]` | Pending User Submission |

---

## 2. Google Drive Submission Folder Structure

When packaging your submission folder in Google Drive, organize the files exactly as follows:

```
📁 KalaMitra_AWS_Hackathon_Submission/
│
├── 📄 01_IDEA_BRIEF.pdf                   <- Export of docs/IDEA_BRIEF.md
├── 📄 02_BUILD_SUMMARY.pdf                <- Export of docs/BUILD_SUMMARY.md
├── 📄 03_DEMO_SCRIPT.pdf                  <- Export of docs/DEMO_SCRIPT.md
├── 📄 04_ARCHITECTURE_DIAGRAM.png         <- High-res export of Mermaid architecture
│
├── 🎥 05_DEMO_VIDEO.mp4                   <- 2:40 screen recording matching DEMO_SCRIPT.md
│
├── 📁 06_Source_Code/
│   ├── 📁 backend/                        <- SAM template, Python Lambda microservices, tests
│   │   ├── template.yaml
│   │   ├── samconfig.toml
│   │   ├── src/
│   │   └── tests/
│   ├── 📁 frontend/                       <- React + Vite PWA source code
│   │   ├── src/
│   │   ├── public/ (manifest.json, sw.js)
│   │   ├── package.json
│   │   └── tailwind.config.js
│   └── 📄 README.md                       <- Comprehensive project documentation
│
└── 📁 07_Screenshots/
    ├── 01_welcome_screen.png
    ├── 02_photo_upload_cutout.png
    ├── 03_gujarati_voice_catalog.png
    ├── 04_price_assistant.png
    ├── 05_my_shop_dashboard.png
    └── 06_public_storefront_enquiry.png
```

---

## 3. Step-by-Step Submission Checklist for Submitter

### Phase A: Video Recording & Polish
- [ ] **Record 2:40 Video**: Record the screen walkthrough following [docs/DEMO_SCRIPT.md](file:///c:/Users/Tanishq/Downloads/kalamitra/docs/DEMO_SCRIPT.md).
  - Voice-over follows the timestamped script (0:00 to 2:40).
  - Show the live public shop at `#/shop/demo-artisan` and demonstrate mousewheel scrolling and craft images.
  - Show Gujarati voice input and bilingual English + Hindi generation.
- [ ] **Export Video**: Render as `KalaMitra_Demo.mp4` (1080p, 16:9, H.264).
- [ ] **Upload Video**: Upload to YouTube (Unlisted) or Google Drive (Ensure "Anyone with the link can view" permission is enabled).
- [ ] **Fill In Link**: Update `[TODO: Paste YouTube / Google Drive public video link here]` above and in the submission form.

### Phase B: PDF Document Generation
- [ ] **Convert Markdown to PDF**:
  - Open [docs/IDEA_BRIEF.md](file:///c:/Users/Tanishq/Downloads/kalamitra/docs/IDEA_BRIEF.md) in your editor/browser and export to PDF.
  - Open [docs/BUILD_SUMMARY.md](file:///c:/Users/Tanishq/Downloads/kalamitra/docs/BUILD_SUMMARY.md) and export to PDF.
  - Open [docs/DEMO_SCRIPT.md](file:///c:/Users/Tanishq/Downloads/kalamitra/docs/DEMO_SCRIPT.md) and export to PDF.
- [ ] **Verify PDF Formatting**: Confirm tables, code blocks, and diagrams render cleanly.

### Phase C: Cloud Verification & Live Checks
- [ ] **Live Public Storefront**:
  - Visit: `https://staging.d7fvd9ozmbri0.amplifyapp.com/#/shop/demo-artisan`
  - Verify all 8 craft photos load cleanly.
  - Verify mousewheel scrolling works smoothly.
  - Verify "Send Inquiry" form successfully submits an enquiry.
- [ ] **Artisan Login & Add Product**:
  - Sign in with test artisan credentials:
    - Email: `demo@kalamitra.local`
    - Password: `[TODO: Set or use demo credentials]` (or sign up a new test account).
  - Walk through Photo -> Background removal -> Voice description -> AI Catalog -> Price -> Save.
- [ ] **Backend Unit Tests**:
  - Run `python -m pytest backend/tests` (Confirm 46/46 tests pass).

### Phase D: Final Submission Portal Entry
- [ ] **Track Name**: Bharat Impact & Cloud Innovation
- [ ] **Project Name**: KalaMitra (कला मित्र)
- [ ] **Tagline**: AI-Powered Virtual Business Manager for Bharat Artisans, Weavers & Micro-Entrepreneurs
- [ ] **Live URL**: `https://staging.d7fvd9ozmbri0.amplifyapp.com`
- [ ] **GitHub / Codebase**: Uploaded zip or repository link
- [ ] **Video URL**: Verified public / unlisted view permissions
- [ ] **Judges Access Note**:
  > *"Judges can directly view the public artisan storefront with 8 authentic craft products without logging in at: https://staging.d7fvd9ozmbri0.amplifyapp.com/#/shop/demo-artisan"*
