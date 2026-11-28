import json
import os
import subprocess
import time
import urllib.request
import zipfile

DIST_DIR = os.path.abspath('frontend/dist')
ZIP_PATH = os.path.abspath('frontend/dist.zip')
APP_ID = 'd7fvd9ozmbri0'
BRANCH = 'staging'
REGION = 'ap-southeast-2'

print(f"Creating zip from {DIST_DIR}...")
if os.path.exists(ZIP_PATH):
    os.remove(ZIP_PATH)

file_count = 0
with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, DIST_DIR).replace('\\', '/')
            zipf.write(full_path, rel_path)
            file_count += 1

print(f"Zip created with {file_count} files at {ZIP_PATH} ({os.path.getsize(ZIP_PATH)} bytes)")

# 1. Create deployment
print(f"Creating Amplify deployment for app {APP_ID}, branch {BRANCH}...")
res = subprocess.run([
    'aws', 'amplify', 'create-deployment',
    '--app-id', APP_ID,
    '--branch-name', BRANCH,
    '--region', REGION,
    '--output', 'json'
], capture_output=True, text=True, check=True)

dep_data = json.loads(res.stdout)
job_id = dep_data['jobId']
upload_url = dep_data['zipUploadUrl']
print(f"Created deployment JobId: {job_id}")

# 2. Upload zip
print("Uploading zip payload to S3 presigned URL...")
with open(ZIP_PATH, 'rb') as f:
    zip_bytes = f.read()

req = urllib.request.Request(upload_url, data=zip_bytes, method='PUT')
req.add_header('Content-Type', 'application/zip')
with urllib.request.urlopen(req) as resp:
    print(f"Uploaded zip (HTTP {resp.status})")

# 3. Start deployment
print("Starting Amplify deployment...")
start_res = subprocess.run([
    'aws', 'amplify', 'start-deployment',
    '--app-id', APP_ID,
    '--branch-name', BRANCH,
    '--job-id', job_id,
    '--region', REGION,
    '--output', 'json'
], capture_output=True, text=True, check=True)
start_data = json.loads(start_res.stdout)
status = start_data['jobSummary']['status']
print(f"Deployment started with status: {status}")

# 4. Wait for completion
print("Waiting for deployment to complete...")
for i in range(20):
    time.sleep(5)
    job_res = subprocess.run([
        'aws', 'amplify', 'get-job',
        '--app-id', APP_ID,
        '--branch-name', BRANCH,
        '--job-id', job_id,
        '--region', REGION,
        '--output', 'json'
    ], capture_output=True, text=True, check=True)
    job_info = json.loads(job_res.stdout)
    current_status = job_info['job']['summary']['status']
    print(f"[{i*5+5}s] Deployment status: {current_status}")
    if current_status in ('SUCCEED', 'FAILED', 'CANCELLED'):
        break

if current_status == 'SUCCEED':
    print(f"\n🎉 Amplify Deployment Job #{job_id} SUCCEEDED!")
    print(f"Live URL: https://staging.{APP_ID}.amplifyapp.com")
else:
    print(f"\n⚠️ Deployment ended with status: {current_status}")
