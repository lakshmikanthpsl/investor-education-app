export type Language = "en" | "hi" | "ta" | "bn"

export interface Translation {
  // Navigation
  nav: {
    home: string
    learn: string
    quiz: string
    simulate: string
    translate: string
    videos: string
  }
  // Homepage
  home: {
    title: string
    subtitle: string
    description: string
    prototype: string
    footer: string
  }
  // Learn section
  learn: {
    title: string
    description: string
    features: {
      lessons: string
      progress: string
    }
  }
  // Quiz section
  quiz: {
    title: string
    description: string
    features: {
      feedback: string
      scores: string
    }
  }
  // Virtual Trading
  trading: {
    title: string
    description: string
    features: {
      paperTrading: string
      charts: string
    }
  }
  // Translation
  translation: {
    title: string
    description: string
    features: {
      paste: string
      summary: string
    }
  }
  // Personalized Learning
  personalized: {
    recommendedForYou: string
    allCaughtUp: string
    keepLearningMessage: string
    learningStreak: string
    keepStreakGoing: string
    highPriority: string
    recommended: string
    minutes: string
    startLesson: string
    retakeQuiz: string
    notInterested: string
    areasToImprove: string
    correct: string
  }
  // PWA-related translations
  pwa: {
    offline_mode: string
    install_app: string
    install: string
    sync: string
  }
  // Common
  common: {
    loading: string
    error: string
    retry: string
    back: string
    next: string
    submit: string
    cancel: string
  }
  // Video generation section
  videos: {
    title: string
    description: string
    features: {
      aiGenerated: string
      customTopics: string
    }
    prompt: {
      placeholder: string
      generate: string
      generating: string
    }
    examples: {
      title: string
      basicStocks: string
      riskManagement: string
      technicalAnalysis: string
      mutualFunds: string
    }
  }
}

export const translations: Record<Language, Translation> = {
  en: {
    nav: {
      home: "Home",
      learn: "Learn",
      quiz: "Quiz",
      simulate: "Virtual Trading",
      translate: "Translate",
      videos: "Videos",
    },
    home: {
      title: "Investor Education",
      subtitle: "Learn the markets safely with interactive lessons and a sandbox",
      description:
        "Built to support SEBI's push for investor education. Educational use only — simulated/delayed data and no investment advice.",
      prototype: "Prototype",
      footer: "For education only. Markets are risky — do your own research.",
    },
    learn: {
      title: "Learn",
      description: "Stock basics, risk assessment, algo/HFT, diversification",
      features: {
        lessons: "Short, structured lessons",
        progress: "Progress tracking",
      },
    },
    quiz: {
      title: "Quiz",
      description: "Reinforce concepts with quick checks",
      features: {
        feedback: "Immediate feedback",
        scores: "Category scores",
      },
    },
    trading: {
      title: "Virtual Trading",
      description: "Practice in a safe sandbox with simulated data",
      features: {
        paperTrading: "Buy/Sell with paper cash",
        charts: "View simple charts",
      },
    },
    translation: {
      title: "Translate & Summarize",
      description: "Convert SEBI/NISM content to vernacular languages",
      features: {
        paste: "Paste a URL or text",
        summary: "Get a clear summary",
      },
    },
    personalized: {
      recommendedForYou: "Recommended for You",
      allCaughtUp: "You're all caught up!",
      keepLearningMessage: "Keep learning to get personalized recommendations based on your quiz performance.",
      learningStreak: "🔥 {days}-day learning streak!",
      keepStreakGoing: "Keep your streak going with today's recommendations.",
      highPriority: "High Priority",
      recommended: "Recommended",
      minutes: "min",
      startLesson: "Start Lesson",
      retakeQuiz: "Retake Quiz",
      notInterested: "Not Interested",
      areasToImprove: "Areas to Improve",
      correct: "correct",
    },
    pwa: {
      offline_mode: "You're offline",
      install_app: "Install App",
      install: "Install",
      sync: "Sync",
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Try again",
      back: "Back",
      next: "Next",
      submit: "Submit",
      cancel: "Cancel",
    },
    videos: {
      title: "Educational Videos",
      description: "Generate personalized video content on investment topics",
      features: {
        aiGenerated: "AI-generated explanations",
        customTopics: "Custom topic requests",
      },
      prompt: {
        placeholder:
          "What investment topic would you like to learn about? (e.g., 'Explain mutual funds for beginners')",
        generate: "Generate Video",
        generating: "Generating video...",
      },
      examples: {
        title: "Popular Topics",
        basicStocks: "Stock Market Basics for Beginners",
        riskManagement: "Understanding Risk Management",
        technicalAnalysis: "Introduction to Technical Analysis",
        mutualFunds: "Mutual Funds vs Direct Equity",
      },
    },
  },
  hi: {
    nav: {
      home: "होम",
      learn: "सीखें",
      quiz: "प्रश्नोत्तरी",
      simulate: "वर्चुअल ट्रेडिंग",
      translate: "अनुवाद",
      videos: "वीडियो",
    },
    home: {
      title: "निवेशक शिक्षा",
      subtitle: "इंटरैक्टिव पाठों और सैंडबॉक्स के साथ बाजारों को सुरक्षित रूप से सीखें",
      description:
        "सेबी की निवेशक शिक्षा पहल का समर्थन करने के लिए बनाया गया। केवल शैक्षिक उपयोग — सिमुलेटेड/विलंबित डेटा और कोई निवेश सलाह नहीं।",
      prototype: "प्रोटोटाइप",
      footer: "केवल शिक्षा के लिए। बाजार जोखिम भरे हैं — अपना शोध करें।",
    },
    learn: {
      title: "सीखें",
      description: "स्टॉक बेसिक्स, जोखिम मूल्यांकन, एल्गो/एचएफटी, विविधीकरण",
      features: {
        lessons: "छोटे, संरचित पाठ",
        progress: "प्रगति ट्रैकिंग",
      },
    },
    quiz: {
      title: "प्रश्नोत्तरी",
      description: "त्वरित जांच के साथ अवधारणाओं को मजबूत करें",
      features: {
        feedback: "तत्काल फीडबैक",
        scores: "श्रेणी स्कोर",
      },
    },
    trading: {
      title: "वर्चुअल ट्रेडिंग",
      description: "सिमुलेटेड डेटा के साथ सुरक्षित सैंडबॉक्स में अभ्यास करें",
      features: {
        paperTrading: "पेपर कैश के साथ खरीदें/बेचें",
        charts: "सरल चार्ट देखें",
      },
    },
    translation: {
      title: "अनुवाद और सारांश",
      description: "सेबी/एनआईएसएम सामग्री को स्थानीय भाषाओं में बदलें",
      features: {
        paste: "URL या टेक्स्ट पेस्ट करें",
        summary: "स्पष्ट सारांश प्राप्त करें",
      },
    },
    personalized: {
      recommendedForYou: "आपके लिए सुझाव",
      allCaughtUp: "आप सब कुछ पूरा कर चुके हैं!",
      keepLearningMessage: "अपने क्विज़ प्रदर्शन के आधार पर व्यक्तिगत सुझाव पाने के लिए सीखते रहें।",
      learningStreak: "🔥 {days}-दिन की सीखने की लकीर!",
      keepStreakGoing: "आज की सिफारिशों के साथ अपनी लकीर जारी रखें।",
      highPriority: "उच्च प्राथमिकता",
      recommended: "सुझाया गया",
      minutes: "मिनट",
      startLesson: "पाठ शुरू करें",
      retakeQuiz: "क्विज़ दोबारा लें",
      notInterested: "रुचि नहीं",
      areasToImprove: "सुधार के क्षेत्र",
      correct: "सही",
    },
    pwa: {
      offline_mode: "आप ऑफलाइन हैं",
      install_app: "ऐप इंस्टॉल करें",
      install: "इंस्टॉल करें",
      sync: "सिंक करें",
    },
    common: {
      loading: "लोड हो रहा है...",
      error: "कुछ गलत हुआ",
      retry: "फिर कोशिश करें",
      back: "वापस",
      next: "अगला",
      submit: "जमा करें",
      cancel: "रद्द करें",
    },
    videos: {
      title: "शैक्षिक वीडियो",
      description: "निवेश विषयों पर व्यक्तिगत वीडियो सामग्री उत्पन्न करें",
      features: {
        aiGenerated: "AI-जनरेटेड व्याख्याएं",
        customTopics: "कस्टम विषय अनुरोध",
      },
      prompt: {
        placeholder: "आप किस निवेश विषय के बारे में जानना चाहते हैं? (जैसे, 'शुरुआती लोगों के लिए म्यूचुअल फंड समझाएं')",
        generate: "वीडियो जेनरेट करें",
        generating: "वीडियो जेनरेट हो रहा है...",
      },
      examples: {
        title: "लोकप्रिय विषय",
        basicStocks: "शुरुआती लोगों के लिए शेयर बाजार की मूल बातें",
        riskManagement: "जोखिम प्रबंधन को समझना",
        technicalAnalysis: "तकनीकी विश्लेषण का परिचय",
        mutualFunds: "म्यूचुअल फंड बनाम डायरेक्ट इक्विटी",
      },
    },
  },
  ta: {
    nav: {
      home: "முகப்பு",
      learn: "கற்றுக்கொள்ளுங்கள்",
      quiz: "வினாடி வினா",
      simulate: "மெய்நிகர் வர்த்தகம்",
      translate: "மொழிபெயர்ப்பு",
      videos: "வீடியோக்கள்",
    },
    home: {
      title: "முதலீட்டாளர் கல்வி",
      subtitle: "ஊடாடும் பாடங்கள் மற்றும் சாண்ட்பாக்ஸுடன் சந்தைகளை பாதுகாப்பாக கற்றுக்கொள்ளுங்கள்",
      description:
        "செபியின் முதலீட்டாளர் கல்வி முயற்சியை ஆதரிக்க உருவாக்கப்பட்டது। கல்வி பயன்பாடு மட்டுமே — உருவகப்படுத்தப்பட்ட/தாமதமான தரவு மற்றும் முதலீட்டு ஆலோசனை இல்லை.",
      prototype: "முன்மாதிரி",
      footer: "கல்விக்காக மட்டுமே. சந்தைகள் ஆபத்தானவை — உங்கள் சொந்த ஆராய்ச்சி செய்யுங்கள்.",
    },
    learn: {
      title: "கற்றுக்கொள்ளுங்கள்",
      description: "பங்கு அடிப்படைகள், ஆபத்து மதிப்பீடு, அல்கோ/எச்எஃப்டி, பல்வகைப்படுத்தல்",
      features: {
        lessons: "குறுகிய, கட்டமைக்கப்பட்ட பாடங்கள்",
        progress: "முன்னேற்ற கண்காணிப்பு",
      },
    },
    quiz: {
      title: "வினாடி வினா",
      description: "விரைவான சரிபார்ப்புகளுடன் கருத்துகளை வலுப்படுத்துங்கள்",
      features: {
        feedback: "உடனடி கருத்து",
        scores: "வகை மதிப்பெண்கள்",
      },
    },
    trading: {
      title: "மெய்நிகர் வர்த்தகம்",
      description: "உருவகப்படுத்தப்பட்ட தரவுகளுடன் பாதுகாப்பான சாண்ட்பாக்ஸில் பயிற்சி செய்யுங்கள்",
      features: {
        paperTrading: "காகித பணத்துடன் வாங்க/விற்க",
        charts: "எளிய விளக்கப்படங்களைப் பார்க்கவும்",
      },
    },
    translation: {
      title: "மொழிபெயர்ப்பு மற்றும் சுருக்கம்",
      description: "செபி/என்ஐஎஸ்எம் உள்ளடக்கத்தை உள்ளூர் மொழிகளுக்கு மாற்றவும்",
      features: {
        paste: "URL அல்லது உரையை ஒட்டவும்",
        summary: "தெளிவான சுருக்கத்தைப் பெறுங்கள்",
      },
    },
    personalized: {
      recommendedForYou: "உங்களுக்கான பரிந்துரைகள்",
      allCaughtUp: "நீங்கள் அனைத்தையும் முடித்துவிட்டீர்கள்!",
      keepLearningMessage: "உங்கள் வினாடி வினா செயல்திறனின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட பரிந்துரைகளைப் பெற தொடர்ந்து கற்றுக்கொள்ளுங்கள்।",
      learningStreak: "🔥 {days}-நாள் கற்றல் தொடர்!",
      keepStreakGoing: "இன்றைய பரிந்துரைகளுடன் உங்கள் தொடரைத் தொடருங்கள்।",
      highPriority: "அதிக முன்னுரிமை",
      recommended: "பரிந்துரைக்கப்பட்டது",
      minutes: "நிமிடம்",
      startLesson: "பாடத்தைத் தொடங்கு",
      retakeQuiz: "வினாடி வினாவை மீண்டும் எடு",
      notInterested: "ஆர்வம் இல்லை",
      areasToImprove: "மேம்படுத்த வேண்டிய பகுதிகள்",
      correct: "சரி",
    },
    pwa: {
      offline_mode: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள்",
      install_app: "ஆப்ஸை நிறுவுங்கள்",
      install: "நிறுவு",
      sync: "ஒத்திசை",
    },
    common: {
      loading: "ஏற்றுகிறது...",
      error: "ஏதோ தவறு நடந்தது",
      retry: "மீண்டும் முயற்சிக்கவும்",
      back: "பின்னால்",
      next: "அடுத்தது",
      submit: "சமர்ப்பிக்கவும்",
      cancel: "ரத்து செய்",
    },
    videos: {
      title: "கல்வி வீடியோக்கள்",
      description: "முதலீட்டு தலைப்புகளில் தனிப்பயனாக்கப்பட்ட வீடியோ உள்ளடக்கத்தை உருவாக்குங்கள்",
      features: {
        aiGenerated: "AI-உருவாக்கப்பட்ட விளக்கங்கள்",
        customTopics: "தனிப்பயன் தலைப்பு கோரிக்கைகள்",
      },
      prompt: {
        placeholder:
          "நீங்கள் எந்த முதலீட்டு தலைப்பைப் பற்றி அறிய விரும்புகிறீர்கள்? (எ.கா., 'ஆரம்பநிலையாளர்களுக்கு மியூச்சுவல் ஃபண்டுகளை விளக்குங்கள்')",
        generate: "வீடியோவை உருவாக்கு",
        generating: "வீடியோ உருவாக்கப்படுகிறது...",
      },
      examples: {
        title: "பிரபலமான தலைப்புகள்",
        basicStocks: "ஆரம்பநிலையாளர்களுக்கான பங்குச் சந்தை அடிப்படைகள்",
        riskManagement: "ஆபத்து மேலாண்மையைப் புரிந்துகொள்ளுதல்",
        technicalAnalysis: "தொழில்நுட்ப பகுப்பாய்வின் அறிமுகம்",
        mutualFunds: "மியூச்சுவல் ஃபண்டுகள் vs நேரடி ஈக்விட்டி",
      },
    },
  },
  bn: {
    nav: {
      home: "হোম",
      learn: "শিখুন",
      quiz: "কুইজ",
      simulate: "ভার্চুয়াল ট্রেডিং",
      translate: "অনুবাদ",
      videos: "ভিডিও",
    },
    home: {
      title: "বিনিয়োগকারী শিক্ষা",
      subtitle: "ইন্টারঅ্যাক্টিভ পাঠ এবং স্যান্ডবক্সের সাথে নিরাপদে বাজার শিখুন",
      description:
        "সেবির বিনিয়োগকারী শিক্ষা উদ্যোগকে সমর্থন করার জন্য তৈরি। শুধুমাত্র শিক্ষামূলক ব্যবহার — সিমুলেটেড/বিলম্বিত ডেটা এবং কোন বিনিয়োগ পরামর্শ নেই।",
      prototype: "প্রোটোটাইপ",
      footer: "শুধুমাত্র শিক্ষার জন্য। বাজার ঝুঁকিপূর্ণ — আপনার নিজস্ব গবেষণা করুন।",
    },
    learn: {
      title: "শিখুন",
      description: "স্টক বেসিক, ঝুঁকি মূল্যায়ন, অ্যালগো/এইচএফটি, বৈচিত্র্যকরণ",
      features: {
        lessons: "সংক্ষিপ্ত, কাঠামোবদ্ধ পাঠ",
        progress: "অগ্রগতি ট্র্যাকিং",
      },
    },
    quiz: {
      title: "কুইজ",
      description: "দ্রুত চেক দিয়ে ধারণাগুলি শক্তিশালী করুন",
      features: {
        feedback: "তাৎক্ষণিক প্রতিক্রিয়া",
        scores: "বিভাগ স্কোর",
      },
    },
    trading: {
      title: "ভার্চুয়াল ট্রেডিং",
      description: "সিমুলেটেড ডেটা সহ নিরাপদ স্যান্ডবক্সে অনুশীলন করুন",
      features: {
        paperTrading: "কাগজের নগদ দিয়ে কিনুন/বিক্রি করুন",
        charts: "সহজ চার্ট দেখুন",
      },
    },
    translation: {
      title: "অনুবাদ এবং সারসংক্ষেপ",
      description: "সেবি/এনআইএসএম বিষয়বস্তু স্থানীয় ভাষায় রূপান্তর করুন",
      features: {
        paste: "একটি URL বা টেক্সট পেস্ট করুন",
        summary: "একটি স্পষ্ট সারসংক্ষেপ পান",
      },
    },
    personalized: {
      recommendedForYou: "আপনার জন্য সুপারিশ",
      allCaughtUp: "আপনি সব শেষ করেছেন!",
      keepLearningMessage: "আপনার কুইজ পারফরম্যান্সের ভিত্তিতে ব্যক্তিগতকৃত সুপারিশ পেতে শিখতে থাকুন।",
      learningStreak: "🔥 {days}-দিনের শেখার ধারা!",
      keepStreakGoing: "আজকের সুপারিশগুলির সাথে আপনার ধারা অব্যাহত রাখুন।",
      highPriority: "উচ্চ অগ্রাধিকার",
      recommended: "সুপারিশকৃত",
      minutes: "মিনিট",
      startLesson: "পাঠ শুরু করুন",
      retakeQuiz: "কুইজ পুনরায় নিন",
      notInterested: "আগ্রহী নই",
      areasToImprove: "উন্নতির ক্ষেত্র",
      correct: "সঠিক",
    },
    pwa: {
      offline_mode: "আপনি অফলাইনে আছেন",
      install_app: "অ্যাপ ইনস্টল করুন",
      install: "ইনস্টল করুন",
      sync: "সিঙ্ক করুন",
    },
    common: {
      loading: "লোড হচ্ছে...",
      error: "কিছু ভুল হয়েছে",
      retry: "আবার চেষ্টা করুন",
      back: "পিছনে",
      next: "পরবর্তী",
      submit: "জমা দিন",
      cancel: "বাতিল",
    },
    videos: {
      title: "শিক্ষামূলক ভিডিও",
      description: "বিনিয়োগ বিষয়ে ব্যক্তিগতকৃত ভিডিও কন্টেন্ট তৈরি করুন",
      features: {
        aiGenerated: "AI-জেনারেটেড ব্যাখ্যা",
        customTopics: "কাস্টম বিষয় অনুরোধ",
      },
      prompt: {
        placeholder: "আপনি কোন বিনিয়োগ বিষয় সম্পর্কে জানতে চান? (যেমন, 'নতুনদের জন্য মিউচুয়াল ফান্ড ব্যাখ্যা করুন')",
        generate: "ভিডিও জেনারেট করুন",
        generating: "ভিডিও জেনারেট হচ্ছে...",
      },
      examples: {
        title: "জনপ্রিয় বিষয়",
        basicStocks: "নতুনদের জন্য স্টক মার্কেট বেসিক",
        riskManagement: "ঝুঁকি ব্যবস্থাপনা বোঝা",
        technicalAnalysis: "টেকনিক্যাল অ্যানালাইসিসের পরিচয়",
        mutualFunds: "মিউচুয়াল ফান্ড বনাম ডাইরেক্ট ইক্যুইটি",
      },
    },
  },
}

export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  bn: "বাংলা",
}
