/* QuickType — Advanced Typing Trainer
   All application JavaScript, extracted from index.html. */

/* =========================================================
   TEST PARAGRAPHS
========================================================= */

const paragraphs = [

`Learning new skills takes time, patience and consistent effort. Typing is a useful digital skill because it allows people to communicate ideas quickly and efficiently. Regular practice helps your fingers remember the position of each key. Over time, you can develop better rhythm, fewer mistakes and greater confidence.`,

`Modern technology has transformed education and communication. Students can access books, courses, videos and useful information from almost anywhere. Technology is powerful when it is used responsibly. Good concentration, careful research and regular practice can help students turn digital tools into useful learning resources.`,

`Success is often the result of small improvements made consistently over a long period of time. People sometimes expect immediate results when learning something new, but meaningful progress usually requires patience. Mistakes should be treated as opportunities to learn rather than reasons to give up.`,

`The internet has made it possible for people around the world to communicate and share information almost instantly. Businesses use online services to reach customers, students use digital resources for education and families use communication platforms to stay connected.`,

`A healthy environment is important for every living thing on Earth. Forests provide homes for animals, clean the air and help maintain the balance of nature. Protecting natural environments requires everyday responsibility. Reducing waste, saving water, planting trees and respecting wildlife are simple actions that can contribute to a healthier planet.`

];


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
            "consistent practice builds muscle memory"
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
            "west rest test desk"
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
            "you know how"
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
            "glass flask"
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
            "quote poetry"
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
            "zoom mix move"
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
            "2026 2027 1234"
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
            "12345 67890"
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
            "Build Better Typing Habits"
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
            "!@#$%^&*()"
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
            "Accuracy: 98%+"
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
            "fast fingers fast mind"
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

    const currentPage =
        document.querySelector(".page.active");

    const isRealNavigation =
        !currentPage || currentPage.id !== pageId;

    const doSwap = function(){

        if(typeof stopReadAloud === "function"){
            stopReadAloud();
        }

        document
            .querySelectorAll(".page")
            .forEach(page =>
                page.classList.remove("active")
            );

        const page =
            document.getElementById(pageId);

        if(page){
            page.classList.add("active");
        }

        document
            .querySelectorAll(".nav button")
            .forEach(button =>
                button.classList.remove("active")
            );

        const nav =
            document.getElementById(
                "nav-" + pageId
            );

        if(nav){
            nav.classList.add("active");
        }

        window.scrollTo({
            top:0,
            behavior:"auto"
        });

        /* Treat navigation like real pages: update the URL hash so
           Login / Feedback / any section is bookmarkable and works
           with the browser back button. */
        if(!navOptions.skipHistory && page){
            const hash = "#" + pageId;
            if(location.hash !== hash){
                history.pushState({ page:pageId }, "", hash);
            }
        }

        if(pageId === "progress"){
            renderProgress();
        }

        if(pageId === "practice"){
            renderProblemKeys();
        }

        if(pageId === "home" && typeof renderHomeStatsChart === "function"){
            renderHomeStatsChart();
        }

        if(pageId === "home" && typeof renderGoalProgress === "function"){
            renderGoalProgress(typeof loadGoal === "function" ? loadGoal() : 40);
        }

        if(typeof observeReveals === "function"){
            observeReveals();
        }

    };

    /* Fully cover the screen first, swap the page while hidden,
       THEN reveal — so the previous page is never visible at the
       same time as the next one (a real cut, not a crossfade). */
    if(isRealNavigation && typeof runPageCurtain === "function"){
        runPageCurtain(doSwap);
    }else{
        doSwap();
    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu(){

    const nav =
        document.querySelector(".nav");

    if(nav.style.display === "flex"){

        nav.style.display = "";

    }else{

        nav.style.display = "flex";

        nav.style.position = "absolute";

        nav.style.top = "62px";

        nav.style.left = "0";

        nav.style.right = "0";

        nav.style.padding = "10px";

        nav.style.background = "#070b17";

        nav.style.flexDirection = "column";

    }

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


function newTest(){

    stopReadAloud();

    clearInterval(timerInterval);

    currentParagraph =
        paragraphs[
            Math.floor(
                Math.random() *
                paragraphs.length
            )
        ];

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

        updateTypingDisplay();

        updateStats();

    }
);


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
        return
