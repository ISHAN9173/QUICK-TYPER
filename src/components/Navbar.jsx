import React from 'react';

export default function Navbar({
  currentPage,
  navigateTo,
  mobileMenuOpen,
  setMobileMenuOpen,
  streak,
  user,
  onLogout
}) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "tests", label: "Tests" },
    { id: "practice", label: "Practice" },
    { id: "progress", label: "Progress" },
    { id: "tutorial", label: "Tutorial" },
    { id: "achievements", label: "🏆 Badges" },
    { id: "about", label: "About" },
    { id: "feedback", label: "Feedback" }
  ];

  const userInitial = (user && typeof user.name === "string" && user.name.trim().length > 0)
    ? user.name.trim().charAt(0).toUpperCase()
    : (user && typeof user.email === "string" && user.email.trim().length > 0)
    ? user.email.trim().charAt(0).toUpperCase()
    : "U";

  const displayName = (user && typeof user.name === "string" && user.name.trim().length > 0)
    ? user.name
    : (user && typeof user.email === "string" && user.email.trim().length > 0)
    ? user.email.split("@")[0]
    : "Member";

  const isLoggedIn = Boolean(user && (user.id || user.email));

  return (
    <header>
      <div className="logo" onClick={() => navigateTo("home")}>
        Quick<span>Type</span>
      </div>

      <nav className={`nav ${mobileMenuOpen ? "open" : ""}`} id="mainNav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={currentPage === item.id ? "active" : ""}
            onClick={() => navigateTo(item.id)}
          >
            {item.label}
          </button>
        ))}

        {isLoggedIn ? (
          <div className="nav-user-cluster">
            <button
              className={`nav-user-badge ${currentPage === "login" ? "active" : ""}`}
              onClick={() => navigateTo("login")}
              title="View Account Profile"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <span>👤</span>
              <span className="user-name-text">{displayName}</span>
            </button>
            <button
              className="btn btn-logout"
              onClick={onLogout}
              title="Sign Out"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className={`btn btn-secondary ${currentPage === "login" ? "active" : ""}`}
            style={{ padding: "8px 16px", marginLeft: "4px" }}
            onClick={() => navigateTo("login")}
          >
            Login / Sign Up
          </button>
        )}
      </nav>

      <div className="header-extras">
        <div className="streak-pill" title="Consecutive days practiced">
          🔥 <span>{streak?.current || 0}</span> day streak
        </div>
      </div>

      <button
        className="mobile-menu"
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>
    </header>
  );
}
