import React, { useState, useEffect } from 'react';
import './App.css';
import { BADGES } from './constants/data';
import { triggerConfetti } from './utils/confetti';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TestsPage from './pages/TestsPage';
import ActiveTestPage from './pages/ActiveTestPage';
import TutorialPage from './pages/TutorialPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import CertificatePage from './pages/CertificatePage';
import AchievementsPage from './pages/AchievementsPage';
import AboutPage from './pages/AboutPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';
import {
  getHistory, saveTestResult, savePracticeSession,
  updateUser, saveBadge, clearHistory
} from './lib/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [unlockedPopup, setUnlockedPopup] = useState(null);

  // Logged-in user object from MySQL / localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quickTypeUser")) || null; }
    catch { return null; }
  });

  // Persistent stats (seeded from DB on login, fallback to localStorage)
  const [history, setHistory] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("quickTypeHistory")) || [];
      return raw.map(r => ({
        ...r,
        wpm: Number(r.wpm) || 0,
        accuracy: Math.round(Number(r.accuracy)) || 0,
        errors: Number(r.errors) || 0,
        duration: Number(r.duration) || 60,
      }));
    } catch {
      return [];
    }
  });

  const [practiceCount, setPracticeCount] = useState(() => {
    return Number(localStorage.getItem("quickTypePracticeSessions")) || 0;
  });
  const [streak, setStreak] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quickTypeStreak")) || { current: 0, longest: 0, lastDate: null };
    } catch {
      return { current: 0, longest: 0, lastDate: null };
    }
  });
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quickTypeBadges")) || []; }
    catch { return []; }
  });
  const [goalWpm, setGoalWpm] = useState(() => {
    return Number(localStorage.getItem("quickTypeGoal")) || 40;
  });
  const [lastResult, setLastResult] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(60);

  // ── Lock to Professional Blue Theme ───────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", "#2563eb");
    document.documentElement.style.setProperty("--primary2", "#3b82f6");
  }, []);

  // ── Load data from Database when a user logs in ──────────
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const [freshUser, hist] = await Promise.all([
          getUser(user.id).catch(() => null),
          getHistory(user.id).catch(() => []),
        ]);

        if (freshUser && freshUser.id) {
          setUser(prev => ({ ...prev, ...freshUser }));
          localStorage.setItem("quickTypeUser", JSON.stringify({ ...user, ...freshUser }));
          if (freshUser.goal_wpm) {
            setGoalWpm(Number(freshUser.goal_wpm));
            localStorage.setItem("quickTypeGoal", freshUser.goal_wpm);
          }
          if (freshUser.streak_current != null) {
            const s = {
              current: Number(freshUser.streak_current) || 0,
              longest: Number(freshUser.streak_longest) || 0,
              lastDate: freshUser.streak_last_date
            };
            setStreak(s);
            localStorage.setItem("quickTypeStreak", JSON.stringify(s));
          }
          if (freshUser.practice_count != null) {
            setPracticeCount(Number(freshUser.practice_count) || 0);
            localStorage.setItem("quickTypePracticeSessions", freshUser.practice_count);
          }
          if (freshUser.unlocked_badges) {
            const badges = typeof freshUser.unlocked_badges === "string"
              ? JSON.parse(freshUser.unlocked_badges)
              : freshUser.unlocked_badges;
            if (Array.isArray(badges)) {
              setUnlockedBadges(badges);
              localStorage.setItem("quickTypeBadges", JSON.stringify(badges));
            }
          }
        }

        // Map user's actual history from database (empty if brand new account)
        const userHist = Array.isArray(hist) ? hist : [];
        const mapped = userHist.map(r => ({
          id: r.id,
          wpm: Number(r.wpm) || 0,
          raw_wpm: Number(r.raw_wpm) || Number(r.wpm) || 0,
          accuracy: Math.round(Number(r.accuracy)) || 0,
          errors: Number(r.errors) || 0,
          correct: Number(r.correct_chars) || 0,
          duration: Number(r.duration) || 60,
          date: r.typed_date || (r.created_at ? new Date(r.created_at).toLocaleDateString() : "Today"),
        }));
        setHistory(mapped);
        localStorage.setItem("quickTypeHistory", JSON.stringify(mapped));
      } catch (err) {
        console.warn("DB sync error:", err.message);
      }
    })();
  }, [user?.id]); // eslint-disable-line

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  };

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUserLogin = (loggedInUser) => {
    // Clear previous user's data from state and storage so fresh accounts start at 0
    setHistory([]);
    setStreak({ current: 0, longest: 0, lastDate: null });
    setPracticeCount(0);
    setUnlockedBadges([]);
    setLastResult(null);

    localStorage.removeItem("quickTypeHistory");
    localStorage.removeItem("quickTypeStreak");
    localStorage.removeItem("quickTypePracticeSessions");
    localStorage.removeItem("quickTypeBadges");

    setUser(loggedInUser);
    localStorage.setItem("quickTypeUser", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    setStreak({ current: 0, longest: 0, lastDate: null });
    setPracticeCount(0);
    setUnlockedBadges([]);
    setLastResult(null);

    localStorage.removeItem("quickTypeUser");
    localStorage.removeItem("quickTypeHistory");
    localStorage.removeItem("quickTypeStreak");
    localStorage.removeItem("quickTypePracticeSessions");
    localStorage.removeItem("quickTypeBadges");

    showToast("Logged out successfully.");
    navigateTo("home");
  };

  const handleClearHistory = async () => {
    setHistory([]);
    localStorage.removeItem("quickTypeHistory");
    if (user) {
      try {
        await clearHistory(user.id);
      } catch (err) {
        console.warn("DB clear failed:", err.message);
      }
    }
    showToast("History cleared successfully.");
  };

  const updateStreakAndBadges = (newHist = history, pCount = practiceCount) => {
    const today = new Date().toDateString();
    let updatedStreak = { ...streak };

    if (updatedStreak.lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (updatedStreak.lastDate === yesterday.toDateString()) {
        updatedStreak.current += 1;
      } else {
        updatedStreak.current = 1;
      }
      updatedStreak.longest = Math.max(updatedStreak.longest, updatedStreak.current);
      updatedStreak.lastDate = today;
      setStreak(updatedStreak);
      localStorage.setItem("quickTypeStreak", JSON.stringify(updatedStreak));

      // ── Save updated streak to Database ──────────────────
      if (user) {
        updateUser(user.id, {
          streak_current:   updatedStreak.current,
          streak_longest:   updatedStreak.longest,
          streak_last_date: today,
        }).catch(err => console.warn("Streak save failed:", err.message));
      }
    }

    const bestWpmVal = newHist.length ? Math.max(...newHist.map(h => Number(h.wpm) || 0)) : 0;
    const hasPerfect = newHist.some(h => (Number(h.accuracy) || 0) >= 100);
    const newBadges  = [...unlockedBadges];
    let justUnlocked = null;
    const freshlyEarned = [];   // badges earned THIS call — to save to DB

    BADGES.forEach(b => {
      if (!newBadges.includes(b.id)) {
        let earned = false;
        if (b.id === "first-test"       && newHist.length >= 1)        earned = true;
        if (b.id === "ten-tests"        && newHist.length >= 10)       earned = true;
        if (b.id === "speed-40"         && bestWpmVal >= 40)           earned = true;
        if (b.id === "speed-60"         && bestWpmVal >= 60)           earned = true;
        if (b.id === "speed-100"        && bestWpmVal >= 100)          earned = true;
        if (b.id === "perfect-accuracy" && hasPerfect)                 earned = true;
        if (b.id === "practice-fan"     && pCount >= 15)               earned = true;
        if (b.id === "streak-3"         && updatedStreak.longest >= 3) earned = true;
        if (b.id === "streak-7"         && updatedStreak.longest >= 7) earned = true;

        if (earned) {
          newBadges.push(b.id);
          freshlyEarned.push(b.id);
          justUnlocked = b;
        }
      }
    });

    if (newBadges.length !== unlockedBadges.length) {
      setUnlockedBadges(newBadges);
      localStorage.setItem("quickTypeBadges", JSON.stringify(newBadges));

      // ── Save each new badge to user_badges table with timestamp ──
      if (user && freshlyEarned.length > 0) {
        freshlyEarned.forEach(badgeId => {
          saveBadge(user.id, badgeId)
            .catch(err => console.warn("Badge save failed:", err.message));
        });
        // Also update unlocked_badges array on the user record
        updateUser(user.id, { unlocked_badges: newBadges })
          .catch(err => console.warn("Badge array save failed:", err.message));
      }

      if (justUnlocked) {
        setUnlockedPopup(justUnlocked);
        triggerConfetti();
        setTimeout(() => setUnlockedPopup(null), 3500);
      }
    }
  };

  const handleTestFinished = async (result) => {
    setLastResult(result);
    const targetUserId = user ? user.id : 1;

    // 1. Immediately save to PostgreSQL database
    try {
      await saveTestResult(targetUserId, {
        wpm:           Number(result.wpm) || 0,
        raw_wpm:       Number(result.raw_wpm || result.wpm) || 0,
        accuracy:      Number(result.accuracy) || 0,
        errors:        Number(result.errors) || 0,
        correct_chars: Number(result.correct) || 0,
        total_chars:   Number(result.total_chars) || (Number(result.correct) || 0) + (Number(result.errors) || 0),
        missed_keys:   result.missed_keys || [],
        duration:      Number(result.duration) || selectedDuration,
        elapsed_secs:  Number(result.elapsed_secs) || selectedDuration,
        passage_id:    Number(result.passage_id) || 0,
        typed_date:    result.date || new Date().toLocaleDateString(),
      });

      // 2. Fetch fresh updated history directly from PostgreSQL
      const hist = await getHistory(targetUserId);
      if (Array.isArray(hist) && hist.length > 0) {
        const mapped = hist.map(r => ({
          id: r.id,
          wpm: Number(r.wpm) || 0,
          raw_wpm: Number(r.raw_wpm) || Number(r.wpm) || 0,
          accuracy: Math.round(Number(r.accuracy)) || 0,
          errors: Number(r.errors) || 0,
          correct: Number(r.correct_chars) || 0,
          duration: Number(r.duration) || 60,
          date: r.typed_date || new Date(r.created_at).toLocaleDateString(),
        }));
        setHistory(mapped);
        localStorage.setItem("quickTypeHistory", JSON.stringify(mapped));
        updateStreakAndBadges(mapped, practiceCount);
      } else {
        const newHist = [result, ...history].slice(0, 30);
        setHistory(newHist);
        localStorage.setItem("quickTypeHistory", JSON.stringify(newHist));
        updateStreakAndBadges(newHist, practiceCount);
      }

      // 3. Update user object from PostgreSQL if logged in
      if (user) {
        try {
          const freshUser = await getUser(user.id);
          if (freshUser && freshUser.id) {
            setUser(freshUser);
            localStorage.setItem("quickTypeUser", JSON.stringify(freshUser));
          }
        } catch {
          setUser(prev => prev ? { ...prev, total_tests: (prev.total_tests || 0) + 1 } : prev);
        }
      }
    } catch (err) {
      console.warn("DB save error:", err.message);
      const newHist = [result, ...history].slice(0, 30);
      setHistory(newHist);
      localStorage.setItem("quickTypeHistory", JSON.stringify(newHist));
      updateStreakAndBadges(newHist, practiceCount);
    }

    if (result.wpm >= 60 || result.accuracy >= 100) {
      triggerConfetti();
      showToast(`🎉 Phenomenal run! ${result.wpm} WPM at ${result.accuracy}% accuracy.`);
    } else {
      showToast("Test completed & saved to PostgreSQL! 🎉");
    }
  };

  const handlePracticeFinished = async (result) => {
    const nextCount = practiceCount + 1;
    setPracticeCount(nextCount);
    localStorage.setItem("quickTypePracticeSessions", nextCount);

    // ── Save full practice session to Database ────
    const targetUserId = user ? user.id : 1;
    try {
      await savePracticeSession(targetUserId, {
        mode:          result.mode          || 'all',
        wpm:           result.wpm           || 0,
        accuracy:      result.accuracy      || 0,
        errors:        result.errors        || 0,
        correct_chars: result.correct_chars || 0,
        total_chars:   result.total_chars   || 0,
        missed_keys:   result.missed_keys   || [],
        pattern_used:  result.pattern_used  || '',
      });
    } catch (err) { console.warn("DB save failed:", err.message); }

    updateStreakAndBadges(history, nextCount);
    showToast(`Practice complete! ${result.wpm} WPM`);
  };

  // Only consider tests with valid typing activity
  const validHistory = history.filter(h => (Number(h.wpm) > 0 || Number(h.accuracy) > 0 || Number(h.errors) > 0));
  const bestWpm = validHistory.length ? Math.max(...validHistory.map(h => Number(h.wpm) || 0)) : 0;
  const bestAcc = validHistory.length ? Math.max(...validHistory.map(h => Number(h.accuracy) || 0)) : 0;
  const avgWpm = validHistory.length ? Math.round(validHistory.reduce((s, h) => s + (Number(h.wpm) || 0), 0) / validHistory.length) : 0;
  const avgAcc = validHistory.length ? Math.round(validHistory.reduce((s, h) => s + (Number(h.accuracy) || 0), 0) / validHistory.length) : 0;

  return (
    <div className={`page-${currentPage}`}>
      <canvas id="confettiCanvas"></canvas>
      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>

      {unlockedPopup && (
        <div className="achievement-popup show">
          <div className="achievement-popup-icon">{unlockedPopup.icon}</div>
          <div>
            <div className="achievement-popup-title">Achievement Unlocked!</div>
            <div className="achievement-popup-name">{unlockedPopup.name}</div>
          </div>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <Navbar
        currentPage={currentPage}
        navigateTo={navigateTo}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        streak={streak}
        user={user}
        onLogout={handleLogout}
      />

      {/* MAIN ROUTED VIEW */}
      <main>
        {currentPage === "home" && (
          <HomePage
            navigateTo={navigateTo}
            startTimedTest={(sec) => {
              setSelectedDuration(sec);
              navigateTo("typingTest");
            }}
            bestWpm={bestWpm}
            bestAcc={bestAcc}
            history={history}
            streak={streak}
            goalWpm={goalWpm}
            setGoalWpm={(g) => {
              setGoalWpm(g);
              localStorage.setItem("quickTypeGoal", g);
            }}
          />
        )}

        {currentPage === "tests" && (
          <TestsPage
            startTimedTest={(sec) => {
              setSelectedDuration(sec);
              navigateTo("typingTest");
            }}
          />
        )}

        {currentPage === "typingTest" && (
          <ActiveTestPage
            duration={selectedDuration}
            navigateTo={navigateTo}
            onComplete={handleTestFinished}
          />
        )}

        {currentPage === "tutorial" && <TutorialPage navigateTo={navigateTo} />}

        {currentPage === "practice" && (
          <PracticePage
            onFinishPractice={handlePracticeFinished}
          />
        )}

        {currentPage === "progress" && (
          <ProgressPage
            history={history}
            practiceCount={practiceCount}
            bestWpm={bestWpm}
            bestAcc={bestAcc}
            avgWpm={avgWpm}
            avgAcc={avgAcc}
            onClearHistory={handleClearHistory}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "certificate" && (
          <CertificatePage
            lastResult={lastResult || history[0]}
            navigateTo={navigateTo}
            user={user}
          />
        )}

        {currentPage === "achievements" && (
          <AchievementsPage
            unlockedBadges={unlockedBadges}
            streak={streak}
          />
        )}

        {currentPage === "about" && <AboutPage navigateTo={navigateTo} />}

        {currentPage === "feedback" && <FeedbackPage navigateTo={navigateTo} showToast={showToast} user={user} />}

        {currentPage === "login" && (
          <LoginPage
            navigateTo={navigateTo}
            showToast={showToast}
            onLogin={handleUserLogin}
            user={user}
            onLogout={handleLogout}
            history={history}
            streak={streak}
            goalWpm={goalWpm}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
