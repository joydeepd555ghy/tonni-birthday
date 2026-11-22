/**
 * Editable configuration for Tonni's Birthday Website.
 * Edit names, dates, Bengali & English text, reasons, albums, and letter here.
 */
window.SITE_CONFIG = {
  meta: {
    recipientNameBn: "তন্নি সরকার",
    recipientNameEn: "Tonni Sarker",
    recipientShortBn: "তন্নি",
    recipientShortEn: "Tonni",
    senderNameBn: "জয়দীপ দেবনাথ",
    senderNameEn: "Joydeep Debnath",
    startDate: "2026-02-10",
    musicSrc: "assets/music/song.mp3",
    heroPhoto: "assets/media/tonni.jpg",
    joydeepPhoto: "assets/media/joydeep.jpg",
    tonniMatchPhoto: "assets/media/tonni.jpg",
    filmSrc: "assets/media/our-story.mp4",
    filmPoster: "assets/media/poster.jpg"
  },

  gate: {
    enabled: true,
    questionBn: "আমি তোমাকে প্রথম কী বলেছিলাম?",
    questionEn: "What was the first word I said to you?",
    placeholder: "Type your answer...",
    buttonText: "Unlock",
    hintText: "Hint: Two letters that started everything.",
    acceptedAnswers: ["hi", "hi!"]
  },

  loader: {
    textBn: "তোমার জন্য কিছু একটা অপেক্ষা করছে...",
    textEn: "Something is waiting for you..."
  },

  hero: {
    eyebrow: "A Private Premiere for",
    headlineBn: "শুভ জন্মদিন, তন্নি",
    headlineEn: "Happy Birthday, my love",
    counterBnPrefix: "আমরা একসাথে",
    counterBnSuffix: "দিন",
    counterEnPrefix: "Together for",
    counterEnSuffix: "days",
    musicTapLabel: "Tap to play music",
    musicPauseLabel: "Pause music",
    musicPlayingLabel: "Playing our song",
    scrollCue: "Scroll to begin"
  },

  film: {
    titleBn: "আমাদের গল্প",
    titleEn: "Our story, in a film",
    subtitle: "From a match to a lifetime."
  },

  gallery: {
    titleBn: "তোমার সাথে কাটানো মুহূর্ত",
    titleEn: "Moments with you",
    subtitle: "Every frame holds a piece of my heart.",
    allAlbumsBn: "সব মুহূর্ত",
    allAlbumsEn: "All",
    memoryOfDayLabelBn: "আজকের স্মৃতি",
    memoryOfDayLabelEn: "Memory of the day",
    surpriseBtnBn: "একটা স্মৃতি দেখাও",
    surpriseBtnEn: "Surprise me",
    slideshowBtnBn: "আমাদের স্লাইডশো",
    slideshowBtnEn: "Slideshow of us",
    loadMoreLabel: "Load more memories",
    emptyText: "Add photos and videos to assets/raw/ and run tools/optimize.py.",
    albums: {
      "February 2026": { bn: "ফেব্রুয়ারি ২০২৬", en: "February 2026" },
      "March 2026": { bn: "মার্চ ২০২৬", en: "March 2026" },
      "April 2026": { bn: "এপ্রিল ২০২৬", en: "April 2026" },
      "May 2026": { bn: "মে ২০২৬", en: "May 2026" },
      "June 2026": { bn: "জুন ২০২৬", en: "June 2026" },
      "July 2026": { bn: "জুলাই ২০২৬", en: "July 2026" },
      "August 2026": { bn: "আগস্ট ২০২৬", en: "August 2026" },
      "September 2026": { bn: "সেপ্টেম্বর ২০২৬", en: "September 2026" },
      "October 2026": { bn: "অক্টোবর ২০২৬", en: "October 2026" },
      "November 2026": { bn: "নভেম্বর ২০২৬", en: "November 2026" },
      "First Memories": { bn: "প্রথম দিকের স্মৃতি", en: "First Memories" },
      "Special Moments": { bn: "বিশেষ মুহূর্ত", en: "Special Moments" },
      "Moments": { bn: "আমাদের মুহূর্ত", en: "Moments" }
    }
  },

  timeline: {
    titleBn: "শুরুটা যেভাবে হয়েছিল",
    titleEn: "How it began",
    subtitle: "The days I will never forget.",
    stops: [
      {
        type: "match",
        date: "9 Feb 2026",
        titleBn: "একটা সুন্দর শুরু",
        titleEn: "It's a Match!",
        description: "Two photos, one heart, and the best notification of my life."
      },
      {
        type: "chat-tinder",
        date: "9 Feb 2026",
        titleBn: "প্রথম কথোপকথন",
        titleEn: "A simple \"Hi\"",
        messages: [
          { from: "me", text: "Hi" },
          { from: "me", text: "Are you Bengali?" },
          { from: "her", text: "Yes" },
          { from: "me", text: "Can I have your WhatsApp number?" }
        ]
      },
      {
        type: "milestone",
        date: "10 Feb 2026",
        stampBn: "আমাদের গল্প শুরু হলো",
        stampEn: "Our story began",
        description: "From that day forward, nothing was ever ordinary again."
      },
      {
        type: "chat-whatsapp",
        date: "11 Feb 2026",
        titleBn: "প্রথম হোয়াটসঅ্যাপ চ্যাট",
        titleEn: "Our first WhatsApp chat",
        contactName: "Tonni",
        messages: [
          { from: "her", text: "Hello joydeep", time: "09:14 AM" },
          { from: "me", text: "Breakfast hoyeche?", time: "09:15 AM" },
          { from: "her", text: "Hae korlam matro", time: "09:16 AM" }
        ]
      }
    ]
  },

  reasons: {
    titleBn: "কেন তোমাকে ভালোবাসি",
    titleEn: "Why I love you",
    subtitle: "Tap each card to reveal a reason.",
    items: [
      {
        bn: "তোমার হাসি আমার পুরো দিনটাকে আলোকিত করে দেয়।",
        en: "Your smile brightens my whole day."
      },
      {
        bn: "তুমি খুব সাধারণ মুহূর্তগুলোকেও উৎসবের মতো সুন্দর করে তোলো।",
        en: "You turn ordinary moments into celebrations."
      },
      {
        bn: "একটা ছোট্ট \"Hi\"-কে তুমি আমার জীবনের সবচেয়ে প্রিয় গল্পে বদলে দিয়েছো।",
        en: "You made a simple \"Hi\" my favourite story."
      },
      {
        bn: "তোমার সাথে কথা বললে মনে হয় আমি নিজের ঘরেই আছি।",
        en: "Talking to you feels like home."
      },
      {
        bn: "তোমার হাত ধরে থাকলে চিরকালও খুব ছোট মনে হয়।",
        en: "With you, forever feels too short."
      },
      {
        bn: "তুমি আমাকে প্রতিদিন আরও ভালো মানুষ হতে অনুপ্রেরণা দাও।",
        en: "You make me want to be better every day."
      },
      {
        bn: "তোমার চোখের দিকে তাকালে আমি আমার পুরো পৃথিবী খুঁজে পাই।",
        en: "In your eyes, I find my entire world."
      },
      {
        bn: "তুমি পাশে থাকলে প্রতিটি দিনই জন্মদিনের মতো বিশেষ।",
        en: "Every day beside you feels like a celebration."
      }
    ]
  },

  cake: {
    titleBn: "একটা ইচ্ছে করো",
    titleEn: "Make a wish",
    subtitle: "Close your eyes, make a wish, and blow out the candles.",
    blowBtnBn: "ফুঁ দাও",
    blowBtnEn: "Blow the candles",
    micBtnBn: "মাইক্রোফোনে ফুঁ দাও",
    micBtnEn: "Use mic to blow",
    micListeningText: "Listening... blow gently into your microphone",
    micDeniedText: "Microphone unavailable — tap the button to blow the candles.",
    relightLabel: "Light candles again",
    wishGrantedBn: "তোমার সব ইচ্ছে পূরণ হোক",
    wishGrantedEn: "May every wish come true"
  },

  letter: {
    titleBn: "তোমার জন্য একটা চিঠি",
    titleEn: "A letter for you",
    subtitle: "Tap the wax seal to open.",
    tapPrompt: "Tap the seal to open",
    skipTypingLabel: "Show full letter",
    salutation: "My dearest Tonni,",
    paragraphs: [
      {
        lang: "en",
        text: "Of all the people I could have matched with, I am endlessly grateful it was you. You turned a simple \"Hi\" into the most beautiful chapter of my life."
      },
      {
        lang: "bn",
        text: "তুমি আমার সবচেয়ে সুন্দর গল্প, আমার প্রতিদিনের শান্তি।"
      },
      {
        lang: "en",
        text: "Every day with you feels like a quiet premiere of my favourite film—warm, magical, and unforgettable. On your birthday, I wish you endless smiles, every dream fulfilled, and a love that grows deeper with every passing sunrise."
      },
      {
        lang: "en",
        text: "I love you, today and always."
      }
    ],
    closingBn: "ইতি তোমার জয়দীপ",
    closingEn: "Forever yours, Joydeep Debnath"
  },

  finale: {
    buttonBn: "আরেকটা কথা...",
    buttonEn: "One more thing...",
    messageBn: "ভালোবাসি তোমাকে, তন্নি.",
    messageEn: "I love you, today and always.",
    credit: "Forever yours, Joydeep Debnath"
  }
};
