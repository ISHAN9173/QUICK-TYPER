import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PARAGRAPH_POOLS } from '../constants/data';
import { playSound } from '../utils/audio';

export default function ActiveTestPage({ duration, navigateTo, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [passage, setPassage] = useState("");
  const [typed, setTyped] = useState("");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [sound, setSound] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const typedRef = useRef("");
  const passageRef = useRef("");
  const doneRef = useRef(false);

  // Keep refs synchronized to prevent stale closures in setInterval callbacks
  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

  useEffect(() => {
    passageRef.current = passage;
  }, [passage]);

  useEffect(() => {
    doneRef.current = done;
  }, [done]);

  const initTest = useCallback(() => {
    clearInterval(timerRef.current);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);
    const pool = PARAGRAPH_POOLS[duration] || PARAGRAPH_POOLS[60];
    const newPassage = pool[Math.floor(Math.random() * pool.length)];
    setPassage(newPassage);
    passageRef.current = newPassage;
    setTimeLeft(duration);
    setTyped("");
    typedRef.current = "";
    setRunning(false);
    setDone(false);
    doneRef.current = false;
    setFinalResult(null);
    startTimeRef.current = null;
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [duration]);

  useEffect(() => {
    initTest();
    return () => clearInterval(timerRef.current);
  }, [initTest]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    setRunning(false);
    clearInterval(timerRef.current);

    const currentTyped   = typedRef.current;
    const currentPassage = passageRef.current;

    let correct = 0;
    let errors  = 0;

    // Track which keys were missed — { key → count }
    const missedKeyMap = {};

    for (let i = 0; i < currentTyped.length; i++) {
      if (currentTyped[i] === currentPassage[i]) {
        correct++;
      } else {
        errors++;
        // The expected (missed) key
        const expectedKey = currentPassage[i];
        if (expectedKey) {
          missedKeyMap[expectedKey] = (missedKeyMap[expectedKey] || 0) + 1;
        }
      }
    }

    // Convert to sorted array [{key, count}], most-missed first
    const missed_keys = Object.entries(missedKeyMap)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);

    const elapsed = Math.max(1, (performance.now() - (startTimeRef.current || performance.now())) / 1000);
    const elapsed_secs = Math.round(elapsed);
    const total_chars  = currentTyped.length;

    const wpm      = total_chars > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0;
    const accuracy = total_chars > 0 ? Math.round((correct / total_chars) * 100)  : 0;

    const res = {
      wpm,
      accuracy,
      correct,          // correct_chars
      errors,           // wrong keystrokes = misses
      total_chars,      // total chars typed
      missed_keys,      // [{key, count}] — which keys were missed
      duration,
      elapsed_secs,
      date: new Date().toLocaleDateString(),
    };

    setFinalResult(res);
    if (onComplete) {
      onComplete(res);
    }
  }, [duration, onComplete]);

  const startTimer = () => {
    startTimeRef.current = performance.now();
    setRunning(true);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInput = (e) => {
    if (doneRef.current) return;
    const val = e.target.value;

    if (!startTimeRef.current) {
      startTimer();
    }

    if (sound && val.length > typed.length) {
      const char = val[val.length - 1];
      playSound(char, char === passage[val.length - 1]);
    }

    setTyped(val);
    typedRef.current = val;

    // If passage is completely typed, auto-finish test
    if (passage && val.length >= passage.length) {
      finish();
    }
  };

  const toggleRead = () => {
    if (!("speechSynthesis" in window)) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const utter = new SpeechSynthesisUtterance(passage);
      utter.onend = () => setIsReading(false);
      utter.onerror = () => setIsReading(false);
      window.speechSynthesis.speak(utter);
      setIsReading(true);
    }
  };

  let correctCount = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === passage[i]) correctCount++;
  }
  const liveWpm = startTimeRef.current && (duration - timeLeft) > 0
    ? Math.round((correctCount / 5) / ((duration - timeLeft) / 60))
    : 0;
  const liveAcc = typed.length ? Math.round((correctCount / typed.length) * 100) : 100;

  const words = passage.split(" ");
  let charOffsets = [];
  let currentOffset = 0;
  for (let i = 0; i < words.length; i++) {
    charOffsets.push(currentOffset);
    currentOffset += words[i].length + 1; // +1 for space
  }

  return (
    <section className="page active">
      <div className="card">
        <div className="test-header">
          <div className="test-header-left">
            <h2>{duration / 60} Minute Typing Test</h2>
            <p>Start typing to begin the timer.</p>
          </div>
          <div className="test-controls">
            <button className="btn btn-secondary" onClick={initTest}>↻ Redo</button>
            <button className="btn btn-secondary" onClick={() => setSound(!sound)}>
              {sound ? "🔊 Sound" : "🔇 Muted"}
            </button>
            <button className={`btn btn-secondary ${isReading ? "active" : ""}`} onClick={toggleRead}>
              {isReading ? "⏹ Stop" : "🔈 Read"}
            </button>
            <div className="timer">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</div>
          </div>
        </div>

        <div className="test-body">
          <div className="reference-text">
            {words.map((word, wIdx) => {
              const wordOffset = charOffsets[wIdx];
              return (
                <span key={wIdx} className="word">
                  {word.split("").map((c, cIdx) => {
                    const idx = wordOffset + cIdx;
                    let cls = "char";
                    if (idx < typed.length) {
                      cls += typed[idx] === c ? " correct" : " wrong";
                    } else if (idx === typed.length) {
                      cls += " current";
                    }
                    return <span key={cIdx} className={cls}>{c}</span>;
                  })}
                  <span className={`char space ${wordOffset + word.length < typed.length ? (typed[wordOffset + word.length] === ' ' ? 'correct' : 'wrong') : (wordOffset + word.length === typed.length ? 'current' : '')}`}> </span>
                </span>
              );
            })}
          </div>

          <textarea
            ref={inputRef}
            id="typingInput"
            value={typed}
            onChange={handleInput}
            disabled={done}
            placeholder="Start typing here to begin test..."
          />

          <div className="live-stats">
            <div className="stat"><div className="stat-label">WPM</div><div className="stat-value">{liveWpm}</div></div>
            <div className="stat"><div className="stat-label">Accuracy</div><div className="stat-value accuracy-value">{liveAcc}%</div></div>
            <div className="stat"><div className="stat-label">Time</div><div className="stat-value">{timeLeft}s</div></div>
            <div className="stat"><div className="stat-label">Characters</div><div className="stat-value">{typed.length}</div></div>
          </div>

          <div className="test-actions">
            {running && typed.length > 0 ? (
              <button className="btn btn-primary" onClick={finish}>✓ Finish & Save Test</button>
            ) : (
              <button className="btn btn-primary" onClick={() => inputRef.current && inputRef.current.focus()}>Start Typing</button>
            )}
            <button className="btn btn-secondary" onClick={initTest}>Restart</button>
          </div>

          {done && finalResult && (
            <div className="card result" style={{ display: "block" }}>
              <h2>Test Complete 🎉</h2>
              <div className="result-grid">
                <div className="result-item"><small>WPM</small><strong>{finalResult.wpm}</strong></div>
                <div className="result-item"><small>Accuracy</small><strong>{finalResult.accuracy}%</strong></div>
                <div className="result-item"><small>Correct Characters</small><strong>{finalResult.correct}</strong></div>
                <div className="result-item"><small>Errors</small><strong>{finalResult.errors}</strong></div>
              </div>
              <div className="hero-buttons" style={{ justifyContent: "center" }}>
                <button className="btn btn-primary" onClick={initTest}>Try Again</button>
                <button className="btn btn-secondary" onClick={() => navigateTo("progress")}>View in Progress →</button>
                <button className="btn btn-secondary" onClick={() => navigateTo("certificate")}>Certificate</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
