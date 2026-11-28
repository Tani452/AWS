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
    en: 'Kaarigar',
    hi: 'कारीगर',
    gu: 'કારીગર',
    mr: 'कारीगर',
    ta: 'காரிகர்',
    bn: 'কারিগর',
    te: 'కారికర్',
    kn: 'ಕಾರಿಗರ್',
    pa: 'ਕਾਰੀਗਰ',
  },
  tagline: {
    en: 'Your AI Artisan Business Manager',
    hi: 'कारीगरों का अपना डिजिटल व्यापार साथी',
    gu: 'કારીગરોનો પોતાનો ડિજિટલ વેપાર સાથી',
    mr: 'कारीगरांचा आपला डिजिटल व्यवसाय साथीदार',
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
    en: 'Namaste! Kaarigar helps you turn your handcrafted creations into digital catalogs and online sales in minutes.',
    hi: 'नमस्ते! कारीगर आपके हस्तशिल्प को कुछ ही मिनटों में ऑनलाइन दुकान और कैटलॉग में बदलने में मदद करता है।',
    gu: 'નમસ્તે! કારીગર તમારી હસ્તકળાને થોડી જ મિનિટોમાં ઓનલાઇન દુકાન અને કેટેલોગમાં ફેરવવામાં મદદ કરે છે.',
    mr: 'नमस्ते! कारीगर तुमच्या हस्तकलेला काही मिनिटांत ऑनलाइन दुकानात रूपांतरित करण्यात मदत करतो.',
    ta: 'வணக்கம்! காரிகர் உங்கள் கைவினைப் பொருட்களை சில நிமிடங்களில் ஆன்லைன் கடையாக மாற்ற உதவுகிறது.',
    bn: 'নমস্কার! কারিগর আপনার হস্তশিল্পকে কয়েক মিনিটের মধ্যে অনলাইন দোকানে পরিণত করতে সাহায্য করে।',
    te: 'నమస్కారం! కారికర్ మీ హస్తకళను కొన్ని నిమిషాల్లో ఆన్‌లైన్ దుకాణంగా మార్చడంలో సహాయపడుతుంది.',
    kn: 'ನಮಸ್ಕಾರ! ಕಾರಿಗರ್ ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತುಗಳನ್ನು ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅಂಗಡಿಯಾಗಿ ಪರಿವರ್ತಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    pa: 'ਨਮਸਤੇ! ਕਾਰੀਗਰ ਤੁਹਾਡੀ ਦਸਤਕਾਰੀ ਨੂੰ ਕੁਝ ਹੀ ਮਿੰਟਾਂ ਵਿੱਚ ਆਨਲਾਈਨ ਦੁਕਾਨ ਵਿੱਚ ਬਦਲਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।',
  },
  getStarted: {
    en: 'Get Started',
    hi: 'आगे बढ़ें',
    gu: 'શરૂ કરો',
    mr: 'पुढे जा',
    ta: 'தொடங்கவும்',
    bn: 'শুরু করুন',
    te: 'ప్రారంభించండి',
    kn: 'ಮುಂದೆ ಸಾಗಿ',
    pa: 'ਅੱਗੇ ਵਧੋ',
  },

  // Auth Screen
  login: {
    en: 'Login',
    hi: 'लॉग इन करें',
    gu: 'લૉગ ઇન કરો',
    mr: 'लॉग इन करा',
    ta: 'உள்நுழைக',
    bn: 'লগ ইন করুন',
    te: 'లాగిన్ అవ్వండి',
    kn: 'ಲಾಗಿನ್ ಮಾಡಿ',
    pa: 'ਲਾਗ ਇਨ ਕਰੋ',
  },
  signup: {
    en: 'New Artisan Registration',
    hi: 'नया कारीगर खाता बनाएं',
    gu: 'નવું કારીગર ખાતું બનાવો',
    mr: 'नवीन कारागीर नोंदणी',
    ta: 'புதிய கைவினைஞர் பதிவு',
    bn: 'নতুন কারিগর নিবন্ধন',
    te: 'కొత్త కళాకారుని నమోదు',
    kn: 'ಹೊಸ ಕುಶಲಕರ್ಮಿ ನೋಂದಣಿ',
    pa: 'ਨਵਾਂ ਕਾਰੀਗਰ ਖਾਤਾ ਬਣਾਓ',
  },
  emailLabel: {
    en: 'Email Address',
    hi: 'ईमेल पता',
    gu: 'ઈમેલ સરનામું',
    mr: 'ईमेल पत्ता',
    ta: 'மின்னஞ்சல் முகவரி',
    bn: 'ইমেল ঠিকানা',
    te: 'ఇమెయిల్ చిరునామా',
    kn: 'ಇಮೇಲ್ ವಿಳಾಸ',
    pa: 'ਈਮੇਲ ਪਤਾ',
  },
  passwordLabel: {
    en: 'Password (min 8 characters)',
    hi: 'पासवर्ड (कम से कम 8 अक्षर)',
    gu: 'પાસવર્ડ (ઓછામાં ઓછા 8 અક્ષરો)',
    mr: 'पासवर्ड (किमान ८ वर्ण)',
    ta: 'கடவுச்சொல் (குறைந்தது 8 எழுத்துக்கள்)',
    bn: 'পাসওয়ার্ড (কমপক্ষে ৮টি অক্ষর)',
    te: 'పాస్‌వర్డ్ (కనీసం 8 అక్షరాలు)',
    kn: 'ಪಾಸ್‌ವರ್ಡ್ (ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು)',
    pa: 'ਪਾਸਵਰਡ (ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰ)',
  },
  submitLogin: {
    en: 'Enter My Shop',
    hi: 'दुकान में प्रवेश करें',
    gu: 'દુકાનમાં પ્રવેશ કરો',
    mr: 'दुकानात प्रवेश करा',
    ta: 'என் கடைக்குள் நுழைக',
    bn: 'আমার দোকানে প্রবেশ করুন',
    te: 'నా దుకాణంలోకి ప్రవేశించండి',
    kn: 'ನನ್ನ ಅಂಗಡಿಗೆ ಪ್ರವೇಶಿಸಿ',
    pa: 'ਦੁਕਾਨ ਵਿੱਚ ਦਾਖਲ ਹੋਵੋ',
  },
  submitSignup: {
    en: 'Create My Account',
    hi: 'खाता तैयार करें',
    gu: 'ખાતું બનાવો',
    mr: 'खाते तयार करा',
    ta: 'கணக்கை உருவாக்குங்கள்',
    bn: 'অ্যাকাউন্ট তৈরি করুন',
    te: 'ఖాతాను సృష్టించండి',
    kn: 'ಖಾತೆ ರಚಿಸಿ',
    pa: 'ਖਾਤਾ ਬਣਾਓ',
  },
  verificationCodeLabel: {
    en: 'Enter Email Verification Code',
    hi: 'ईमेल पर आया 6 अंकों का कोड दर्ज करें',
    gu: 'ઈમેલ પર આવેલ 6 અંકનો કોડ દાખલ કરો',
    mr: 'ईमेलवरील ६ अंकी कोड टाका',
    ta: 'மின்னஞ்சல் சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்',
    bn: 'ইমেলের ৬ সংখ্যার কোড লিখুন',
    te: 'ఇమెయిల్ ధృవీకరణ కోడ్‌ను నమోదు చేయండి',
    kn: 'ಇಮೇಲ್ ಪರಿಶೀಲನಾ ಕೋಡ್ ನಮೂದಿಸಿ',
    pa: 'ਈਮੇਲ ਵੈਰੀਫਿਕੇਸ਼ਨ ਕੋਡ ਦਰਜ ਕਰੋ',
  },
  verifyCodeBtn: {
    en: 'Verify & Continue',
    hi: 'सत्यापित करें और आगे बढ़ें',
    gu: 'વેરિફાય કરો અને આગળ વધો',
    mr: 'सत्यापित करा आणि पुढे जा',
    ta: 'சரிபார்த்து தொடரவும்',
    bn: 'যাচাই করে এগিয়ে যান',
    te: 'ధృవీకరించి కొనసాగించండి',
    kn: 'ಪರಿಶೀಲಿಸಿ ಮುಂದುವರಿಯಿರಿ',
    pa: 'ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ',
  },
  logout: {
    en: 'Logout',
    hi: 'लॉग आउट',
    gu: 'લૉગ આઉટ',
    mr: 'लॉग आउट',
    ta: 'வெளியேறு',
    bn: 'লগ আউট',
    te: 'లాగ్ అవుట్',
    kn: 'ಲಾಗ್ ಔಟ್',
    pa: 'ਲਾਗ ਆਊਟ',
  },

  // Home Screen
  greeting: {
    en: 'Welcome Artisan',
    hi: 'नमस्ते कारीगर साथी',
    gu: 'નમસ્તે કારીગર મિત્ર',
    mr: 'नमस्ते कारागीर मित्र',
    ta: 'வணக்கம் கைவினைஞரே',
    bn: 'স্বাগতম কারিগর বন্ধু',
    te: 'స్వాగతం కళాకారుడా',
    kn: 'ಸ್ವಾಗತ ಕುಶಲಕರ್ಮಿ',
    pa: 'ਜੀ ਆਇਆਂ ਨੂੰ ਕਾਰੀਗਰ ਵੀਰ',
  },
  homeListenPrompt: {
    en: 'Tap Add Product to photograph and describe your craft. Tap My Shop to view your items.',
    hi: 'नया सामान जोड़ने के लिए बड़ा बटन दबाएं। अपनी वस्तुएं देखने के लिए मेरी दुकान पर जाएं।',
    gu: 'નવી વસ્તુ ઉમેરવા માટે મોટું બટન દબાવો. તમારો સામાન જોવા માટે મારી દુકાન પર જાઓ.',
    mr: 'नवीन वस्तू जोडण्यासाठी मोठे बटण दाबा. तुमचा माल पाहण्यासाठी माझ्या दुकानात जा.',
    ta: 'புதிய பொருளைச் சேர்க்க பொத்தானை அழுத்தவும். உங்கள் பொருட்களைப் பார்க்க என் கடைக்குச் செல்லவும்.',
    bn: 'নতুন পণ্য যোগ করতে বড় বোতামটি চাপুন। আপনার জিনিসপত্র দেখতে আমার দোকানে যান।',
    te: 'కొత్త వస్తువును జోడించడానికి బటన్‌ను నొక్కండి. మీ వస్తువులను చూడటానికి నా దుకాణానికి వెళ్లండి.',
    kn: 'ಹೊಸ ವಸ್ತು ಸೇರಿಸಲು ದೊಡ್ಡ ಬಟನ್ ಒತ್ತಿರಿ. ನಿಮ್ಮ ವಸ್ತುಗಳನ್ನು ನೋಡಲು ನನ್ನ ಅಂಗಡಿಗೆ ಹೋಗಿ.',
    pa: 'ਨਵਾਂ ਸਮਾਨ ਜੋੜਨ ਲਈ ਵੱਡਾ ਬਟਨ ਦਬਾਓ। ਆਪਣੀਆਂ ਵਸਤੂਆਂ ਵੇਖਣ ਲਈ ਮੇਰੀ ਦੁਕਾਨ ਤੇ ਜਾਓ।',
  },
  btnBigAddProduct: {
    en: 'Add Product',
    hi: 'नया सामान जोड़ें',
    gu: 'નવો સામાન ઉમેરો',
    mr: 'नवीन वस्तू जोडा',
    ta: 'பொருளைச் சேர்க்க',
    bn: 'পণ্য যোগ করুন',
    te: 'వస్తువును జోడించండి',
    kn: 'ವಸ್ತು ಸೇರಿಸಿ',
    pa: 'ਨਵਾਂ ਸਮਾਨ ਜੋੜੋ',
  },
  btnBigAddProductSub: {
    en: 'Photo, voice & AI price',
    hi: 'फोटो खींचें और बोलकर बनाएं',
    gu: 'ફોટો પાડો અને બોલીને બનાવો',
    mr: 'फोटो काढा आणि बोलून बनवा',
    ta: 'புகைப்படம், குரல் மற்றும் விலை',
    bn: 'ছবি তুলুন এবং মুখে বলে বানান',
    te: 'ఫోటో తీసి మాట్లాడి ధర నిర్ణయించండి',
    kn: 'ಫೋಟೋ ಮತ್ತು ಧ್ವನಿ ಮೂಲಕ ಬೆಲೆ',
    pa: 'ਫੋਟੋ ਖਿੱਚੋ ਅਤੇ ਬੋਲ ਕੇ ਬਣਾਓ',
  },
  btnBigMyShop: {
    en: 'My Shop',
    hi: 'मेरी दुकान',
    gu: 'મારી દુકાન',
    mr: 'माझे दुकान',
    ta: 'என் கடை',
    bn: 'আমার দোকান',
    te: 'నా దుకాణం',
    kn: 'ನನ್ನ ಅಂಗಡಿ',
    pa: 'ਮੇਰੀ ਦੁਕਾਨ',
  },
  btnBigMyShopSub: {
    en: 'View catalog & items',
    hi: 'अपनी सूची देखें और हटाएं',
    gu: 'તમારો સામાન જુઓ અને મેનેજ કરો',
    mr: 'कॅटलॉग आणि वस्तू पहा',
    ta: 'பட்டியல் மற்றும் பொருட்களைக் காண்க',
    bn: 'ক্যাটালগ ও পণ্য দেখুন',
    te: 'జాబితా మరియు వస్తువులను చూడండి',
    kn: 'ಕ್ಯಾಟಲಾಗ್ ಮತ್ತು ವಸ್ತುಗಳನ್ನು ನೋಡಿ',
    pa: 'ਕੈਟਾਲਾਗ ਅਤੇ ਵਸਤੂਆਂ ਵੇਖੋ',
  },
  shareShop: {
    en: 'Share My Shop Link',
    hi: 'दुकान का लिंक शेयर करें',
    gu: 'દુકાનની લિંક શેર કરો',
    mr: 'दुकानाची लिंक शेअर करा',
    ta: 'கடை இணைப்பைப் பகிரவும்',
    bn: 'দোকানের লিঙ্ক শেয়ার করুন',
    te: 'దుకాణం లింక్ షేర్ చేయండి',
    kn: 'ಅಂಗಡಿಯ ಲಿಂಕ್ ಹಂಚಿಕೊಳ್ಳಿ',
    pa: 'ਦੁਕਾਨ ਦਾ ਲਿੰਕ ਸ਼ੇਅਰ ਕਰੋ',
  },
  shareCopied: {
    en: 'Shop link copied to clipboard!',
    hi: 'दुकान का लिंक कॉपी हो गया!',
    gu: 'દુકાનની લિંક કોપી થઈ ગઈ!',
    mr: 'दुकानाची लिंक कॉपी झाली आहे!',
    ta: 'கடை இணைப்பு நகலெடுக்கப்பட்டது!',
    bn: 'দোকানের লিঙ্ক কপি হয়েছে!',
    te: 'దుకాణం లింక్ కాపీ చేయబడింది!',
    kn: 'ಅಂಗಡಿಯ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!',
    pa: 'ਦੁਕਾਨ ਦਾ ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ!',
  },
  exportCatalog: {
    en: 'Export Catalog (CSV)',
    hi: 'कैटलॉग डाउनलोड करें (CSV)',
    gu: 'કેટેલોગ ડાઉનલોડ કરો (CSV)',
    mr: 'कॅटलॉग डाउनलोड करा (CSV)',
    ta: 'பட்டியலை பதிவிறக்கு (CSV)',
    bn: 'ক্যাটালগ ডাউনলোড করুন (CSV)',
    te: 'జాబితాను డౌన్‌లోడ్ చేయండి (CSV)',
    kn: 'ಕ್ಯಾಟಲಾಗ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (CSV)',
    pa: 'ਕੈਟਾਲਾਗ ਡਾਊਨਲੋਡ ਕਰੋ (CSV)',
  },
  impactScreen: {
    en: 'My Business Impact',
    hi: 'मेरा व्यावसायिक प्रभाव',
    gu: 'મારો વ્યવસાયિક પ્રભાવ',
    mr: 'माझा व्यवसाय प्रभाव',
    ta: 'என் வணிக தாக்கம்',
    bn: 'আমার ব্যবসায়িক প্রভাব',
    te: 'నా వ్యాపార ప్రభావం',
    kn: 'ನನ್ನ ವ್ಯಾಪಾರದ ಪ್ರಭಾವ',
    pa: 'ਮੇਰਾ ਵਪਾਰਕ ਪ੍ਰਭਾਵ',
  },

  // Impact & Stats
  productsCountLabel: {
    en: 'Products in Catalog',
    hi: 'कुल उत्पाद',
    gu: 'કુલ ઉત્પાદનો',
    mr: 'एकूण उत्पादने',
    ta: 'மொத்த தயாரிப்புகள்',
    bn: 'মোট পণ্য',
    te: 'మొత్తం ఉత్పత్తులు',
    kn: 'ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು',
    pa: 'ਕੁੱਲ ਉਤਪਾਦ',
  },
  enquiriesCountLabel: {
    en: 'Buyer Inquiries Received',
    hi: 'ग्राहक पूछताछ',
    gu: 'ગ્રાહક પૂછપરછ',
    mr: 'ग्राहक चौकशी',
    ta: 'வாங்குபவர் விசாரணைகள்',
    bn: 'ক্রেতার অনুসন্ধান',
    te: 'కొనుగోలుదారు విచారణలు',
    kn: 'ಖರೀದಿದಾರರ ವಿಚಾರಣೆಗಳು',
    pa: 'ਗਾਹਕ ਪੁੱਛਗਿੱਛ',
  },
  viewEnquiries: {
    en: 'Buyer Inquiries',
    hi: 'ग्राहक पूछताछ',
    gu: 'ગ્રાહક પૂછપરછ',
    mr: 'ग्राहक चौकशी',
    ta: 'வாங்குபவர் விசாரணைகள்',
    bn: 'ক্রেতার অনুসন্ধান',
    te: 'కొనుగోలుదారు విచారణలు',
    kn: 'ಖರೀದಿದಾರರ ವಿಚಾರಣೆಗಳು',
    pa: 'ਗਾਹਕ ਪੁੱਛਗਿੱਛ',
  },
  replyOnWhatsApp: {
    en: 'Reply on WhatsApp',
    hi: 'व्हाट्सएप पर उत्तर दें',
    gu: 'વોટ્સએપ પર જવાબ આપો',
    mr: 'व्हॉट्सअॅपवर उत्तर द्या',
    ta: 'வாட்ஸ்அப்பில் பதிலளிக்கவும்',
    bn: 'হোয়াটসঅ্যাপে উত্তর দিন',
    te: 'వాట్సాప్‌లో ప్రత్యుత్తరం ఇవ్వండి',
    kn: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಉತ್ತರಿಸಿ',
    pa: 'ਵਟਸਐਪ ਤੇ ਜਵਾਬ ਦਿਓ',
  },
  callBuyer: {
    en: 'Call Buyer',
    hi: 'ग्राहक को कॉल करें',
    gu: 'ગ્રાહકને કૉલ કરો',
    mr: 'ग्राहकाला कॉल करा',
    ta: 'வாங்குபவரை அழைக்கவும்',
    bn: 'ক্রেতাকে কল করুন',
    te: 'కొనుగోలుదారుకు కాల్ చేయండి',
    kn: 'ಖರೀದಿದಾರರಿಗೆ ಕರೆ ಮಾಡಿ',
    pa: 'ਗਾਹਕ ਨੂੰ ਕਾਲ ਕਰੋ',
  },
  noEnquiriesYet: {
    en: 'No customer inquiries yet. Share your shop link on WhatsApp to start receiving orders!',
    hi: 'अभी तक कोई ग्राहक पूछताछ नहीं आई है। ऑर्डर प्राप्त करने के लिए व्हाट्सएप पर अपनी दुकान का लिंक साझा करें!',
    gu: 'હજી સુધી કોઈ ગ્રાહક પૂછપરછ આવી નથી. ઓર્ડર મેળવવા માટે વૉટ્સએપ પર તમારી દુકાનની લિંક શેર કરો!',
    mr: 'अद्याप कोणतीही ग्राहक चौकशी आलेली नाही. ऑर्डर्स मिळविण्यासाठी व्हॉट्सअॅपवर तुमच्या दुकानाचा लिंक शेअर करा!',
    ta: 'இதுவரை வாடிக்கையாளர் விசாரணைகள் எதுவும் இல்லை. ஆர்டர்களைப் பெற வாட்ஸ்அப்பில் உங்கள் கடை இணைப்பைப் பகிரவும்!',
    bn: 'এখনও কোনো গ্রাহক অনুসন্ধান আসেনি। অর্ডার পেতে হোয়াটসঅ্যাপে আপনার দোকানের লিঙ্ক শেয়ার করুন!',
    te: 'ఇంకా ఎటువంటి కస్టమర్ విచారణలు రాలేదు. ఆర్డర్‌లను స్వీకరించడానికి వాట్సాప్‌లో మీ షాప్ లింక్‌ను షేర్ చేయండి!',
    kn: 'ಇನ್ನೂ ಯಾವುದೇ ಗ್ರಾಹಕರ ವಿಚಾರಣೆಗಳು ಬಂದಿಲ್ಲ. ಆರ್ಡರ್‌ಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಅಂಗಡಿಯ ಲಿಂಕ್ ಅನ್ನು ಹಂಚಿಕೊಳ್ಳಿ!',
    pa: 'ਅਜੇ ਤੱਕ ਕੋਈ ਗਾਹਕ ਪੁੱਛਗਿੱਛ ਨਹੀਂ ਆਈ। ਆਰਡਰ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਵਟਸਐਪ ਤੇ ਆਪਣੀ ਦੁਕਾਨ ਦਾ ਲਿੰਕ ਸਾਂਝਾ ਕਰੋ!',
  },
  minutesSavedLabel: {
    en: 'Time Saved with AI',
    hi: 'बचाया गया समय',
    gu: 'બચાવેલો સમય',
    mr: 'वाचलेला वेळ',
    ta: 'சேமிக்கப்பட்ட நேரம்',
    bn: 'বাঁচানো সময়',
    te: 'ఆదా అయిన సమయం',
    kn: 'ಉಳಿಸಿದ ಸಮಯ',
    pa: 'ਬਚਾਇਆ ਗਿਆ ਸਮਾਂ',
  },
  minutesSavedUnit: {
    en: 'Minutes saved',
    hi: 'मिनट की बचत',
    gu: 'મિનિટની બચત',
    mr: 'मिनिटांची बचत',
    ta: 'நிமிடங்கள் சேமிப்பு',
    bn: 'মিনিট সাশ্রয়',
    te: 'నిమిషాల ఆదా',
    kn: 'ನಿಮಿಷಗಳ ಉಳಿತಾಯ',
    pa: 'ਮਿੰਟਾਂ ਦੀ ਬਚਤ',
  },

  // Public Shop & Enquiries
  publicShopTitle: {
    en: 'Artisan Handicrafts Shop',
    hi: 'कारीगर हस्तकला भंडार',
    gu: 'કારીગર હસ્તકલા સ્ટોર',
    mr: 'कारागीर हस्तकला भांडार',
    ta: 'கைவினைப் பொருட்கள் அங்காடி',
    bn: 'কারিগর হস্তশিল্প ভাণ্ডার',
    te: 'చేతివృత్తుల హస్తకళల దుకాణం',
    kn: 'ಕುಶಲಕರ್ಮಿ ಕರಕುಶಲ ಮಳಿಗೆ',
    pa: 'ਕਾਰੀਗਰ ਦਸਤਕਾਰੀ ਭੰਡਾਰ',
  },
  enquireButton: {
    en: 'Send Inquiry / Order',
    hi: 'पूछताछ या ऑर्डर भेजें',
    gu: 'પૂછપરછ અથવા ઓર્ડર મોકલો',
    mr: 'चौकशी किंवा ऑर्डर पाठवा',
    ta: 'விசாரணை / ஆர்டர் அனுப்புக',
    bn: 'অনুসন্ধান বা অর্ডার পাঠান',
    te: 'విచారణ లేదా ఆర్డర్ పంపండి',
    kn: 'ವಿಚಾರಣೆ ಅಥವಾ ಆರ್ಡರ್ ಕಳುಹಿಸಿ',
    pa: 'ਪੁੱਛਗਿੱਛ ਜਾਂ ਆਰਡਰ ਭੇਜੋ',
  },
  buyerNameLabel: {
    en: 'Your Full Name',
    hi: 'आपका नाम',
    gu: 'તમારું નામ',
    mr: 'तुमचे नाव',
    ta: 'உங்கள் பெயர்',
    bn: 'আপনার নাম',
    te: 'మీ పేరు',
    kn: 'ನಿಮ್ಮ ಹೆಸರು',
    pa: 'ਤੁਹਾਡਾ ਨਾਮ',
  },
  buyerContactLabel: {
    en: 'Phone Number / WhatsApp',
    hi: 'फोन या व्हाट्सएप नंबर',
    gu: 'ફોન અથવા વોટ્સએપ નંબર',
    mr: 'फोन किंवा व्हॉट्सॲप नंबर',
    ta: 'தொலைபேசி / வாட்ஸ்அப் எண்',
    bn: 'ফোন বা হোয়াটসঅ্যাপ নম্বর',
    te: 'ఫోన్ లేదా వాట్సాప్ నంబర్',
    kn: 'ಫೋನ್ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ',
    pa: 'ਫੋਨ ਜਾਂ ਵਟਸਐਪ ਨੰਬਰ',
  },
  messageLabel: {
    en: 'Your Message or Custom Request',
    hi: 'संदेश या विशेष मांग',
    gu: 'સંદેશ અથવા વિશેષ વિનંતી',
    mr: 'संदेश किंवा विशेष मागणी',
    ta: 'உங்கள் செய்தி அல்லது தனிப்பயன் கோரிக்கை',
    bn: 'আপনার বার্তা বা বিশেষ অনুরোধ',
    te: 'మీ సందేశం లేదా ప్రత్యేక అభ్యర్థన',
    kn: 'ನಿಮ್ಮ ಸಂದೇಶ ಅಥವಾ ವಿಶೇಷ ಬೇಡಿಕೆ',
    pa: 'ਸੁਨੇਹਾ ਜਾਂ ਵਿਸ਼ੇਸ਼ ਮੰਗ',
  },
  sendEnquiryBtn: {
    en: 'Send Message to Artisan',
    hi: 'कारीगर को संदेश भेजें',
    gu: 'કારીગરને સંદેશ મોકલો',
    mr: 'कारागिराला संदेश पाठवा',
    ta: 'கைவினைஞருக்கு செய்தி அனுப்புக',
    bn: 'কারিগরকে বার্তা পাঠান',
    te: 'కళాకారునికి సందేశం పంపండి',
    kn: 'ಕುಶಲಕರ್ಮಿಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ',
    pa: 'ਕਾਰੀਗਰ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ',
  },
  enquirySentSuccess: {
    en: 'Your enquiry has been sent to the artisan!',
    hi: 'आपकी पूछताछ कारीगर तक पहुंच गई है!',
    gu: 'તમારી પૂછપરછ કારીગર સુધી પહોંચી ગઈ છે!',
    mr: 'तुमची चौकशी कारागिरापर्यंत पोहोचली आहे!',
    ta: 'உங்கள் விசாரணை கைவினைஞருக்கு அனுப்பப்பட்டது!',
    bn: 'আপনার অনুসন্ধান কারিগরের কাছে পৌঁছেছে!',
    te: 'మీ విచారణ కళాకారునికి చేరింది!',
    kn: 'ನಿಮ್ಮ ವಿಚಾರಣೆ ಕುಶಲಕರ್ಮಿಗೆ ತಲುಪಿದೆ!',
    pa: 'ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਕਾਰੀਗਰ ਤੱਕ ਪਹੁੰਚ ਗਈ ਹੈ!',
  },

  // Add Product Wizard Steps
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

  // Wizard Details
  capturePhotoPrompt: {
    en: 'Capture Your Craft Photo',
    hi: 'अपने शिल्प की फोटो खींचें',
    gu: 'તમારી હસ્તકળાનો ફોટો પાડો',
    mr: 'तुमच्या हस्तकलेचा फोटो काढा',
    ta: 'உங்கள் கைவினைப் புகைப்படத்தை எடுக்கவும்',
    bn: 'আপনার হস্তশিল্পের ছবি তুলুন',
    te: 'మీ హస్తకళ ఫోటో తీయండి',
    kn: 'ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತುವಿನ ಚಿತ್ರ ತೆಗೆಯಿರಿ',
    pa: 'ਆਪਣੀ ਦਸਤਕਾਰੀ ਦੀ ਫੋਟੋ ਖਿੱਚੋ',
  },
  cameraButton: {
    en: 'Tap to Take Photo / Choose File',
    hi: 'फोटो खींचने या फाइल चुनने के लिए दबाएं',
    gu: 'ફોટો પાડવા અથવા પસંદ કરવા દબાવો',
    mr: 'फोटो काढण्यासाठी किंवा निवडण्यासाठी दाबा',
    ta: 'புகைப்படம் எடுக்க அல்லது தேர்வு செய்ய அழுத்தவும்',
    bn: 'ছবি তুলতে বা বেছে নিতে চাপুন',
    te: 'ఫోటో తీయడానికి లేదా ఎంచుకోవడానికి నొక్కండి',
    kn: 'ಫೋಟೋ ತೆಗೆಯಲು ಅಥವಾ ಆಯ್ಕೆ ಮಾಡಲು ಒತ್ತಿರಿ',
    pa: 'ਫੋਟੋ ਖਿੱਚਣ ਜਾਂ ਫਾਈਲ ਚੁਣਨ ਲਈ ਦਬਾਓ',
  },
  capturePhotoSubtitle: {
    en: 'Take a clear picture in natural daylight. Images automatically optimize to max 1600px.',
    hi: 'प्राकृतिक रोशनी में साफ फोटो लें। फोटो अपने आप 1600px में संवर जाएगी।',
    gu: 'કુદરતી પ્રકાશમાં ચોખ્ખો ફોટો પાડો. ફોટો આપમેળે 1600px માં સેટ થઈ જશે.',
    mr: 'नैसर्गिक उजेडात स्वच्छ फोटो काढा. फोटो आपोआप 1600px मध्ये ऑप्टिमाइझ होतो.',
    ta: 'இயற்கை வெளிச்சத்தில் தெளிவான படம் எடுக்கவும். படம் தானாகவே 1600px-க்கு மாறும்.',
    bn: 'দিনের আলোতে পরিষ্কার ছবি তুলুন। ছবি স্বয়ংক্রিয়ভাবে ১৬০০ পিক্সেল হবে।',
    te: 'సహజ వెలుగులో స్పష్టమైన ఫోటో తీయండి. ఫోటో ఆటోమేటిక్‌గా 1600px కి సెట్ అవుతుంది.',
    kn: 'ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ. ಚಿತ್ರವು ಸ್ವಯಂಚಾಲಿತವಾಗಿ 1600px ಆಗುತ್ತದೆ.',
    pa: 'ਕੁਦਰਤੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਸਾਫ਼ ਫੋਟੋ ਖਿੱਚੋ। ਫੋਟੋ ਆਪਣੇ ਆਪ 1600px ਵਿੱਚ ਸੈੱਟ ਹੋ ਜਾਵੇਗੀ।',
  },
  takeLivePhoto: {
    en: 'Take Live Photo (Camera)',
    hi: 'कैमरे से लाइव फोटो लें',
    gu: 'કેમેરાથી લાઈવ ફોટો પાડો',
    mr: 'कॅमेऱ्याने थेट फोटो काढा',
    ta: 'கேமராவில் நேரலை படம் எடுக்கவும்',
    bn: 'ক্যামেরা দিয়ে সরাসরি ছবি তুলুন',
    te: 'కెమెరాతో ప్రత్యక్ష ఫోటో తీయండి',
    kn: 'ಕ್ಯಾಮೆರಾದಿಂದ ನೇರ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    pa: 'ਕੈਮਰੇ ਨਾਲ ਲਾਈਵ ਫੋਟੋ ਖਿੱਚੋ',
  },
  liveCameraSubtitle: {
    en: 'Opens your phone camera or laptop webcam directly',
    hi: 'अपने फोन का कैमरा या लैपटॉप का वेबकैम खोलें',
    gu: 'તમારા ફોનનો કેમેરો અથવા લેપટોપ વેબકેમ ખોલો',
    mr: 'तुमचा फोन कॅमेरा किंवा लॅपटॉप वेबकॅम थेट उघडा',
    ta: 'உங்கள் தொலைபேசி அல்லது மடிக்கணினி கேமராவைத் திறக்கவும்',
    bn: 'আপনার ফোন বা ল্যাপটপের ক্যামেরা সরাসরি চালু করুন',
    te: 'మీ ఫోన్ లేదా ల్యాప్‌టాప్ కెమెరాను నేరుగా తెరవండి',
    kn: 'ನಿಮ್ಮ ಫೋನ್ ಅಥವಾ ಲ್ಯಾಪ್ಟಾಪ್ ಕ್ಯಾಮೆರಾವನ್ನು ನೇರವಾಗಿ ತೆರೆಯಿರಿ',
    pa: 'ਆਪਣਾ ਫ਼ੋਨ ਜਾਂ ਲੈਪਟਾਪ ਕੈਮਰਾ ਸਿੱਧਾ ਖੋਲ੍ਹੋ',
  },
  chooseFromFiles: {
    en: 'Choose Photo from Files / Gallery',
    hi: 'गैलरी या फाइल से फोटो चुनें',
    gu: 'ગેલેરી અથવા ફાઇલમાંથી ફોટો પસંદ કરો',
    mr: 'गॅलरी किंवा फाइलमधून फोटो निवडा',
    ta: 'கேலரி அல்லது கோப்பிலிருந்து தேர்ந்தெடுக்கவும்',
    bn: 'গ্যালারি বা ফাইল থেকে ছবি নির্বাচন করুন',
    te: 'గ్యాలరీ లేదా ఫైల్ నుండి ఫోటోను ఎంచుకోండి',
    kn: 'ಗ್ಯಾಲರಿ ಅಥವಾ ಫೈಲ್‌ನಿಂದ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ',
    pa: 'ਗੈਲਰੀ ਜਾਂ ਫਾਈਲ ਵਿੱਚੋਂ ਫੋਟੋ ਚੁਣੋ',
  },
  closeCamera: {
    en: 'Close',
    hi: 'बंद करें',
    gu: 'બંધ કરો',
    mr: 'बंद करा',
    ta: 'மூடு',
    bn: 'বন্ধ করুন',
    te: 'మూసివేయండి',
    kn: 'ಮುಚ್ಚಿ',
    pa: 'ਬੰਦ ਕਰੋ',
  },
  retakePhoto: {
    en: 'Retake Photo',
    hi: 'दोबारा फोटो लें',
    gu: 'ફરીથી ફોટો પાડો',
    mr: 'पुन्हा फोटो काढा',
    ta: 'மீண்டும் படம் எடுக்கவும்',
    bn: 'আবার ছবি তুলুন',
    te: 'మరలా ఫోటో తీయండి',
    kn: 'ಮತ್ತೆ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    pa: 'ਦੁਬਾਰਾ ਫੋਟੋ ਖਿੱਚੋ',
  },
  nextToStudio: {
    en: 'Next: Enhance in AI Studio',
    hi: 'अगला: फोटो संवारें',
    gu: 'આગળ: AI સ્ટુડિયોમાં સુધારો',
    mr: 'पुढे: एआय स्टुडिओमध्ये सुधारा',
    ta: 'அடுத்து: AI ஸ்டுடியோவில் அழகுபடுத்துங்கள்',
    bn: 'পরবর্তী: AI স্টুডিওতে সুন্দর করুন',
    te: 'తదుపరి: AI స్టూడియోలో మెరుగుపరచండి',
    kn: 'ಮುಂದೆ: AI ಸ್ಟುಡಿಯೋದಲ್ಲಿ ಸುಧಾರಿಸಿ',
    pa: 'ਅਗਲਾ: AI ਸਟੂਡੀਓ ਵਿੱਚ ਸੁਧਾਰੋ',
  },
  nextToVoice: {
    en: 'Next: Voice Story',
    hi: 'अगला: बोलकर बताएं',
    gu: 'આગળ: બોલીને જણાવો',
    mr: 'पुढे: बोलून सांगा',
    ta: 'அடுத்து: குரல் விவரிப்பு',
    bn: 'পরবর্তী: মুখে বলে বর্ণনা দিন',
    te: 'తదుపరి: వాయిస్ వివరణ',
    kn: 'ಮುಂದೆ: ಧ್ವನಿ ವಿವರಣೆ',
    pa: 'ਅਗਲਾ: ਬੋਲ ਕੇ ਦੱਸੋ',
  },
  photoQualityTips: {
    en: 'Photo Quality Feedback',
    hi: 'फोटो गुणवत्ता सुझाव',
    gu: 'ફોટો ગુણવત્તા સૂચન',
    mr: 'फोटो गुणवत्ता अभिप्राय',
    ta: 'புகைப்பட தர கருத்து',
    bn: 'ছবির গুণমান পরামর্শ',
    te: 'ఫోటో నాణ్యత అభిప్రాయం',
    kn: 'ಫೋಟೋ ಗುಣಮಟ್ಟದ ಪ್ರತಿಕ್ರಿಯೆ',
    pa: 'ਫੋਟੋ ਗੁਣਵੱਤਾ ਸੁਝਾਅ',
  },
  detectedCategory: {
    en: 'Detected Category',
    hi: 'पहचानी गई श्रेणी',
    gu: 'ઓળખાયેલી શ્રેણી',
    mr: 'ओळखलेली श्रेणी',
    ta: 'கண்டறியப்பட்ட வகை',
    bn: 'শনাক্ত করা বিভাগ',
    te: 'గుర్తించబడిన వర్గం',
    kn: 'ಗುರುತಿಸಲಾದ ವರ್ಗ',
    pa: 'ਪਛਾਣੀ ਗਈ ਸ਼੍ਰੇਣੀ',
  },
  bgChoiceWhite: {
    en: 'White',
    hi: 'सफेद',
    gu: 'સફેદ',
    mr: 'पांढरा',
    ta: 'வெள்ளை',
    bn: 'সাদা',
    te: 'తెలుపు',
    kn: 'ಬಿಳಿ',
    pa: 'ਚਿੱਟਾ',
  },
  bgChoiceCream: {
    en: 'Warm Ivory',
    hi: 'क्रीम (पारंपरिक)',
    gu: 'ક્રીમ (પરંપરાગત)',
    mr: 'क्रीम (पारंपरिक)',
    ta: 'ஐவரி கிரீம்',
    bn: 'ক্রিম (ঐতিহ্যবাহী)',
    te: 'క్రీమ్ వర్ణం',
    kn: 'ಐವರಿ ಕ್ರೀಮ್',
    pa: 'ਕ੍ਰੀਮ (ਰਵਾਇਤੀ)',
  },
  bgChoiceBlack: {
    en: 'Rich Black',
    hi: 'शाही काला',
    gu: 'શાહી કાળો',
    mr: 'शाही काळा',
    ta: 'கருப்பு',
    bn: 'কালো',
    te: 'నలుపు',
    kn: 'ಕಪ್ಪು',
    pa: 'ਕਾਲਾ',
  },
  beforeAfterComparison: {
    en: 'Compare: Original vs Studio',
    hi: 'तुलना: मूल फोटो बनाम स्टूडियो',
    gu: 'સરખામણી: મૂળ વિરુદ્ધ સ્ટુડિયો',
    mr: 'तुलना: मूळ फोटो विरुद्ध स्टुडिओ',
    ta: 'ஒப்பீடு: அசல் மற்றும் ஸ்டுடியோ',
    bn: 'তুলনা: আসল বনাম স্টুডিও',
    te: 'పోలిక: అసలు వర్సెస్ స్టూడియో',
    kn: 'ಹೋಲಿಕೆ: ಮೂಲ vs ಸ್ಟುಡಿಯೋ',
    pa: 'ਤੁਲਨਾ: ਅਸਲ ਬਨਾਮ ਸਟੂਡੀਓ',
  },
  voicePrompt: {
    en: 'Tell the story of your craft in your language',
    hi: 'अपनी मातृभाषा में शिल्प की कहानी बोलकर बताएं',
    gu: 'તમારી ભાષામાં હસ્તકળા વિશે બોલીને જણાવો',
    mr: 'तुमच्या मातृभाषेत हस्तकलेबद्दल बोलून सांगा',
    ta: 'உங்கள் தாய்மொழியில் கைவினைப் பொருளின் கதையைப் பேசுங்கள்',
    bn: 'আপনার মাতৃভাষায় হস্তশিল্পের গল্প বলুন',
    te: 'మీ మాతృభాషలో హస్తకళ కథను మాట్లాడి చెప్పండి',
    kn: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಕರಕುಶಲ ಕಲೆಯ ಕಥೆಯನ್ನು ಮಾತನಾಡಿ',
    pa: 'ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਦਸਤਕਾਰੀ ਦੀ ਕਹਾਣੀ ਬੋਲ ਕੇ ਦੱਸੋ',
  },
  micStart: {
    en: 'Tap Mic to Speak',
    hi: 'बोलने के लिए माइक दबाएं',
    gu: 'બોલવા માટે માઇક દબાવો',
    mr: 'बोलण्यासाठी माइक दाबा',
    ta: 'பேச மைக்கை அழுத்தவும்',
    bn: 'কথা বলতে মাইক চাপুন',
    te: 'మాట్లాడటానికి మైక్ నొక్కండి',
    kn: 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿರಿ',
    pa: 'ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ',
  },
  micListening: {
    en: 'Listening... (Tap to stop)',
    hi: 'सुन रहे हैं... (रुकने के लिए दबाएं)',
    gu: 'સાંભળી રહ્યા છીએ... (બંધ કરવા દબાવો)',
    mr: 'ऐकत आहे... (थांबवण्यासाठी दाबा)',
    ta: 'கேட்கிறது... (நிறுத்த அழுத்தவும்)',
    bn: 'শুনছি... (থামাতে চাপুন)',
    te: 'వింటున్నాము... (ఆపడానికి నొక్కండి)',
    kn: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... (ನಿಲ್ಲಿಸಲು ಒತ್ತಿರಿ)',
    pa: 'ਸੁਣ ਰਹੇ ਹਾਂ... (ਰੋਕਣ ਲਈ ਦਬਾਓ)',
  },
  speechNotSupported: {
    en: 'Speech recognition is not supported in this browser. Please type below.',
    hi: 'इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया नीचे लिखकर बताएं।',
    gu: 'આ બ્રાઉઝરમાં અવાજ સુવિધા નથી. કૃપા કરીને નીચે લખો.',
    mr: 'या ब्राउझरमध्ये आवाज ओळख उपलब्ध नाही. कृपया खाली टाइप करा.',
    ta: 'இந்த உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை. கீழே தட்டச்சு செய்யவும்.',
    bn: 'এই ব্রাউজারে ভয়েস সমর্থন নেই। অনুগ্রহ করে নিচে টাইপ করুন।',
    te: 'ఈ బ్రౌజర్‌లో వాయిస్ సపోర్ట్ లేదు. దయచేసి క్రింద టైప్ చేయండి.',
    kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ.',
    pa: 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਆਵਾਜ਼ ਪਛਾਣ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਟਾਈਪ ਕਰੋ।',
  },
  transcriptLabel: {
    en: 'Craft Voice Story (Editable)',
    hi: 'शिल्प का विवरण (आप बदलाव भी कर सकते हैं)',
    gu: 'હસ્તકળાની વિગત (તમે સુધારી શકો છો)',
    mr: 'हस्तकलेचे वर्णन (बदल करू शकता)',
    ta: 'கைவினை விவரிப்பு (திருத்தக்கூடியது)',
    bn: 'হস্তশিল্পের বিবরণ (সম্পাদনাযোগ্য)',
    te: 'హస్తకళ వివరణ (సవరించవచ్చు)',
    kn: 'ಕರಕುಶಲ ವಿವರಣೆ (ಬದಲಾಯಿಸಬಹುದು)',
    pa: 'ਦਸਤਕਾਰੀ ਦਾ ਵੇਰਵਾ (ਬਦਲ ਸਕਦੇ ਹੋ)',
  },
  nextToCatalog: {
    en: 'Generate AI Catalog',
    hi: 'एआई कैटलॉग बनाएं',
    gu: 'AI કેટેલોગ બનાવો',
    mr: 'एआय कॅटलॉग तयार करा',
    ta: 'AI பட்டியலை உருவாக்கவும்',
    bn: 'AI ক্যাটালগ তৈরি করুন',
    te: 'AI కేటలాగ్‌ను రూపొందించండి',
    kn: 'AI ಕ್ಯಾಟಲಾಗ್ ರಚಿಸಿ',
    pa: 'AI ਕੈਟਾਲਾਗ ਬਣਾਓ',
  },
  editCatalog: {
    en: 'Edit Details',
    hi: 'विवरण सुधारें',
    gu: 'વિગત સુધારો',
    mr: 'तपशील बदला',
    ta: 'விவரங்களைத் திருத்தவும்',
    bn: 'বিবরণ সম্পাদনা করুন',
    te: 'వివరాలను సవరించండి',
    kn: 'ವಿವರಗಳನ್ನು ತಿದ್ದಿ',
    pa: 'ਵੇਰਵਾ ਸੁਧਾਰੋ',
  },
  saveEdit: {
    en: 'Save Edits',
    hi: 'सुधार सुरक्षित करें',
    gu: 'સુધારો સેવ કરો',
    mr: 'बदल जतन करा',
    ta: 'மாற்றங்களைச் சேமிக்கவும்',
    bn: 'সম্পাদনা সংরক্ষণ করুন',
    te: 'మార్పులను సేవ్ చేయండి',
    kn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    pa: 'ਸੁਧਾਰ ਸੇਵ ਕਰੋ',
  },
  nextToPrice: {
    en: 'Next: Price Assistant',
    hi: 'अगला: मूल्य तय करें',
    gu: 'આગળ: યોગ્ય ભાવ નક્કી કરો',
    mr: 'पुढे: योग्य किंमत ठरवा',
    ta: 'அடுத்து: விலை உதவியாளர்',
    bn: 'পরবর্তী: মূল্য নির্ধারণ করুন',
    te: 'తదుపరి: ధర సహాయకుడు',
    kn: 'ಮುಂದೆ: ಬೆಲೆ ಸಹಾಯಕ',
    pa: 'ਅਗਲਾ: ਮੁੱਲ ਤੈਅ ਕਰੋ',
  },
  materialCostLabel: {
    en: 'Material Cost (₹)',
    hi: 'सामग्री व कच्चा माल लागत (₹)',
    gu: 'કાચો માલ ખર્ચ (₹)',
    mr: 'कच्चा माल खर्च (₹)',
    ta: 'பொருள் செலவு (₹)',
    bn: 'কাঁচামাল খরচ (₹)',
    te: 'ముడి సరుకు ఖర్చు (₹)',
    kn: 'ಕಚ್ಚಾ ಸಾಮಗ್ರಿ ವೆಚ್ಚ (₹)',
    pa: 'ਕੱਚਾ ਮਾਲ ਖਰਚਾ (₹)',
  },
  hoursWorkedLabel: {
    en: 'Artisan Work Hours',
    hi: 'बनाने में लगे घंटे',
    gu: 'બનાવવામાં લાગેલા કલાકો',
    mr: 'लागलेले कामाचे तास',
    ta: 'வேலை செய்த மணிநேரம்',
    bn: 'কাজের সময় (ঘণ্টা)',
    te: 'పనిచేసిన గంటలు',
    kn: 'ಕೆಲಸ ಮಾಡಿದ ಗಂಟೆಗಳು',
    pa: 'ਬਣਾਉਣ ਵਿੱਚ ਲੱਗੇ ਘੰਟੇ',
  },
  quantityLabel: {
    en: 'Quantity Produced',
    hi: 'कुल नग / मात्रा',
    gu: 'કુલ નંગ / જથ્થો',
    mr: 'उत्पादित नग / संख्या',
    ta: 'உற்பத்தி செய்யப்பட்ட அளவு',
    bn: 'তৈরি করা সংখ্যা / পরিমাণ',
    te: 'ఉత్పత్తి పరిమాణం',
    kn: 'ಉತ್ಪಾದಿಸಿದ ಪ್ರಮಾಣ',
    pa: 'ਕੁੱਲ ਨਗ / ਮਾਤਰਾ',
  },
  calculatePriceBtn: {
    en: 'Calculate Fair-Trade Price',
    hi: 'उचित मूल्य की गणना करें',
    gu: 'યોગ્ય ભાવ ગણો',
    mr: 'वाजवी किंमत मोजा',
    ta: 'நியாயமான விலையைக் கணக்கிடுங்கள்',
    bn: 'ন্যায্য মূল্য গণনা করুন',
    te: 'సరసమైన ధరను లెక్కించండి',
    kn: 'ನ್ಯಾಯಯುತ ಬೆಲೆ ಲೆಕ್ಕಹಾಕಿ',
    pa: 'ਸਹੀ ਮੁੱਲ ਦਾ ਹਿਸਾਬ ਲਗਾਓ',
  },
  priceGaugeMin: {
    en: 'Cost Floor',
    hi: 'न्यूनतम लागत',
    gu: 'ન્યૂનતમ ખર્ચ',
    mr: 'किमान खर्च',
    ta: 'குறைந்தபட்ச செலவு',
    bn: 'ন্যূনতম খরচ',
    te: 'కనీస ఖర్చు',
    kn: 'ಕನಿಷ್ಠ ವೆಚ್ಚ',
    pa: 'ਘੱਟੋ-ਘੱਟ ਲਾਗਤ',
  },
  priceGaugeSuggested: {
    en: 'Recommended Fair Price',
    hi: 'सुझाया गया उचित मूल्य',
    gu: 'ભલામણ કરેલ ભાવ',
    mr: 'शिफारस केलेली वाजवी किंमत',
    ta: 'பரிந்துரைக்கப்பட்ட நியாய விலை',
    bn: 'প্রস্তাবিত ন্যায্য মূল্য',
    te: 'సిఫార్సు చేయబడిన సరసమైన ధర',
    kn: 'ಶಿಫಾರಸು ಮಾಡಿದ ನ್ಯಾಯಯುತ ಬೆಲೆ',
    pa: 'ਸੁਝਾਇਆ ਗਿਆ ਸਹੀ ਮੁੱਲ',
  },
  priceGaugeMax: {
    en: 'Premium Boutique',
    hi: 'प्रीमियम मूल्य',
    gu: 'પ્રીમિયમ ભાવ',
    mr: 'प्रीमियम किंमत',
    ta: 'பிரீமியம் விலை',
    bn: 'প্রিমিয়াম দাম',
    te: 'ప్రీమియం ధర',
    kn: 'ಪ್ರೀಮಿಯಂ ಬೆಲೆ',
    pa: 'ਪ੍ਰੀਮੀਅਮ ਮੁੱਲ',
  },
  useThisPrice: {
    en: 'Use This Price',
    hi: 'यह मूल्य चुनें',
    gu: 'આ ભાવ પસંદ કરો',
    mr: 'ही किंमत निवडा',
    ta: 'இந்த விலையைப் பயன்படுத்துங்கள்',
    bn: 'এই দামটি বেছে নিন',
    te: 'ఈ ధరను ఉపయోగించండి',
    kn: 'ಈ ಬೆಲೆ ಬಳಸಿ',
    pa: 'ਇਹ ਮੁੱਲ ਚੁਣੋ',
  },
  customPriceLabel: {
    en: 'Final Selling Price (₹)',
    hi: 'अंतिम विक्रय मूल्य (₹)',
    gu: 'અંતિમ વેચાણ ભાવ (₹)',
    mr: 'अंतिम विक्री किंमत (₹)',
    ta: 'இறுதி விற்பனை விலை (₹)',
    bn: 'চূড়ান্ত বিক্রয় মূল্য (₹)',
    te: 'చివరి విక్రయ ధర (₹)',
    kn: 'ಅಂತಿಮ ಮಾರಾಟ ಬೆಲೆ (₹)',
    pa: 'ਅੰਤਿਮ ਵਿਕਰੀ ਮੁੱਲ (₹)',
  },
  saveProductBtn: {
    en: 'Save & Publish to My Shop',
    hi: 'दुकान में सुरक्षित करें',
    gu: 'દુકાનમાં સેવ કરો',
    mr: 'दुकानात जतन करा',
    ta: 'கடையில் சேமித்து வெளியிடவும்',
    bn: 'দোকানে প্রকাশ করুন',
    te: 'దుకాణంలో భద్రపరచండి',
    kn: 'ಅಂಗಡಿಯಲ್ಲಿ ಉಳಿಸಿ',
    pa: 'ਦੁਕਾਨ ਵਿੱਚ ਸੇਵ ਕਰੋ',
  },
  productSavedSuccess: {
    en: 'Product Added to Your Shop!',
    hi: 'उत्पाद आपकी दुकान में जुड़ गया!',
    gu: 'સામાન તમારી દુકાનમાં ઉમેરાઈ ગયો!',
    mr: 'वस्तू तुमच्या दुकानात जोडली गेली आहे!',
    ta: 'பொருள் உங்கள் கடையில் சேர்க்கப்பட்டது!',
    bn: 'পণ্য আপনার দোকানে যোগ করা হয়েছে!',
    te: 'వస్తువు మీ దుకాణంలో చేర్చబడింది!',
    kn: 'ವಸ್ತು ನಿಮ್ಮ ಅಂಗಡಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!',
    pa: 'ਸਮਾਨ ਤੁਹਾਡੀ ਦੁਕਾਨ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਗਿਆ!',
  },
  shareOnWhatsApp: {
    en: 'Share on WhatsApp',
    hi: 'व्हाट्सएप पर शेयर करें',
    gu: 'વોટ્સએપ પર શેર કરો',
    mr: 'व्हॉट्सॲपवर शेअर करा',
    ta: 'வாட்ஸ்அப்பில் பகிரவும்',
    bn: 'হোয়াটসঅ্যাপে শেয়ার করুন',
    te: 'వాట్సాప్‌లో షేర్ చేయండి',
    kn: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ',
    pa: 'ਵਟਸਐਪ ਤੇ ਸ਼ੇਅਰ ਕਰੋ',
  },
  addAnother: {
    en: 'Add Another Product',
    hi: 'एक और सामान जोड़ें',
    gu: 'બીજી વસ્તુ ઉમેરો',
    mr: 'दुसरी वस्तू जोडा',
    ta: 'மற்றொரு பொருளைச் சேர்க்கவும்',
    bn: 'আরেকটি পণ্য যোগ করুন',
    te: 'మరొక వస్తువును జోడించండి',
    kn: 'ಇನ್ನೊಂದು ವಸ್ತು ಸೇರಿಸಿ',
    pa: 'ਇੱਕ ਹੋਰ ਸਮਾਨ ਜੋੜੋ',
  },
  goToMyShop: {
    en: 'Go to My Shop',
    hi: 'मेरी दुकान देखें',
    gu: 'મારી દુકાન જુઓ',
    mr: 'माझे दुकान पहा',
    ta: 'என் கடைக்குச் செல்லவும்',
    bn: 'আমার দোকানে যান',
    te: 'నా దుకాణానికి వెళ్లండి',
    kn: 'ನನ್ನ ಅಂಗಡಿಗೆ ಹೋಗಿ',
    pa: 'ਮੇਰੀ ਦੁਕਾਨ ਵੇਖੋ',
  },
  offlineAlert: {
    en: 'You are currently offline. Changes will sync when reconnected.',
    hi: 'आप ऑफलाइन हैं। इंटरनेट जुड़ने पर बदलाव सुरक्षित होंगे।',
    gu: 'તમે ઑફલાઇન છો. ઇન્ટરનેટ કનેક્ટ થતાં બદલાવો સેવ થશે.',
    mr: 'तुम्ही ऑफलाइन आहात. इंटरनेट जोडल्यावर बदल जतन होतील.',
    ta: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். இணையம் வந்ததும் சேமிக்கப்படும்.',
    bn: 'আপনি অফলাইনে আছেন। ইন্টারনেট সংযুক্ত হলে সংরক্ষিত হবে।',
    te: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. ఇంటర్నెట్ వచ్చినప్పుడు సేవ్ అవుతుంది.',
    kn: 'ನೀವು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ಅಂತರ್ಜಾಲ ಸಂಪರ್ಕವಾದಾಗ ಉಳಿಯುತ್ತದೆ.',
    pa: 'ਤੁਸੀਂ ਔਫਲਾਈਨ ਹੋ। ਇੰਟਰਨੈਟ ਜੁੜਨ ਤੇ ਬਦਲਾਅ ਸੇਵ ਹੋਣਗੇ।',
  },
  dailyLimitAlert: {
    en: 'Daily AI limit reached (20 actions per day). Please try again tomorrow.',
    hi: 'दैनिक एआई सीमा (20 कार्य) समाप्त हो गई है। कृपया कल पुनः प्रयास करें।',
    gu: 'દૈનિક AI મર્યાદા (20 ક્રિયાઓ) પૂર્ણ થઈ છે. કૃપા કરીને આવતીકાલે પ્રયાસ કરો.',
    mr: 'दैनिक एआय मर्यादा (२० कृती) संपली आहे. कृपया उद्या पुन्हा प्रयत्न करा.',
    ta: 'தினசரி AI வரம்பு முடிந்தது (ஒரு நாளைக்கு 20 செயல்கள்). நாளை முயற்சிக்கவும்.',
    bn: 'দৈনিক AI সীমা (২০টি অ্যাকশন) শেষ হয়েছে। অনুগ্রহ করে কাল চেষ্টা করুন।',
    te: 'రోజువారీ AI పరిమితి ముగిసింది (రోజుకు 20). దయచేసి రేపు మళ్లీ ప్రయత్నించండి.',
    kn: 'ದೈನಂದಿನ AI ಮಿತಿ ಮುಗಿದಿದೆ (ದಿನಕ್ಕೆ 20). ದಯವಿಟ್ಟು ನಾಳೆ ಪ್ರಯತ್ನಿಸಿ.',
    pa: 'ਰੋਜ਼ਾਨਾ AI ਸੀਮਾ ਪੂਰੀ ਹੋ ਗਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕੱਲ੍ਹ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
  },
  readAloud: {
    en: 'Read aloud',
    hi: 'सुनें',
    gu: 'સાંભળો',
    mr: 'ऐका',
    ta: 'கேட்க',
    bn: 'শুনুন',
    te: 'వినండి',
    kn: 'ಕೇಳಿ',
    pa: 'ਸੁਣੋ',
  },
  price: {
    en: 'Price',
    hi: 'मूल्य',
    gu: 'ભાવ',
    mr: 'किंमत',
    ta: 'விலை',
    bn: 'দাম',
    te: 'ధర',
    kn: 'ಬೆಲೆ',
    pa: 'ਮੁੱਲ',
  },
  tagsLabel: {
    en: 'Tags & Keywords',
    hi: 'टैग और मुख्य शब्द',
    gu: 'ટેગ અને કીવર્ડ્સ',
    mr: 'टॅग्ज आणि कीवर्ड्स',
    ta: 'குறிச்சொற்கள் மற்றும் முக்கிய வார்த்தைகள்',
    bn: 'ট্যাগ এবং মূল শব্দ',
    te: 'ట్యాగ్‌లు మరియు కీలక పదాలు',
    kn: 'ಟ್ಯಾಗ್‌ಗಳು ಮತ್ತು ಕೀವರ್ಡ್‌ಗಳು',
    pa: 'ਟੈਗ ਅਤੇ ਮੁੱਖ ਸ਼ਬਦ',
  },
};

// Track active audio clip instance
let currentAudio = null;

/**
 * Pre-recorded authentic studio-quality native neural audio clips across ALL 9 languages.
 * Generated with state-of-the-art regional neural voices (Swara for Hindi,
 * Dhwani for Gujarati, Aarohi for Marathi, Pallavi for Tamil, Tanishaa for Bengali,
 * Shruti for Telugu, Sapna for Kannada, Prabhat for Punjabi, Neerja for English).
 */
export const AUDIO_CLIPS = {
  tagline: {
    hi: '/audio/tagline_hi.mp3',
    gu: '/audio/tagline_gu.mp3',
    en: '/audio/tagline_en.mp3',
    mr: '/audio/tagline_mr.mp3',
    ta: '/audio/tagline_ta.mp3',
    bn: '/audio/tagline_bn.mp3',
    te: '/audio/tagline_te.mp3',
    kn: '/audio/tagline_kn.mp3',
    pa: '/audio/tagline_pa.mp3',
  },
  welcomeListenInstruction: {
    hi: '/audio/welcome_hi.mp3',
    gu: '/audio/welcome_gu.mp3',
    en: '/audio/welcome_en.mp3',
    mr: '/audio/welcome_mr.mp3',
    ta: '/audio/welcome_ta.mp3',
    bn: '/audio/welcome_bn.mp3',
    te: '/audio/welcome_te.mp3',
    kn: '/audio/welcome_kn.mp3',
    pa: '/audio/welcome_pa.mp3',
  },
  homeListenPrompt: {
    hi: '/audio/home_hi.mp3',
    gu: '/audio/home_gu.mp3',
    en: '/audio/home_en.mp3',
    mr: '/audio/home_mr.mp3',
    ta: '/audio/home_ta.mp3',
    bn: '/audio/home_bn.mp3',
    te: '/audio/home_te.mp3',
    kn: '/audio/home_kn.mp3',
    pa: '/audio/home_pa.mp3',
  },
  shareCopied: {
    hi: '/audio/copied_hi.mp3',
    gu: '/audio/copied_gu.mp3',
    en: '/audio/copied_en.mp3',
    mr: '/audio/copied_mr.mp3',
    ta: '/audio/copied_ta.mp3',
    bn: '/audio/copied_bn.mp3',
    te: '/audio/copied_te.mp3',
    kn: '/audio/copied_kn.mp3',
    pa: '/audio/copied_pa.mp3',
  },
  copied: {
    hi: '/audio/copied_hi.mp3',
    gu: '/audio/copied_gu.mp3',
    en: '/audio/copied_en.mp3',
    mr: '/audio/copied_mr.mp3',
    ta: '/audio/copied_ta.mp3',
    bn: '/audio/copied_bn.mp3',
    te: '/audio/copied_te.mp3',
    kn: '/audio/copied_kn.mp3',
    pa: '/audio/copied_pa.mp3',
  },
  auth_login: {
    hi: '/audio/auth_login_hi.mp3',
    gu: '/audio/auth_login_gu.mp3',
    en: '/audio/auth_login_en.mp3',
    mr: '/audio/auth_login_mr.mp3',
    ta: '/audio/auth_login_ta.mp3',
    bn: '/audio/auth_login_bn.mp3',
    te: '/audio/auth_login_te.mp3',
    kn: '/audio/auth_login_kn.mp3',
    pa: '/audio/auth_login_pa.mp3',
  },
  auth_signup: {
    hi: '/audio/auth_signup_hi.mp3',
    gu: '/audio/auth_signup_gu.mp3',
    en: '/audio/auth_signup_en.mp3',
    mr: '/audio/auth_signup_mr.mp3',
    ta: '/audio/auth_signup_ta.mp3',
    bn: '/audio/auth_signup_bn.mp3',
    te: '/audio/auth_signup_te.mp3',
    kn: '/audio/auth_signup_kn.mp3',
    pa: '/audio/auth_signup_pa.mp3',
  },
  step1Prompt: {
    hi: '/audio/step1_photo_hi.mp3',
    gu: '/audio/step1_photo_gu.mp3',
    en: '/audio/step1_photo_en.mp3',
    mr: '/audio/step1_photo_mr.mp3',
    ta: '/audio/step1_photo_ta.mp3',
    bn: '/audio/step1_photo_bn.mp3',
    te: '/audio/step1_photo_te.mp3',
    kn: '/audio/step1_photo_kn.mp3',
    pa: '/audio/step1_photo_pa.mp3',
  },
  step2Prompt: {
    hi: '/audio/step2_studio_hi.mp3',
    gu: '/audio/step2_studio_gu.mp3',
    en: '/audio/step2_studio_en.mp3',
    mr: '/audio/step2_studio_mr.mp3',
    ta: '/audio/step2_studio_ta.mp3',
    bn: '/audio/step2_studio_bn.mp3',
    te: '/audio/step2_studio_te.mp3',
    kn: '/audio/step2_studio_kn.mp3',
    pa: '/audio/step2_studio_pa.mp3',
  },
  step3Prompt: {
    hi: '/audio/step3_voice_hi.mp3',
    gu: '/audio/step3_voice_gu.mp3',
    en: '/audio/step3_voice_en.mp3',
    mr: '/audio/step3_voice_mr.mp3',
    ta: '/audio/step3_voice_ta.mp3',
    bn: '/audio/step3_voice_bn.mp3',
    te: '/audio/step3_voice_te.mp3',
    kn: '/audio/step3_voice_kn.mp3',
    pa: '/audio/step3_voice_pa.mp3',
  },
  step4Prompt: {
    hi: '/audio/step4_price_hi.mp3',
    gu: '/audio/step4_price_gu.mp3',
    en: '/audio/step4_price_en.mp3',
    mr: '/audio/step4_price_mr.mp3',
    ta: '/audio/step4_price_ta.mp3',
    bn: '/audio/step4_price_bn.mp3',
    te: '/audio/step4_price_te.mp3',
    kn: '/audio/step4_price_kn.mp3',
    pa: '/audio/step4_price_pa.mp3',
  },
  productSavedSuccess: {
    hi: '/audio/success_hi.mp3',
    gu: '/audio/success_gu.mp3',
    en: '/audio/success_en.mp3',
    mr: '/audio/success_mr.mp3',
    ta: '/audio/success_ta.mp3',
    bn: '/audio/success_bn.mp3',
    te: '/audio/success_te.mp3',
    kn: '/audio/success_kn.mp3',
    pa: '/audio/success_pa.mp3',
  },
  impactScreen: {
    hi: '/audio/impact_hi.mp3',
    gu: '/audio/impact_gu.mp3',
    en: '/audio/impact_en.mp3',
    mr: '/audio/impact_mr.mp3',
    ta: '/audio/impact_ta.mp3',
    bn: '/audio/impact_bn.mp3',
    te: '/audio/impact_te.mp3',
    kn: '/audio/impact_kn.mp3',
    pa: '/audio/impact_pa.mp3',
  },
  impact: {
    hi: '/audio/impact_hi.mp3',
    gu: '/audio/impact_gu.mp3',
    en: '/audio/impact_en.mp3',
    mr: '/audio/impact_mr.mp3',
    ta: '/audio/impact_ta.mp3',
    bn: '/audio/impact_bn.mp3',
    te: '/audio/impact_te.mp3',
    kn: '/audio/impact_kn.mp3',
    pa: '/audio/impact_pa.mp3',
  },
};

export const DEMO_PRODUCT_IDS = new Set([
  'craft-patola-01',
  'craft-pottery-02',
  'craft-wood-03',
  'craft-metal-04',
  'craft-jewelry-05',
  'craft-painting-06',
  'craft-leather-07',
  'craft-bamboo-08',
]);

/**
 * Plays pre-recorded studio-grade native neural audio clip for demo crafts.
 * Returns true if playback started, false otherwise.
 */
export function playProductAudio(productId, lang = 'hi') {
  if (!DEMO_PRODUCT_IDS.has(productId)) return false;
  // Demo craft clips exist for 'hi' and 'en'
  if (lang !== 'hi' && lang !== 'en') return false; // Handled by dynamic TTS in caller
  const url = `/audio/prod_${productId}_${lang}.mp3`;
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    currentAudio = new Audio(url);
    currentAudio.play().catch((err) => {
      console.warn('Product audio play blocked:', err);
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Plays pre-recorded studio native audio clip for the exact language requested.
 * Returns true if playback started, false if clip not available.
 * NEVER forces Hindi onto non-Hindi regional language speakers.
 */
export function playAudioClip(key, lang = 'hi') {
  const clipUrl = AUDIO_CLIPS[key]?.[lang];
  if (!clipUrl) return false;

  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    currentAudio = new Audio(clipUrl);
    currentAudio.play().catch((err) => {
      console.warn('Audio play interrupted or blocked:', err);
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Stop any ongoing audio clip or speech synthesis.
 */
export function stopAllAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Translation helper with graceful fallback to English.
 */
export function t(key, lang = 'hi') {
  const item = DICTIONARY[key];
  if (!item) return key;
  return item[lang] || item['en'] || item['hi'] || key;
}

/**
 * Lightweight Indic to phonetic Latin transliterator.
 * Used as fallback for systems/browsers (like Windows with only English TTS)
 * that lack installed native Indic voices.
 */
export function transliterateIndicToLatin(text) {
  if (!text) return '';

  const charMap = {
    // Devanagari Vowels & Consonants (Hindi, Marathi)
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
    'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l',
    'ा': 'aa', 'િ': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', '्': '',
    // Gujarati Vowels & Consonants
    'અ': 'a', 'આ': 'aa', 'ઇ': 'i', 'ઈ': 'ee', 'ઉ': 'u', 'ઊ': 'oo', 'ઋ': 'ri',
    'એ': 'e', 'ઐ': 'ai', 'ઓ': 'o', 'ઔ': 'au', 'અં': 'an',
    'ક': 'k', 'ખ': 'kh', 'ગ': 'g', 'ઘ': 'gh', 'ઙ': 'ng',
    'ચ': 'ch', 'છ': 'chh', 'જ': 'j', 'ઝ': 'jh', 'ઞ': 'ny',
    'ટ': 't', 'ઠ': 'th', 'ડ': 'd', 'ઢ': 'dh', 'ણ': 'n',
    'ત': 't', 'થ': 'th', 'દ': 'd', 'ધ': 'dh', 'ન': 'n',
    'પ': 'p', 'ફ': 'ph', 'બ': 'b', 'ભ': 'bh', 'મ': 'm',
    'ય': 'y', 'ર': 'r', 'લ': 'l', 'વ': 'v',
    'શ': 'sh', 'ષ': 'sh', 'સ': 's', 'હ': 'h',
    'ા': 'aa', 'િ': 'i', 'ી': 'ee', 'ુ': 'u', 'ૂ': 'oo', 'ૃ': 'ri',
    'ે': 'e', 'ૈ': 'ai', 'ો': 'o', 'ૌ': 'au', 'ં': 'n', '્': '',
    // Bengali Vowels & Consonants
    'অ': 'o', 'আ': 'aa', 'ই': 'i', 'ঈ': 'ee', 'উ': 'u', 'ঊ': 'oo', 'ঋ': 'ri',
    'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou', 'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh',
    'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n', 'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
    'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
    'া': 'aa', 'ি': 'i', 'ী': 'ee', 'ু': 'u', 'ূ': 'oo', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou', 'ং': 'ng', '্': '',
    // Tamil & Telugu vowels/consonants transliteration basics
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo', 'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oa', 'ஔ': 'au',
    'க': 'k', 'ங': 'ng', 'ச': 'ch', 'ஞ': 'ny', 'ட': 't', 'ண': 'n', 'த': 'th', 'ந': 'n', 'ப': 'p', 'ம': 'm', 'ய': 'y', 'ர': 'r', 'ல': 'l', 'வ': 'v', 'ழ': 'zh', 'ள': 'l',
    'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo', 'ಋ': 'ru', 'ಎ': 'e', 'ಏ': 'ae', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oa', 'ಔ': 'au',
    'ಕ': 'k', 'ಖ': 'kh', 'ಗ': 'g', 'ಘ': 'gh', 'ಚ': 'ch', 'ಛ': 'chh', 'ಜ': 'j', 'ಝ': 'jh', 'ಟ': 't', 'ಠ': 'th', 'ಡ': 'd', 'ಢ': 'dh', 'ಣ': 'n',
    'ತ': 't', 'ಥ': 'th', 'ದ': 'd', 'ಧ': 'dh', 'ನ': 'n', 'ಪ': 'p', 'ಫ': 'ph', 'ಬ': 'b', 'ಭ': 'bh', 'ಮ': 'm', 'ಯ': 'y', 'ರ': 'r', 'ಲ': 'l', 'ವ': 'v',
    'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo', 'ಋ': 'ru',
    'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo', 'ఋ': 'ru', 'ఎ': 'e', 'ఏ': 'ae', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oa', 'ఔ': 'au',
    'క': 'k', 'ఖ': 'kh', 'గ': 'g', 'ఘ': 'gh', 'చ': 'ch', 'ఛ': 'chh', 'జ': 'j', 'ఝ': 'jh', 'ట': 't', 'ఠ': 'th', 'డ': 'd', 'ఢ': 'dh', 'ణ': 'n',
    'త': 't', 'థ': 'th', 'ద': 'd', 'ధ': 'dh', 'న': 'n', 'ప': 'p', 'ఫ': 'ph', 'బ': 'b', 'భ': 'bh', 'మ': 'm', 'య': 'y', 'ర': 'r', 'ల': 'l', 'వ': 'v',
    // Numerals & Punctuation
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4', '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9',
    '।': '.', '॥': '.'
  };

  const consonants = new Set([
    'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श',
    'ष', 'स', 'ह', 'ળ',
    'ક', 'ખ', 'ગ', 'ઘ', 'ઙ', 'ચ', 'છ', 'જ', 'ઝ', 'ઞ', 'ટ', 'ઠ', 'ડ', 'ઢ', 'ણ',
    'ત', 'થ', 'દ', 'ધ', 'ન', 'પ', 'ફ', 'બ', 'ભ', 'મ', 'ય', 'ર', 'લ', 'વ', 'શ',
    'ષ', 'સ', 'હ',
    'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ',
    'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ',
  ]);
  const matras = new Set([
    'ा', 'િ', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ँ', '્', '्',
    'ા', 'િ', 'ી', 'ુ', 'ૂ', 'ૃ', 'ે', 'ૈ', 'ો', 'ૌ', 'ং', '্'
  ]);

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (charMap[char] !== undefined) {
      result += charMap[char];
      if (consonants.has(char)) {
        if (!nextChar || (!matras.has(nextChar) && nextChar !== ' ' && nextChar !== '્' && nextChar !== '्')) {
          result += 'a';
        }
      }
    } else {
      result += char;
    }
  }

  return result.replace(/\s+/g, ' ').trim();
}

/**
 * Text-to-speech helper utilizing Web Speech API with smart voice detection
 * and phonetic fallback for platforms lacking native Indic voices.
 */
export function speakText(text, langCode = 'hi-IN', phoneticFallback = '') {
  if (!('speechSynthesis' in window)) return;

  try {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const langPrefix = (langCode || 'hi').split('-')[0].toLowerCase();
    const voices = window.speechSynthesis.getVoices() || [];

    // 1. Check if a native voice is available for this exact language
    const nativeVoice = voices.find((v) => {
      const vLang = (v.lang || '').toLowerCase();
      const vName = (v.name || '').toLowerCase();
      return (
        vLang === langCode.toLowerCase() ||
        vLang.startsWith(langPrefix) ||
        (langPrefix === 'hi' && (vName.includes('hindi') || vLang.includes('hi'))) ||
        (langPrefix === 'gu' && (vName.includes('gujarati') || vLang.includes('gu'))) ||
        (langPrefix === 'mr' && (vName.includes('marathi') || vLang.includes('mr'))) ||
        (langPrefix === 'ta' && (vName.includes('tamil') || vLang.includes('ta'))) ||
        (langPrefix === 'bn' && (vName.includes('bengali') || vLang.includes('bn'))) ||
        (langPrefix === 'te' && (vName.includes('telugu') || vLang.includes('te'))) ||
        (langPrefix === 'kn' && (vName.includes('kannada') || vLang.includes('kn'))) ||
        (langPrefix === 'pa' && (vName.includes('punjabi') || vLang.includes('pa')))
      );
    });

    let voiceToUse = nativeVoice;
    let textToUse = text;
    let finalLang = langCode;

    if (nativeVoice) {
      voiceToUse = nativeVoice;
      textToUse = text;
      finalLang = nativeVoice.lang || langCode;
    } else {
      // Pick Indian English or General English voice
      const indianVoice = voices.find(
        (v) =>
          (v.lang || '').toLowerCase().includes('en-in') ||
          (v.name || '').toLowerCase().includes('india')
      );
      const generalEnglish = voices.find((v) =>
        (v.lang || '').toLowerCase().startsWith('en')
      );
      voiceToUse = indianVoice || generalEnglish || voices[0] || null;
      finalLang = voiceToUse?.lang || 'en-US';

      if (phoneticFallback) {
        textToUse = phoneticFallback;
      } else if (/[\u0900-\u0D7F]/.test(text)) {
        textToUse = transliterateIndicToLatin(text);
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToUse);
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }
    utterance.lang = finalLang;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    setTimeout(() => {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 40);
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err);
  }
}
