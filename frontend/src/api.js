/**
 * KalaMitra API Client with Cognito ID Token Injection, Error Handling, and Offline/Mock Mode.
 */
import { Amplify } from 'aws-amplify';
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';

const isMock = import.meta.env.VITE_MOCK === 'true' || !import.meta.env.VITE_USER_POOL_ID;
export { isMock };
const API_URL = import.meta.env.VITE_API_URL || '';

// Configure AWS Amplify in real backend mode
if (!isMock && import.meta.env.VITE_USER_POOL_ID) {
  try {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: import.meta.env.VITE_USER_POOL_ID,
          userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
          loginWith: { email: true },
        },
      },
    });
  } catch (err) {
    console.warn('Amplify config notice:', err);
  }
}

// =============================================================================
// REALISTIC MOCK STORAGE FOR TESTING BEFORE BACKEND DEPLOYMENT
// =============================================================================
const MOCK_STORAGE_KEY_PRODUCTS = 'kalamitra_mock_products';
const MOCK_STORAGE_KEY_USER = 'kalamitra_mock_user';

const INITIAL_MOCK_PRODUCTS = [
  {
    productId: 'prod-001',
    ownerId: 'mock-artisan-101',
    shopId: 'mock-artisan-101',
    title_en: 'Handcrafted Patola Silk Saree',
    title_hi: 'हस्तनिर्मित पाटोला सिल्क साड़ी',
    description_en: 'Woven with pure natural mulberry silk and geometric double ikat heritage patterns. Takes over 25 days of dedicated artisan weaving.',
    description_hi: 'शुद्ध रेशम और प्राकृतिक रंगों से बनी पारंपरिक पाटोला साड़ी, 25 दिनों की सूक्ष्म बुनाई से तैयार।',
    price: 6500,
    category: 'textiles',
    materials: ['Mulberry Silk', 'Natural Dyes'],
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    productId: 'prod-002',
    ownerId: 'mock-artisan-101',
    shopId: 'mock-artisan-101',
    title_en: 'Traditional Terracotta Clay Water Pot',
    title_hi: 'पारंपरिक मिट्टी का मटका',
    description_en: 'Wheel-thrown porous clay pot from organic riverbed silt. Naturally cools drinking water during warm summer seasons.',
    description_hi: 'नदी की उपजाऊ मिट्टी से कुम्हार के चाक पर बना पारंपरिक मटका, पानी को प्राकृतिक रूप से शीतल रखता है।',
    price: 350,
    category: 'pottery',
    materials: ['Riverbed Terracotta Clay'],
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    productId: 'prod-003',
    ownerId: 'mock-artisan-101',
    shopId: 'mock-artisan-101',
    title_en: 'Engraved Brass Temple Bell',
    title_hi: 'नक्काशीदार पीतल की घंटी',
    description_en: 'Hand-cast solid brass bell with traditional floral engravings, producing a pure harmonic resonance for puja and home decor.',
    description_hi: 'शुद्ध पीतल से हाथ द्वारा ढाली गई नक्काशीदार पूजा घंटी, मधुर और पवित्र ध्वनि के साथ।',
    price: 850,
    category: 'metalcraft',
    materials: ['Brass', 'Copper Alloy'],
    imageUrl: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  }
];

function getMockProducts() {
  const data = localStorage.getItem(MOCK_STORAGE_KEY_PRODUCTS);
  if (!data) {
    localStorage.setItem(MOCK_STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_MOCK_PRODUCTS));
    return INITIAL_MOCK_PRODUCTS;
  }
  return JSON.parse(data);
}

function saveMockProducts(products) {
  localStorage.setItem(MOCK_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

// =============================================================================
// AUTHENTICATION METHODS
// =============================================================================
export async function apiLogin(email, password) {
  if (isMock) {
    const mockUser = { userId: 'mock-artisan-101', email, username: email.split('@')[0] };
    localStorage.setItem(MOCK_STORAGE_KEY_USER, JSON.stringify(mockUser));
    return mockUser;
  }
  const result = await amplifySignIn({ username: email, password });
  return result;
}

export async function apiSignUp(email, password) {
  if (isMock) {
    return { isSignUpComplete: false, nextStep: { signUpStep: 'CONFIRM_SIGN_UP_STEP' } };
  }
  return await amplifySignUp({
    username: email,
    password,
    options: { userAttributes: { email } },
  });
}

export async function apiConfirmSignUp(email, code) {
  if (isMock) {
    const mockUser = { userId: 'mock-artisan-101', email, username: email.split('@')[0] };
    localStorage.setItem(MOCK_STORAGE_KEY_USER, JSON.stringify(mockUser));
    return mockUser;
  }
  return await amplifyConfirmSignUp({ username: email, confirmationCode: code });
}

export async function apiSignOut() {
  if (isMock) {
    localStorage.removeItem(MOCK_STORAGE_KEY_USER);
    return;
  }
  return await amplifySignOut();
}

export async function apiGetCurrentUser() {
  if (isMock) {
    const data = localStorage.getItem(MOCK_STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
  }
  try {
    const session = await fetchAuthSession();
    if (!session.tokens?.idToken) return null;
    const user = await amplifyGetCurrentUser();
    return { ...user, sub: session.tokens.idToken.payload.sub };
  } catch {
    return null;
  }
}

// Helper to get authorization headers
async function getAuthHeaders() {
  if (isMock) return { 'Content-Type': 'application/json' };
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

// Core fetch wrapper
async function request(endpoint, options = {}) {
  if (!navigator.onLine) {
    throw new Error('OFFLINE: Please check your internet connection.');
  }

  const headers = await getAuthHeaders();
  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  if (res.status === 429) {
    throw new Error('DAILY_LIMIT_EXCEEDED: Daily AI limit reached (20 actions per day). Please try again tomorrow.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Server request failed with status ${res.status}`);
  }

  return data;
}

// =============================================================================
// PRODUCT & BUSINESS APIS
// =============================================================================

/**
 * Requests a presigned S3 upload URL for an image asset.
 */
export async function getUploadUrl(contentType = 'image/jpeg') {
  if (isMock) {
    const fileUuid = 'mock-' + Date.now();
    const ext = contentType === 'image/png' ? '.png' : '.jpg';
    return {
      uploadUrl: 'mock-s3-presigned-url',
      key: `tmp/mock-artisan-101/${fileUuid}${ext}`,
      expiresIn: 300,
    };
  }
  return request('/upload-url', {
    method: 'POST',
    body: JSON.stringify({ contentType }),
  });
}

/**
 * Uploads a file blob directly to S3 via presigned PUT URL.
 */
export async function uploadToS3(uploadUrl, fileBlob, contentType = 'image/jpeg') {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { ok: true };
  }
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: fileBlob,
  });
  if (!res.ok) {
    throw new Error(`Failed to upload photo to S3 (status ${res.status})`);
  }
  return { ok: true };
}

/**
 * Calls Rekognition /enhance endpoint to analyze image quality and detect category.
 */
export async function enhanceImage(key) {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      category: 'textiles',
      quality: { brightness: 68, sharpness: 74, contrast: 62 },
      tips: [
        'Photo quality looks great! Lighting and craft details are clear.',
        'High contrast against the surface highlights texture and colors.'
      ],
      rawLabels: ['Textile', 'Saree', 'Pattern', 'Fabric'],
    };
  }
  return request('/enhance', {
    method: 'POST',
    body: JSON.stringify({ key }),
  });
}

/**
 * Calls Gemini /catalog endpoint to generate bilingual e-commerce title, story, and tags.
 */
export async function generateCatalog({ transcript, language = 'hi-IN', category, imageKey }) {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      title_en: 'Heritage Handcrafted Artisan Craft',
      title_hi: 'पारंपरिक हस्तनिर्मित कारीगरी शिल्प',
      description_en: 'Authentic handmade creation crafted with dedication and heritage techniques passed down through generations. Beautifully textured and rich in Indian cultural tradition.',
      description_hi: 'पीढ़ियों से चली आ रही पारंपरिक कारीगरी से तैयार किया गया शुद्ध हस्तशिल्प। भारतीय संस्कृति और कला का अनुपम संगम।',
      category: category || 'textiles',
      materials: ['Pure Silk', 'Natural Organic Dyes', 'Fine Cotton'],
      technique: 'Traditional Handloom Weaving',
      craft_tradition: 'Heritage Artisan Craft',
      care_instructions_en: 'Gently wipe with dry soft cloth or dry clean. Keep away from harsh direct sunlight.',
      tags: ['handcrafted', 'traditional', 'artisanal', 'madeinbharat', 'authentic'],
      seo_keywords: ['handmade indian craft', 'authentic artisan goods', 'traditional decor'],
      detected_language: language,
    };
  }
  return request('/catalog', {
    method: 'POST',
    body: JSON.stringify({ transcript, language, category, imageKey }),
  });
}

/**
 * Calls /price endpoint to compute fair-trade price range, cost breakdown, and reasoning.
 */
export async function getPriceRecommendation({ category, materialCostInr, hoursOfWork, quantity = 1, imageKey }) {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const mat = Number(materialCostInr) || 200;
    const hrs = Number(hoursOfWork) || 2;
    const qty = Number(quantity) || 1;
    const unitMat = mat / qty;
    const unitLabour = (hrs * 100) / qty;
    const floor = unitMat + unitLabour;
    const suggested = Math.round((floor * 1.35) / 10) * 10;
    const min = Math.round((floor * 1.1) / 10) * 10;
    const max = Math.round((floor * 1.75) / 10) * 10;
    return {
      min_price: min,
      suggested_price: suggested,
      max_price: max,
      reasoning_en: `Fair trade price covers ₹${Math.round(unitMat)} in materials, ₹${Math.round(unitLabour)} in artisan wages (₹100/hr benchmark), plus a 35% sustainable artisan profit margin.`,
      reasoning_hi: `यह न्यायसंगत मूल्य ₹${Math.round(unitMat)} सामग्री लागत, ₹${Math.round(unitLabour)} कारीगर मजदूरी (₹100 प्रति घंटा) और 35% लाभ जोड़कर तय किया गया है।`,
      breakdown: {
        material: Math.round(unitMat),
        labour: Math.round(unitLabour),
        margin: Math.round(suggested - floor),
      },
      tips: [
        'Mention the hours of handmade effort in your product story to justify premium pricing.',
        'Bundle with complementary items or small craft gifts for higher order value.',
        'Offer festive or gift packaging for special occasions.'
      ],
    };
  }
  return request('/price', {
    method: 'POST',
    body: JSON.stringify({ category, materialCostInr, hoursOfWork, quantity, imageKey }),
  });
}
export async function getProducts() {
  if (isMock) {
    return { products: getMockProducts(), count: getMockProducts().length };
  }
  return request('/products', { method: 'GET' });
}

export async function saveProduct(productData) {
  if (isMock) {
    const list = getMockProducts();
    const newProd = {
      ...productData,
      productId: 'prod-' + Date.now(),
      ownerId: 'mock-artisan-101',
      shopId: 'mock-artisan-101',
      imageUrl: productData.imageUrl || productData.finalDataUrl || productData.previewUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newProd);
    saveMockProducts(list);
    return { product: newProd };
  }
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(productId) {
  if (isMock) {
    const list = getMockProducts().filter((p) => p.productId !== productId);
    saveMockProducts(list);
    return { ok: true, deletedProductId: productId };
  }
  return request(`/products?productId=${productId}`, { method: 'DELETE' });
}

export async function getShop(shopId) {
  if (isMock) {
    const list = getMockProducts();
    return { shopId, products: list, count: list.length };
  }
  return request(`/shop/${shopId}`, { method: 'GET' });
}

export async function submitEnquiry(enquiryData) {
  if (isMock) {
    return { ok: true, enquiryId: 'enq-' + Date.now(), message: 'Enquiry submitted successfully' };
  }
  return request('/enquiry', {
    method: 'POST',
    body: JSON.stringify(enquiryData),
  });
}

export async function getStats() {
  if (isMock) {
    const products = getMockProducts();
    return {
      productsCount: products.length,
      enquiriesCount: 8,
      estimatedMinutesSaved: products.length * 15,
      isEstimate: true,
      note: 'Based on 15 mins saved per product cataloged',
    };
  }
  return request('/stats', { method: 'GET' });
}

export async function exportCatalogCsv() {
  if (isMock) {
    const products = getMockProducts();
    const rows = [
      ['sku', 'title_en', 'title_hi', 'description_en', 'description_hi', 'category', 'price_inr', 'materials', 'image_url'],
      ...products.map((p) => [
        p.productId,
        p.title_en,
        p.title_hi || '',
        p.description_en || '',
        p.description_hi || '',
        p.category || '',
        p.price,
        (p.materials || []).join(', '),
        p.imageUrl || '',
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kalamitra_catalog_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { ok: true };
  }

  // Real backend export
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/export.csv`, { method: 'GET', headers });
  if (!res.ok) throw new Error('Failed to export catalog CSV');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kalamitra_catalog.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return { ok: true };
}
