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
        text:"Learn the keyboard step by step and build real muscle memory."
    },

    {
        icon:"🤲",
        title:"Home Row",
        text:"Place your left fingers around A S D F and your right fingers around J K L and semicolon."
    },

    {
        icon:"👀",
        title:"Stop Looking Down",
        text:"Try to look at the screen rather than the keyboard. Your fingers will gradually remember the keys."
    },

    {
        icon:"🎯",
        title:"Accuracy First",
        text:"Speed is useful, but accuracy comes first. Slow accurate typing becomes fast typing."
    },

    {
        icon:"⚡",
        title:"Train Every Zone",
        text:"Practice left hand, right hand, number row, symbols, bottom row and numpad separately."
    },

    {
        icon:"🏆",
        title:"You're Ready",
        text:"Choose a practice section or take a timed typing test."
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

showPage("home");


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

        if(pageId === "map" && typeof initQuickTypeMap === "function"){
            setTimeout(function(){
                try{
                    initQuickTypeMap();
                    if(window.quickTypeMap){
                        window.quickTypeMap.invalidateSize();
                    }
                }catch(err){
                    console.error("QuickType map init failed:", err);
                    const info = document.getElementById("mapInfo");
                    if(info){
                        info.innerHTML =
                            "<strong>Map unavailable</strong><br>" +
                            "The map couldn't load — this can happen if your browser " +
                            "(e.g. Brave Shields) is blocking the map's external script.";
                    }
                }
            }, 150);
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

function submitFeedback(event){

    event.preventDefault();

    const message = document.getElementById("feedbackMessage");

    message.className = "form-message success";
    message.textContent = "✓ Thank you! Your feedback has been submitted.";

    showToast("Feedback submitted — thank you!");

    event.target.reset();

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


/* ============================================================
   NEXT SECTION
============================================================ */

/* ---------------------------------------------------------
   INTERACTIVE MAP
--------------------------------------------------------- */

let quickTypeMap = null;
let indiaMarker = null;
let ahmedabadMarker = null;
let userMarker = null;

const INDIA = [22.9734, 78.6569];
const AHMEDABAD = [23.0225, 72.5714];

function initQuickTypeMap(){

    if(quickTypeMap !== null){
        return;
    }

    const mapElement = document.getElementById("quickTypeMap");

    if(!mapElement){
        return;
    }

    quickTypeMap = L.map("quickTypeMap", {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView(INDIA, 5);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(quickTypeMap);

    indiaMarker = L.marker(INDIA)
        .addTo(quickTypeMap)
        .bindPopup("<b>India</b><br>QuickType Map");

    ahmedabadMarker = L.marker(AHMEDABAD)
        .addTo(quickTypeMap)
        .bindPopup("<b>Ahmedabad</b><br>Gujarat, India");

}

function showMapInfo(title, text){

    const info = document.getElementById("mapInfo");

    if(info){
        info.innerHTML = "<strong>" + title + "</strong><br>" + text;
    }

}

function goToIndia(){

    initQuickTypeMap();

    quickTypeMap.setView(INDIA, 5);
    indiaMarker.openPopup();

    showMapInfo("Selected: India", "Showing the full country view.");

}

function goToAhmedabad(){

    initQuickTypeMap();

    quickTypeMap.setView(AHMEDABAD, 12);
    ahmedabadMarker.openPopup();

    showMapInfo("Selected: Ahmedabad", "Gujarat, India.");

}

function findMyLocation(){

    initQuickTypeMap();

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
                message = "Location permission was denied.";
            }

            showMapInfo("Location unavailable", message);

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );

}

function resetMap(){

    initQuickTypeMap();

    quickTypeMap.setView(INDIA, 5);

    if(userMarker){
        quickTypeMap.removeLayer(userMarker);
        userMarker = null;
    }

    indiaMarker.closePopup();
    ahmedabadMarker.closePopup();

    showMapInfo("Selected: India", "Map has been reset.");

}


/* ============================================================
   NEXT SECTION
============================================================ */

/* ---------------------------------------------------------
   PAGE CURTAIN TRANSITION
--------------------------------------------------------- */

function runPageCurtain(onCovered){

    const curtain = document.getElementById("pageCurtain");

    if(!curtain){
        /* No curtain available — just swap immediately. */
        try{
            if(typeof onCovered === "function"){
                onCovered();
            }
        }catch(err){
            console.error("QuickType page swap failed:", err);
        }
        return;
    }

    const COVER_MS = 220;
    const HOLD_MS = 40;

    const clearCurtain = function(){
        curtain.classList.remove("cover");
        clearTimeout(curtain._safetyTimer);
    };

    /* Phase 1: fade the curtain to fully opaque, hiding the
       current page completely. */
    curtain.classList.add("cover");

    /* Absolute safety net — if anything below goes wrong in a
       way we didn't anticipate, this guarantees the curtain can
       never stay stuck covering the screen for more than 1.5s. */
    clearTimeout(curtain._safetyTimer);
    curtain._safetyTimer = setTimeout(clearCurtain, 1500);

    setTimeout(() => {

        /* Phase 2: swap the page content while the screen is
           fully covered — the old page is never visible at the
           same time as the new one. try/finally guarantees the
           curtain always gets removed afterward, even if the
           page swap itself throws an error. */
        try{
            if(typeof onCovered === "function"){
                onCovered();
            }
        }catch(err){
            console.error("QuickType page swap failed:", err);
        }finally{

            setTimeout(() => {
                /* Phase 3: fade the curtain back out, revealing
                   the already-swapped new page underneath. */
                clearCurtain();
            }, HOLD_MS);

        }

    }, COVER_MS);

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

    /* Each enhancement runs independently — if one throws (e.g.
       localStorage blocked in a locked-down browser mode), it
       must never stop the others, and it must never stop the
       page from being visible (visibility no longer depends on
       any of this running at all). */

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

        if(initialTarget && initialTarget.classList.contains("page")){
            showPage(initialFromHash, { skipHistory:true });
        }else{
            renderHomeStatsChart();
        }

    });

    safely(refreshAiCoachTip);
    safely(function(){ renderGoalProgress(loadGoal()); });
    safely(observeReveals);

});
