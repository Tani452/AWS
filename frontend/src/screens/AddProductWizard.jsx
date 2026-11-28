import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  getUploadUrl,
  uploadToS3,
  enhanceImage,
  generateCatalog,
  getPriceRecommendation,
  saveProduct,
  isMock,
} from '../api';
import {
  resizeImageToMax1600,
  processStudioImage,
} from '../utils/imageUtils';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import {
  Camera,
  Upload,
  Sparkles,
  Mic,
  MicOff,
  Check,
  ChevronRight,
  ArrowLeft,
  Volume2,
  Edit3,
  Share2,
  PlusCircle,
  Store,
  DollarSign,
  AlertCircle,
  Layers,
  Palette,
  RotateCcw,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'textiles', labelEn: 'Textiles & Sarees', labelHi: 'वस्त्र व साड़ियां', icon: '🧵' },
  { id: 'pottery', labelEn: 'Clay & Pottery', labelHi: 'मिट्टी व बर्तन', icon: '🏺' },
  { id: 'woodwork', labelEn: 'Woodwork & Toys', labelHi: 'काष्ठकला व खिलौने', icon: '🪵' },
  { id: 'metalcraft', labelEn: 'Brass & Metalcraft', labelHi: 'पीतल व धातु शिल्प', icon: '🔔' },
  { id: 'jewelry', labelEn: 'Artisan Jewelry', labelHi: 'हस्तनिर्मित आभूषण', icon: '💍' },
  { id: 'paintings', labelEn: 'Heritage Paintings', labelHi: 'पारंपरिक चित्रकला', icon: '🎨' },
  { id: 'leathercraft', labelEn: 'Leather Craft', labelHi: 'चर्म शिल्प', icon: '👞' },
  { id: 'bamboo_craft', labelEn: 'Bamboo & Cane', labelHi: 'बांस व बेंत शिल्प', icon: '🧺' },
];

export default function AddProductWizard() {
  const { t, lang, currentLangObj, speak } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Wizard Step: 1 = Photo, 2 = AI Studio, 3 = Voice, 4 = Catalog, 5 = Price, 6 = Success
  const [currentStep, setCurrentStep] = useState(1);

  // General Loading & Error State
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------------
  // STEP 1: PHOTO CAPTURE & UPLOAD
  // ---------------------------------------------------------------------------
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);
  const [resizedBlob, setResizedBlob] = useState(null);
  const [originalDataUrl, setOriginalDataUrl] = useState('');
  const [rawImageKey, setRawImageKey] = useState('');
  const [fileStats, setFileStats] = useState(null);

  // ---------------------------------------------------------------------------
  // STEP 2: AI STUDIO (REKOGNITION + BG REMOVAL + LIGHTING FIX + 1:1 COMPOSITE)
  // ---------------------------------------------------------------------------
  const [enhanceTips, setEnhanceTips] = useState([]);
  const [category, setCategory] = useState('textiles');
  const [bgColor, setBgColor] = useState('white'); // 'white' | 'cream' | 'black'
  const [bgRemovalProgress, setBgRemovalProgress] = useState(null);
  const [studioBlob, setStudioBlob] = useState(null);
  const [studioDataUrl, setStudioDataUrl] = useState('');
  const [finalImageKey, setFinalImageKey] = useState('');
  const [fallbackNotice, setFallbackNotice] = useState(false);

  // ---------------------------------------------------------------------------
  // STEP 3: VOICE STORY (WEB SPEECH API)
  // ---------------------------------------------------------------------------
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // ---------------------------------------------------------------------------
  // STEP 4: AI BILINGUAL CATALOG
  // ---------------------------------------------------------------------------
  const [catalog, setCatalog] = useState(null);
  const [catalogLanguageView, setCatalogLanguageView] = useState('both'); // 'both' | 'hi' | 'en'
  const [isEditingCatalog, setIsEditingCatalog] = useState(false);
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editTitleHi, setEditTitleHi] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editDescHi, setEditDescHi] = useState('');

  // ---------------------------------------------------------------------------
  // STEP 5: FAIR-TRADE PRICE ASSISTANT
  // ---------------------------------------------------------------------------
  const [materialCost, setMaterialCost] = useState('450');
  const [hoursWorked, setHoursWorked] = useState('4');
  const [quantity, setQuantity] = useState('1');
  const [priceRecommendation, setPriceRecommendation] = useState(null);
  const [chosenPrice, setChosenPrice] = useState('1100');

  // ---------------------------------------------------------------------------
  // STEP 6: SAVED SUCCESS
  // ---------------------------------------------------------------------------
  const [savedProduct, setSavedProduct] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Initialize SpeechRecognition support check
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // STEP 1 HANDLERS: Photo Capture & Client-Side Resize
  // ---------------------------------------------------------------------------
  const processImageFile = async (file) => {
    if (!file) return;

    setError('');
    setLoading(true);
    setLoadingMessage('Optimizing photo for fast upload...');

    try {
      setOriginalFile(file);
      // Client-side resize to max 1600px JPEG
      const resized = await resizeImageToMax1600(file);
      setResizedBlob(resized.blob);
      setOriginalDataUrl(resized.dataUrl);
      setFileStats({
        origKb: Math.round(file.size / 1024),
        resizedKb: Math.round(resized.blob.size / 1024),
        width: resized.width,
        height: resized.height,
      });

      // Request presigned upload URL and PUT to S3
      setLoadingMessage('Uploading craft photo safely...');
      const uploadResp = await getUploadUrl('image/jpeg');
      await uploadToS3(uploadResp.uploadUrl, resized.blob, 'image/jpeg');
      setRawImageKey(uploadResp.key);
      setFinalImageKey(uploadResp.key); // Default if studio unchanged
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('401') || msg.includes('expired') || msg.includes('signed in')) {
        setError('Login session required: Please log in to your artisan account to upload photos and save products.');
      } else {
        setError('Photo preparation failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  const startLiveCamera = async () => {
    setError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Live camera access is not supported by your browser. Please select an existing photo.');
      return;
    }

    try {
      setIsLiveCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (camErr) {
      console.warn('Camera access error:', camErr);
      setIsLiveCameraOpen(false);
      setError('Camera access denied or unavailable. Please click "Choose from Files" to upload an image.');
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsLiveCameraOpen(false);
  };

  const handleCaptureFromLiveCamera = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      stopLiveCamera();
      if (blob) {
        const file = new File([blob], `craft-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        await processImageFile(file);
      }
    }, 'image/jpeg', 0.92);
  };

  const handleRetake = () => {
    setOriginalDataUrl('');
    setOriginalFile(null);
    setResizedBlob(null);
    setRawImageKey('');
    setFinalImageKey('');
    setFileStats(null);
    stopLiveCamera();
  };

  // Ensure camera stream is stopped if component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // STEP 2 HANDLERS: AI Studio Analysis & Processing
  // ---------------------------------------------------------------------------
  const startStudioProcessing = async (chosenBg = bgColor) => {
    if (!resizedBlob || !rawImageKey) return;

    setError('');
    setLoading(true);
    setLoadingMessage('AI Studio: checking lighting & quality...');

    try {
      // 1. Rekognition call for photo quality tips and category
      const enhanceData = await enhanceImage(rawImageKey);
      if (enhanceData.tips && enhanceData.tips.length > 0) {
        setEnhanceTips(enhanceData.tips);
      }
      if (enhanceData.category) {
        setCategory(enhanceData.category);
      }

      // 2. Browser background removal & 1:1 compositing
      setLoadingMessage('AI Studio: creating studio lighting and background...');
      const studioRes = await processStudioImage({
        imageBlob: resizedBlob,
        bgColor: chosenBg,
        onProgress: (p) => {
          setBgRemovalProgress(p);
          setLoadingMessage(p.note || 'Processing image...');
        },
      });

      setStudioBlob(studioRes.finalBlob);
      setStudioDataUrl(studioRes.finalDataUrl);
      setFallbackNotice(studioRes.fallbackUsed);

      // 3. Upload studio-enhanced JPEG to S3
      const uploadResp = await getUploadUrl('image/jpeg');
      await uploadToS3(uploadResp.uploadUrl, studioRes.finalBlob, 'image/jpeg');
      setFinalImageKey(uploadResp.key);
    } catch (err) {
      console.warn('Studio processing error:', err);
      // Fallback: use resized original
      setStudioBlob(resizedBlob);
      setStudioDataUrl(originalDataUrl);
      setFallbackNotice(true);
    } finally {
      setLoading(false);
      setBgRemovalProgress(null);
    }
  };

  const handleStep1Next = async () => {
    if (!rawImageKey || !originalDataUrl) {
      setError('Please take or upload a photo first');
      return;
    }
    setCurrentStep(2);
    // Automatically trigger studio processing on entering step 2
    await startStudioProcessing(bgColor);
  };

  const handleBgColorChange = async (color) => {
    setBgColor(color);
    await startStudioProcessing(color);
  };

  // ---------------------------------------------------------------------------
  // STEP 3 HANDLERS: Voice Recording (SpeechRecognition)
  // ---------------------------------------------------------------------------
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLangObj.bcp47;

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'network') {
          setError('Speech network error: Brave and privacy browsers block cloud speech servers by default. You can type below, tap the quick craft tags, or enable Google speech in brave://settings/privacy.');
        } else if (event.error === 'not-allowed') {
          setError('Microphone access blocked. Please tap the lock/tune icon in your URL bar and allow microphone permissions.');
        } else if (event.error !== 'no-speech') {
          setError(`Mic notice: ${event.error}. You can type or use the quick tags below.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setError('Microphone access unavailable. Please type your description.');
      setIsListening(false);
    }
  };

  // ---------------------------------------------------------------------------
  // STEP 4 HANDLERS: Catalog Generation
  // ---------------------------------------------------------------------------
  const handleGenerateCatalog = async () => {
    const textDesc = transcript.trim();
    if (!textDesc) {
      setError('Please provide a brief voice or typed description of your craft.');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingMessage('Gemini AI: creating bilingual e-commerce catalog...');

    try {
      const catResult = await generateCatalog({
        transcript: textDesc,
        language: currentLangObj.bcp47,
        category,
        imageKey: finalImageKey,
      });

      // Cache successful result in localStorage for live demo resilience
      try {
        localStorage.setItem('kalamitra_last_catalog_cache', JSON.stringify(catResult));
      } catch {}

      setCatalog(catResult);
      setEditTitleEn(catResult.title_en || '');
      setEditTitleHi(catResult.title_regional || catResult.title_hi || '');
      setEditDescEn(catResult.description_en || '');
      setEditDescHi(catResult.description_regional || catResult.description_hi || '');
      setCurrentStep(4);
    } catch (err) {
      console.warn('AI catalog generation notice:', err.message);
      // Fallback: recover from last successful cache or construct a smart draft
      let fallbackData = null;
      try {
        const cached = localStorage.getItem('kalamitra_last_catalog_cache');
        if (cached) {
          fallbackData = JSON.parse(cached);
        }
      } catch {}

      if (!fallbackData) {
        const textLower = textDesc.toLowerCase();
        const cleanCat = (category || 'handicrafts').replace('_', ' ');
        const isWater = textLower.includes('पाणी') || textLower.includes('पिण्यासाठी') || textLower.includes('पानी') || textLower.includes('water');
        const isClay = textLower.includes('माती') || textLower.includes('मटका') || textLower.includes('भांडे') || textLower.includes('clay');
        const isTextile = textLower.includes('कापड') || textLower.includes('रेशम') || textLower.includes('सिल्क') || textLower.includes('साड़ी');

        let titleEn = `Authentic Handcrafted ${cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1)}`;
        let descEn = 'Handcrafted with traditional devotion using authentic, sustainable materials that celebrate Indian artisan craftsmanship.';
        let titleReg = `पारंपरिक हस्तनिर्मित ${cleanCat}`;
        let descReg = `पारंपरिक कारागिरी आणि निष्ठेने साकारलेली हस्तकला: ${textDesc}। भारतीय समृद्ध संस्कृती आणि कौशल्याचा सुंदर संगम.`;

        if (isWater) {
          titleEn = 'Artisanal Pure Drinking Water Bottle & Vessel';
          descEn = 'Specially crafted for healthy everyday hydration and storing pure drinking water. Handmade using authentic Indian artisan traditions to keep water naturally cool and fresh.';
          titleReg = 'पारंपरिक हस्तनिर्मित पाणी पिण्याची बाटली';
          descReg = `शुद्ध पाणी पिण्यासाठी आणि दैनंदिन वापरासाठी निष्ठेने घडवलेली सुंदर बाटली: ${textDesc}। अस्सल भारतीय कारागिरीचे प्रतीक.`;
        } else if (isClay) {
          titleEn = `Traditional Terracotta Clay Craft`;
          descEn = 'Wheel-thrown by master artisans from organic riverbed clay. Naturally porous and eco-friendly, keeping water and food fresh and chemical-free.';
          titleReg = 'पारंपरिक मातीची हस्तकला';
          descReg = `नदीच्या नैसर्गिक मातीपासून कुंभाराच्या चाकावर घडवलेले अस्सल भांडे: ${textDesc}.`;
        } else if (isTextile) {
          titleEn = `Heritage Handwoven Fabric & Textile`;
          descEn = 'Woven on traditional handlooms using organic natural yarns and heritage weave motifs. Represents authentic sustainable Indian craftsmanship.';
          titleReg = 'पारंपरिक हातमाग विणकाम वस्त्र';
          descReg = `पारंपरिक हातमागावर नैसर्गिक धाग्यांनी विणलेले देखणे वस्त्र: ${textDesc}.`;
        }

        fallbackData = {
          title_en: titleEn,
          title_hi: `पारंपरिक हस्तनिर्मित ${cleanCat}`,
          title_regional: titleReg,
          description_en: descEn,
          description_hi: `पारंपरिक कारीगरी और निष्ठा से तैयार: ${textDesc}। भारतीय शिल्प कला का सुंदर संगम।`,
          description_regional: descReg,
          category: isWater || isClay ? 'pottery' : (category || 'handicrafts'),
          materials: ['Pure Natural Materials', 'Eco-friendly Elements'],
          technique: 'Traditional Handcraft',
          craft_tradition: 'Heritage Craft',
          care_instructions_en: 'Gently wipe with a soft cloth. Keep away from harsh direct sunlight.',
          tags: ['handcrafted', 'traditional', 'artisanal', 'madeinbharat'],
          seo_keywords: ['authentic indian craft', 'handmade product', 'bharat crafts'],
        };
      }

      setCatalog(fallbackData);
      setEditTitleEn(fallbackData.title_en || '');
      setEditTitleHi(fallbackData.title_hi || '');
      setEditDescEn(fallbackData.description_en || '');
      setEditDescHi(fallbackData.description_hi || '');
      setError('AI assistant is busy right now. We preserved your draft description so you can continue editing.');
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  const saveCatalogEdits = () => {
    if (catalog) {
      setCatalog({
        ...catalog,
        title_en: editTitleEn,
        title_hi: editTitleHi,
        description_en: editDescEn,
        description_hi: editDescHi,
      });
    }
    setIsEditingCatalog(false);
  };

  // ---------------------------------------------------------------------------
  // STEP 5 HANDLERS: Price Assistant & Final Save
  // ---------------------------------------------------------------------------
  const handleCalculatePrice = async () => {
    setError('');
    setLoading(true);
    setLoadingMessage('AI: Calculating dignity-wage fair-trade price...');

    try {
      const rec = await getPriceRecommendation({
        category,
        materialCostInr: Number(materialCost) || 0,
        hoursOfWork: Number(hoursWorked) || 1,
        quantity: Number(quantity) || 1,
        imageKey: finalImageKey,
      });

      setPriceRecommendation(rec);
      setChosenPrice(String(rec.suggested_price || 1000));
    } catch (err) {
      setError('Price calculation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!chosenPrice || Number(chosenPrice) <= 0) {
      setError('Please set a valid price');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingMessage('Saving product to your shop & S3 media...');

    try {
      const regionalTitle = editTitleHi || catalog?.title_regional || catalog?.title_hi || '';
      const regionalDesc = editDescHi || catalog?.description_regional || catalog?.description_hi || '';

      const productPayload = {
        title_en: editTitleEn || catalog?.title_en || 'Handcrafted Craft Item',
        title_hi: catalog?.title_hi || regionalTitle || 'हस्तनिर्मित शिल्प',
        title_regional: regionalTitle,
        [`title_${lang}`]: regionalTitle,
        description_en: editDescEn || catalog?.description_en || transcript || '',
        description_hi: catalog?.description_hi || regionalDesc || '',
        description_regional: regionalDesc,
        [`description_${lang}`]: regionalDesc,
        language: lang,
        category,
        price: Number(chosenPrice),
        imageKey: finalImageKey,
        finalDataUrl: studioDataUrl || originalDataUrl,
        materials: catalog?.materials || [],
        technique: catalog?.technique || '',
        craft_tradition: catalog?.craft_tradition || '',
        care_instructions_en: catalog?.care_instructions_en || '',
        tags: catalog?.tags || [],
        pricingDetails: {
          materialCost: Number(materialCost),
          hoursWorked: Number(hoursWorked),
          quantity: Number(quantity),
          minPrice: priceRecommendation?.min_price,
          suggestedPrice: priceRecommendation?.suggested_price,
          maxPrice: priceRecommendation?.max_price,
        },
      };

      const result = await saveProduct(productPayload);
      setSavedProduct(result.product || productPayload);
      setCurrentStep(6); // Success
      speak(t('productSavedSuccess'));
    } catch (err) {
      setError('Failed to save product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SUCCESS SCREEN HELPERS
  // ---------------------------------------------------------------------------
  const shopId = user?.sub || user?.userId || 'my-shop';
  const publicShopUrl = `${window.location.origin}/#/shop/${shopId}`;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Namaste! Explore my authentic handcrafted ${savedProduct?.title_en || 'creation'} on Kaarigar: ${publicShopUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleResetWizard = () => {
    setCurrentStep(1);
    setOriginalFile(null);
    setResizedBlob(null);
    setOriginalDataUrl('');
    setRawImageKey('');
    setStudioBlob(null);
    setStudioDataUrl('');
    setFinalImageKey('');
    setTranscript('');
    setCatalog(null);
    setPriceRecommendation(null);
    setSavedProduct(null);
    setError('');
  };

  // ===========================================================================
  // RENDER STEP CONTENT
  // ===========================================================================

  return (
    <div className="mobile-container p-4 space-y-5 pb-16">
      {/* Top Header & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (currentStep > 1 && currentStep < 6) {
              setCurrentStep((s) => s - 1);
            } else {
              navigate('/home');
            }
          }}
          aria-label="Previous step or go home"
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-lg font-black text-indigo-950">
            {t('btnBigAddProduct')}
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            {currentStep <= 5 ? `Step ${currentStep} of 5` : 'Complete'}
          </p>
        </div>

        <button
          onClick={() => {
            if (currentStep === 1) speak('step1Prompt');
            else if (currentStep === 2) speak('step2Prompt');
            else if (currentStep === 3) speak('step3Prompt');
            else if (currentStep === 4) speak('step4Prompt');
            else speak('productSavedSuccess');
          }}
          aria-label={t('readAloud') || "Read aloud"}
          className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center"
          title={t('readAloud')}
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar (5 Steps) */}
      {currentStep <= 5 && (
        <div className="space-y-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-xs font-black">
            {[1, 2, 3, 4, 5].map((stepNum) => {
              const active = currentStep === stepNum;
              const completed = currentStep > stepNum;
              return (
                <div
                  key={stepNum}
                  className={`flex flex-col items-center flex-1 transition-all ${
                    active ? 'text-saffron-600 scale-105' : completed ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-1 transition-all ${
                      completed
                        ? 'bg-emerald-500 text-white'
                        : active
                        ? 'bg-saffron-600 text-white ring-4 ring-saffron-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {completed ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span className="text-[10px] font-bold tracking-tight">
                    {t(`step${stepNum}Title`)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-saffron-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Alert Box */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start space-x-3 text-red-700 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-bold leading-relaxed">{error}</div>
        </div>
      )}

      {/* Loading Overlay / Progress Notification */}
      {loading && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center space-x-3 text-amber-900 shadow-md">
          <div className="w-6 h-6 border-3 border-amber-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div className="flex-1 text-xs font-black">{loadingMessage}</div>
        </div>
      )}

      {/* =====================================================================
          STEP 1: PHOTO CAPTURE & RESIZE
          ===================================================================== */}
      {currentStep === 1 && (
        <div className="space-y-5 max-w-2xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900">
              {t('capturePhotoPrompt')}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {t('capturePhotoSubtitle')}
            </p>
          </div>

          {/* Hidden file input with camera environment capture */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {isLiveCameraOpen ? (
            /* Live Camera Viewfinder */
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-saffron-500 bg-black flex flex-col justify-between">
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  onClick={stopLiveCamera}
                  className="px-3.5 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full text-xs font-bold shadow transition-all backdrop-blur"
                >
                  ✕ {t('closeCamera')}
                </button>
              </div>
              <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center z-10">
                <button
                  type="button"
                  onClick={handleCaptureFromLiveCamera}
                  aria-label={t('takeLivePhoto')}
                  className="w-20 h-20 rounded-full bg-white border-4 border-saffron-600 shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
                >
                  <div className="w-14 h-14 rounded-full bg-saffron-600 hover:bg-saffron-700 transition-colors shadow-inner flex items-center justify-center text-white">
                    <Camera className="w-7 h-7" />
                  </div>
                </button>
              </div>
            </div>
          ) : !originalDataUrl ? (
            /* Dual Option: Live Camera or File Upload */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Live Camera */}
              <button
                type="button"
                onClick={startLiveCamera}
                className="w-full min-h-[160px] border-2 border-saffron-600/30 hover:border-saffron-600 bg-white hover:bg-amber-100/50 rounded-3xl flex flex-col items-center justify-center p-5 space-y-2 active:scale-[0.98] transition-all shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-saffron-600 text-white flex items-center justify-center shadow-sm">
                  <Camera className="w-7 h-7" />
                </div>
                <div className="text-base font-black text-slate-900">
                  📷 {t('takeLivePhoto')}
                </div>
                <p className="text-xs text-slate-500 font-semibold text-center">
                  {t('liveCameraSubtitle')}
                </p>
              </button>

              {/* Option 2: Upload File / Gallery */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-[160px] border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-3xl flex flex-col items-center justify-center p-5 space-y-2 active:scale-[0.98] transition-all shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="text-base font-black text-slate-700">
                  📁 {t('chooseFromFiles')}
                </div>
                <p className="text-xs text-slate-400 font-semibold text-center">
                  Select image from files or gallery
                </p>
              </button>
            </div>
          ) : (
            /* Photo Preview with stats */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-lg border-2 border-amber-200 bg-white">
                <img
                  src={originalDataUrl}
                  alt="Captured craft"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={handleRetake}
                  className="absolute bottom-3 right-3 px-3.5 py-2 rounded-xl bg-black/70 text-white text-xs font-bold backdrop-blur flex items-center space-x-1.5 shadow active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('retakePhoto')}</span>
                </button>
              </div>

              <div className="space-y-4">
                {fileStats && (
                  <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 shadow-sm">
                    <div className="font-semibold text-slate-500">
                      Original Size: <span className="font-bold text-slate-800">{fileStats.origKb} KB</span>
                    </div>
                    <div className="font-black text-emerald-600">
                      ✓ Optimized: {fileStats.resizedKb} KB (Max {fileStats.width}px)
                    </div>
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={handleStep1Next}
                  disabled={loading}
                  className="w-full min-h-[64px] bg-saffron-600 hover:bg-saffron-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-saffron-600/25 flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <span>{t('nextToStudio')}</span>
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          STEP 2: AI STUDIO (REKOGNITION TIPS, BG REMOVAL, LIGHTING FIX & 1:1)
          ===================================================================== */}
      {currentStep === 2 && (
        <div className="space-y-5 max-w-5xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-saffron-600" />
              <span>{t('step2Title')}</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {t('beforeAfterComparison')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Interactive Before/After Slider & Progress */}
            <div className="space-y-4">
              {studioDataUrl && originalDataUrl && (
                <BeforeAfterSlider
                  originalUrl={originalDataUrl}
                  enhancedUrl={studioDataUrl}
                  labelBefore="Original Photo"
                  labelAfter="Studio Enhanced"
                />
              )}

              {bgRemovalProgress && (
                <div className="bg-amber-100 p-3 rounded-2xl border border-amber-300 text-xs font-bold text-amber-900 space-y-1">
                  <div className="flex justify-between">
                    <span>{bgRemovalProgress.note}</span>
                    <span>{bgRemovalProgress.percent}%</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-200"
                      style={{ width: `${bgRemovalProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {fallbackNotice && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-800">
                  ℹ️ Original background kept with enhanced lighting fix applied.
                </div>
              )}
            </div>

            {/* Right: Studio Background & Quality Tips */}
            <div className="space-y-4">
              {/* 1:1 Studio Background Color Selector */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Palette className="w-4 h-4 text-saffron-600" />
                  <span>Choose 1:1 Studio Background:</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { id: 'white', label: t('bgChoiceWhite'), bgClass: 'bg-white', borderClass: 'border-slate-300' },
                    { id: 'cream', label: t('bgChoiceCream'), bgClass: 'bg-[#FAF7EE]', borderClass: 'border-amber-200' },
                    { id: 'black', label: t('bgChoiceBlack'), bgClass: 'bg-[#18181B] text-white', borderClass: 'border-slate-800' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleBgColorChange(b.id)}
                      disabled={loading}
                      className={`py-3 px-2 rounded-2xl border-2 text-xs font-black transition-all flex flex-col items-center justify-center space-y-1 ${b.bgClass} ${
                        bgColor === b.id ? 'ring-3 ring-saffron-500 border-saffron-600 shadow-md scale-105' : b.borderClass
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border ${bgColor === b.id ? 'bg-saffron-600' : 'bg-transparent'}`} />
                      <span className={b.id === 'black' ? 'text-white' : 'text-slate-800'}>{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rekognition Photo Quality Tips & Category */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t('photoQualityTips')}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {t('detectedCategory')}: {category}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs font-medium text-slate-700">
                  {enhanceTips.length > 0 ? (
                    enhanceTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Lighting and craft details look clear and ready for digital cataloging.</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentStep(3)}
                disabled={loading}
                className="w-full min-h-[64px] bg-saffron-600 hover:bg-saffron-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-saffron-600/25 flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <span>{t('nextToVoice')}</span>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 3: VOICE STORY (WEB SPEECH API IN NATIVE INDIAN LOCALES)
          ===================================================================== */}
      {currentStep === 3 && (
        <div className="space-y-5 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              {t('voicePrompt')}
            </h2>
            <p className="text-xs md:text-sm text-saffron-700 font-bold">
              Speaking in: {currentLangObj.name} ({currentLangObj.bcp47})
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column: Big Circular Microphone Button */}
            <div className="flex flex-col items-center justify-center py-8 px-4 space-y-4 bg-white/70 rounded-3xl border border-slate-200 shadow-sm">
              <button
                onClick={toggleSpeechRecognition}
                disabled={!speechSupported}
                aria-label={isListening ? "Stop voice recording" : "Start speaking voice description"}
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 border-4 ${
                  isListening
                    ? 'bg-red-600 border-red-300 animate-pulse ring-8 ring-red-200 text-white'
                    : 'bg-saffron-600 border-saffron-400 text-white hover:bg-saffron-700'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-14 h-14 mb-1" />
                ) : (
                  <Mic className="w-14 h-14 mb-1" />
                )}
                <span className="text-xs font-black">
                  {isListening ? 'Stop' : 'Speak'}
                </span>
              </button>

              <div className="text-sm font-bold text-slate-700 text-center">
                {isListening ? (
                  <span className="text-red-600 font-black flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                    <span>{t('micListening')}</span>
                  </span>
                ) : (
                  <span>{t('micStart')}</span>
                )}
              </div>

              {/* Browser unsupported banner */}
              {!speechSupported && (
                <div className="p-3 bg-amber-100 border border-amber-300 rounded-2xl text-xs font-semibold text-amber-900">
                  {t('speechNotSupported')}
                </div>
              )}
            </div>

            {/* Right Column: Spoken / Typed Transcript Text Area */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600">
                    {t('transcriptLabel')}
                  </label>
                  {transcript && (
                    <button
                      onClick={() => speak(transcript, true)}
                      className="text-xs text-saffron-600 font-bold flex items-center space-x-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('readAloud')}</span>
                    </button>
                  )}
                </div>

                <textarea
                  rows={5}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="E.g., I made this silk dupatta using traditional natural indigo dye and hand block printing in 3 days..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 text-sm font-medium outline-none resize-none"
                />

                {/* Quick Inspiration suggestions for artisans */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(lang === 'mr' ? [
                    'शुद्ध रेशम', 'मातीचे भांडे', 'हातमाग विणकाम', 'नैसर्गिक रंग', 'हस्तकला'
                  ] : lang === 'hi' ? [
                    'शुद्ध रेशम', 'मिट्टी का बर्तन', 'हथकरघा बुनाई', 'प्राकृतिक रंग', 'हस्तशिल्प'
                  ] : lang === 'gu' ? [
                    'શુદ્ધ રેશમ', 'માટીનું વાસણ', 'હાથવણાટ', 'કુદરતી રંગો', 'હસ્તકળા'
                  ] : lang === 'ta' ? [
                    'பட்டு நெசவு', 'களிமண் கைவினை', 'கைத்தறி', 'இயற்கை சாயம்', 'கைவினை'
                  ] : lang === 'bn' ? [
                    'খাঁটি রেশম', 'মাটির পাত্র', 'হাঁততাঁত', 'প্রাকৃতিক রঙ', 'হস্তশিল্প'
                  ] : [
                    'Pure mulberry silk',
                    'Terracotta clay',
                    'Handloom woven',
                    'Natural organic dyes',
                    'Solid brass bell',
                  ]).map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => setTranscript((prev) => (prev ? `${prev}, ${phrase}` : phrase))}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                    >
                      + {phrase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleGenerateCatalog}
                disabled={loading || !transcript.trim()}
                className="w-full min-h-[64px] bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white font-black text-lg rounded-2xl shadow-xl shadow-saffron-600/25 flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <span>{t('nextToCatalog')}</span>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 4: AI BILINGUAL CATALOG (ENGLISH & HINDI WITH EDIT & AUDIO)
          ===================================================================== */}
      {currentStep === 4 && catalog && (
        <div className="space-y-5 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              {t('step4Title')}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Bilingual e-commerce copy generated by Gemini AI. Tap Edit to adjust anytime.
            </p>
          </div>

          {/* Language View Selector */}
          <div className="flex rounded-2xl bg-white p-1 border border-slate-200 shadow-sm max-w-md mx-auto">
            {[
              { id: 'both', label: 'Bilingual (Both)' },
              { id: 'regional', label: currentLangObj.label },
              { id: 'en', label: 'English' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setCatalogLanguageView(v.id)}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  catalogLanguageView === v.id
                    ? 'bg-saffron-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Bilingual Catalog Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Catalog Preview
              </span>
              <button
                onClick={() => setIsEditingCatalog(!isEditingCatalog)}
                className="text-xs font-black text-saffron-600 flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingCatalog ? t('saveEdit') : t('editCatalog')}</span>
              </button>
            </div>

            {/* Editable Mode */}
            {isEditingCatalog ? (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">English Title</label>
                    <input
                      type="text"
                      value={editTitleEn}
                      onChange={(e) => setEditTitleEn(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">{currentLangObj.label} Title</label>
                    <input
                      type="text"
                      value={editTitleHi}
                      onChange={(e) => setEditTitleHi(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">English Story</label>
                    <textarea
                      rows={4}
                      value={editDescEn}
                      onChange={(e) => setEditDescEn(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">{currentLangObj.label} {t('step4Title')}</label>
                    <textarea
                      rows={4}
                      value={editDescHi}
                      onChange={(e) => setEditDescHi(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>
                </div>
                <button
                  onClick={saveCatalogEdits}
                  className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  {t('saveEdit')}
                </button>
              </div>
            ) : (
              /* Display Mode */
              <div className={catalogLanguageView === 'both' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {/* English Content */}
                {(catalogLanguageView === 'both' || catalogLanguageView === 'en') && (
                  <div className="space-y-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        English Copy
                      </span>
                      <button
                        onClick={() => speak(catalog.description_en, true)}
                        className="text-xs text-slate-400 hover:text-slate-700"
                        title="Read aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {catalog.title_en}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {catalog.description_en}
                    </p>
                  </div>
                )}

                {/* Regional Language Content */}
                {(catalogLanguageView === 'both' || catalogLanguageView === 'regional' || catalogLanguageView === 'hi') && (
                  <div className="space-y-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {currentLangObj.label} {t('step4Title')}
                      </span>
                      <button
                        onClick={() => speak(catalog.description_regional || catalog.description_hi, true)}
                        className="text-xs text-slate-400 hover:text-slate-700"
                        title={t('readAloud')}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {catalog.title_regional || catalog.title_hi}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {catalog.description_regional || catalog.description_hi}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tags & Materials */}
            {catalog.tags && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('tagsLabel')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {catalog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentStep(5)}
            className="w-full min-h-[64px] bg-saffron-600 hover:bg-saffron-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-saffron-600/25 flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <span>{t('nextToPrice')}</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* =====================================================================
          STEP 5: FAIR-TRADE PRICE ASSISTANT (GAUGE, BREAKDOWN & SAVE)
          ===================================================================== */}
      {currentStep === 5 && (
        <div className="space-y-5 max-w-5xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center justify-center space-x-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <span>{t('priceAssistantTitle')}</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Guarantees artisan dignity wage (₹100/hr) + fair trade profit margin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column: Cost, Labor & Final Price Controls */}
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {t('materialCostLabel')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={materialCost}
                        onChange={(e) => setMaterialCost(e.target.value)}
                        className="w-full pl-8 pr-3 py-3 rounded-2xl border border-slate-200 text-lg font-black focus:border-saffron-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {t('hoursWorkedLabel')}
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={hoursWorked}
                      onChange={(e) => setHoursWorked(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-lg font-black focus:border-saffron-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('quantityLabel')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-lg font-black focus:border-saffron-500 outline-none"
                  />
                </div>

                <button
                  onClick={handleCalculatePrice}
                  disabled={loading}
                  className="w-full py-3.5 bg-saffron-600 hover:bg-saffron-700 text-white font-black text-sm rounded-2xl shadow-sm active:scale-95 transition-all"
                >
                  {t('calculatePriceBtn')}
                </button>
              </div>

              {/* Final Price Input with manual override */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  {t('customPriceLabel')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-bold text-xl">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={chosenPrice}
                    onChange={(e) => setChosenPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-saffron-500 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-saffron-200 outline-none"
                  />
                </div>
              </div>

              {/* Save Product Button */}
              <button
                onClick={handleSaveProduct}
                disabled={loading || !chosenPrice}
                className="w-full min-h-[64px] bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg rounded-2xl shadow-sm flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <Check className="w-6 h-6" />
                <span>{t('saveProductBtn')}</span>
              </button>
            </div>

            {/* Right Column: Price Spectrum & Recommendation Card */}
            <div>
              {priceRecommendation ? (
                <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-sm space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-black uppercase text-saffron-700 tracking-wider">
                      {t('priceGaugeSuggested')}
                    </span>
                    <div className="text-4xl font-black text-saffron-700">
                      ₹{priceRecommendation.suggested_price}
                    </div>
                  </div>

                  {/* Visual 3-tier Price Gauge */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {t('priceGaugeMin')}
                      </div>
                      <div className="text-base font-black text-slate-700">
                        ₹{priceRecommendation.min_price}
                      </div>
                    </div>

                    <div className="bg-emerald-700 text-white p-2.5 rounded-2xl shadow-sm ring-2 ring-emerald-200">
                      <div className="text-[10px] font-bold uppercase">
                        Suggested
                      </div>
                      <div className="text-lg font-black">
                        ₹{priceRecommendation.suggested_price}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {t('priceGaugeMax')}
                      </div>
                      <div className="text-base font-black text-slate-700">
                        ₹{priceRecommendation.max_price}
                      </div>
                    </div>
                  </div>

                  {/* Fair Breakdown Card */}
                  {priceRecommendation.breakdown && (
                    <div className="bg-amber-50/50 p-3.5 rounded-2xl text-xs space-y-1.5 border border-amber-200">
                      <div className="flex justify-between font-semibold text-slate-600">
                        <span>{t('materialCostLabel')}:</span>
                        <span>₹{priceRecommendation.breakdown.material}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-slate-600">
                        <span>Artisan Wage (₹100/hr):</span>
                        <span>₹{priceRecommendation.breakdown.labour}</span>
                      </div>
                      <div className="flex justify-between font-black text-emerald-800 border-t border-amber-200/60 pt-1">
                        <span>Artisan Profit Margin:</span>
                        <span>₹{priceRecommendation.breakdown.margin}</span>
                      </div>
                    </div>
                  )}

                  {/* Reasoning in user language */}
                  <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                    "{lang === 'hi' ? priceRecommendation.reasoning_hi : priceRecommendation.reasoning_en}"
                  </p>

                  {/* Use this price shortcut */}
                  <button
                    onClick={() => setChosenPrice(String(priceRecommendation.suggested_price))}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    ✓ {t('useThisPrice')} (₹{priceRecommendation.suggested_price})
                  </button>
                </div>
              ) : (
                <div className="bg-white/70 p-8 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">
                    Enter details & tap Calculate Price
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Kaarigar AI will compute fair market rates, artisan living wage, and benchmarked tiers automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 6: CELEBRATORY SUCCESS SCREEN
          ===================================================================== */}
      {currentStep === 6 && savedProduct && (
        <div className="space-y-6 pt-4 text-center max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-xl">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              {t('productSavedSuccess')}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Your handcrafted craft is now ready for buyers and global marketplace export.
            </p>
          </div>

          {/* Saved Product Card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-md text-left flex space-x-4 items-center">
            <img
              src={studioDataUrl || originalDataUrl}
              alt="Saved product"
              className="w-20 h-20 rounded-2xl object-cover bg-slate-100 flex-shrink-0 border"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-slate-900 truncate">
                {lang === 'hi' ? savedProduct.title_hi || savedProduct.title_en : savedProduct.title_en}
              </h4>
              <p className="text-xs text-slate-500 capitalize">{savedProduct.category}</p>
              <div className="text-base font-black text-emerald-600 mt-1">
                ₹{savedProduct.price}
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('shareOnWhatsApp')}</span>
            </button>

            <button
              onClick={handleResetWizard}
              className="w-full py-3.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('addAnother')}</span>
            </button>

            <button
              onClick={() => navigate('/my-shop')}
              className="w-full py-3.5 bg-white hover:bg-amber-50 border border-amber-200 text-slate-800 font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <Store className="w-4 h-4 text-slate-600" />
              <span>{t('goToMyShop')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
