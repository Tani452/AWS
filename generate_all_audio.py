import asyncio
import os
import edge_tts

OUTPUT_DIR = "frontend/public/audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

VOICES = {
    'mr': 'mr-IN-AarohiNeural',
    'ta': 'ta-IN-PallaviNeural',
    'bn': 'bn-IN-TanishaaNeural',
    'te': 'te-IN-ShrutiNeural',
    'kn': 'kn-IN-SapnaNeural',
    'pa': 'en-IN-PrabhatNeural',
    'hi': 'hi-IN-SwaraNeural',
    'gu': 'gu-IN-DhwaniNeural',
    'en': 'en-IN-NeerjaExpressiveNeural',
}

AUDIO_TASKS = [
    # homeListenPrompt -> home_{lang}.mp3
    {
        'file_prefix': 'home',
        'texts': {
            'mr': 'नवीन वस्तू जोडण्यासाठी मोठे बटण दाबा. तुमचा माल पाहण्यासाठी माझ्या दुकानात जा.',
            'ta': 'புதிய கைவினைப் பொருளைச் சேர்க்க பெரிய பொத்தானை அழுத்தவும். உங்கள் பொருட்களைப் பார்க்க என் கடைக்குச் செல்லவும்.',
            'bn': 'নতুন পণ্য যোগ করতে বড় বোতামটি চাপুন। আপনার জিনিসপত্র দেখতে আমার দোকানে যান।',
            'te': 'కొత్త వస్తువును జోడించడానికి పెద్ద బటన్‌ను నొక్కండి. మీ వస్తువులను చూడటానికి నా దుకాణానికి వెళ్లండి.',
            'kn': 'ಹೊಸ ವಸ್ತು ಸೇರಿಸಲು ದೊಡ್ಡ ಬಟನ್ ಒತ್ತಿರಿ. ನಿಮ್ಮ ವಸ್ತುಗಳನ್ನು ನೋಡಲು ನನ್ನ ಅಂಗಡಿಗೆ ಹೋಗಿ.',
            'pa': 'Navaan samaan jodan layi vadda button dabao. Apniyan vastuaan vekhan layi meri dukan te jao.',
        }
    },
    # auth_login -> auth_login_{lang}.mp3
    {
        'file_prefix': 'auth_login',
        'texts': {
            'mr': 'तुमच्या कला मित्र खात्यात लॉग इन करा.',
            'ta': 'உங்கள் கலா மித்ரா கணக்கில் உள்நுழையவும்.',
            'bn': 'আপনার কলা মিত্র অ্যাকাউন্টে লগ ইন করুন।',
            'te': 'మీ కళా మిత్ర ఖాతాలోకి లాగిన్ అవ్వండి.',
            'kn': 'ನಿಮ್ಮ ಕಲಾ ಮಿತ್ರ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ.',
            'pa': 'Apne KalaMitra khaate vich login karo.',
        }
    },
    # auth_signup -> auth_signup_{lang}.mp3
    {
        'file_prefix': 'auth_signup',
        'texts': {
            'mr': 'नवीन कारागीर म्हणून नोंदणी करा आणि तुमचे डिजिटल दुकान सुरू करा.',
            'ta': 'புதிய கைவினைஞராகப் பதிவு செய்து உங்கள் ஆன்லைன் கடையைத் தொடங்குங்கள்.',
            'bn': 'নতুন কারিগর হিসেবে নিবন্ধন করুন এবং আপনার ডিজিটাল দোকান শুরু করুন।',
            'te': 'కొత్త కళాకారుడిగా నమోదు చేసుకుని మీ డిజిటల్ దుకాణాన్ని ప్రారంభించండి.',
            'kn': 'ನಿಮ್ಮ ಕಲಾ ಮಿತ್ರ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ.',
            'pa': 'Nave karigar vajo register karo te apni digital dukan shuru karo.',
        }
    },
    # step1Prompt -> step1_photo_{lang}.mp3
    {
        'file_prefix': 'step1_photo',
        'texts': {
            'mr': 'तुमच्या हस्तकलेचा स्पष्ट फोटो काढा किंवा निवडा.',
            'ta': 'உங்கள் கைவினைப் பொருளின் தெளிவான புகைப்படத்தை எடுக்கவும் அல்லது தேர்ந்தெடுக்கவும்.',
            'bn': 'আপনার হস্তশিল্পের একটি পরিষ্কার ছবি তুলুন বা নির্বাচন করুন।',
            'te': 'మీ హస్తకళ యొక్క స్పష్టమైన ఫోటో తీయండి లేదా ఎంచుకోండి.',
            'kn': 'ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತುವಿನ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಆಯ್ಕೆಮಾಡಿ.',
            'pa': 'Apni dastkari di saaf photo khicho ya chuno.',
        }
    },
    # step2Prompt -> step2_studio_{lang}.mp3
    {
        'file_prefix': 'step2_studio',
        'texts': {
            'mr': 'एआय स्टुडिओद्वारे पार्श्वभूमी काढून फोटो अधिक सुंदर बनवा.',
            'ta': 'AI ஸ்டுடியோ மூலம் பின்னணியை நீக்கி புகைப்படத்தை அழகாக்குங்கள்.',
            'bn': 'AI স্টুডিও দিয়ে ব্যাকগ্রাউন্ড সরিয়ে ছবি আরও সুন্দর করুন।',
            'te': 'AI స్టూడియోతో బ్యాక్‌గ్రౌండ్ తొలగించి ఫోటోను అందంగా మార్చండి.',
            'kn': 'AI ಸ್ಟುಡಿಯೋ ಮೂಲಕ ಹಿನ್ನೆಲೆ ತೆಗೆದು ಫೋಟೋವನ್ನು ಇನ್ನಷ್ಟು ಆಕರ್ಷಕವಾಗಿಸಿ.',
            'pa': 'AI Studio naal background hata ke photo nu hor sohni banao.',
        }
    },
    # step3Prompt -> step3_voice_{lang}.mp3
    {
        'file_prefix': 'step3_voice',
        'texts': {
            'mr': 'तुमच्या मातृभाषेत हस्तकलेबद्दल बोलून सांगा.',
            'ta': 'உங்கள் தாய்மொழியில் கைவினைப் பொருளின் கதையைப் பேசுங்கள்.',
            'bn': 'আপনার মাতৃভাষায় হস্তশিল্পের গল্প বলুন।',
            'te': 'మీ మాతృభాషలో హస్తకళ గురించి మాట్లాడి చెప్పండి.',
            'kn': 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಕರಕುಶಲ ಕಲೆಯ ಬಗ್ಗೆ ಮಾತನಾಡಿ.',
            'pa': 'Apni boli vich dastkari di kahani bol ke dasso.',
        }
    },
    # step4Prompt -> step4_price_{lang}.mp3
    {
        'file_prefix': 'step4_price',
        'texts': {
            'mr': 'वाजवी आणि फायदेशीर किंमत ठरवण्यासाठी एआय किंमत सहाय्यक वापरा.',
            'ta': 'நியாயமான விலையைத் தீர்மானிக்க AI விலை உதவியாளரைப் பயன்படுத்தவும்.',
            'bn': 'ন্যায্য মূল্য নির্ধারণের জন্য AI মূল্য সহায়ক ব্যবহার করুন।',
            'te': 'సరసమైన ధరను నిర్ణయించడానికి AI ధర సహాయకుడిని ఉపయోగించండి.',
            'kn': 'ನ್ಯಾಯಯುತ ಬೆಲೆ ನಿರ್ಧರಿಸಲು AI ಬೆಲೆ ಸಹಾಯಕರನ್ನು ಬಳಸಿ.',
            'pa': 'Sahi te yog mul taye karan layi AI Price Assistant varto.',
        }
    },
    # productSavedSuccess -> success_{lang}.mp3
    {
        'file_prefix': 'success',
        'texts': {
            'mr': 'अभिनंदन! तुमचे हस्तशिल्प यशस्वीरित्या तुमच्या दुकानात जोडले गेले आहे.',
            'ta': 'வாழ்த்துக்கள்! உங்கள் கைவினைப் பொருள் வெற்றிகரமாக கடையில் சேர்க்கப்பட்டது.',
            'bn': 'অভিনন্দন! আপনার হস্তশিল্প সফলভাবে আপনার দোকানে যুক্ত হয়েছে।',
            'te': 'అభినందనలు! మీ హస్తకళ విజయవంతంగా మీ దుకాణంలో చేర్చబడింది.',
            'kn': 'ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತು ಯಶಸ್ವಿಯಾಗಿ ನಿಮ್ಮ ಅಂಗಡಿಗೆ ಸೇರಿಸಲಾಗಿದೆ.',
            'pa': 'Mubarakbaad! Tuhadi dastkari kamyabi naal dukan vich shamil ho gayi hai.',
        }
    },
    # copied -> copied_{lang}.mp3
    {
        'file_prefix': 'copied',
        'texts': {
            'mr': 'दुकानाची लिंक क्लिपबोर्डवर कॉपी झाली आहे!',
            'ta': 'கடை இணைப்பு நகலெடுக்கப்பட்டது!',
            'bn': 'দোকানের লিঙ্ক কপি করা হয়েছে!',
            'te': 'దుకాణం లింక్ కాపీ చేయబడింది!',
            'kn': 'ಅಂಗಡಿಯ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!',
            'pa': 'Dukan da link copy ho gaya hai!',
        }
    },
    # impact -> impact_{lang}.mp3
    {
        'file_prefix': 'impact',
        'texts': {
            'mr': 'तुमचा व्यावसायिक प्रभाव आणि विक्री आकडेवारी पहा.',
            'ta': 'உங்கள் வணிக தாக்கம் மற்றும் விற்பனை புள்ளிவிவரங்களைக் காண்க.',
            'bn': 'আপনার ব্যবসায়িক প্রভাব এবং বিক্রয় পরিসংখ্যান দেখুন।',
            'te': 'మీ వ్యాపార ప్రభావం మరియు విక్రయ గణాంకాలను చూడండి.',
            'kn': 'ನಿಮ್ಮ ವ್ಯಾಪಾರದ ಪ್ರಭಾವ ಮತ್ತು ಮಾರಾಟದ ಅಂಕಿಅಂಶಗಳನ್ನು ನೋಡಿ.',
            'pa': 'Apna vyapaarak prabhaav te bikri de aakde vekho.',
        }
    },
]

async def generate_clip(prefix, lang, text):
    voice = VOICES.get(lang, 'hi-IN-SwaraNeural')
    filename = f"{prefix}_{lang}.mp3"
    filepath = os.path.join(OUTPUT_DIR, filename)
    try:
        comm = edge_tts.Communicate(text, voice)
        await comm.save(filepath)
        size = os.path.getsize(filepath)
        print(f"Generated {filename} ({size} bytes) with {voice}")
    except Exception as e:
        print(f"Failed {filename}: {e}")

async def main():
    tasks = []
    for item in AUDIO_TASKS:
        prefix = item['file_prefix']
        for lang, text in item['texts'].items():
            tasks.append(generate_clip(prefix, lang, text))
    
    print(f"Starting generation of {len(tasks)} regional audio clips...")
    await asyncio.gather(*tasks)
    print("All regional audio clips generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
