/* QuickType — Advanced Typing Trainer
   All application JavaScript, extracted from index.html. */

(function(){

    try{
        const probe = "__quicktype_probe__";
        window.localStorage.setItem(probe, "1");
        window.localStorage.removeItem(probe);
    }catch(err){

        const memory = {};

        const shim = {
            getItem:function(key){ return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null; },
            setItem:function(key, value){ memory[key] = String(value); },
            removeItem:function(key){ delete memory[key]; },
            clear:function(){ Object.keys(memory).forEach(function(k){ delete memory[k]; }); }
        };

        try{
            Object.defineProperty(window, "localStorage", { value:shim, configurable:true });
        }catch(e){
            console.warn("QuickType: localStorage unavailable, progress will not be saved.");
        }

    }

})();


/* =========================================================
   TEST PARAGRAPHS

   Passages are grouped by test length so the wording, vocabulary
   and overall length scale with the selected timestamp: the
   1-minute pool stays short and punchy, the 3-minute pool is
   noticeably longer with richer vocabulary, and the 5-minute pool
   is the longest and most descriptive of all. newTest() below
   also chains a fresh passage onto the current one automatically
   if a fast typist reaches the end before the clock runs out, so
   the reference text never runs dry mid-test.
========================================================= */

const paragraphPools = {

    /* 60 seconds — short, direct passages. */
    60:[

`Learning new skills demands time, patience and consistent effort. Typing is a genuinely valuable digital skill because it lets people express ideas swiftly and clearly. Deliberate practice trains your fingers to recognize the position of every key. Over time, you will develop sharper rhythm, fewer errors and greater confidence.`,

`Modern technology has reshaped education and communication. Students can access books, courses, videos and valuable information from almost anywhere. Technology becomes powerful when it is used responsibly. Sharp focus, careful research and consistent practice help students transform digital tools into genuine learning resources.`,

`Success is often the result of small improvements made consistently over a long period of time. People frequently expect instant results when learning something new, yet meaningful progress usually demands patience. Mistakes should be viewed as opportunities to learn rather than reasons to quit.`,

`The internet has made it possible for people around the world to communicate and exchange information almost instantly. Businesses rely on online services to reach customers, students turn to digital resources for education and families use communication platforms to stay connected.`,

`A healthy environment matters for every living creature on Earth. Forests shelter animals, purify the air and help sustain the balance of nature. Protecting natural environments requires everyday responsibility. Reducing waste, conserving water, planting trees and respecting wildlife are simple actions that contribute to a healthier planet.`

    ],

    /* 180 seconds — longer passages with a broader vocabulary. */
    180:[

`Learning any new skill demands time, patience and consistent, deliberate effort, and typing is no exception to that general rule. Typing is a genuinely valuable digital skill because it lets people express ideas swiftly, clearly and confidently across emails, documents, forums and countless everyday applications. Deliberate practice gradually trains your fingers to recognize the exact position of every key without conscious thought, freeing your mind to focus on the words themselves rather than the mechanics of pressing them. Over time, disciplined repetition produces sharper rhythm, fewer careless errors, steadier posture and far greater overall confidence. Typists who practice regularly often discover that their thoughts flow onto the screen almost as quickly as they occur, turning a once tedious chore into an almost effortless extension of thinking itself.`,

`Modern technology has fundamentally reshaped education, communication and the everyday exchange of knowledge across the globe. Students today can access textbooks, video lectures, interactive courses and enormous archives of valuable information from almost anywhere with an internet connection, collapsing distances that once made learning slow and expensive. Technology becomes genuinely powerful only when it is used responsibly, thoughtfully and with clear intention rather than as a constant distraction. Sharp focus, careful research, critical thinking and consistent practice help ambitious students transform ordinary digital tools into extraordinary learning resources. Teachers increasingly rely on collaborative platforms, adaptive software and instant feedback systems to personalize instruction, while learners themselves must cultivate the discipline to sift reliable sources from noise in an age of overwhelming information.`,

`Success is often the quiet result of small, unglamorous improvements made consistently over a surprisingly long period of time rather than any single dramatic breakthrough. People frequently expect instant results when learning something unfamiliar, yet meaningful, lasting progress usually demands considerable patience, humility and a willingness to fail repeatedly along the way. Mistakes should be viewed as valuable opportunities to learn rather than embarrassing reasons to quit or abandon a goal altogether. Ambitious individuals who track their gradual progress, celebrate modest milestones and remain curious about their own weaknesses tend to outperform those who simply chase talent or shortcuts. Genuine mastery, whether in typing, music, sport or craftsmanship, is almost always built one deliberate, unremarkable repetition at a time.`,

`The internet has made it astonishingly possible for people scattered around the entire world to communicate and exchange information almost instantly, reshaping commerce, culture and daily life within a single generation. Businesses increasingly rely on online services to reach customers efficiently, students turn to abundant digital resources for education and research, and families use countless communication platforms to stay meaningfully connected across vast distances. This constant connectivity brings tremendous convenience, yet it also introduces new challenges: misinformation spreads rapidly, attention becomes fragmented, and privacy requires far more vigilance than in earlier eras. Navigating this environment wisely means balancing genuine curiosity with healthy skepticism, embracing useful tools while guarding against their more corrosive side effects on focus and wellbeing.`,

`A healthy environment matters immensely for every living creature that shares this planet, from towering forests to microscopic organisms in distant soil. Forests shelter countless animals, purify the surrounding air and help sustain the delicate balance of nature that supports agriculture, weather patterns and clean water supplies worldwide. Protecting natural environments requires everyday responsibility from individuals, communities and governments alike, not merely occasional gestures during designated awareness campaigns. Reducing waste, conserving water, planting trees, supporting renewable energy and respecting wildlife habitats are simple yet meaningful actions that collectively contribute to a healthier, more resilient planet. Future generations will inherit whatever balance we strike today, making thoughtful stewardship an urgent and shared obligation rather than an optional afterthought.`

    ],

    /* 300 seconds — the longest, most descriptive passages. */
    300:[

`Learning any new skill demands time, patience and consistent, deliberate effort, and typing is certainly no exception to that timeless rule. Typing is a genuinely valuable digital skill because it lets people express ideas swiftly, clearly and confidently across emails, reports, essays, forums and countless everyday applications that define modern working life. Deliberate practice gradually trains your fingers to recognize the exact position of every key without conscious thought, freeing your mind to focus entirely on the words themselves rather than the underlying mechanics of pressing them one at a time. Over time, disciplined repetition produces sharper rhythm, fewer careless errors, steadier posture and far greater overall confidence at the keyboard. Typists who practice regularly and deliberately often discover that their thoughts flow onto the screen almost as quickly as they occur, turning a once tedious, mechanical chore into an almost effortless extension of thinking itself. This transformation rarely happens overnight; it emerges gradually from short, focused sessions repeated day after day, week after week, until accuracy and speed finally arrive together rather than as separate, competing goals.`,

`Modern technology has fundamentally reshaped education, communication and the everyday exchange of knowledge across the entire globe in ways earlier generations could scarcely have imagined. Students today can access textbooks, recorded lectures, interactive courses and enormous digital archives of valuable information from almost anywhere with a reliable internet connection, collapsing distances that once made serious learning slow, expensive and geographically limited. Technology becomes genuinely powerful only when it is used responsibly, thoughtfully and with clear intention rather than as a constant, addictive distraction competing for every spare moment of attention. Sharp focus, careful research, critical thinking and consistent, patient practice help ambitious students transform ordinary digital tools into extraordinary learning resources capable of accelerating growth dramatically. Teachers increasingly rely on collaborative platforms, adaptive software and instant feedback systems to personalize instruction for every individual learner, while students themselves must cultivate the discipline required to sift reliable sources from overwhelming noise in an age defined by information abundance rather than scarcity.`,

`Success is often the quiet, unglamorous result of small improvements made consistently over a surprisingly long period of time rather than any single dramatic breakthrough or stroke of luck. People frequently expect instant results when learning something unfamiliar, yet meaningful, lasting progress usually demands considerable patience, genuine humility and a stubborn willingness to fail repeatedly along the winding road toward mastery. Mistakes should be viewed as valuable, even necessary opportunities to learn rather than embarrassing reasons to quit or abandon a worthwhile goal altogether at the first sign of difficulty. Ambitious individuals who track their gradual progress carefully, celebrate modest milestones honestly and remain endlessly curious about their own weaknesses tend to outperform those who simply chase raw talent or convenient shortcuts. Genuine mastery, whether in typing, music, athletics or craftsmanship, is almost always constructed one deliberate, unremarkable repetition at a time, quietly compounding until the results finally become impossible to ignore.`,

`The internet has made it astonishingly possible for people scattered across the entire world to communicate and exchange information almost instantly, reshaping global commerce, culture and daily life within the span of a single generation. Businesses increasingly rely on online services to reach customers efficiently and affordably, students turn to abundant digital resources for education and independent research, and families use countless communication platforms to stay meaningfully connected across vast, once impossible distances. This constant connectivity brings tremendous convenience and opportunity, yet it also introduces genuinely new challenges: misinformation spreads with alarming speed, attention becomes fragmented across dozens of competing notifications, and personal privacy requires far more vigilance than in earlier, simpler eras of communication. Navigating this environment wisely means balancing genuine curiosity with healthy skepticism, embracing useful tools while guarding against their more corrosive side effects on focus, memory and overall wellbeing over time.`,

`A healthy environment matters immensely for every living creature that shares this remarkable planet, from towering ancient forests to microscopic organisms hidden within distant soil. Forests shelter countless species of animals, purify the surrounding air and help sustain the delicate balance of nature that quietly supports agriculture, weather patterns and clean water supplies for billions of people worldwide. Protecting natural environments requires genuine, everyday responsibility from individuals, communities, corporations and governments alike, not merely occasional gestures reserved for designated awareness campaigns once a year. Reducing waste, conserving water, planting trees, supporting renewable energy and respecting fragile wildlife habitats are simple yet meaningful actions that collectively contribute to a healthier, more resilient planet for generations still to come. Future generations will inherit whatever ecological balance we strike today, making thoughtful, consistent stewardship an urgent and shared obligation rather than a distant, optional afterthought that can be postponed indefinitely.`

    ]

};

/* Flat list kept for backward compatibility with any code that
   expects a single combined pool of passages. */
const paragraphs = [].concat(
    paragraphPools[60],
    paragraphPools[180],
    paragraphPools[300]
);


/* =========================================================
   TEST STATE
========================================================= */

let testDuration = 60;

let currentParagraph = "";

let startTime = null;

let timerInterval = null;

let testRunning = false;

let testFinished = false;

let soundEnabled = true;

let correctCharacters = 0;

let errorCharacters = 0;

let lastResult = null;


/* =========================================================
   PRACTICE DATA
========================================================= */

const practiceModes = {

    all:{
        title:"All Keys Practice",
        description:"Train the complete keyboard.",
        pill:"ALL KEYS",
        goal:"Accuracy",
        info:"This exercise combines letters, numbers, punctuation and spaces so you can train your complete keyboard.",
        patterns:[
            "the quick brown fox jumps over the lazy dog",
            "practice makes progress every single day",
            "quick typing requires accuracy and rhythm",
            "learn every key before chasing speed",
            "consistent practice builds muscle memory",
            "a calm mind and steady hands type best",
            "great typists trust their fingers, not their eyes",
            "small daily sessions beat rare long ones",
            "confidence grows quietly with every accurate line",
            "focus on rhythm and the speed will follow"
        ]
    },

    left:{
        title:"Left Hand Practice",
        description:"Train the left side of your keyboard.",
        pill:"LEFT HAND",
        goal:"Left Hand",
        info:"Focus on Q W E R T, A S D F G and Z X C V B.",
        patterns:[
            "asdfg",
            "qwert",
            "zxcvb",
            "asdfg qwert zxcvb",
            "red fed wed sad dad",
            "west rest test desk",
            "great sweater dresses fade",
            "average dresser deserves care",
            "grab a fresh cedar tree",
            "sad geese gather at dawn",
            "create a great garden fence",
            "gather fresh berries before dark",
            "watered gardens grow greatest crops",
            "brave zebras dashed after a great feast",
            "sacred trees rest beside a great cave"
        ]
    },

    right:{
        title:"Right Hand Practice",
        description:"Train the right side of your keyboard.",
        pill:"RIGHT HAND",
        goal:"Right Hand",
        info:"Focus on Y U I O P, H J K L and N M.",
        patterns:[
            "yuiop",
            "hjkl",
            "nm",
            "yuiop hjkl nm",
            "jump moon look",
            "you know how",
            "honey milk in a mug",
            "a monkey looks up high",
            "pink lily blooms in july",
            "unlikely opinion on lunch",
            "kindly join him in kyoto",
            "many hills hold humpy hills",
            "you look mighty happy today",
            "nobody hopped on my minivan",
            "hip hip hooray, holiday plan"
        ]
    },

    home:{
        title:"Home Row Practice",
        description:"Build strong home-row muscle memory.",
        pill:"HOME ROW",
        goal:"Home Row",
        info:"Keep your fingers anchored around A S D F and J K L ;.",
        patterns:[
            "asdf jkl;",
            "asdfg hjkl;",
            "fj fj dk dk",
            "ask sad fall",
            "dad has all",
            "glass flask",
            "a lad sat; a glass fell",
            "half a flask ashed a jar",
            "salad; a glad lass had all"
        ]
    },

    top:{
        title:"Top Row Practice",
        description:"Train QWERTY top-row movement.",
        pill:"TOP ROW",
        goal:"Top Row",
        info:"Practice Q W E R T Y U I O P without looking down.",
        patterns:[
            "qwerty",
            "yuiop",
            "qwerty uiop",
            "type write quiet",
            "power tower",
            "quote poetry",
            "type quietly, write it out",
            "our route required quiet power",
            "quiet writers type witty poetry"
        ]
    },

    bottom:{
        title:"Bottom Row Practice",
        description:"Strengthen Z X C V B N M movement.",
        pill:"BOTTOM ROW",
        goal:"Bottom Row",
        info:"Train the lower keyboard row and improve finger movement.",
        patterns:[
            "zxcvbnm",
            "zxcvb nm",
            "mix box",
            "maximum",
            "zinc carbon",
            "zoom mix move",
            "vamoose, my zombie van moves",
            "count boxes, mix numbers, zoom",
            "an even mix cannot move mountains"
        ]
    },

    numbers:{
        title:"Number Row Practice",
        description:"Master the number keys above the letters.",
        pill:"NUMBER ROW",
        goal:"Numbers",
        info:"Practice 0–9 and number combinations until they become automatic.",
        patterns:[
            "1234567890",
            "0987654321",
            "12345 67890",
            "1122334455",
            "2468 13579",
            "2026 2027 1234",
            "order 4821 shipped on 09 15",
            "invoice 77234 totals 1690 50",
            "flight 208 departs at 14 45"
        ]
    },

    numpad:{
        title:"Numpad Practice",
        description:"Train the dedicated numeric keypad.",
        pill:"NUMPAD",
        goal:"Numpad",
        info:"Build numeric keypad speed for calculations, data entry and office work.",
        patterns:[
            "1234567890",
            "7418529630",
            "123 456 789",
            "2026 0815",
            "100 250 500 1000",
            "12345 67890",
            "72 145 398 610 927",
            "4500 3200 1800 900 275",
            "10 20 30 40 50 60 70 80"
        ]
    },

    shift:{
        title:"Shift & Capital Practice",
        description:"Train uppercase letters and Shift combinations.",
        pill:"SHIFT",
        goal:"Capitalization",
        info:"Practice uppercase typing while maintaining rhythm and accuracy.",
        patterns:[
            "The Quick Brown Fox",
            "Learning Typing Is Fun",
            "QuickType Keyboard Training",
            "Practice Makes Progress",
            "Accuracy Comes Before Speed",
            "Build Better Typing Habits",
            "New York, London And Tokyo",
            "Monday, Wednesday And Friday",
            "United States Of America"
        ]
    },

    symbols:{
        title:"Symbols Practice",
        description:"Master punctuation and keyboard symbols.",
        pill:"SYMBOLS",
        goal:"Symbols",
        info:"Train punctuation, operators and special characters commonly used in programming and writing.",
        patterns:[
            "! @ # $ % ^ & *",
            "( ) [ ] { }",
            "< > / \\ |",
            "+ = - _",
            ": ; ' \" , . ?",
            "!@#$%^&*()",
            "she said, \"wait — is that true?\"",
            "total = (price * qty) - discount;",
            "email: name@example.com; #urgent!"
        ]
    },

    mixed:{
        title:"Mixed Keyboard Practice",
        description:"Combine different keyboard zones.",
        pill:"MIXED",
        goal:"Mixed",
        info:"This mode intentionally mixes letters, numbers, punctuation and symbols.",
        patterns:[
            "QuickType 2026!",
            "Code + Learn = Progress",
            "User123 @ QuickType.com",
            "Hello, World! 123",
            "Speed > mistakes",
            "Accuracy: 98%+",
            "Meeting #4 starts at 9:30 AM.",
            "Order ID 55210 shipped — thanks!",
            "Password must have 8+ characters."
        ]
    },

    speed:{
        title:"Speed Burst",
        description:"Short patterns designed for maximum speed.",
        pill:"SPEED",
        goal:"Speed",
        info:"Try to type quickly while keeping accuracy above 95%.",
        patterns:[
            "the the the the",
            "and and and and",
            "quick quick quick",
            "type type type",
            "speed speed speed",
            "fast fingers fast mind",
            "go go go go faster now",
            "keep keep keep the rhythm up",
            "push push push past your best"
        ]
    }

};


/* =========================================================
   ELEMENTS
========================================================= */

const typingInput =
    document.getElementById("typingInput");

const referenceText =
    document.getElementById("referenceText");

const timerElement =
    document.getElementById("timer");

const liveWpm =
    document.getElementById("liveWpm");

const liveAccuracy =
    document.getElementById("liveAccuracy");

const liveTime =
    document.getElementById("liveTime");

const liveCharacters =
    document.getElementById("liveCharacters");

const resultBox =
    document.getElementById("result");


/* =========================================================
   NAVIGATION
========================================================= */

function showPage(pageId, navOptions){

    navOptions = navOptions || {};

    const page = document.getElementById(pageId);

    /* Never blank the screen for an unknown page id. */
    if(!page || !page.classList.contains("page")){
        return;
    }

    if(typeof stopReadAloud === "function"){
        stopReadAloud();
    }

    if(typeof closeMobileMenu === "function"){
        closeMobileMenu();
    }

    document
        .querySelectorAll(".page.active")
        .forEach(p => p.classList.remove("active"));

    page.classList.add("active");

    document
        .querySelectorAll(".nav button.active")
        .forEach(button => button.classList.remove("active"));

    const nav = document.getElementById("nav-" + pageId);

    if(nav){
        nav.classList.add("active");
    }

    window.scrollTo({ top:0, behavior:"auto" });

    /* Keep the URL hash in sync so every section is bookmarkable
       and the browser back button works. */
    if(!navOptions.skipHistory){
        const hash = "#" + pageId;
        if(location.hash !== hash){
            try{
                history.pushState({ page:pageId }, "", hash);
            }catch(err){
                /* Sandboxed / embedded previews can block the History API. */
            }
        }
    }

    if(pageId === "progress"){
        renderProgress();
    }

    if(pageId === "practice"){
        renderProblemKeys();
    }

    if(pageId === "home"){

        if(typeof renderHomeStatsChart === "function"){
            renderHomeStatsChart();
        }

        if(typeof renderGoalProgress === "function"){
            renderGoalProgress(typeof loadGoal === "function" ? loadGoal() : 40);
        }

        if(typeof renderTypingSlider === "function"){
            renderTypingSlider();
        }

    }

    /* The slider only runs while the Home page is visible. */
    if(pageId === "home"){
        if(typeof startSliderAutoplay === "function"){
            startSliderAutoplay();
        }
    }else if(typeof stopSliderAutoplay === "function"){
        stopSliderAutoplay();
    }

    if(pageId === "map" && typeof attemptMapInit === "function"){
        attemptMapInit();
    }

    if(typeof observeReveals === "function"){
        observeReveals();
    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu(force){

    const nav = document.getElementById("mainNav");
    const button = document.getElementById("mobileMenuBtn");

    if(!nav){
        return;
    }

    const open =
        typeof force === "boolean"
            ? force
            : !nav.classList.contains("open");

    nav.classList.toggle("open", open);

    if(button){
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "✕" : "☰";
    }

}

function closeMobileMenu(){
    toggleMobileMenu(false);
}


/* =========================================================
   TEST
========================================================= */

function startTimedTest(seconds){

    testDuration = seconds;

    showPage("typingTest");

    document.getElementById("testTitle")
        .textContent =
        `${seconds / 60} Minute Typing Test`;

    newTest();

    setTimeout(
        () => typingInput.focus(),
        100
    );

}


function getParagraphPool(){

    return (
        paragraphPools[testDuration] ||
        paragraphPools[60]
    );

}


function pickRandomParagraph(){

    const pool =
        getParagraphPool();

    return pool[
        Math.floor(
            Math.random() *
            pool.length
        )
    ];

}


function newTest(){

    stopReadAloud();

    clearInterval(timerInterval);

    currentParagraph =
        pickRandomParagraph();

    startTime = null;

    testRunning = false;

    testFinished = false;

    correctCharacters = 0;

    errorCharacters = 0;

    typingInput.disabled = false;

    typingInput.value = "";

    resultBox.style.display = "none";

    timerElement.textContent =
        formatTime(testDuration);

    liveTime.textContent =
        formatTime(testDuration);

    liveWpm.textContent = "0";

    liveAccuracy.textContent = "100%";

    liveCharacters.textContent = "0";

    renderReference();

}


function renderReference(){

    referenceText.innerHTML = "";

    [...currentParagraph]
        .forEach(
            (character,index)=>{

                const span =
                    document.createElement("span");

                span.textContent = character;

                if(index === 0){
                    span.classList.add("current");
                }

                referenceText.appendChild(span);

            }
        );

}


function focusTyping(){

    typingInput.focus();

}


typingInput.addEventListener(
    "input",
    ()=>{

        if(!testRunning && !testFinished){
            startClock();
        }

        if(testFinished){
            return;
        }

        extendParagraphIfNeeded();

        updateTypingDisplay();

        updateStats();

    }
);


/* If a fast typist reaches the end of the current passage before
   the timer runs out, chain on another random passage from the
   same duration's pool so there is always more text to type for
   the full length of the test. */
function extendParagraphIfNeeded(){

    if(!testRunning || testFinished){
        return;
    }

    const typedLength =
        typingInput.value.length;

    if(
        typedLength <
        currentParagraph.length - 20
    ){
        return;
    }

    const addition =
        " " + pickRandomParagraph();

    currentParagraph += addition;

    [...addition].forEach(
        character=>{

            const span =
                document.createElement("span");

            span.textContent = character;

            referenceText.appendChild(span);

        }
    );

}


function startClock(){

    if(startTime){
        return;
    }

    startTime =
        performance.now();

    testRunning = true;

    clearInterval(timerInterval);

    timerInterval =
        setInterval(
            updateStats,
            100
        );

}


function updateTypingDisplay(){

    const typed =
        typingInput.value;

    const spans =
        referenceText.querySelectorAll("span");

    spans.forEach(
        (span,index)=>{

            span.className = "";

            if(index < typed.length){

                if(
                    typed[index] ===
                    currentParagraph[index]
                ){

                    span.classList.add("correct");

                }else{

                    span.classList.add("wrong");

                }

            }

            if(
                index === typed.length &&
                index < spans.length
            ){

                span.classList.add("current");

            }

        }
    );

}


function updateStats(){

    if(!startTime){
        return;
    }

    const elapsed =
        (
            performance.now() -
            startTime
        ) / 1000;

    const remaining =
        Math.max(
            0,
            testDuration - elapsed
        );

    const typed =
        typingInput.value;

    let correct = 0;

    let errors = 0;

    for(
        let i=0;
        i<typed.length;
        i++
    ){

        if(
            typed[i] ===
            currentParagraph[i]
        ){

            correct++;

        }else{

            errors++;

        }

    }

    correctCharacters = correct;

    errorCharacters = errors;

    const accuracy =
        typed.length === 0
            ? 100
            : correct / typed.length * 100;

    const wpm =
        elapsed > 0
            ? (correct / 5) /
              (elapsed / 60)
            : 0;

    liveWpm.textContent =
        Math.round(wpm);

    liveAccuracy.textContent =
        Math.round(accuracy) + "%";

    liveCharacters.textContent =
        typed.length;

    liveTime.textContent =
        formatTime(remaining);

    timerElement.textContent =
        formatTime(remaining);

    if(
        remaining <= 0
    ){

        finishTest();

    }

}


function formatTime(seconds){

    seconds =
        Math.max(
            0,
            Math.ceil(seconds)
        );

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;

    return (
        String(minutes) +
        ":" +
        String(secs).padStart(2,"0")
    );

}


function finishTest(){

    if(testFinished){
        return;
    }

    if(!startTime){
        return;
    }

    stopReadAloud();

    clearInterval(timerInterval);

    updateStats();

    testRunning = false;

    testFinished = true;

    typingInput.disabled = true;

    const typed =
        typingInput.value;

    const elapsed =
        Math.max(
            1,
            (
                performance.now() -
                startTime
            ) / 1000
        );

    const wpm =
        (
            correctCharacters / 5
        ) /
        (
            elapsed / 60
        );

    const accuracy =
        typed.length === 0
            ? 100
            : (
                correctCharacters /
                typed.length
            ) * 100;

    lastResult = {

        wpm:Math.round(wpm),

        accuracy:Math.round(accuracy),

        correct:correctCharacters,

        errors:errorCharacters,

        duration:testDuration,

        date:new Date().toLocaleString()

    };

    saveResult(lastResult);

    if(typeof renderGoalProgress === "function"){
        renderGoalProgress(typeof loadGoal === "function" ? loadGoal() : 40);
    }

    document.getElementById("finalWpm")
        .textContent =
        lastResult.wpm;

    document.getElementById("finalAccuracy")
        .textContent =
        lastResult.accuracy + "%";

    document.getElementById("finalCorrect")
        .textContent =
        lastResult.correct;

    document.getElementById("finalErrors")
        .textContent =
        lastResult.errors;

    resultBox.style.display = "block";

    updateHomeStats();

    showToast("Test completed! 🎉");

}


/* =========================================================
   SOUND
========================================================= */

function toggleSound(){

    soundEnabled =
        !soundEnabled;

    document.getElementById("soundBtn")
        .textContent =
        soundEnabled
            ? "🔊 Sound"
            : "🔇 Muted";

}


function playErrorSound(){

    if(!soundEnabled){
        return;
    }

    try{

        const context =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        oscillator.frequency.value = 120;

        gain.gain.value = .04;

        oscillator.connect(gain);

        gain.connect(context.destination);

        oscillator.start();

        oscillator.stop(
            context.currentTime + .06
        );

    }catch(e){}

}


function readAloud(){

    if(!("speechSynthesis" in window)){

        showToast(
            "Read aloud is not supported."
        );

        return;
    }

    stopReadAloud();

    const speech =
        new SpeechSynthesisUtterance(
            currentParagraph
        );

    speech.rate = .9;

    speech.pitch = 1;

    /* Reset the button the moment speech actually ends, errors
       out, or gets cancelled from anywhere else — this is what
       was missing before, so the "Read" button never flipped
       back and speech could be left running invisibly. */
    speech.onend = () => setReadAloudButtonState(false);
    speech.onerror = () => setReadAloudButtonState(false);

    speechSynthesis.speak(speech);

    setReadAloudButtonState(true);

}


function stopReadAloud(){

    if("speechSynthesis" in window){
        speechSynthesis.cancel();
    }

    setReadAloudButtonState(false);

}


function toggleReadAloud(){

    if("speechSynthesis" in window && speechSynthesis.speaking){
        stopReadAloud();
    }else{
        readAloud();
    }

}


function setReadAloudButtonState(isSpeaking){

    const btn = document.getElementById("readAloudBtn");

    if(!btn){
        return;
    }

    btn.textContent = isSpeaking ? "⏹ Stop" : "🔈 Read";
    btn.classList.toggle("active", isSpeaking);

}


/* Belt-and-braces: never let speech keep running once it no
   longer makes sense — switching tabs, leaving the page, or
   closing the browser. */
document.addEventListener("visibilitychange", function(){
    if(document.hidden){
        stopReadAloud();
    }
});

window.addEventListener("beforeunload", stopReadAloud);


/* =========================================================
   TUTORIAL
========================================================= */

const tutorialScreens = [

    {
        icon:"⌨️",
        title:"Welcome to QuickType",
        text:"Learn the keyboard methodically and build genuine muscle memory through steady, focused repetition."
    },

    {
        icon:"🤲",
        title:"Home Row",
        text:"Rest your left fingers on A S D F and your right fingers on J K L and the semicolon — this is your anchor position."
    },

    {
        icon:"👀",
        title:"Stop Looking Down",
        text:"Train your eyes to stay on the screen instead of the keyboard. With repetition, your fingers will memorize each key automatically."
    },

    {
        icon:"🎯",
        title:"Accuracy First",
        text:"Speed matters, but precision comes first. Slow, accurate typing naturally evolves into fast, confident typing."
    },

    {
        icon:"⚡",
        title:"Train Every Zone",
        text:"Strengthen each region individually — left hand, right hand, number row, symbols, bottom row and numpad."
    },

    {
        icon:"🏆",
        title:"You're Ready",
        text:"Pick a practice drill or dive into a timed typing test to measure your progress."
    }

];

let tutorialIndex = 0;


function renderTutorial(){

    const screen =
        tutorialScreens[tutorialIndex];

    const progress =
        document.getElementById(
            "tutorialProgress"
        );

    progress.innerHTML = "";

    tutorialScreens.forEach(
        (_,index)=>{

            const dot =
                document.createElement("div");

            dot.className =
                "progress-dot" +
                (
                    index <= tutorialIndex
                        ? " active"
                        : ""
                );

            progress.appendChild(dot);

        }
    );

    document.getElementById(
        "tutorialScreen"
    ).innerHTML = `

        <div class="icon">
            ${screen.icon}
        </div>

        <h2>
            ${screen.title}
        </h2>

        <p>
            ${screen.text}
        </p>

    `;

    document.getElementById(
        "tutorialNext"
    ).textContent =
        tutorialIndex ===
        tutorialScreens.length - 1
            ? "Start Practice →"
            : "Continue →";

}


function nextTutorial(){

    if(
        tutorialIndex <
        tutorialScreens.length - 1
    ){

        tutorialIndex++;

        renderTutorial();

    }else{

        showPage("practice");

    }

}


function previousTutorial(){

    if(tutorialIndex > 0){

        tutorialIndex--;

        renderTutorial();

    }

}


/* =========================================================
   PRACTICE ENGINE
========================================================= */

let currentPracticeMode = "all";

let currentPracticeTarget = "";

let practiceStartTime = null;

let practiceSessionRunning = false;

let practiceSound = true;

let practiceLastLength = 0;

let practiceSessionCount =
    Number(
        localStorage.getItem(
            "quickTypePracticeSessions"
        )
    ) || 0;


function selectPractice(mode){

    currentPracticeMode = mode;

    document
        .querySelectorAll(".practice-category")
        .forEach(button=>{

            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );

        });

    const data =
        practiceModes[mode];

    document.getElementById(
        "practiceTitle"
    ).textContent =
        data.title;

    document.getElementById(
        "practiceDescription"
    ).textContent =
        data.description;

    document.getElementById(
        "practiceModePill"
    ).textContent =
        data.pill;

    document.getElementById(
        "practiceGoalPill"
    ).textContent =
        data.goal;

    document.getElementById(
        "practiceInfo"
    ).textContent =
        data.info;

    document.getElementById(
        "numpadPanel"
    ).style.display =
        mode === "numpad"
            ? "block"
            : "none";

    resetPractice();

}


function getPracticePattern(){

    const mode =
        practiceModes[currentPracticeMode];

    return mode.patterns[
        Math.floor(
            Math.random() *
            mode.patterns.length
        )
    ];

}


function resetPractice(){

    practiceSessionRunning = false;

    practiceStartTime = null;

    practiceLastLength = 0;

    currentPracticeTarget =
        getPracticePattern();

    practiceInput.value = "";

    renderPracticeTarget();

    document.getElementById(
        "practiceWpm"
    ).textContent = "0";

    document.getElementById(
        "practiceAccuracy"
    ).textContent = "100%";

    document.getElementById(
        "practiceCorrect"
    ).textContent = "0";

    document.getElementById(
        "practiceErrors"
    ).textContent = "0";

    document.getElementById(
        "practiceProgress"
    ).style.width = "0%";

    clearKeyboardHighlights();

    practiceInput.focus();

}


function renderPracticeTarget(){

    const target =
        document.getElementById(
            "practiceTarget"
        );

    target.innerHTML = "";

    [...currentPracticeTarget]
        .forEach(
            (char,index)=>{

                const span =
                    document.createElement("span");

                span.textContent = char;

                if(index === 0){
                    span.classList.add("current");
                }

                target.appendChild(span);

            }
        );

}


const practiceInput =
    document.getElementById(
        "practiceInput"
    );


practiceInput.addEventListener(
    "input",
    handlePracticeInput
);


function handlePracticeInput(){

    const typed =
        practiceInput.value;

    if(
        !practiceSessionRunning &&
        typed.length > 0
    ){

        startPracticeClock();

    }

    let correct = 0;

    let errors = 0;

    for(
        let i=0;
        i<typed.length;
        i++
    ){

        if(
            typed[i] ===
            currentPracticeTarget[i]
        ){

            correct++;

        }else{

            errors++;

        }

    }

    const accuracy =
        typed.length === 0
            ? 100
            : correct / typed.length * 100;

    const elapsed =
        practiceStartTime
            ? Math.max(
                .1,
                (
                    performance.now() -
                    practiceStartTime
                ) / 1000
            )
            : 0;

    const wpm =
        elapsed > 0
            ? (
                correct / 5
            ) /
            (
                elapsed / 60
            )
            : 0;

    document.getElementById(
        "practiceCorrect"
    ).textContent =
        correct;

    document.getElementById(
        "practiceErrors"
    ).textContent =
        errors;

    document.getElementById(
        "practiceAccuracy"
    ).textContent =
        Math.round(accuracy) + "%";

    document.getElementById(
        "practiceWpm"
    ).textContent =
        Math.round(wpm);

    const progress =
        Math.min(
            100,
            (
                typed.length /
                currentPracticeTarget.length
            ) * 100
        );

    document.getElementById(
        "practiceProgress"
    ).style.width =
        progress + "%";

    renderPracticeProgress();

    updatePracticeKeyboard();

    trackPracticeKeys(
        typed
    );

    if(
        typed.length >
        practiceLastLength
    ){

        const lastChar =
            typed[typed.length - 1];

        const expected =
            currentPracticeTarget[
                typed.length - 1
            ];

        if(
            expected !== undefined &&
            lastChar !== expected
        ){

            playPracticeError();

        }

    }

    practiceLastLength =
        typed.length;

    if(
        typed.length >=
        currentPracticeTarget.length
    ){

        finishPractice(
            correct,
            errors,
            accuracy,
            wpm
        );

    }

}


function startPracticeClock(){

    practiceStartTime =
        performance.now();

    practiceSessionRunning = true;

}


function finishPractice(
    correct,
    errors,
    accuracy,
    wpm
){

    practiceSessionRunning = false;

    practiceSessionCount++;

    localStorage.setItem(
        "quickTypePracticeSessions",
        practiceSessionCount
    );

    savePracticeResult({
        mode:currentPracticeMode,
        wpm:Math.round(wpm),
        accuracy:Math.round(accuracy),
        correct,
        errors,
        date:new Date().toLocaleString()
    });

    document.getElementById(
        "practiceProgress"
    ).style.width = "100%";

    showToast(
        `Practice complete! ${Math.round(wpm)} WPM`
    );

    setTimeout(
        resetPractice,
        900
    );

}


function renderPracticeProgress(){

    const typed =
        practiceInput.value;

    const spans =
        document
            .getElementById(
                "practiceTarget"
            )
            .querySelectorAll("span");

    spans.forEach(
        (span,index)=>{

            span.className = "";

            if(index < typed.length){

                if(
                    typed[index] ===
                    currentPracticeTarget[index]
                ){

                    span.classList.add("correct");

                }else{

                    span.classList.add("wrong");

                }

            }

            if(
                index === typed.length &&
                index < spans.length
            ){

                span.classList.add("current");

            }

        }
    );

}


/* =========================================================
   PRACTICE KEYBOARD
========================================================= */

function normalizeKey(key){

    if(key === " "){
        return " ";
    }

    return key.toLowerCase();

}


function clearKeyboardHighlights(){

    document
        .querySelectorAll(".key")
        .forEach(key=>{

            key.classList.remove(
                "active",
                "correct",
                "wrong"
            );

        });

}


function updatePracticeKeyboard(){

    clearKeyboardHighlights();

    const typed =
        practiceInput.value;

    const nextIndex =
        typed.length;

    const nextChar =
        currentPracticeTarget[
            nextIndex
        ];

    if(nextChar !== undefined){

        highlightKey(
            normalizeKey(nextChar),
            "active"
        );

    }

}


function highlightKey(keyName,className){

    const keys =
        document.querySelectorAll(
            `.key[data-key="${CSS.escape(keyName)}"]`
        );

    keys.forEach(
        key =>
            key.classList.add(className)
    );

}


function trackPracticeKeys(typed){

    const index =
        typed.length - 1;

    if(index < 0){
        return;
    }

    const actual =
        typed[index];

    const expected =
        currentPracticeTarget[index];

    if(
        actual === undefined ||
        expected === undefined
    ){
        return;
    }

    const actualKey =
        normalizeKey(actual);

    highlightKey(
        actualKey,
        actual === expected
            ? "correct"
            : "wrong"
    );

}


function focusPractice(){

    practiceInput.focus();

}


function togglePracticeSound(){

    practiceSound =
        !practiceSound;

    document.getElementById(
        "practiceSoundBtn"
    ).textContent =
        practiceSound
            ? "🔊 Sound"
            : "🔇 Muted";

}


function playPracticeError(){

    if(!practiceSound){
        return;
    }

    try{

        const context =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        oscillator.frequency.value = 130;

        gain.gain.value = .035;

        oscillator.connect(gain);

        gain.connect(context.destination);

        oscillator.start();

        oscillator.stop(
            context.currentTime + .05
        );

    }catch(e){}

}


/* =========================================================
   PRACTICE HISTORY
========================================================= */

function getPracticeHistory(){

    return JSON.parse(
        localStorage.getItem(
            "quickTypePracticeHistory"
        )
    ) || [];

}


function savePracticeResult(result){

    const history =
        getPracticeHistory();

    history.unshift(result);

    localStorage.setItem(
        "quickTypePracticeHistory",
        JSON.stringify(
            history.slice(0,50)
        )
    );

}


/* =========================================================
   PROBLEM KEYS
========================================================= */

let keyStats =
    JSON.parse(
        localStorage.getItem(
            "quickTypeKeys"
        )
    ) || {};


function trackPracticeKeyStats(){

    /* Stats are calculated from completed
       characters only, not repeatedly per timer tick. */

}


function renderProblemKeys(){

    const container =
        document.getElementById(
            "problemKeys"
        );

    if(!container){
        return;
    }

    const keys =
        Object.entries(keyStats)
            .map(
                ([key,data])=>{

                    const total =
                        data.correct +
                        data.errors;

                    const rate =
                        total > 0
                            ? data.errors / total
                            : 0;

                    return {
                        key,
                        rate,
                        total
                    };

                }
            )
            .filter(
                item => item.total >= 2
            )
            .sort(
                (a,b)=>
                    b.rate - a.rate
            )
            .slice(0,10);

    container.innerHTML = "";

    if(!keys.length){

        container.innerHTML =
            `<p style="color:var(--muted)">
                Complete a few practice sessions to
                discover your problem keys.
            </p>`;

        return;

    }

    keys.forEach(item=>{

        const div =
            document.createElement("div");

        div.className = "problem-key";

        div.textContent =
            `${item.key.toUpperCase()}
             ${Math.round(item.rate * 100)}%`;

        container.appendChild(div);

    });

}


/* Record only newly typed character */

let previousTrackedText = "";

function trackPracticeKeys(typed){

    if(
        typed.length <=
        previousTrackedText.length
    ){

        previousTrackedText = typed;

        return;

    }

    const index =
        typed.length - 1;

    const actual =
        typed[index];

    const expected =
        currentPracticeTarget[index];

    if(
        actual === undefined ||
        expected === undefined
    ){

        previousTrackedText = typed;

        return;

    }

    const key =
        actual.toLowerCase();

    if(key === " "){

        previousTrackedText = typed;

        return;

    }

    if(!keyStats[key]){

        keyStats[key] = {
            correct:0,
            errors:0
        };

    }

    if(actual === expected){

        keyStats[key].correct++;

    }else{

        keyStats[key].errors++;

    }

    localStorage.setItem(
        "quickTypeKeys",
        JSON.stringify(keyStats)
    );

    previousTrackedText = typed;

    renderProblemKeys();

}


/* =========================================================
   HISTORY
========================================================= */

function getHistory(){

    return JSON.parse(
        localStorage.getItem(
            "quickTypeHistory"
        )
    ) || [];

}


function saveResult(result){

    const history =
        getHistory();

    history.unshift(result);

    localStorage.setItem(
        "quickTypeHistory",
        JSON.stringify(
            history.slice(0,30)
        )
    );

}


function renderProgress(){

    const history =
        getHistory();

    const bestWpm =
        history.length
            ? Math.max(
                ...history.map(
                    item => item.wpm
                )
            )
            : 0;

    const bestAccuracy =
        history.length
            ? Math.max(
                ...history.map(
                    item => item.accuracy
                )
            )
            : 0;

    document.getElementById(
        "progressBestWpm"
    ).textContent =
        bestWpm;

    document.getElementById(
        "progressBestAccuracy"
    ).textContent =
        bestAccuracy + "%";

    document.getElementById(
        "progressTests"
    ).textContent =
        history.length;

    document.getElementById(
        "progressPractice"
    ).textContent =
        practiceSessionCount;

    const container =
        document.getElementById(
            "historyList"
        );

    container.innerHTML = "";

    if(!history.length){

        container.innerHTML =
            `<div style="
                padding:30px;
                text-align:center;
                color:var(--muted)
            ">
                No typing tests completed yet.
            </div>`;

        return;

    }

    history.forEach(item=>{

        const div =
            document.createElement("div");

        div.className =
            "card history-item";

        div.innerHTML = `

            <div>

                <strong>
                    ${item.duration / 60}
                    Minute Test
                </strong>

                <small>
                    ${item.date}
                </small>

            </div>

            <strong>
                ${item.wpm} WPM
            </strong>

            <strong>
                ${item.accuracy}%
            </strong>

            <strong>
                ${item.errors} errors
            </strong>

        `;

        container.appendChild(div);

    });

}


/* =========================================================
   HOME STATS
========================================================= */

function updateHomeStats(){

    const history =
        getHistory();

    if(!history.length){
        return;
    }

    const best =
        Math.max(
            ...history.map(
                item => item.wpm
            )
        );

    const bestAccuracy =
        Math.max(
            ...history.map(
                item => item.accuracy
            )
        );

    document.getElementById(
        "homeBest"
    ).textContent =
        "Best WPM: " + best;

    document.getElementById(
        "homeAccuracy"
    ).textContent =
        "Best Accuracy: " +
        bestAccuracy +
        "%";

}


/* =========================================================
   CERTIFICATE
========================================================= */

function showCertificate(){

    if(!lastResult){

        const history =
            getHistory();

        if(history.length){
            lastResult = history[0];
        }

    }

    if(!lastResult){

        showToast(
            "Complete a test first."
        );

        return;

    }

    document.getElementById(
        "certificateScore"
    ).textContent =
        lastResult.wpm +
        " WPM";

    document.getElementById(
        "certificateAccuracy"
    ).textContent =
        lastResult.accuracy +
        "% Accuracy";

    document.getElementById(
        "certificateDate"
    ).textContent =
        lastResult.date;

    showPage("certificate");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message){

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            ()=>{
                toast.classList.remove("show");
            },
            2300
        );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event=>{

        if(
            event.ctrlKey &&
            event.key === "Enter"
        ){

            if(
                document
                    .getElementById("typingTest")
                    .classList
                    .contains("active")
            ){

                focusTyping();

            }

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.getElementById(
    "numpadPanel"
).style.display = "none";

renderTutorial();

selectPractice("all");

updateHomeStats();

renderProgress();

newTest();

/* The first page is shown from the DOMContentLoaded handler at the
   bottom of this file, once every later const/let has been created. */


/* =========================================================
   RESET TRACKED PRACTICE STRING WHEN NEW PATTERN STARTS
========================================================= */

const originalResetPractice =
    resetPractice;


/*
   Small wrapper so key statistics begin tracking
   correctly after every new exercise.
*/

function resetPractice(){

    practiceSessionRunning = false;

    practiceStartTime = null;

    practiceLastLength = 0;

    previousTrackedText = "";

    currentPracticeTarget =
        getPracticePattern();

    practiceInput.value = "";

    renderPracticeTarget();

    document.getElementById(
        "practiceWpm"
    ).textContent = "0";

    document.getElementById(
        "practiceAccuracy"
    ).textContent = "100%";

    document.getElementById(
        "practiceCorrect"
    ).textContent = "0";

    document.getElementById(
        "practiceErrors"
    ).textContent = "0";

    document.getElementById(
        "practiceProgress"
    ).style.width = "0%";

    clearKeyboardHighlights();

}


/* =========================================================
   KEYBOARD PHYSICAL KEY FEEDBACK
========================================================= */

document.addEventListener(
    "keydown",
    event=>{

        const key =
            event.key.toLowerCase();

        let lookup = key;

        if(key === " "){
            lookup = " ";
        }

        if(
            key === "shift" ||
            key === "control" ||
            key === "alt" ||
            key === "enter" ||
            key === "tab"
        ){

            lookup = key;

        }

        const keys =
            document.querySelectorAll(
                `.key[data-key="${CSS.escape(lookup)}"]`
            );

        keys.forEach(
            element =>
                element.classList.add("active")
        );

    }
);


document.addEventListener(
    "keyup",
    event=>{

        const key =
            event.key.toLowerCase();

        document
            .querySelectorAll(
                `.key[data-key="${CSS.escape(key)}"]`
            )
            .forEach(
                element =>
                    element.classList.remove("active")
            );

    }
);


/* ============================================================
   NEXT SECTION
============================================================ */

(function(){

/* ---------------------------------------------------------
   THEME SWATCHES
--------------------------------------------------------- */

const THEMES = {
    indigo:{ primary:"#6366f1", primary2:"#8b5cf6" },
    cyan:  { primary:"#06b6d4", primary2:"#22d3ee" },
    pink:  { primary:"#ec4899", primary2:"#f472b6" },
    green: { primary:"#22c55e", primary2:"#4ade80" },
    amber: { primary:"#f59e0b", primary2:"#fbbf24" }
};

function applyTheme(name){

    const theme = THEMES[name] || THEMES.indigo;

    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--primary2", theme.primary2);

    document.querySelectorAll(".swatch").forEach(button=>{
        button.classList.toggle(
            "active",
            button.dataset.theme === name
        );
    });

    localStorage.setItem("quickTypeTheme", name);
}

document.querySelectorAll(".swatch").forEach(button=>{
    button.addEventListener("click", ()=>{
        applyTheme(button.dataset.theme);
        showToast("Theme switched to " + button.dataset.theme);
    });
});

applyTheme(localStorage.getItem("quickTypeTheme") || "indigo");


/* ---------------------------------------------------------
   DAILY STREAK
--------------------------------------------------------- */

function loadStreak(){
    return JSON.parse(localStorage.getItem("quickTypeStreak")) ||
        { current:0, longest:0, lastDate:null };
}

function saveStreak(streak){
    localStorage.setItem("quickTypeStreak", JSON.stringify(streak));
}

function todayKey(){
    return new Date().toDateString();
}

function bumpStreak(){

    const streak = loadStreak();
    const today = todayKey();

    if(streak.lastDate === today){
        return streak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if(streak.lastDate === yesterday.toDateString()){
        streak.current += 1;
    }else{
        streak.current = 1;
    }

    streak.longest = Math.max(streak.longest, streak.current);
    streak.lastDate = today;

    saveStreak(streak);
    renderStreak();

    return streak;
}

function renderStreak(){

    const streak = loadStreak();

    const countEl = document.getElementById("streakCount");
    if(countEl){
        countEl.textContent = streak.current;
    }

    const achStreak = document.getElementById("achStreak");
    if(achStreak){
        achStreak.textContent = streak.current + " days";
    }

    const achLongest = document.getElementById("achLongestStreak");
    if(achLongest){
        achLongest.textContent = streak.longest + " days";
    }
}

renderStreak();


/* ---------------------------------------------------------
   CONFETTI
--------------------------------------------------------- */

const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
let confettiPieces = [];
let confettiRunning = false;

function resizeConfettiCanvas(){
    if(!confettiCanvas){ return; }
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeConfettiCanvas);
resizeConfettiCanvas();

function burstConfetti(){

    if(!confettiCtx){ return; }

    const colors = ["#6366f1","#8b5cf6","#06b6d4","#ec4899","#f59e0b","#22c55e"];

    confettiPieces = [];

    for(let i = 0; i < 140; i++){

        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -20 - Math.random() * confettiCanvas.height * 0.5,
            size: 6 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: 2 + Math.random() * 3,
            speedX: -1.5 + Math.random() * 3,
            rotation: Math.random() * 360,
            spin: -6 + Math.random() * 12
        });

    }

    if(!confettiRunning){
        confettiRunning = true;
        requestAnimationFrame(animateConfetti);
    }
}

function animateConfetti(){

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let stillFalling = false;

    confettiPieces.forEach(piece=>{

        piece.y += piece.speedY;
        piece.x += piece.speedX;
        piece.rotation += piece.spin;

        if(piece.y < confettiCanvas.height + 20){
            stillFalling = true;
        }

        confettiCtx.save();
        confettiCtx.translate(piece.x, piece.y);
        confettiCtx.rotate((piece.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = piece.color;
        confettiCtx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
        confettiCtx.restore();

    });

    if(stillFalling){
        requestAnimationFrame(animateConfetti);
    }else{
        confettiRunning = false;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }

}


/* ---------------------------------------------------------
   ACHIEVEMENT POPUP TOAST
--------------------------------------------------------- */

let achievementQueue = [];
let achievementShowing = false;

function queueAchievementPopup(badge){

    achievementQueue.push(badge);

    if(!achievementShowing){
        showNextAchievementPopup();
    }

}

function showNextAchievementPopup(){

    const badge = achievementQueue.shift();

    if(!badge){
        achievementShowing = false;
        return;
    }

    achievementShowing = true;

    const popup = document.getElementById("achievementPopup");
    document.getElementById("achievementPopupIcon").textContent = badge.icon;
    document.getElementById("achievementPopupName").textContent = badge.name;

    popup.classList.add("show");
    burstConfetti();

    setTimeout(()=>{
        popup.classList.remove("show");
        setTimeout(showNextAchievementPopup, 500);
    }, 3200);

}


/* ---------------------------------------------------------
   BADGES
--------------------------------------------------------- */

const BADGES = [
    {
        id:"first-test",
        icon:"🎯",
        name:"First Steps",
        desc:"Complete your first typing test.",
        check: data => data.history.length >= 1
    },
    {
        id:"ten-tests",
        icon:"📚",
        name:"Dedicated Typist",
        desc:"Complete 10 typing tests.",
        check: data => data.history.length >= 10
    },
    {
        id:"speed-40",
        icon:"⚡",
        name:"Speed Runner",
        desc:"Reach 40 WPM in a test.",
        check: data => data.history.some(item => item.wpm >= 40)
    },
    {
        id:"speed-60",
        icon:"🚀",
        name:"Velocity Master",
        desc:"Reach 60 WPM in a test.",
        check: data => data.history.some(item => item.wpm >= 60)
    },
    {
        id:"speed-100",
        icon:"🛸",
        name:"Warp Speed",
        desc:"Reach 100 WPM in a test.",
        check: data => data.history.some(item => item.wpm >= 100)
    },
    {
        id:"perfect-accuracy",
        icon:"💎",
        name:"Flawless",
        desc:"Finish a test with 100% accuracy.",
        check: data => data.history.some(item => item.accuracy >= 100)
    },
    {
        id:"practice-fan",
        icon:"🏋️",
        name:"Practice Makes Perfect",
        desc:"Complete 15 practice sessions.",
        check: data => data.practiceCount >= 15
    },
    {
        id:"streak-3",
        icon:"🔥",
        name:"On a Roll",
        desc:"Keep a 3-day practice streak.",
        check: data => data.streak.longest >= 3
    },
    {
        id:"streak-7",
        icon:"🌟",
        name:"Week Warrior",
        desc:"Keep a 7-day practice streak.",
        check: data => data.streak.longest >= 7
    }
];

function getUnlockedBadgeIds(){
    return JSON.parse(localStorage.getItem("quickTypeBadges")) || [];
}

function saveUnlockedBadgeIds(ids){
    localStorage.setItem("quickTypeBadges", JSON.stringify(ids));
}

function gatherBadgeData(){

    return {
        history: JSON.parse(localStorage.getItem("quickTypeHistory")) || [],
        practiceCount: (typeof practiceSessionCount !== "undefined") ? practiceSessionCount : 0,
        streak: loadStreak()
    };

}

function checkBadges(){

    const data = gatherBadgeData();
    const unlocked = getUnlockedBadgeIds();
    let changed = false;

    BADGES.forEach(badge=>{

        if(unlocked.includes(badge.id)){
            return;
        }

        if(badge.check(data)){
            unlocked.push(badge.id);
            changed = true;
            queueAchievementPopup(badge);
        }

    });

    if(changed){
        saveUnlockedBadgeIds(unlocked);
    }

    renderBadgeGrid(unlocked);

}

function renderBadgeGrid(unlocked){

    unlocked = unlocked || getUnlockedBadgeIds();

    const grid = document.getElementById("badgeGrid");
    if(!grid){ return; }

    grid.innerHTML = "";

    BADGES.forEach(badge=>{

        const isUnlocked = unlocked.includes(badge.id);

        const tile = document.createElement("div");
        tile.className = "badge-tile" + (isUnlocked ? " unlocked" : "");

        tile.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-desc">${isUnlocked ? badge.desc : "Locked — " + badge.desc}</div>
        `;

        grid.appendChild(tile);

    });

    const unlockedEl = document.getElementById("achUnlocked");
    const totalEl = document.getElementById("achTotal");

    if(unlockedEl){ unlockedEl.textContent = unlocked.length; }
    if(totalEl){ totalEl.textContent = BADGES.length; }

}

renderBadgeGrid();


/* ---------------------------------------------------------
   HOOK INTO EXISTING QUICKTYPE FUNCTIONS
--------------------------------------------------------- */

const originalFinishTest = window.finishTest;

window.finishTest = function(){

    originalFinishTest.apply(this, arguments);

    bumpStreak();
    checkBadges();

    const wpmText = document.getElementById("finalWpm");
    const accuracyText = document.getElementById("finalAccuracy");

    const wpm = wpmText ? parseInt(wpmText.textContent, 10) || 0 : 0;
    const accuracy = accuracyText ? parseInt(accuracyText.textContent, 10) || 0 : 0;

    if(wpm >= 60 || accuracy >= 100){
        burstConfetti();
        showToast("🎉 Great run! " + wpm + " WPM at " + accuracy + "% accuracy.");
    }

};

if(typeof finishPractice === "function"){

    const originalFinishPractice = window.finishPractice;

    window.finishPractice = function(){

        originalFinishPractice.apply(this, arguments);

        bumpStreak();
        checkBadges();

    };

}

const originalShowPage = window.showPage;

window.showPage = function(pageId){

    originalShowPage.apply(this, arguments);

    try{

        /* Give every page its own atmosphere via a body class. */
        document.body.className = document.body.className
            .split(" ")
            .filter(cls => !cls.startsWith("page-"))
            .join(" ");

        document.body.classList.add("page-" + pageId);

        if(pageId === "achievements"){
            checkBadges();
        }

        if(pageId === "map"){
            setTimeout(refreshMapSize, 250);
        }

    }catch(err){
        console.error("QuickType navigation extras failed:", err);
    }

};


/* Apply the atmosphere for whichever page is active on load. */
const initialActivePage = document.querySelector(".page.active");

if(initialActivePage && initialActivePage.id){
    document.body.classList.add("page-" + initialActivePage.id);
}


/* Run an initial pass so previously earned milestones populate the board. */
checkBadges();

})();


/* ============================================================
   NEXT SECTION
============================================================ */

/* ---------------------------------------------------------
   FEEDBACK FORM
--------------------------------------------------------- */

/* ---------------------------------------------------------
   SHARED VALIDATION HELPERS
--------------------------------------------------------- */

function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFieldError(inputId, errorId, message){

    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);

    if(input){
        input.classList.toggle("input-error", !!message);
    }

    if(errorEl){
        errorEl.textContent = message || "";
    }

    return !message;

}


/* ---------------------------------------------------------
   FEEDBACK FORM
--------------------------------------------------------- */

function submitFeedback(event){

    event.preventDefault();

    const name = document.getElementById("feedbackName").value.trim();
    const email = document.getElementById("feedbackEmail").value.trim();
    const text = document.getElementById("feedbackMessageInput").value.trim();

    let valid = true;

    valid = setFieldError(
        "feedbackName", "feedbackNameError",
        name.length === 0
            ? "Please enter your name."
            : name.length < 2
                ? "Name must be at least 2 characters."
                : ""
    ) && valid;

    valid = setFieldError(
        "feedbackEmail", "feedbackEmailError",
        email.length === 0
            ? "Please enter your email."
            : !isValidEmail(email)
                ? "Enter a valid email address."
                : ""
    ) && valid;

    valid = setFieldError(
        "feedbackMessageInput", "feedbackMessageInputError",
        text.length === 0
            ? "Please share some feedback before submitting."
            : text.length < 10
                ? "Please write at least 10 characters."
                : ""
    ) && valid;

    const message = document.getElementById("feedbackMessage");

    if(!valid){
        message.className = "form-message error";
        message.textContent = "Please fix the highlighted fields.";
        return;
    }

    message.className = "form-message success";
    message.textContent = "✓ Thank you! Your feedback has been submitted.";

    showToast("Feedback submitted — thank you!");

    event.target.reset();

    setFieldError("feedbackName", "feedbackNameError", "");
    setFieldError("feedbackEmail", "feedbackEmailError", "");
    setFieldError("feedbackMessageInput", "feedbackMessageInputError", "");

}


/* ---------------------------------------------------------
   LOGIN FORM
--------------------------------------------------------- */

document
    .getElementById("loginForm")
    .addEventListener("submit", function(event){

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        let valid = true;

        valid = setFieldError(
            "loginEmail", "loginEmailError",
            email.length === 0
                ? "Please enter your email."
                : !isValidEmail(email)
                    ? "Enter a valid email address."
                    : ""
        ) && valid;

        valid = setFieldError(
            "loginPassword", "loginPasswordError",
            password.length === 0
                ? "Please enter your password."
                : password.length < 4
                    ? "Password must be at least 4 characters."
                    : ""
        ) && valid;

        if(!valid){
            message.className = "form-message error";
            message.textContent = "Please fix the highlighted fields.";
            return;
        }

        if(email === "admin@gmail.com" && password === "12345"){

            message.className = "form-message success";
            message.textContent = "✓ Welcome back! Login successful.";

            localStorage.setItem("quickTypeLoggedIn", "true");
            localStorage.setItem("quickTypeUser", email);

            showToast("Logged in as " + email);

            setTimeout(function(){
                showPage("home");
            }, 800);

        }else{

            message.className = "form-message error";
            message.textContent = "✕ Email or password is incorrect.";

        }

    });


/* ---------------------------------------------------------
   AUTH MODE SWITCH (Login / Create Account)
--------------------------------------------------------- */

function showAuthMode(mode){

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const tabLogin = document.getElementById("authTabLogin");
    const tabSignup = document.getElementById("authTabSignup");
    const subtitle = document.getElementById("authSubtitle");
    const switchNote = document.getElementById("authSwitch");
    const demoNote = document.getElementById("demoNote");
    const message = document.getElementById("loginMessage");

    const isSignup = mode === "signup";

    loginForm.style.display = isSignup ? "none" : "";
    signupForm.style.display = isSignup ? "" : "none";

    tabLogin.classList.toggle("active", !isSignup);
    tabSignup.classList.toggle("active", isSignup);

    subtitle.textContent = isSignup
        ? "Create your QuickType account"
        : "Access your QuickType workspace";

    demoNote.style.display = isSignup ? "none" : "";

    switchNote.innerHTML = isSignup
        ? `Already have an account? <button type="button" class="auth-switch-link" onclick="showAuthMode('login')">Log in</button>`
        : `Don't have an account? <button type="button" class="auth-switch-link" onclick="showAuthMode('signup')">Create one</button>`;

    message.className = "form-message";
    message.textContent = "";

}


/* ---------------------------------------------------------
   CREATE ACCOUNT FORM
--------------------------------------------------------- */

document
    .getElementById("signupForm")
    .addEventListener("submit", function(event){

        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;
        const message = document.getElementById("loginMessage");

        let valid = true;

        valid = setFieldError(
            "signupName", "signupNameError",
            name.length === 0
                ? "Please enter your name."
                : ""
        ) && valid;

        valid = setFieldError(
            "signupEmail", "signupEmailError",
            email.length === 0
                ? "Please enter your email."
                : !isValidEmail(email)
                    ? "Enter a valid email address."
                    : ""
        ) && valid;

        valid = setFieldError(
            "signupPassword", "signupPasswordError",
            password.length === 0
                ? "Please create a password."
                : password.length < 4
                    ? "Password must be at least 4 characters."
                    : ""
        ) && valid;

        valid = setFieldError(
            "signupConfirmPassword", "signupConfirmPasswordError",
            confirmPassword.length === 0
                ? "Please confirm your password."
                : confirmPassword !== password
                    ? "Passwords do not match."
                    : ""
        ) && valid;

        if(!valid){
            message.className = "form-message error";
            message.textContent = "Please fix the highlighted fields.";
            return;
        }

        message.className = "form-message success";
        message.textContent = "✓ Account created! You can now log in.";

        localStorage.setItem("quickTypeUser", email);

        showToast("Account created — welcome, " + name + "!");

        event.target.reset();

        setTimeout(function(){
            showAuthMode("login");
            document.getElementById("loginEmail").value = email;
        }, 900);

    });


/* ============================================================
   NEXT SECTION
============================================================ */

/* ---------------------------------------------------------
   INTERACTIVE MAP

   Leaflet is loaded on demand — the first time the Map page is
   opened — so it costs nothing on every other page. If one CDN
   is blocked (ad-blocker, Brave Shields, offline) the next one
   is tried automatically, and if the default tiles are blocked
   a backup tile provider takes over.
--------------------------------------------------------- */

let quickTypeMap = null;
let indiaMarker = null;
let ahmedabadMarker = null;
let userMarker = null;
let mapTileLayer = null;
let mapTileProvider = 0;
let leafletPromise = null;

const INDIA = [22.9734, 78.6569];
const AHMEDABAD = [23.0225, 72.5714];

const LEAFLET_SOURCES = [
    {
        js:"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
        css:"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        images:"https://unpkg.com/leaflet@1.9.4/dist/images/"
    },
    {
        js:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js",
        css:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css",
        images:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/"
    },
    {
        js:"https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js",
        css:"https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css",
        images:"https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/"
    }
];

const MAP_TILE_PROVIDERS = [
    {
        url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        options:{
            maxZoom:19,
            attribution:"&copy; OpenStreetMap contributors"
        }
    },
    {
        /* Backup — also works when the page is opened straight from
           disk (file://), which OpenStreetMap's servers reject. */
        url:"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        options:{
            maxZoom:19,
            subdomains:"abcd",
            attribution:"&copy; OpenStreetMap contributors &copy; CARTO"
        }
    }
];

function loadLeaflet(){

    if(window.L && typeof L.map === "function"){
        return Promise.resolve();
    }

    if(leafletPromise){
        return leafletPromise;
    }

    leafletPromise = new Promise(function(resolve, reject){

        let attempt = 0;

        function tryNextSource(){

            if(attempt >= LEAFLET_SOURCES.length){
                leafletPromise = null;   /* let "Retry" try again */
                reject(new Error("Leaflet could not be downloaded from any CDN."));
                return;
            }

            const source = LEAFLET_SOURCES[attempt++];

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = source.css;
            document.head.appendChild(link);

            const script = document.createElement("script");
            script.src = source.js;
            script.async = true;

            script.onload = function(){

                if(window.L && typeof L.map === "function"){
                    /* Set the marker-icon folder explicitly instead of letting
                       Leaflet guess it from CSS that may not have loaded yet. */
                    L.Icon.Default.imagePath = source.images;
                    resolve();
                    return;
                }

                script.remove();
                link.remove();
                tryNextSource();

            };

            script.onerror = function(){
                script.remove();
                link.remove();
                tryNextSource();
            };

            document.head.appendChild(script);

        }

        tryNextSource();

    });

    return leafletPromise;

}

function showMapStatus(icon, title, text, showRetry){

    const container = document.getElementById("quickTypeMap");

    if(!container){
        return;
    }

    container.innerHTML =
        '<div class="map-fallback">' +
            '<div class="map-fallback-icon">' + icon + '</div>' +
            '<h3>' + title + '</h3>' +
            '<p>' + text + '</p>' +
            (showRetry
                ? '<button type="button" class="btn btn-primary" onclick="attemptMapInit()">↻ Retry</button>'
                : '') +
        '</div>';

}

function showMapFallback(err){

    const libraryMissing = !(window.L && typeof L.map === "function");

    if(libraryMissing){

        showMapStatus(
            "🗺️",
            "Map couldn\u2019t load",
            "The map library couldn\u2019t be downloaded. Check your internet " +
            "connection, or allow this site in your ad-blocker / browser " +
            "shield, then tap Retry.",
            true
        );

    }else{

        showMapStatus(
            "🗺️",
            "Map couldn\u2019t start",
            "Something went wrong while starting the map" +
            (err && err.message ? " (" + err.message + ")" : "") +
            ". Tap Retry.",
            true
        );

    }

    showMapInfo(
        "Map unavailable",
        "Fix the issue above, then tap Retry."
    );

}

function addMapTileLayer(){

    const provider = MAP_TILE_PROVIDERS[mapTileProvider];

    if(mapTileLayer){
        quickTypeMap.removeLayer(mapTileLayer);
    }

    let loaded = 0;
    let failed = 0;

    const layer = L.tileLayer(provider.url, provider.options);

    layer.on("tileload", function(){
        loaded++;
    });

    layer.on("tileerror", function(){

        failed++;

        /* Nothing has loaded and several tiles failed: this provider is
           blocked, so switch to the backup exactly once. */
        if(
            layer === mapTileLayer &&
            loaded === 0 &&
            failed >= 3 &&
            mapTileProvider < MAP_TILE_PROVIDERS.length - 1
        ){
            mapTileProvider++;
            addMapTileLayer();
            showMapInfo(
                "Using backup map tiles",
                "The default tiles were blocked, so a backup provider is being used."
            );
        }

    });

    layer.addTo(quickTypeMap);

    mapTileLayer = layer;

}

function initQuickTypeMap(){

    if(quickTypeMap){
        return;
    }

    const mapElement = document.getElementById("quickTypeMap");

    if(!mapElement){
        return;
    }

    /* Remove the "loading" / error message before Leaflet takes over. */
    mapElement.innerHTML = "";

    quickTypeMap = L.map(mapElement, {
        zoomControl:true,
        scrollWheelZoom:true
    }).setView(INDIA, 5);

    addMapTileLayer();

    indiaMarker = L.marker(INDIA)
        .addTo(quickTypeMap)
        .bindPopup("<b>India</b><br>QuickType Map");

    ahmedabadMarker = L.marker(AHMEDABAD)
        .addTo(quickTypeMap)
        .bindPopup("<b>Ahmedabad</b><br>Gujarat, India");

}

/* Runs `action` once the map exists (loading Leaflet first if needed). */
function withMap(action){

    if(!quickTypeMap){
        showMapStatus("⏳", "Loading map…", "Fetching the map library.", false);
    }

    return loadLeaflet()
        .then(function(){

            initQuickTypeMap();

            if(quickTypeMap){
                quickTypeMap.invalidateSize();

                if(typeof action === "function"){
                    try{
                        action();
                    }catch(actionErr){
                        /* A failed button action must never wipe the map. */
                        console.error("QuickType map action failed:", actionErr);
                    }
                }
            }

        })
        .catch(function(err){
            console.error("QuickType map failed:", err);
            showMapFallback(err);
        });

}

function attemptMapInit(){
    return withMap();
}

function refreshMapSize(){
    if(quickTypeMap){
        quickTypeMap.invalidateSize();
    }
}

function showMapInfo(title, text){

    const info = document.getElementById("mapInfo");

    if(info){
        info.innerHTML = "<strong>" + title + "</strong><br>" + text;
    }

}

function goToIndia(){

    withMap(function(){
        quickTypeMap.setView(INDIA, 5);
        indiaMarker.openPopup();
        showMapInfo("Selected: India", "Showing the full country view.");
    });

}

function goToAhmedabad(){

    withMap(function(){
        quickTypeMap.setView(AHMEDABAD, 12);
        ahmedabadMarker.openPopup();
        showMapInfo("Selected: Ahmedabad", "Gujarat, India.");
    });

}

function findMyLocation(){

    withMap(function(){

        if(!navigator.geolocation){

            showMapInfo(
                "Location unavailable",
                "Your browser does not support geolocation."
            );

            return;

        }

        showMapInfo(
            "Finding location...",
            "Please allow location access in your browser."
        );

        navigator.geolocation.getCurrentPosition(

            function(position){

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                if(userMarker){
                    userMarker.setLatLng([lat, lng]);
                }else{
                    userMarker = L.marker([lat, lng]).addTo(quickTypeMap);
                }

                userMarker.bindPopup("<b>Your Location</b>").openPopup();

                quickTypeMap.setView([lat, lng], 14);

                showMapInfo(
                    "Selected: My Location",
                    "Latitude: " + lat.toFixed(5) +
                    "<br>Longitude: " + lng.toFixed(5)
                );

            },

            function(error){

                let message = "Unable to access your location.";

                if(error.code === 1){
                    message =
                        "Location permission was denied. Location only works on " +
                        "https:// or localhost — not when the file is opened directly.";
                }else if(error.code === 3){
                    message = "Finding your location timed out. Try again.";
                }

                showMapInfo("Location unavailable", message);

            },

            {
                /* Coarse location is fast and works on laptops without GPS;
                   high accuracy often just times out there. */
                enableHighAccuracy:false,
                timeout:15000,
                maximumAge:60000
            }

        );

    });

}

function resetMap(){

    withMap(function(){

        quickTypeMap.setView(INDIA, 5);

        if(userMarker){
            quickTypeMap.removeLayer(userMarker);
            userMarker = null;
        }

        indiaMarker.closePopup();
        ahmedabadMarker.closePopup();

        showMapInfo("Selected: India", "Map has been reset.");

    });

}


/* ---------------------------------------------------------
   SCROLL-REVEAL
--------------------------------------------------------- */

let revealObserver = null;

function observeReveals(){

    if(!("IntersectionObserver" in window)){

        document
            .querySelectorAll(".reveal")
            .forEach(el => el.classList.add("in-view"));

        return;

    }

    if(!revealObserver){

        revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if(entry.isIntersecting){
                        entry.target.classList.add("in-view");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold:.12 }
        );

    }

    document
        .querySelectorAll(".reveal:not(.in-view)")
        .forEach(el => revealObserver.observe(el));

}


/* ---------------------------------------------------------
   HOME — WEEKLY STATS CHART (real localStorage data)
--------------------------------------------------------- */

function renderHomeStatsChart(){

    const barsEl = document.getElementById("homeChartBars");

    if(!barsEl){
        return;
    }

    const history =
        (typeof getHistory === "function") ? getHistory() : [];

    const recent = history.slice(0, 7).reverse();

    const slots = 7;
    const padded = [];

    for(let i = 0; i < slots; i++){
        padded.push(recent[recent.length - slots + i] || null);
    }

    const maxWpm = Math.max(
        10,
        ...recent.map(h => h.wpm || 0)
    );

    barsEl.innerHTML = "";

    padded.forEach((entry, i) => {

        const col = document.createElement("div");
        col.className = "bar-col";

        const val = document.createElement("div");
        val.className = "bar-val";
        val.textContent = entry ? entry.wpm : "";

        const bar = document.createElement("div");
        const lastFilledIndex =
            padded.map(e => !!e).lastIndexOf(true);
        bar.className =
            "bar" + (entry && i === lastFilledIndex ? " today" : "");
        bar.style.height = "4px";

        const day = document.createElement("div");
        day.className = "bar-day";

        let label = "–";

        if(entry && entry.date){
            const parsed = new Date(entry.date);
            if(!isNaN(parsed)){
                label =
                    parsed
                        .toLocaleDateString(undefined, { weekday:"short" })
                        .slice(0, 1);
            }
        }

        day.textContent = label;

        col.appendChild(val);
        col.appendChild(bar);
        col.appendChild(day);
        barsEl.appendChild(col);

        const targetHeight =
            entry ? Math.max(6, Math.round((entry.wpm / maxWpm) * 100)) : 4;

        setTimeout(() => {
            bar.style.height = targetHeight + "%";
        }, 120 + i * 70);

    });

    const streak =
        (typeof loadStreak === "function")
            ? loadStreak()
            : { current:0, longest:0 };

    const chip = document.getElementById("homeStreakChip");
    if(chip){
        chip.textContent =
            (streak.current || 0) +
            (streak.current === 1 ? " day streak" : " day streak");
    }

    const bubble = document.getElementById("homeStreakBubble");
    if(bubble){
        bubble.textContent =
            (streak.current || 0) > 0 ? "look at you go" : "start today";
    }

}


/* ---------------------------------------------------------
   AI COACH — lightweight, on-device tip generator

   Reads recent local results (WPM, accuracy, streak) and
   picks the most relevant coaching tip. No server or network
   call is made; everything runs from data already stored in
   this browser.
--------------------------------------------------------- */

function buildAiCoachTips(){

    const history =
        (typeof getHistory === "function") ? getHistory() : [];

    const streak =
        (typeof loadStreak === "function")
            ? loadStreak()
            : { current:0, longest:0 };

    if(history.length === 0){
        return [
            "Run a quick test and I'll start spotting patterns in your typing.",
            "No data yet — a single 15-second test is enough for me to get started.",
            "Tip: relax your wrists and keep your eyes on the text, not the keys."
        ];
    }

    const recent = history.slice(0, 5);

    const avgWpm =
        recent.reduce((sum, h) => sum + (h.wpm || 0), 0) / recent.length;

    const avgAcc =
        recent.reduce((sum, h) => sum + (h.accuracy || 0), 0) / recent.length;

    const best = history.reduce(
        (top, h) => (h.wpm > (top ? top.wpm : 0) ? h : top),
        null
    );

    const tips = [];

    if(avgAcc < 90){
        tips.push(
            "Your last few runs sit around " + Math.round(avgAcc) +
            "% accuracy — slow down about 10% and let accuracy catch up. Speed follows accuracy, not the other way round."
        );
    }

    if(avgAcc >= 97 && avgWpm < 45){
        tips.push(
            "Accuracy is excellent (" + Math.round(avgAcc) +
            "%) — you have room to push pace. Try a 15-second sprint just to feel a faster rhythm."
        );
    }

    if(streak.current >= 3){
        tips.push(
            "You're on a " + streak.current +
            "-day streak. One more short test today keeps it alive."
        );
    }

    if(streak.current === 0 && streak.longest > 0){
        tips.push(
            "Your best streak was " + streak.longest +
            " days — start a fresh one today with a single quick test."
        );
    }

    if(best && best.wpm){
        tips.push(
            "Your personal best is " + best.wpm +
            " WPM. Aim to beat it by just 2–3 WPM this run, not all at once."
        );
    }

    tips.push(
        "Average over your last " + recent.length + " runs: " +
        Math.round(avgWpm) + " WPM at " + Math.round(avgAcc) + "% accuracy."
    );

    return tips;

}

function refreshAiCoachTip(){

    const tipEl = document.getElementById("aiCoachTip");

    if(!tipEl){
        return;
    }

    const tips = buildAiCoachTips();

    let next = tips[Math.floor(Math.random() * tips.length)];

    if(tips.length > 1 && next === tipEl.dataset.lastTip){
        next = tips[(tips.indexOf(next) + 1) % tips.length];
    }

    tipEl.textContent = next;
    tipEl.dataset.lastTip = next;

}


/* ---------------------------------------------------------
   TYPING IN MOTION IMAGE SLIDER

   - 12 slides, only the current + next image are ever fetched
   - autoplay pauses on hover / focus / touch, when the tab is
     hidden, when scrolled out of view and off the Home page
   - arrows, dots, keyboard (← →) and swipe all work
   - any photo that fails to load is replaced by generated art,
     so the slider never shows a broken image
--------------------------------------------------------- */

function unsplashPhoto(id){
    return "https://images.unsplash.com/photo-" + id +
           "?auto=format&fit=crop&w=1200&q=75";
}

const typingSliderImages = [
    { src:unsplashPhoto("1587829741301-dc798b83add3"), caption:"Focused typing session" },
    { src:unsplashPhoto("1587440871875-191322ee64b0"), caption:"Mechanical keyboard close-up" },
    { src:unsplashPhoto("1517430816045-df4b7de11d1d"), caption:"Working at a laptop" },
    { src:unsplashPhoto("1519389950473-47ba0277781c"), caption:"Remote workspace setup" },
    { src:unsplashPhoto("1498050108023-c5249f4df085"), caption:"Coding on a keyboard" },
    { src:unsplashPhoto("1461749280684-dccba630e2f6"), caption:"Code on a dark monitor" },
    { src:unsplashPhoto("1555066931-4365d14bab8c"),    caption:"Late-night coding session" },
    { src:unsplashPhoto("1531297484001-80022131f5a1"), caption:"Laptop and desk setup" },
    { src:unsplashPhoto("1496181133206-80ce9b88a853"), caption:"Laptop workspace" },
    { src:unsplashPhoto("1484417894907-623942c8ee29"), caption:"A clean desk to type at" },
    { src:unsplashPhoto("1515879218367-8466d910aaa4"), caption:"Code on a laptop screen" },
    { src:unsplashPhoto("1522071820081-009f0129c71c"), caption:"Team working together" }
];

const SLIDER_DELAY_MS = 5000;

let typingSliderIndex = 0;
let sliderTimer = null;
let sliderPaused = false;
let sliderInView = true;
let sliderReady = false;

const sliderFailed = new Set();
const sliderPreloaded = new Set();


function sliderFallbackArt(index, caption){

    const hue = (index * 47 + 230) % 360;

    let keys = "";

    for(let row = 0; row < 4; row++){
        for(let col = 0; col < 12; col++){
            keys +=
                '<rect x="' + (110 + col * 80 + row * 14) +
                '" y="' + (300 + row * 72) +
                '" width="66" height="58" rx="10" fill="rgba(255,255,255,' +
                (((row + col) % 3 === 0) ? ".28" : ".14") + ')"/>';
        }
    }

    const safeCaption =
        String(caption)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="hsl(' + hue + ',70%,38%)"/>' +
        '<stop offset="1" stop-color="hsl(' + ((hue + 50) % 360) + ',75%,22%)"/>' +
        '</linearGradient></defs>' +
        '<rect width="1200" height="675" fill="url(#g)"/>' +
        keys +
        '<text x="600" y="190" text-anchor="middle" ' +
        'font-family="Arial,Helvetica,sans-serif" font-size="54" ' +
        'font-weight="700" fill="#ffffff">' + safeCaption + '</text></svg>';

    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

}

function preloadSlide(index){

    if(sliderPreloaded.has(index) || sliderFailed.has(index)){
        return;
    }

    sliderPreloaded.add(index);

    const probe = new Image();

    probe.onerror = function(){
        sliderFailed.add(index);
    };

    probe.src = typingSliderImages[index].src;

}

function buildSliderDots(){

    const dots = document.getElementById("typingSliderDots");

    if(!dots || dots.childElementCount){
        return;
    }

    typingSliderImages.forEach(function(slide, i){

        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", "Show image " + (i + 1) + ": " + slide.caption);
        dot.addEventListener("click", function(){
            goToSlide(i);
        });

        dots.appendChild(dot);

    });

}

function updateSliderDots(){

    const dots = document.getElementById("typingSliderDots");

    if(!dots){
        return;
    }

    Array.prototype.forEach.call(dots.children, function(dot, i){
        const active = i === typingSliderIndex;
        dot.classList.toggle("active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
    });

}

function renderTypingSlider(){

    const img = document.getElementById("typingSliderImg");
    const caption = document.getElementById("typingSliderCaption");
    const counter = document.getElementById("typingSliderCounter");
    const box = document.getElementById("typingSlider");

    if(!img || !caption || !counter || !box){
        return;
    }

    const index = typingSliderIndex;
    const current = typingSliderImages[index];

    caption.textContent = current.caption;
    counter.textContent = (index + 1) + " / " + typingSliderImages.length;
    img.alt = current.caption;

    updateSliderDots();

    /* Already showing this slide — nothing to do. */
    if(img.dataset.index === String(index) && img.getAttribute("src")){
        return;
    }

    img.dataset.index = String(index);

    const showFallback = function(){
        sliderFailed.add(index);
        if(typingSliderIndex === index){
            img.src = sliderFallbackArt(index, current.caption);
        }
    };

    box.classList.add("is-loading");

    img.onload = function(){
        box.classList.remove("is-loading");
    };

    img.onerror = function(){

        if(sliderFailed.has(index) && img.src.indexOf("data:") === 0){
            box.classList.remove("is-loading");
            return;
        }

        showFallback();

    };

    img.src = sliderFailed.has(index)
        ? sliderFallbackArt(index, current.caption)
        : current.src;

    /* Fetch only the slide that is most likely needed next. */
    preloadSlide((index + 1) % typingSliderImages.length);

}

function goToSlide(index){

    const total = typingSliderImages.length;

    typingSliderIndex = ((index % total) + total) % total;

    renderTypingSlider();
    startSliderAutoplay();

}

function changeSliderImage(direction){

    goToSlide(typingSliderIndex + direction);

}

function stopSliderAutoplay(){

    clearTimeout(sliderTimer);
    sliderTimer = null;

}

function startSliderAutoplay(){

    stopSliderAutoplay();

    const home = document.getElementById("home");

    if(
        !sliderReady ||
        sliderPaused ||
        !sliderInView ||
        document.hidden ||
        !home ||
        !home.classList.contains("active") ||
        (window.matchMedia &&
         window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ){
        return;
    }

    sliderTimer = setTimeout(function(){
        changeSliderImage(1);
    }, SLIDER_DELAY_MS);

}

function initTypingSlider(){

    const box = document.getElementById("typingSlider");

    if(!box || sliderReady){
        return;
    }

    buildSliderDots();

    /* Pause while the visitor is interacting with the slider. */
    const pause = function(){
        sliderPaused = true;
        stopSliderAutoplay();
    };

    const resume = function(){
        sliderPaused = false;
        startSliderAutoplay();
    };

    box.addEventListener("mouseenter", pause);
    box.addEventListener("mouseleave", resume);
    box.addEventListener("focusin", pause);
    box.addEventListener("focusout", resume);

    /* Keyboard: ← / → while the slider has focus. */
    box.addEventListener("keydown", function(event){

        if(event.key === "ArrowLeft"){
            event.preventDefault();
            changeSliderImage(-1);
        }else if(event.key === "ArrowRight"){
            event.preventDefault();
            changeSliderImage(1);
        }

    });

    /* Touch: swipe left / right. */
    let touchStartX = null;

    box.addEventListener("touchstart", function(event){
        touchStartX = event.touches[0].clientX;
        pause();
    }, { passive:true });

    box.addEventListener("touchend", function(event){

        if(touchStartX !== null){

            const distance = event.changedTouches[0].clientX - touchStartX;

            if(Math.abs(distance) > 40){
                changeSliderImage(distance < 0 ? 1 : -1);
            }

            touchStartX = null;

        }

        resume();

    }, { passive:true });

    /* Stop working when the tab is hidden or the slider is off-screen. */
    document.addEventListener("visibilitychange", function(){

        if(document.hidden){
            stopSliderAutoplay();
        }else{
            startSliderAutoplay();
        }

    });

    if("IntersectionObserver" in window){

        new IntersectionObserver(function(entries){

            sliderInView = entries[0].isIntersecting;

            if(sliderInView){
                startSliderAutoplay();
            }else{
                stopSliderAutoplay();
            }

        }, { threshold:.25 }).observe(box);

    }

    sliderReady = true;

    renderTypingSlider();
    startSliderAutoplay();

}


/* ---------------------------------------------------------
   DAILY WPM GOAL SLIDER
--------------------------------------------------------- */

function loadGoal(){
    const stored = parseInt(localStorage.getItem("quickTypeGoal"), 10);
    return isNaN(stored) ? 40 : stored;
}

function saveGoal(value){
    localStorage.setItem("quickTypeGoal", String(value));
}

function onGoalSliderInput(value){

    value = parseInt(value, 10);

    saveGoal(value);
    renderGoalProgress(value);

}

function renderGoalProgress(goalValue){

    const slider = document.getElementById("goalSlider");
    const valueEl = document.getElementById("goalValue");
    const chip = document.getElementById("goalProgressChip");
    const fill = document.getElementById("goalProgressFill");
    const hint = document.getElementById("goalHint");

    if(!slider){
        return;
    }

    goalValue = goalValue || loadGoal();

    slider.value = goalValue;

    if(valueEl){
        valueEl.textContent = goalValue;
    }

    const history =
        (typeof getHistory === "function") ? getHistory() : [];

    const recent = history.slice(0, 5);

    const avgWpm =
        recent.length
            ? Math.round(
                recent.reduce((sum, h) => sum + (h.wpm || 0), 0) / recent.length
            )
            : 0;

    const pct = Math.max(
        0,
        Math.min(100, Math.round((avgWpm / goalValue) * 100))
    );

    if(chip){
        chip.textContent = pct + "%";
    }

    if(fill){
        fill.style.width = pct + "%";
    }

    if(hint){
        if(recent.length === 0){
            hint.textContent =
                "Set a target and I'll track how close your recent runs get.";
        }else if(pct >= 100){
            hint.textContent =
                "You're averaging " + avgWpm +
                " WPM — already at your goal. Nudge the slider up for a new challenge.";
        }else{
            hint.textContent =
                "You're averaging " + avgWpm + " WPM — " +
                (goalValue - avgWpm) + " WPM to go.";
        }
    }

}


/* ---------------------------------------------------------
   HASH ROUTING — real, bookmarkable "pages"
--------------------------------------------------------- */

window.addEventListener("popstate", function(event){

    const pageId =
        (event.state && event.state.page) ||
        (location.hash ? location.hash.slice(1) : "home");

    const target = document.getElementById(pageId);

    if(target && target.classList.contains("page")){
        showPage(pageId, { skipHistory:true });
    }

});


/* ---------------------------------------------------------
   INITIAL LOAD
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function(){

    function safely(fn){
        try{
            fn();
        }catch(err){
            console.error("QuickType init step failed:", err);
        }
    }

    safely(function(){

        const initialFromHash =
            location.hash ? location.hash.slice(1) : "";

        const initialTarget =
            initialFromHash && document.getElementById(initialFromHash);

        const startPage =
            (initialTarget && initialTarget.classList.contains("page"))
                ? initialFromHash
                : "home";

        showPage(startPage, { skipHistory:true });

    });

    safely(refreshAiCoachTip);
    safely(initTypingSlider);
    safely(observeReveals);

    /* Close the mobile menu with Escape, and when the window is widened. */
    safely(function(){

        document.addEventListener("keydown", function(event){
            if(event.key === "Escape"){
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", function(){
            if(window.innerWidth > 1280){
                closeMobileMenu();
            }
        });

    });

    /* Clear a field's error the moment the user starts fixing it. */
    safely(function(){

        const fieldPairs = [
            ["loginEmail", "loginEmailError"],
            ["loginPassword", "loginPasswordError"],
            ["signupName", "signupNameError"],
            ["signupEmail", "signupEmailError"],
            ["signupPassword", "signupPasswordError"],
            ["signupConfirmPassword", "signupConfirmPasswordError"],
            ["feedbackName", "feedbackNameError"],
            ["feedbackEmail", "feedbackEmailError"],
            ["feedbackMessageInput", "feedbackMessageInputError"]
        ];

        fieldPairs.forEach(function(pair){

            const input = document.getElementById(pair[0]);

            if(!input){
                return;
            }

            input.addEventListener("input", function(){
                setFieldError(pair[0], pair[1], "");
            });

        });

    });

});
