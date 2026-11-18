import React, { useState, useEffect, useRef } from 'react';
import { PRACTICE_MODES } from '../constants/data';
import { playSound } from '../utils/audio';

const SHIFT_SYMBOLS = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-',
  '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'",
  '<': ',', '>': '.', '?': '/'
};

export default function PracticePage({ onFinishPractice }) {
  const [mode, setMode] = useState("all");
  const [pattern, setPattern] = useState("");
  const [typed, setTyped] = useState("");
  const [sound, setSound] = useState(true);
  const [completionNotice, setCompletionNotice] = useState(null);
  const [problemKeys, setProblemKeys] = useState(() => {
    try {
      const stored = localStorage.getItem("quickTypeProblemKeys");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const inputRef = useRef(null);

  const loadPattern = (m = mode) => {
    const list = PRACTICE_MODES[m]?.patterns || [];
    const next = list[Math.floor(Math.random() * list.length)] || "";
    setPattern(next);
    setTyped("");
    setCompletionNotice(null);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    loadPattern(mode);
  }, [mode]);

  const focusPractice = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const handleInput = (e) => {
    const val = e.target.value;
    if (pattern && val.length > pattern.length) return;

    if (val.length > typed.length) {
      const c        = val[val.length - 1];
      const expected = pattern[val.length - 1];
      const isRight  = c === expected;
      if (sound) playSound(c, isRight);
    }
    setTyped(val);

    if (val.length >= pattern.length && pattern.length > 0) {
      let correct = 0;
      let errors  = 0;
      const missedKeyMap = {};
      const updatedProblems = { ...problemKeys };

      for (let i = 0; i < pattern.length; i++) {
        if (val[i] === pattern[i]) {
          correct++;
        } else {
          errors++;
          const expectedKey = pattern[i];
          if (expectedKey) {
            missedKeyMap[expectedKey] = (missedKeyMap[expectedKey] || 0) + 1;
            updatedProblems[expectedKey] = (updatedProblems[expectedKey] || 0) + 1;
          }
        }
      }

      setProblemKeys(updatedProblems);
      try {
        localStorage.setItem("quickTypeProblemKeys", JSON.stringify(updatedProblems));
      } catch (e) {
        console.warn("Could not save problem keys to localStorage", e);
      }

      const missed_keys = Object.entries(missedKeyMap)
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);

      const total_chars = val.length;
      const accuracy    = total_chars > 0 ? Math.round((correct / total_chars) * 100) : 100;
      const wpm         = Math.round((correct / 5) * 12);

      setCompletionNotice({ wpm, accuracy, errors, correct });

      if (onFinishPractice) {
        onFinishPractice({
          mode,
          wpm,
          accuracy,
          errors,
          correct_chars: correct,
          total_chars,
          missed_keys,
          pattern_used: pattern,
        });
      }

      setTimeout(() => {
        loadPattern(mode);
      }, 900);
    }
  };

  let correctCount = 0;
  let errorCount = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === pattern[i]) correctCount++;
    else errorCount++;
  }
  const acc = typed.length ? Math.round((correctCount / typed.length) * 100) : 100;
  const progressPct = pattern.length ? Math.min(100, Math.round((typed.length / pattern.length) * 100)) : 0;
  
  // Calculate next key and shift requirement
  const rawNext = pattern[typed.length] || "";
  let isShiftActive = false;
  let nextKeyBase = "";

  if (rawNext) {
    if (rawNext in SHIFT_SYMBOLS) {
      isShiftActive = true;
      nextKeyBase = SHIFT_SYMBOLS[rawNext];
    } else if (rawNext >= 'A' && rawNext <= 'Z') {
      isShiftActive = true;
      nextKeyBase = rawNext.toLowerCase();
    } else {
      nextKeyBase = rawNext.toLowerCase();
    }
  }

  // Sorted problem keys list for display
  const problemKeyList = Object.entries(problemKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const clearProblemKeys = () => {
    setProblemKeys({});
    localStorage.removeItem("quickTypeProblemKeys");
  };

  return (
    <section className="page active" id="practice">
      <div className="section-header">
        <div className="page-kicker kicker-practice">🏋️ DRILL</div>
        <h1>Keyboard Practice Lab</h1>
        <p>Train specific keyboard zones, hands, numbers, symbols and the complete keyboard.</p>
      </div>

      <div className="practice-layout">
        <aside className="card practice-menu">
          <div className="practice-menu-title">Practice Sections</div>
          {Object.keys(PRACTICE_MODES).map(k => (
            <button
              key={k}
              className={`practice-category ${mode === k ? "active" : ""}`}
              onClick={() => setMode(k)}
            >
              <span className="category-icon">{PRACTICE_MODES[k].icon || "⌨️"}</span>
              <span>{PRACTICE_MODES[k].title}</span>
            </button>
          ))}
        </aside>

        <main className="practice-main">
          <div className="card practice-header">
            <div>
              <h2 id="practiceTitle">{PRACTICE_MODES[mode].title}</h2>
              <p id="practiceDescription">{PRACTICE_MODES[mode].description}</p>
            </div>
            <div className="practice-meta">
              <span className="practice-pill" id="practiceModePill">{PRACTICE_MODES[mode].pill}</span>
              <span className="practice-pill" id="practiceGoalPill">{PRACTICE_MODES[mode].goal}</span>
            </div>
          </div>

          <div className="practice-work">
            <div className="card practice-box">
              {/* TARGET STRING (direct span children styled by .practice-target span) */}
              <div className="practice-target" id="practiceTarget" onClick={focusPractice} style={{ cursor: 'text' }}>
                {pattern.split("").map((c, i) => {
                  let cls = "char";
                  if (i < typed.length) cls += typed[i] === c ? " correct" : " wrong";
                  else if (i === typed.length) cls += " current";
                  return <span key={i} className={cls}>{c}</span>;
                })}
              </div>

              {/* PRACTICE INPUT */}
              <input
                ref={inputRef}
                id="practiceInput"
                type="text"
                value={typed}
                onChange={handleInput}
                placeholder="Click here and type the pattern above..."
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />

              {/* LIVE DRILL STATS */}
              <div className="practice-live-stats">
                <div className="practice-stat">
                  <small>WPM</small>
                  <strong id="practiceWpm">{Math.round((correctCount / 5) * 12)}</strong>
                </div>
                <div className="practice-stat">
                  <small>Accuracy</small>
                  <strong id="practiceAccuracy">{acc}%</strong>
                </div>
                <div className="practice-stat">
                  <small>Correct</small>
                  <strong id="practiceCorrect">{correctCount}</strong>
                </div>
                <div className="practice-stat">
                  <small>Errors</small>
                  <strong id="practiceErrors">{errorCount}</strong>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="progress-track">
                <div className="progress-fill" id="practiceProgress" style={{ width: `${progressPct}%` }} />
              </div>

              {/* COMPLETION POPUP */}
              {completionNotice && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  color: '#4ade80',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  marginTop: '12px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '15px'
                }}>
                  🎉 Drill Complete! {completionNotice.wpm} WPM · {completionNotice.accuracy}% Accuracy
                </div>
              )}

              {/* DRILL CONTROLS */}
              <div className="practice-controls" style={{ marginTop: '16px' }}>
                <button className="btn btn-primary" onClick={focusPractice}>
                  Start Practice
                </button>
                <button className="btn btn-secondary" onClick={() => loadPattern(mode)}>
                  ↻ New Pattern
                </button>
                <button className="btn btn-secondary" onClick={() => setSound(!sound)} id="practiceSoundBtn">
                  {sound ? "🔊 Sound" : "🔇 Muted"}
                </button>
              </div>

              <div className="mode-info" id="practiceInfo">
                {PRACTICE_MODES[mode].info || "Start typing to train your keyboard muscle memory."}
              </div>
            </div>

            {/* KEYBOARD VISUALIZERS */}
            <div className="practice-keyboards">
              <div className="card keyboard-wrapper">
                <div className="keyboard-title">
                  <strong>Interactive Keyboard</strong>
                  <span>
                    Next key: <strong style={{ color: '#818cf8' }}>
                      {rawNext === " " ? "SPACE" : rawNext ? `"${rawNext}"` : "DONE"}
                    </strong>
                    {isShiftActive && <span style={{ color: '#f59e0b', marginLeft: '6px' }}>(Hold Shift)</span>}
                  </span>
                </div>
                <div className="keyboard">
                  {/* NUMBER ROW */}
                  <div className="keyboard-row">
                    {["`","1","2","3","4","5","6","7","8","9","0","-","="].map(k => (
                      <div key={k} className={`key ${nextKeyBase === k ? "active" : ""}`} data-key={k}>
                        {k}
                      </div>
                    ))}
                    <div className="key wide" data-key="backspace">⌫</div>
                  </div>

                  {/* Q ROW */}
                  <div className="keyboard-row">
                    <div className="key wide" data-key="tab">Tab</div>
                    {["q","w","e","r","t","y","u","i","o","p","[","]","\\"].map(k => (
                      <div key={k} className={`key ${nextKeyBase === k ? "active" : ""}`} data-key={k}>
                        {k.toUpperCase()}
                      </div>
                    ))}
                  </div>

                  {/* A ROW */}
                  <div className="keyboard-row">
                    <div className="key wide" data-key="capslock">Caps</div>
                    {["a","s","d","f","g","h","j","k","l",";","'"].map(k => (
                      <div key={k} className={`key ${nextKeyBase === k ? "active" : ""}`} data-key={k}>
                        {k.toUpperCase()}
                      </div>
                    ))}
                    <div className="key wide" data-key="enter">Enter</div>
                  </div>

                  {/* Z ROW */}
                  <div className="keyboard-row">
                    <div className={`key xwide ${isShiftActive ? "active" : ""}`} data-key="shift">Shift</div>
                    {["z","x","c","v","b","n","m",",",".","/"].map(k => (
                      <div key={k} className={`key ${nextKeyBase === k ? "active" : ""}`} data-key={k}>
                        {k.toUpperCase()}
                      </div>
                    ))}
                    <div className={`key xwide ${isShiftActive ? "active" : ""}`} data-key="shift">Shift</div>
                  </div>

                  {/* BOTTOM ROW */}
                  <div className="keyboard-row">
                    <div className="key" data-key="ctrl">Ctrl</div>
                    <div className="key" data-key="alt">Alt</div>
                    <div className={`key space ${rawNext === " " ? "active" : ""}`} data-key="space">SPACE</div>
                    <div className="key" data-key="alt">Alt</div>
                    <div className="key" data-key="ctrl">Ctrl</div>
                  </div>
                </div>
              </div>

              {/* NUMPAD (shown for numpad mode) */}
              {mode === "numpad" && (
                <div className="card keyboard-wrapper" id="numpadPanel">
                  <div className="keyboard-title">
                    <strong>Numeric Keypad</strong>
                    <span>Use right-hand numpad keys</span>
                  </div>
                  <div className="keyboard" style={{ maxWidth: 300, margin: "auto" }}>
                    {[
                      ["7","8","9","/"],
                      ["4","5","6","*"],
                      ["1","2","3","-"],
                      ["0",".","+","↵"]
                    ].map((row, rIdx) => (
                      <div key={rIdx} className="keyboard-row">
                        {row.map(k => {
                          const isMatch = (k === "↵" && rawNext === "\n") || nextKeyBase === k.toLowerCase();
                          return (
                            <div key={k} className={`key ${isMatch ? "active" : ""}`} data-key={k}>
                              {k}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PROBLEM KEYS SECTION */}
          <div className="card problem-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Your Problem Keys</h2>
                <p style={{ color: 'var(--muted)', marginTop: '5px' }}>
                  Keys where you make the most mistakes. Practice these zones to level up your speed.
                </p>
              </div>
              {problemKeyList.length > 0 && (
                <button
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={clearProblemKeys}
                >
                  Clear Stats
                </button>
              )}
            </div>

            <div className="problem-grid" id="problemKeys">
              {problemKeyList.length === 0 ? (
                <div style={{ color: 'var(--muted)', padding: '10px 0', fontSize: '14px' }}>
                  No problem keys yet! Type with errors to see missed key statistics here.
                </div>
              ) : (
                problemKeyList.map(([key, count]) => (
                  <div key={key} className="problem-key">
                    {key === " " ? "SPACE" : key.toUpperCase()}: {count} {count === 1 ? "miss" : "misses"}
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </section>
  );
}
