export const PARAGRAPH_POOLS = {
  60: [
    "Learning new skills demands time, patience and consistent effort. Typing is a genuinely valuable digital skill because it lets people express ideas swiftly and clearly. Deliberate practice trains your fingers to recognize the position of every key. Over time, you will develop sharper rhythm, fewer errors and greater confidence.",
    "Modern technology has reshaped education and communication. Students can access books, courses, videos and valuable information from almost anywhere. Technology becomes powerful when it is used responsibly. Sharp focus, careful research and consistent practice help students transform digital tools into genuine learning resources.",
    "Success is often the result of small improvements made consistently over a long period of time. People frequently expect instant results when learning something new, yet meaningful progress usually demands patience. Mistakes should be viewed as opportunities to learn rather than reasons to quit.",
    "The internet has made it possible for people around the world to communicate and exchange information almost instantly. Businesses rely on online services to reach customers, students turn to digital resources for education and families use communication platforms to stay connected.",
    "A healthy environment matters for every living creature on Earth. Forests shelter animals, purify the air and help sustain the balance of nature. Protecting natural environments requires everyday responsibility."
  ],
  180: [
    "Learning any new skill demands time, patience and consistent, deliberate effort, and typing is no exception to that general rule. Typing is a genuinely valuable digital skill because it lets people express ideas swiftly, clearly and confidently across emails, documents, forums and countless everyday applications. Deliberate practice gradually trains your fingers to recognize the exact position of every key without conscious thought, freeing your mind to focus on the words themselves rather than the mechanics of pressing them. Over time, disciplined repetition produces sharper rhythm, fewer careless errors, steadier posture and far greater overall confidence.",
    "Success is often the quiet result of small, unglamorous improvements made consistently over a surprisingly long period of time rather than any single dramatic breakthrough. People frequently expect instant results when learning something unfamiliar, yet meaningful, lasting progress usually demands considerable patience, humility and a willingness to fail repeatedly along the way."
  ],
  300: [
    "Learning any new skill demands time, patience and consistent, deliberate effort, and typing is certainly no exception to that timeless rule. Typing is a genuinely valuable digital skill because it lets people express ideas swiftly, clearly and confidently across emails, reports, essays, forums and countless everyday applications that define modern working life. Deliberate practice gradually trains your fingers to recognize the exact position of every key without conscious thought, freeing your mind to focus entirely on the words themselves rather than the underlying mechanics of pressing them one at a time."
  ]
};

export const PRACTICE_MODES = {
  all: {
    title: "All Keys Practice",
    description: "Train the complete keyboard.",
    pill: "ALL KEYS",
    goal: "Accuracy",
    info: "This exercise combines letters, numbers, punctuation and spaces so you can train your complete keyboard.",
    patterns: [
      "the quick brown fox jumps over the lazy dog",
      "practice makes progress every single day",
      "quick typing requires accuracy and rhythm",
      "learn every key before chasing speed",
      "consistent practice builds muscle memory"
    ]
  },
  left: {
    title: "Left Hand Practice",
    description: "Train the left side of your keyboard.",
    pill: "LEFT HAND",
    goal: "Left Hand",
    info: "Focus on Q W E R T, A S D F G and Z X C V B.",
    patterns: [
      "asdfg",
      "qwert",
      "zxcvb",
      "asdfg qwert zxcvb",
      "red fed wed sad dad",
      "west rest test desk",
      "great sweater dresses fade"
    ]
  },
  right: {
    title: "Right Hand Practice",
    description: "Train the right side of your keyboard.",
    pill: "RIGHT HAND",
    goal: "Right Hand",
    info: "Focus on Y U I O P, H J K L and N M.",
    patterns: [
      "yuiop",
      "hjkl",
      "nm",
      "yuiop hjkl nm",
      "jump moon look",
      "you know how",
      "honey milk in a mug"
    ]
  },
  home: {
    title: "Home Row Practice",
    description: "Build strong home-row muscle memory.",
    pill: "HOME ROW",
    goal: "Home Row",
    info: "Keep your fingers anchored around A S D F and J K L ;.",
    patterns: [
      "asdf jkl;",
      "asdfg hjkl;",
      "fj fj dk dk",
      "ask sad fall",
      "dad has all",
      "glass flask"
    ]
  },
  top: {
    title: "Top Row Practice",
    description: "Train QWERTY top-row movement.",
    pill: "TOP ROW",
    goal: "Top Row",
    info: "Practice Q W E R T Y U I O P without looking down.",
    patterns: [
      "qwerty",
      "yuiop",
      "qwerty uiop",
      "type write quiet",
      "power tower",
      "quote poetry"
    ]
  },
  bottom: {
    title: "Bottom Row Practice",
    description: "Strengthen Z X C V B N M movement.",
    pill: "BOTTOM ROW",
    goal: "Bottom Row",
    info: "Train the lower keyboard row and improve finger movement.",
    patterns: [
      "zxcvbnm",
      "zxcvb nm",
      "mix box",
      "maximum",
      "zinc carbon",
      "zoom mix move"
    ]
  },
  numbers: {
    title: "Number Row Practice",
    description: "Master the number keys above the letters.",
    pill: "NUMBER ROW",
    goal: "Numbers",
    info: "Practice 0–9 and number combinations until they become automatic.",
    patterns: [
      "1234567890",
      "0987654321",
      "12345 67890",
      "1122334455",
      "order 4821 shipped on 09 15"
    ]
  },
  numpad: {
    title: "Numpad Practice",
    description: "Train the dedicated numeric keypad.",
    pill: "NUMPAD",
    goal: "Numpad",
    info: "Build numeric keypad speed for calculations, data entry and office work.",
    patterns: [
      "1234567890",
      "7418529630",
      "123 456 789",
      "2026 0815",
      "100 250 500 1000",
      "72 145 398 610 927"
    ]
  },
  shift: {
    title: "Shift & Capital Practice",
    description: "Train uppercase letters and Shift combinations.",
    pill: "SHIFT",
    goal: "Capitalization",
    info: "Practice uppercase typing while maintaining rhythm and accuracy.",
    patterns: [
      "The Quick Brown Fox",
      "Learning Typing Is Fun",
      "QuickType Keyboard Training",
      "Practice Makes Progress",
      "Accuracy Comes Before Speed"
    ]
  },
  symbols: {
    title: "Symbols Practice",
    description: "Master punctuation and keyboard symbols.",
    pill: "SYMBOLS",
    goal: "Symbols",
    info: "Train punctuation, operators and special characters commonly used in programming and writing.",
    patterns: [
      "! @ # $ % ^ & *",
      "( ) [ ] { }",
      "< > / \\ |",
      "+ = - _",
      "total = (price * qty) - discount;",
      "email: name@example.com; #urgent!"
    ]
  },
  mixed: {
    title: "Mixed Keyboard Practice",
    description: "Combine different keyboard zones.",
    pill: "MIXED",
    goal: "Mixed",
    info: "This mode intentionally mixes letters, numbers, punctuation and symbols.",
    patterns: [
      "QuickType 2026!",
      "Code + Learn = Progress",
      "User123 @ QuickType.com",
      "Hello, World! 123",
      "Speed > mistakes"
    ]
  },
  speed: {
    title: "Speed Burst",
    description: "Short patterns designed for maximum speed.",
    pill: "SPEED",
    goal: "Speed",
    info: "Try to type quickly while keeping accuracy above 95%.",
    patterns: [
      "the the the the",
      "and and and and",
      "quick quick quick",
      "type type type",
      "speed speed speed",
      "fast fingers fast mind"
    ]
  }
};

export const TUTORIAL_SCREENS = [
  {
    icon: "⌨️",
    title: "Welcome to QuickType",
    text: "Learn the keyboard methodically and build genuine muscle memory through steady, focused repetition."
  },
  {
    icon: "🤲",
    title: "Home Row",
    text: "Rest your left fingers on A S D F and your right fingers on J K L and semicolon — this is your anchor position."
  },
  {
    icon: "👀",
    title: "Stop Looking Down",
    text: "Train your eyes to stay on the screen instead of the keyboard. With repetition, your fingers memorise each key automatically."
  },
  {
    icon: "🎯",
    title: "Accuracy First",
    text: "Speed matters, but precision comes first. Slow, accurate typing naturally evolves into fast, confident typing."
  },
  {
    icon: "⚡",
    title: "Train Every Zone",
    text: "Strengthen each region individually — left hand, right hand, number row, symbols, bottom row and numpad."
  },
  {
    icon: "🏆",
    title: "You're Ready",
    text: "Pick a practice drill or dive into a timed typing test to measure your progress."
  }
];

export const BADGES = [
  { id: "first-test", icon: "🎯", name: "First Steps", desc: "Complete your first typing test." },
  { id: "ten-tests", icon: "📚", name: "Dedicated Typist", desc: "Complete 10 typing tests." },
  { id: "speed-40", icon: "⚡", name: "Speed Runner", desc: "Reach 40 WPM in a test." },
  { id: "speed-60", icon: "🚀", name: "Velocity Master", desc: "Reach 60 WPM in a test." },
  { id: "speed-100", icon: "🛸", name: "Warp Speed", desc: "Reach 100 WPM in a test." },
  { id: "perfect-accuracy", icon: "💎", name: "Flawless", desc: "Finish a test with 100% accuracy." },
  { id: "practice-fan", icon: "🏋️", name: "Practice Makes Perfect", desc: "Complete 15 practice sessions." },
  { id: "streak-3", icon: "🔥", name: "On a Roll", desc: "Keep a 3-day practice streak." },
  { id: "streak-7", icon: "🌟", name: "Week Warrior", desc: "Keep a 7-day practice streak." }
];

export const THEMES = {
  indigo: { primary: "#6366f1", primary2: "#8b5cf6" },
  cyan: { primary: "#06b6d4", primary2: "#22d3ee" },
  pink: { primary: "#ec4899", primary2: "#f472b6" },
  green: { primary: "#22c55e", primary2: "#4ade80" },
  amber: { primary: "#f59e0b", primary2: "#fbbf24" }
};

export const SLIDES = [
  { 
    src: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80", 
    url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80", 
    caption: "Focused Typing Session — Ergonomic Precision" 
  },
  { 
    src: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1200&q=80", 
    url: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1200&q=80", 
    caption: "Custom Mechanical Switches & Tactile Feedback" 
  },
  { 
    src: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80", 
    url: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80", 
    caption: "Modern Workstation & Flow State Typing" 
  },
  { 
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80", 
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80", 
    caption: "Collaborative Remote Engineering Setup" 
  },
  { 
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", 
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", 
    caption: "Code Syntax Mastery & High-Speed Keystrokes" 
  },
  { 
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80", 
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80", 
    caption: "Dark Theme Terminal & Real-Time Analytics" 
  }
];
