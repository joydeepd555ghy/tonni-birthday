/**
 * Editable configuration for Maharani's (Tonni Sarker's) Birthday Website.
 * Edit names, dates, Bengali & English text, reasons, albums, and letter here.
 */
window.SITE_CONFIG = {
  meta: {
    recipientNameBn: "তন্নি সরকার",
    recipientNameEn: "Tonni Sarker",
    recipientTitleBn: "মহারানী",
    recipientTitleEn: "Maharani",
    senderNameBn: "জয়দীপ দেবনাথ",
    senderNameEn: "Joydeep Debnath",
    birthdayMonth: 11,
    birthdayDay: 28,
    startDate: "2026-02-10",
    birthdayMusicSrc: "assets/music/maharani-birthday.mp3",
    romanticMusicSrc: "assets/music/song.mp3",
    letterMusicSrc: "assets/music/letter-birthday.mp3",
    voiceWishSrc: "assets/music/joydeep-wish.mp3",
    musicSrc: "assets/music/maharani-birthday.mp3",
    heroPhoto: "assets/media/tonni.jpg",
    joydeepPhoto: "assets/media/joydeep.jpg",
    tonniMatchPhoto: "assets/media/tonni.jpg",
    filmSrc: "assets/media/our-story.mp4",
    filmPoster: "assets/media/poster.jpg"
  },

  onboarding: {
    enabled: true,
    eyebrow: "28 November • Royal Birthday Premiere",
    dateStampBn: "২৮ নভেম্বর",
    dateStampEn: "28 NOVEMBER",
    birthdayTodayBn: "আজ তোমার বিশেষ দিন, মহারানী!",
    birthdayTodayEn: "It's 28th November — Happy Birthday, Maharani!",
    countdownPrefixBn: "মহারানীর জন্মদিনে আর মাত্র",
    titleBn: "স্বাগতম, মহারানী",
    titleEn: "Welcome, my Maharani",
    subtitleBn: "২৮ নভেম্বর—আমার জীবনের সবচেয়ে প্রিয় দিন। সাউন্ড অন করে প্রবেশ করো।",
    subtitleEn: "28th November—the brightest day of every year. Turn on sound & step inside.",
    buttonBn: "প্রবেশ করো, মহারানী",
    buttonEn: "Enter, Maharani"
  },

  gate: {
    enabled: true,
    questionBn: "আমি তোমাকে প্রথম কী বলেছিলাম, মহারানী?",
    questionEn: "What was the first word I ever said to you?",
    placeholder: "Type your answer...",
    buttonText: "Unlock Your Surprise",
    hintText: "Hint: Two simple letters that changed my life.",
    acceptedAnswers: ["hi", "hi!"]
  },

  loader: {
    textBn: "মহারানী, তোমার জন্য কিছু একটা অপেক্ষা করছে...",
    textEn: "Something magical is waiting for you, Maharani..."
  },

  hero: {
    eyebrow: "Happy Birthday to My Queen",
    headlineBn: "শুভ জন্মদিন, মহারানী",
    headlineEn: "Happy Birthday, my Maharani",
    counterBnPrefix: "তোমাকে জানার",
    counterBnSuffix: "তম দিন",
    counterEnPrefix: "Celebrating day",
    counterEnSuffix: "of knowing you",
    musicTapLabel: "Play birthday melody",
    musicPauseLabel: "Pause melody",
    musicPlayingLabel: "Playing for Maharani",
    scrollCue: "Scroll to celebrate"
  },

  film: {
    titleBn: "মহারানীর জন্য একটি ছোট্ট গল্প",
    titleEn: "A birthday film for Maharani",
    subtitle: "Press play for a special reel dedicated to you."
  },

  gallery: {
    titleBn: "মহারানীর সেরা মুহূর্তগুলো",
    titleEn: "Every radiant moment of you",
    subtitle: "Every smile, every glance, treasured forever.",
    allAlbumsBn: "সব ছবি",
    allAlbumsEn: "All",
    memoryOfDayLabelBn: "আজকের প্রিয় ছবি",
    memoryOfDayLabelEn: "Spotlight of the day",
    surpriseBtnBn: "একটা মুহূর্ত দেখাও",
    surpriseBtnEn: "Surprise me",
    slideshowBtnBn: "মহারানীর স্লাইডশো",
    slideshowBtnEn: "Maharani's Slideshow",
    slideshowCaptions: [
      "তুমি হাসলে পুরো পৃথিবীটা সুন্দর হয়ে যায়, মহারানী।",
      "Every glance of yours feels like magic.",
      "তোমার গ্লো আর মিষ্টি হাসি—দুটোই আমার সবচেয়ে প্রিয়।",
      "My favourite glow queen & foodie partner forever.",
      "তুমি পাশে থাকলে প্রতিটি মুহূর্ত উৎসব।",
      "A thousand photos still wouldn't be enough.",
      "শুভ জন্মদিন, আমার লক্ষ্মী কুচুপুচু মহারানী।"
    ],
    loadMoreLabel: "Show more moments",
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
      "Moments": { bn: "বিশেষ মুহূর্ত", en: "Moments" }
    }
  },

  timeline: {
    titleBn: "যেদিন মহারানীর সাথে দেখা হলো",
    titleEn: "The days that brought you into my life",
    subtitle: "The moments I will cherish forever.",
    stops: [
      {
        type: "match",
        date: "9 Feb 2026",
        titleBn: "একটা সুন্দর শুরু",
        titleEn: "It's a Match!",
        description: "The luckiest notification of my life—meeting my Maharani."
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
        stampBn: "এক নতুন অধ্যায়ের শুরু",
        stampEn: "The brightest chapter began",
        description: "From that day forward, every day became brighter because of you."
      },
      {
        type: "chat-whatsapp",
        date: "11 Feb 2026",
        titleBn: "প্রথম হোয়াটসঅ্যাপ চ্যাট",
        titleEn: "Your first message on WhatsApp",
        contactName: "Maharani",
        messages: [
          { from: "her", text: "Hello joydeep", time: "09:14 AM" },
          { from: "me", text: "Breakfast hoyeche?", time: "09:15 AM" },
          { from: "her", text: "Hae korlam matro", time: "09:16 AM" }
        ]
      }
    ]
  },

  reasons: {
    titleBn: "মহারানী, তুমি কেন এত বিশেষ",
    titleEn: "Why you are so special, Maharani",
    subtitle: "Tap each royal card to reveal a secret.",
    allFlippedBn: "আর সবচেয়ে বড় কারণ—তুমি শুধু তুমি, আমার মহারানী।",
    allFlippedEn: "And the biggest reason of all—simply being you, my Maharani.",
    vouchersTitleBn: "মহারানীর জন্মদিনের বিশেষ উপহার",
    vouchersTitleEn: "Tap to Claim Your Birthday Treats",
    vouchers: [
      {
        id: "skincare",
        tag: "ROYAL GLOW PASS",
        titleBn: "স্কিনকেয়ার ট্রিট",
        titleEn: "Skincare Wish Treat",
        desc: "Pick your favourite serums, lip tints, or skincare must-haves—my treat for your royal glow!",
        claimLabel: "Claim Glow Treat",
        claimedLabel: "Claimed by Maharani"
      },
      {
        id: "foodie",
        tag: "ROYAL FOODIE PASS",
        titleBn: "মহারানীর ফুডি ডেট",
        titleEn: "Unlimited Foodie Feast",
        desc: "Biryani, street food, desserts, or midnight cravings—eat whatever your heart desires, all on me!",
        claimLabel: "Claim Foodie Treat",
        claimedLabel: "Claimed by Maharani"
      }
    ],
    items: [
      {
        bn: "তোমার হাসি আমার পুরো দিনটাকে আলোকিত করে দেয়, মহারানী।",
        en: "Your smile lights up every single day, Maharani."
      },
      {
        bn: "স্কিনকেয়ার ছাড়াই তুমি এত সুন্দর, তবুও তোমার স্কিনকেয়ার ভালোবাসাটা ভীষণ কিউট।",
        en: "You glow naturally, and watching you adore your skincare routine is the cutest thing ever."
      },
      {
        bn: "ভালো খাবার দেখলে তোমার চোখের সেই খুশিটা আমার সবচেয়ে প্রিয় দৃশ্য।",
        en: "Seeing your eyes light up over delicious food is my favourite sight in the world."
      },
      {
        bn: "একটা ছোট্ট \"Hi\"-কে তুমি আমার সবচেয়ে প্রিয় স্মৃতিতে বদলে দিয়েছো।",
        en: "You turned a simple \"Hi\" into my favourite memory."
      },
      {
        bn: "তোমার সাথে কথা বললে মনে হয় পৃথিবীর সব শান্তি এখানেই।",
        en: "Talking to you feels like peace itself."
      },
      {
        bn: "তোমার সৌন্দর্য আর সারল্য তোমাকে সত্যিই আমার মহারানী করে তুলেছে।",
        en: "Your grace and warmth make you truly my Maharani."
      },
      {
        bn: "তুমি খুব সাধারণ মুহূর্তগুলোকেও উৎসবের মতো সুন্দর করে তোলো।",
        en: "You turn the simplest moments into pure magic."
      },
      {
        bn: "তুমি আছো বলেই প্রতিটি দিনই জন্মদিনের মতো বিশেষ।",
        en: "Because of you, every day feels worth celebrating."
      }
    ]
  },

  cake: {
    titleBn: "মহারানী, একটা ইচ্ছে করো",
    titleEn: "Make a birthday wish, Maharani",
    subtitle: "Close your eyes, make a wish, blow out the candles, and cut your royal cake.",
    blowBtnBn: "ফুঁ দাও",
    blowBtnEn: "Blow the candles",
    cutBtnBn: "কেক কাটো, মহারানী",
    cutBtnEn: "Cut Your Birthday Cake",
    firstBiteBn: "প্রথম টুকরো শুধু আমার মহারানীর জন্য!",
    firstBiteEn: "The very first bite is for my Maharani!",
    relightLabel: "Light candles again",
    wishGrantedBn: "মহারানী, তোমার সব ইচ্ছে পূরণ হোক",
    wishGrantedEn: "May every single wish of yours come true, Maharani"
  },

  letter: {
    titleBn: "মহারানীর জন্য একটি চিঠি",
    titleEn: "A birthday letter for Maharani",
    subtitle: "Tap the royal wax seal to open.",
    tapPrompt: "Tap the seal to open",
    skipTypingLabel: "Show full letter",
    salutation: "My dearest Maharani,",
    paragraphs: [
      {
        lang: "en",
        text: "Happy Birthday, Tonni. Of all the people in this world, I am endlessly grateful that fate brought you into my life. You turned a simple \"Hi\" into the most beautiful chapter I could ever ask for."
      },
      {
        lang: "bn",
        text: "তুমি আমার মহারানী, আমার সবচেয়ে সুন্দর গল্প আর প্রতিদিনের শান্তি।"
      },
      {
        lang: "en",
        text: "Today is all about celebrating you—your radiant smile, your kindness, and the effortless grace you carry everywhere. On your birthday, I wish you endless happiness, every dream fulfilled, and a lifetime of joy."
      },
      {
        lang: "en",
        text: "Stay shining always, my Maharani. I adore you, today and forever."
      }
    ],
    closingBn: "ইতি তোমার জয়দীপ",
    closingEn: "Forever yours, Joydeep Debnath",
    hugBtnBn: "একটা আলিঙ্গন পাঠাও",
    hugBtnEn: "Send a warm hug",
    hugSentText: "Warmest birthday hug delivered straight to my heart, Maharani."
  },

  finale: {
    buttonBn: "মহারানী, আরেকটা কথা...",
    buttonEn: "One more thing, Maharani...",
    messageBn: "শুভ জন্মদিন, আমার মহারানী তন্নি।",
    messageEn: "Happy Birthday, my Maharani. I love you, today and always.",
    replayVoiceBn: "আবার শোনো",
    replayVoiceEn: "Replay my voice note",
    reliveBtnBn: "আবার প্রথম থেকে দেখো",
    reliveBtnEn: "Relive from the beginning",
    voiceCaptions: [
      { at: 0.35, text: "শুভ জন্মদিন, মহারানী..." },
      { at: 2.1, text: "আমার লক্ষ্মী কুচুপুচু..." },
      { at: 3.65, text: "I love you..." },
      { at: 4.55, text: "ম্মুআহ... চিরকাল তোমারই।" }
    ],
    credit: "With all my heart, Joydeep Debnath"
  },

  reveals: {
    toFilmBn: "প্রথম চমক খোলো",
    toFilmEn: "Open Your First Surprise",
    toGalleryBn: "মহারানীর গ্যালারি খোলো",
    toGalleryEn: "Reveal Maharani's Gallery",
    toTimelineBn: "সেই দিনগুলোতে ফিরে যাই",
    toTimelineEn: "Relive How It Began",
    toReasonsBn: "তুমি কেন এত বিশেষ",
    toReasonsEn: "Discover Why You're Special",
    toCakeBn: "এবার কেক কাটার পালা",
    toCakeEn: "Bring Out the Birthday Cake",
    toLetterBn: "মহারানীর চিঠি খোলো",
    toLetterEn: "Unlock Your Royal Letter",
    toFinaleBn: "শেষ চমক দেখো",
    toFinaleEn: "Unlock the Final Surprise"
  },

  interludes: {
    film: {
      bn: "তুমি জানো আজ আমি কতটা খুশি? আজ আমার মহারানীর জন্মদিন!",
      en: "You know how excited I am? It's your birthday, Maharani..."
    },
    gallery: {
      bn: "তোমার প্রতিটি হাসি আমার সবচেয়ে প্রিয় ছবি।",
      en: "Every single smile of yours is my favourite work of art."
    },
    timeline: {
      bn: "একটা ছোট্ট \"Hi\" আমার পুরো পৃথিবী বদলে দিল...",
      en: "One tiny \"Hi\" changed my entire world forever..."
    },
    reasons: {
      bn: "তোমাকে ভালোবাসার হাজারো কারণের কয়েকটা...",
      en: "Just a few of the thousand reasons you own my heart..."
    },
    cake: {
      bn: "চোখ বন্ধ করো মহারানী, একটা সুন্দর ইচ্ছে করো...",
      en: "Close your eyes, Maharani, and wish for the stars..."
    },
    letter: {
      bn: "কিছু কথা শুধু তোমার জন্য হৃদয় দিয়ে লিখে রেখেছি...",
      en: "Some words were written only for your heart..."
    },
    finale: {
      bn: "আর একটা শেষ কথা... যেটা আমি চিরকাল বলবো।",
      en: "And one last thing I will say for the rest of my life..."
    }
  }
};
