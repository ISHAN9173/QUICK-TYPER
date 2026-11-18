=======================================================================
QUICKTYPE — ADVANCED REAL-TIME TYPING SPEED PLATFORM
Web Application Development Project
=======================================================================
Student Name:    Ishan Prajapati
Student ID:      2410112090
Live Website:    https://quicktype-app.vercel.app
Live Alias:      https://ishan-quicktype.vercel.app
GitHub Repo:     https://github.com/ISHAN9173/QUICK-TYPER
=======================================================================

HOW TO RUN ON YOUR LAPTOP (ONE-CLICK):
-----------------------------------------------------------------------
1. Double-click "START_WEBSITE.bat"
   - It automatically starts the Backend Server (Express + PostgreSQL) on Port 5000.
   - It automatically starts the Frontend React Application on Port 3000.
   - It opens your web browser directly to http://localhost:3000 !

HOW TO SHOW THE POSTGRESQL DATABASE & LIVE CHANGES:
-----------------------------------------------------------------------
1. First-time database setup (Optional / If PostgreSQL is installed):
   - Double-click "SETUP_DATABASE.bat"
   - This automatically creates the "quicktype_db" database and all 6 tables!

2. To view the live database in real-time:
   - Double-click "VIEW_POSTGRES_DATABASE.bat"
   - Take any typing test on the website.
   - Switch to the terminal window and press ENTER.
   - You will see the new test row appear LIVE in the "test_history" table with:
     * id, user_id, wpm, accuracy, correct_chars, errors, duration, typed_date!

WHAT IF YOUR LAPTOP DOES NOT HAVE POSTGRESQL?
-----------------------------------------------------------------------
No problem at all! The backend has an automatic Fail-Safe Store.
Even without PostgreSQL installed, the entire website, accounts, 
tests, analytics, confetti, and certificates run 100% smoothly!

PROJECT TECH STACK:
-----------------------------------------------------------------------
- Frontend: React.js, Responsive CSS, Canvas Confetti, Web Speech API
- Backend:  Node.js, Express.js REST API
- Database: PostgreSQL (with connection pooling and schema migrations)
- Deploy:   Vercel Cloud Serverless + GitHub CI/CD

=======================================================================
