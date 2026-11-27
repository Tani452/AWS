# KalaMitra Production Deployment Guide

This guide provides step-by-step instructions to deploy the **KalaMitra** PWA frontend to AWS. All backend infrastructure is deployed via AWS SAM in region `ap-southeast-2` (Sydney).

---

## Prerequisites

1. The backend SAM stack `kalamitra` is deployed in `ap-southeast-2`.
2. `frontend/.env` is configured with real AWS resource IDs (`VITE_MOCK=false`).
3. `frontend/dist.zip` is created.

---

## Option A: AWS Amplify Hosting (Deploy Without Git - Recommended)

AWS Amplify Hosting provides instant global CDN distribution, automatic HTTPS, and SPA routing rewrites.

### Step 1: Open AWS Amplify Console
1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/).
2. In the top search bar, type **Amplify** and select **AWS Amplify**.
3. Verify that your console is set to your preferred region (e.g. `ap-southeast-2` or global Amplify console).

### Step 2: Create a New Amplify App
1. Click **Create new app** (or **Deploy an app**).
2. Under "Start with an existing app" / "Deploy your app", select **Deploy without Git**.
3. Click **Next**.

### Step 3: Configure App and Upload `dist.zip`
1. **App name**: Enter `kalamitra`.
2. **Environment name**: Enter `production` (or `main` / `staging`).
3. **Method**: Select **Drag and drop** (or **Zip**).
4. Drag and drop `frontend/dist.zip` (located in `c:\Users\Tanishq\Downloads\kalamitra\frontend\dist.zip`) into the upload dropzone, or click **Browse** and select `dist.zip`.
   > [!NOTE]
   > `frontend/dist.zip` has been packaged with POSIX-standard forward-slash directory paths (`assets/...`) so Amplify and S3 extract nested asset directories cleanly.
5. Click **Save and deploy**.

> [!TIP]
> **CLI Alternative for 1-step deployment:**
> ```bash
> # 1. Create deployment to obtain signed upload URL and Job ID
> aws amplify create-deployment --app-id <app-id> --branch-name <branch> --region ap-southeast-2
> # 2. Upload zip via PUT (curl or python)
> curl.exe -X PUT -T frontend/dist.zip "<zipUploadUrl>"
> # 3. Trigger deployment
> aws amplify start-deployment --app-id <app-id> --branch-name <branch> --job-id <job-id> --region ap-southeast-2
> ```

### Step 4: Configure SPA Rewrites and Redirects (Crucial for `/shop/:shopId`)
Because KalaMitra is a Single Page Application (SPA), direct browser navigation or refreshing on deep routes must serve `index.html` with HTTP 200 rather than throwing a 404.

1. In the Amplify left navigation menu, click **Rewrites and redirects** (under **Hosting**).
2. Click **Manage rewrites and redirects**.
3. Replace the contents of the JSON editor with the official Amplify SPA rule:
```json
[
  {
    "source": "/<*>",
    "target": "/index.html",
    "status": "404-200"
  }
]
```
*(Alternatively, if using regex matching, remember that JSON requires escaping backslashes as `\\.`)*:
```json
[
  {
    "source": "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|wasm)$)([^.]+$)/>",
    "target": "/index.html",
    "status": "200"
  }
]
```
4. Click **Save**.

### Step 5: Test the Live URL
1. Amplify will generate a default public domain (e.g., `https://production.dxxxxxxxx.amplifyapp.com`).
2. Click the link to open KalaMitra on desktop and mobile.
3. Test direct access to your public storefront: `https://<amplify-domain>/#/shop/<your-artisan-id>`.

---

## Option B: Fallback - S3 Static Website + CloudFront CDN

If Amplify Hosting is unavailable or if you prefer direct S3 + CloudFront hosting:

### Step 1: Create the S3 Website Bucket
1. Open the [Amazon S3 Console](https://console.aws.amazon.com/s3/).
2. Click **Create bucket**.
   - **Bucket name**: `kalamitra-frontend-036999274284` (must be globally unique).
   - **AWS Region**: `ap-southeast-2` (Sydney).
   - **Object Ownership**: ACLs disabled (recommended).
   - **Block Public Access**:
     - *If using CloudFront OAC (recommended)*: Keep "Block all public access" **checked**.
     - *If using direct S3 website hosting*: Uncheck "Block all public access" and acknowledge the warning.
3. Click **Create bucket**.

### Step 2: Upload Frontend Assets to S3
1. Extract `dist.zip` or open the `frontend/dist/` directory.
2. In the S3 Console, open your bucket and click **Upload**.
3. Select all files and folders inside `frontend/dist/` (`index.html`, `manifest.json`, `sw.js`, `icon.svg`, and the `assets/` directory).
4. Click **Upload**.

### Step 3: Create CloudFront Distribution with SPA Error Rewrite
1. Open the [CloudFront Console](https://console.aws.amazon.com/cloudfront/).
2. Click **Create distribution**.
3. **Origin domain**: Select your S3 bucket (`kalamitra-frontend-036999274284.s3.ap-southeast-2.amazonaws.com`).
4. **Origin access**: Select **Origin access control settings (recommended)** and click **Create control setting** with default settings.
5. **Default cache behavior**:
   - **Viewer protocol policy**: Redirect HTTP to HTTPS.
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS.
6. **Default root object**: Enter `index.html`.
7. Click **Create distribution**.
8. Copy the recommended S3 bucket policy prompted by CloudFront, navigate to your S3 bucket > **Permissions** > **Bucket policy**, and paste it so CloudFront can read S3 objects.

### Step 4: Configure SPA Custom Error Response in CloudFront
1. In your CloudFront distribution details, click the **Error pages** tab.
2. Click **Create custom error response**.
   - **HTTP error code**: `403: Forbidden`.
   - **Customize error response**: Yes.
   - **Response page path**: `/index.html`.
   - **HTTP response code**: `200: OK`.
   - Click **Create custom error response**.
3. Repeat the same for `404: Not Found`:
   - **HTTP error code**: `404: Not Found`.
   - **Customize error response**: Yes.
   - **Response page path**: `/index.html`.
   - **HTTP response code**: `200: OK`.
   - Click **Create custom error response**.

---

## Verifying Frontend Deployment

1. Open your deployed Amplify or CloudFront URL.
2. Verify that the language picker allows switching between English, Hindi, Gujarati, Marathi, Tamil, Bengali, Telugu, Kannada, and Punjabi.
3. Verify that the PWA install prompt is functional.
4. Verify that `/shop/:shopId` is accessible directly without login.
