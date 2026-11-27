/**
 * Multilingual Dictionary for KalaMitra
 * Supported BCP-47 Languages:
 * en-IN, hi-IN, gu-IN, mr-IN, ta-IN, bn-IN, te-IN, kn-IN, pa-IN
 */

export const LANGUAGES = [
  { code: 'hi', bcp47: 'hi-IN', label: 'हिंदी', name: 'Hindi', script: 'Devanagari' },
  { code: 'gu', bcp47: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati', script: 'Gujarati' },
  { code: 'en', bcp47: 'en-IN', label: 'English', name: 'English', script: 'Latin' },
  { code: 'mr', bcp47: 'mr-IN', label: 'मराठी', name: 'Marathi', script: 'Devanagari' },
  { code: 'ta', bcp47: 'ta-IN', label: 'தமிழ்', name: 'Tamil', script: 'Tamil' },
  { code: 'bn', bcp47: 'bn-IN', label: 'বাংলা', name: 'Bengali', script: 'Bengali' },
  { code: 'te', bcp47: 'te-IN', label: 'తెలుగు', name: 'Telugu', script: 'Telugu' },
  { code: 'kn', bcp47: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada', script: 'Kannada' },
  { code: 'pa', bcp47: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi', script: 'Gurmukhi' },
];

export const DICTIONARY = {
  // App Header & Branding
  appName: {
    en: 'KalaMitra',
    hi: 'कला मित्र',
    gu: 'કલા મિત્ર',
    mr: 'कला मित्र',
    ta: 'கலா மித்ரா',
    bn: 'কলা মিত্র',
    te: 'కళా మిత్ర',
    kn: 'ಕಲಾ ಮಿತ್ರ',
    pa: 'ਕਲਾ ਮਿੱਤਰ',
  },
  tagline: {
    en: 'Your AI Artisan Business Manager',
    hi: 'आपका डिजिटल व्यापार साथी',
    gu: 'તમારો ડિજિટલ વેપાર સાથી',
    mr: 'तुमचा डिजिटल व्यवसाय साथीदार',
    ta: 'உங்கள் கைவினை வணிக மேலாளர்',
    bn: 'আপনার ডিজিটাল ব্যবসা সহযোগী',
    te: 'మీ డిజిటల్ వ్యాపార సహాయకుడు',
    kn: 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ವ್ಯಾಪಾರ ಸಹಾಯಕ',
    pa: 'ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਵਪਾਰ ਸਾਥੀ',
  },

  // Welcome Screen
  selectLanguage: {
    en: 'Choose your language',
    hi: 'अपनी भाषा चुनें',
    gu: 'તમારી ભાષા પસંદ કરો',
    mr: 'तुमची भाषा निवडा',
    ta: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    bn: 'আপনার ভাষা নির্বাচন করুন',
    te: 'మీ భాషను ఎంచుకోండి',
    kn: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    pa: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
  },
  welcomeListenInstruction: {
    en: 'Namaste! KalaMitra helps you turn your handcrafted creations into digital catalogs and online sales in minutes.',
    hi: 'नमस्ते! कला मित्र आपके हस्तशिल्प को कुछ ही मिनटों में ऑनलाइन दुकान और कैटलॉग में बदलने में मदद करता है।',
    gu: 'નમસ્તે! કલા મિત્ર તમારી હસ્તકળાને થોડી જ મિનિટોમાં ઓનલાઇન દુકાન અને કેટેલોગમાં ફેરવવામાં મદદ કરે છે.',
  },
  getStarted: {
    en: 'Get Started',
    hi: 'आगे बढ़ें',
    gu: 'શરૂ કરો',
    mr: 'सुरू करा',
    ta: 'தொடங்கவும்',
    bn: 'শুরু করুন',
    te: 'ప్రారంభించండి',
    kn: 'ಪ್ರಾರಂಭಿಸಿ',
    pa: 'ਸ਼ੁਰੂ ਕਰੋ',
  },

  // Auth Screen
  login: {
    en: 'Login',
    hi: 'लॉग इन करें',
    gu: 'લૉગ ઇન કરો',
  },
  signup: {
    en: 'New Artisan Registration',
    hi: 'नया कारीगर खाता बनाएं',
    gu: 'નવું કારીગર ખાતું બનાવો',
  },
  emailLabel: {
    en: 'Email Address',
    hi: 'ईमेल पता',
    gu: 'ઈમેલ સરનામું',
  },
  passwordLabel: {
    en: 'Password (min 8 characters)',
    hi: 'पासवर्ड (कम से कम 8 अक्षर)',
    gu: 'પાસવર્ડ (ઓછામાં ઓછા 8 અક્ષરો)',
  },
  submitLogin: {
    en: 'Enter My Shop',
    hi: 'दुकान में प्रवेश करें',
    gu: 'દુકાનમાં પ્રવેશ કરો',
  },
  submitSignup: {
    en: 'Create My Account',
    hi: 'खाता तैयार करें',
    gu: 'ખાતું બનાવો',
  },
  verificationCodeLabel: {
    en: 'Enter Email Verification Code',
    hi: 'ईमेल पर आया 6 अंकों का कोड दर्ज करें',
    gu: 'ઈમેલ પર આવેલ 6 અંકનો કોડ દાખલ કરો',
  },
  verifyCodeBtn: {
    en: 'Verify & Continue',
    hi: 'सत्यापित करें और आगे बढ़ें',
    gu: 'વેરિફાય કરો અને આગળ વધો',
  },
  logout: {
    en: 'Logout',
    hi: 'लॉग आउट',
    gu: 'લૉગ આઉટ',
  },

  // Home Screen
  greeting: {
    en: 'Welcome Artisan',
    hi: 'नमस्ते कारीगर साथी',
    gu: 'નમસ્તે કારીગર મિત્ર',
  },
  homeListenPrompt: {
    en: 'Tap Add Product to photograph and describe your craft. Tap My Shop to view your items.',
    hi: 'नया सामान जोड़ने के लिए बड़ा बटन दबाएं। अपनी वस्तुएं देखने के लिए मेरी दुकान पर जाएं।',
    gu: 'નવી વસ્તુ ઉમેરવા માટે મોટું બટન દબાવો. તમારો સામાન જોવા માટે મારી દુકાન પર જાઓ.',
  },
  btnBigAddProduct: {
    en: 'Add Product',
    hi: 'नया सामान जोड़ें',
    gu: 'નવો સામાન ઉમેરો',
  },
  btnBigAddProductSub: {
    en: 'Photo, voice & AI price',
    hi: 'फोटो खींचें और बोलकर बनाएं',
    gu: 'ફોટો પાડો અને બોલીને બનાવો',
  },
  btnBigMyShop: {
    en: 'My Shop',
    hi: 'मेरी दुकान',
    gu: 'મારી દુકાન',
  },
  btnBigMyShopSub: {
    en: 'View catalog & items',
    hi: 'अपनी सूची देखें और हटाएं',
    gu: 'તમારો સામાન જુઓ અને મેનેજ કરો',
  },
  shareShop: {
    en: 'Share My Shop Link',
    hi: 'दुकान का लिंक शेयर करें',
    gu: 'દુકાનની લિંક શેર કરો',
  },
  shareCopied: {
    en: 'Shop link copied to clipboard!',
    hi: 'दुकान का लिंक कॉपी हो गया!',
    gu: 'દુકાનની લિંક કોપી થઈ ગઈ!',
  },
  exportCatalog: {
    en: 'Export Catalog (CSV)',
    hi: 'कैटलॉग डाउनलोड करें (CSV)',
    gu: 'કેટેલોગ ડાઉનલોડ કરો (CSV)',
  },
  impactScreen: {
    en: 'My Business Impact',
    hi: 'मेरा व्यावसायिक प्रभाव',
    gu: 'મારો વ્યવસાયિક પ્રભાવ',
  },

  // Impact & Stats
  productsCountLabel: {
    en: 'Products in Catalog',
    hi: 'कुल उत्पाद',
    gu: 'કુલ ઉત્પાદનો',
  },
  enquiriesCountLabel: {
    en: 'Buyer Inquiries Received',
    hi: 'ग्राहक पूछताछ',
    gu: 'ગ્રાહક પૂછપરછ',
  },
  minutesSavedLabel: {
    en: 'Time Saved with AI',
    hi: 'बचाया गया समय',
    gu: 'બચાવેલો સમય',
  },
  minutesSavedUnit: {
    en: 'Minutes saved',
    hi: 'मिनट की बचत',
    gu: 'મિનિટની બચત',
  },

  // Public Shop & Enquiries
  publicShopTitle: {
    en: 'Artisan Handicrafts Shop',
    hi: 'कारीगर हस्तकला भंडार',
    gu: 'કારીગર હસ્તકલા સ્ટોર',
  },
  enquireButton: {
    en: 'Send Inquiry / Order',
    hi: 'पूछताछ या ऑर्डर भेजें',
    gu: 'પૂછપરછ અથવા ઓર્ડર મોકલો',
  },
  buyerNameLabel: {
    en: 'Your Full Name',
    hi: 'आपका नाम',
    gu: 'તમારું નામ',
  },
  buyerContactLabel: {
    en: 'Phone Number / WhatsApp',
    hi: 'फोन या व्हाट्सएप नंबर',
    gu: 'ફોન અથવા વોટ્સએપ નંબર',
  },
  messageLabel: {
    en: 'Your Message or Custom Request',
    hi: 'संदेश या विशेष मांग',
    gu: 'સંદેશ અથવા વિશેષ વિનંતી',
  },
  sendEnquiryBtn: {
    en: 'Send Message to Artisan',
    hi: 'कारीगर को संदेश भेजें',
    gu: 'કારીગરને સંદેશ મોકલો',
  },
  enquirySentSuccess: {
    en: 'Your enquiry has been sent to the artisan!',
    hi: 'आपकी पूछताछ कारीगर तक पहुंच गई है!',
    gu: 'તમારી પૂછપરછ કારીગર સુધી પહોંચી ગઈ છે!',
  },

  // Add Product Wizard & AI Studio
  step1Title: {
    en: 'Photo',
    hi: 'फोटो',
    gu: 'ફોટો',
    mr: 'फोटो',
    ta: 'புகைப்படம்',
    bn: 'ছবি',
    te: 'ఫోటో',
    kn: 'ಚಿತ್ರ',
    pa: 'ਫੋਟੋ',
  },
  step2Title: {
    en: 'AI Studio',
    hi: 'स्टूडियो',
    gu: 'સ્ટુડિયો',
    mr: 'स्टुडिओ',
    ta: 'ஸ்டுடியோ',
    bn: 'স্টুডিও',
    te: 'స్టూడియో',
    kn: 'ಸ್ಟುಡಿಯೋ',
    pa: 'ਸਟੂਡੀਓ',
  },
  step3Title: {
    en: 'Voice',
    hi: 'आवाज़',
    gu: 'અવાજ',
    mr: 'आवाज',
    ta: 'குரல்',
    bn: 'কণ্ঠস্বর',
    te: 'స్వరం',
    kn: 'ಧ್ವನಿ',
    pa: 'ਆਵਾਜ਼',
  },
  step4Title: {
    en: 'Catalog',
    hi: 'विवरण',
    gu: 'વિગત',
    mr: 'तपशील',
    ta: 'விவரம்',
    bn: 'ক্যাটালগ',
    te: 'వివరాలు',
    kn: 'ವಿವರಗಳು',
    pa: 'ਵੇਰਵਾ',
  },
  step5Title: {
    en: 'Price',
    hi: 'मूल्य',
    gu: 'ભાવ',
    mr: 'किंमत',
    ta: 'விலை',
    bn: 'দাম',
    te: 'ధర',
    kn: 'ಬೆಲೆ',
    pa: 'ਕੀਮਤ',
  },
  capturePhotoPrompt: {
    en: 'Capture Your Craft Photo',
    hi: 'अपने शिल्प की फोटो खींचें',
    gu: 'તમારી હસ્તકળાનો ફોટો પાડો',
  },
  cameraButton: {
    en: 'Tap to Take Photo / Choose File',
    hi: 'फोटो खींचने या फाइल चुनने के लिए दबाएं',
    gu: 'ફોટો પાડવા અથવા પસંદ કરવા દબાવો',
  },
  nextToStudio: {
    en: 'Next: Enhance in AI Studio',
    hi: 'अगला: फोटो संवारें',
    gu: 'આગળ: AI સ્ટુડિયોમાં સુધારો',
  },
  photoQualityTips: {
    en: 'Photo Quality Feedback',
    hi: 'फोटो गुणवत्ता सुझाव',
    gu: 'ફોટો ગુણવત્તા સૂચન',
  },
  detectedCategory: {
    en: 'Detected Category',
    hi: 'पहचानी गई श्रेणी',
    gu: 'ઓળખાયેલી શ્રેણી',
  },
  bgChoiceWhite: {
    en: 'White',
    hi: 'सफेद',
    gu: 'સફેદ',
  },
  bgChoiceCream: {
    en: 'Warm Ivory',
    hi: 'क्रीम (पारंपरिक)',
    gu: 'ક્રીમ (પરંપરાગત)',
  },
  bgChoiceBlack: {
    en: 'Rich Black',
    hi: 'शाही काला',
    gu: 'શાહી કાળો',
  },
  beforeAfterComparison: {
    en: 'Compare: Original vs Studio',
    hi: 'तुलना: मूल फोटो बनाम स्टूडियो',
    gu: 'સરખામણી: મૂળ વિરુદ્ધ સ્ટુડિયો',
  },
  voicePrompt: {
    en: 'Tell the story of your craft in your language',
    hi: 'अपनी मातृभाषा में शिल्प की कहानी बोलकर बताएं',
    gu: 'તમારી ભાષામાં હસ્તકળા વિશે બોલીને જણાવો',
  },
  micStart: {
    en: 'Tap Mic to Speak',
    hi: 'बोलने के लिए माइक दबाएं',
    gu: 'બોલવા માટે માઇક દબાવો',
  },
  micListening: {
    en: 'Listening... (Tap to stop)',
    hi: 'सुन रहे हैं... (रुकने के लिए दबाएं)',
    gu: 'સાંભળી રહ્યા છીએ... (બંધ કરવા દબાવો)',
  },
  speechNotSupported: {
    en: 'Speech recognition is not supported in this browser. Please type below.',
    hi: 'इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया नीचे लिखकर बताएं।',
    gu: 'આ બ્રાઉઝરમાં અવાજ સુવિધા નથી. કૃપા કરીને નીચે લખો.',
  },
  transcriptLabel: {
    en: 'Craft Voice Story (Editable)',
    hi: 'शिल्प का विवरण (आप बदलाव भी कर सकते हैं)',
    gu: 'હસ્તકળાની વિગત (તમે સુધારી શકો છો)',
  },
  nextToCatalog: {
    en: 'Generate AI Catalog',
    hi: 'एआई कैटलॉग बनाएं',
    gu: 'AI કેટેલોગ બનાવો',
  },
  editCatalog: {
    en: 'Edit Details',
    hi: 'विवरण सुधारें',
    gu: 'વિગત સુધારો',
  },
  saveEdit: {
    en: 'Save Edits',
    hi: 'सुधार सुरक्षित करें',
    gu: 'સુધારો સેવ કરો',
  },
  nextToPrice: {
    en: 'Next: Price Assistant',
    hi: 'अगला: मूल्य तय करें',
    gu: 'આગળ: યોગ્ય ભાવ નક્કી કરો',
  },
  materialCostLabel: {
    en: 'Material Cost (₹)',
    hi: 'सामग्री व कच्चा माल लागत (₹)',
    gu: 'કાચો માલ ખર્ચ (₹)',
  },
  hoursWorkedLabel: {
    en: 'Artisan Work Hours',
    hi: 'बनाने में लगे घंटे',
    gu: 'બનાવવામાં લાગેલા કલાકો',
  },
  quantityLabel: {
    en: 'Quantity Produced',
    hi: 'कुल नग / मात्रा',
    gu: 'કુલ નંગ / જથ્થો',
  },
  calculatePriceBtn: {
    en: 'Calculate Fair-Trade Price',
    hi: 'उचित मूल्य की गणना करें',
    gu: 'યોગ્ય ભાવ ગણો',
  },
  priceGaugeMin: {
    en: 'Cost Floor',
    hi: 'न्यूनतम लागत',
    gu: 'ન્યૂનતમ ખર્ચ',
  },
  priceGaugeSuggested: {
    en: 'Recommended Fair Price',
    hi: 'सुझाया गया उचित मूल्य',
    gu: 'ભલામણ કરેલ ભાવ',
  },
  priceGaugeMax: {
    en: 'Premium Boutique',
    hi: 'प्रीमियम मूल्य',
    gu: 'પ્રીમિયમ ભાવ',
  },
  useThisPrice: {
    en: 'Use This Price',
    hi: 'यह मूल्य चुनें',
    gu: 'આ ભાવ પસંદ કરો',
  },
  customPriceLabel: {
    en: 'Final Selling Price (₹)',
    hi: 'अंतिम विक्रय मूल्य (₹)',
    gu: 'અંતિમ વેચાણ ભાવ (₹)',
  },
  saveProductBtn: {
    en: 'Save & Publish to My Shop',
    hi: 'दुकान में सुरक्षित करें',
    gu: 'દુકાનમાં સેવ કરો',
  },
  productSavedSuccess: {
    en: 'Product Added to Your Shop!',
    hi: 'उत्पाद आपकी दुकान में जुड़ गया!',
    gu: 'સામાન તમારી દુકાનમાં ઉમેરાઈ ગયો!',
  },
  shareOnWhatsApp: {
    en: 'Share on WhatsApp',
    hi: 'व्हाट्सएप पर शेयर करें',
    gu: 'વોટ્સએપ પર શેર કરો',
  },
  addAnother: {
    en: 'Add Another Product',
    hi: 'एक और सामान जोड़ें',
    gu: 'બીજી વસ્તુ ઉમેરો',
  },
  goToMyShop: {
    en: 'Go to My Shop',
    hi: 'मेरी दुकान देखें',
    gu: 'મારી દુકાન જુઓ',
  },

  // System & Offline Alerts
  offlineAlert: {
    en: 'You are currently offline. Changes will sync when reconnected.',
    hi: 'आप ऑफलाइन हैं। इंटरनेट जुड़ने पर बदलाव सुरक्षित होंगे।',
    gu: 'તમે ઑફલાઇન છો. ઇન્ટરનેટ કનેક્ટ થતાં બદલાવો સેવ થશે.',
  },
  dailyLimitAlert: {
    en: 'Daily AI limit reached (20 actions per day). Please try again tomorrow.',
    hi: 'दैनिक एआई सीमा (20 कार्य) समाप्त हो गई है। कृपया कल पुनः प्रयास करें।',
    gu: 'દૈનિક AI મર્યાદા (20 ક્રિયાઓ) પૂર્ણ થઈ છે. કૃપા કરીને આવતીકાલે પ્રયાસ કરો.',
  },
  readAloud: {
    en: 'Read aloud',
    hi: 'सुनें',
    gu: 'સાંભળો',
  },
};

/**
 * Translation helper with graceful fallback to English.
 */
export function t(key, lang = 'hi') {
  const item = DICTIONARY[key];
  if (!item) return key;
  return item[lang] || item['hi'] || item['en'] || key;
}

/**
 * Text-to-speech helper utilizing Web Speech API
 */
export function speakText(text, langCode = 'hi-IN') {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95; // Slightly slower, clear cadence for low-literacy clarity
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err);
  }
}
