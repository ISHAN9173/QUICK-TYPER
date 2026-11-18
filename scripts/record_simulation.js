const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function recordFastForwardSimulation() {
  const videoDir = path.join('C:', 'Users', 'parve', 'Downloads', 'video_temp');
  if (fs.existsSync(videoDir)) {
    fs.rmSync(videoDir, { recursive: true, force: true });
  }
  fs.mkdirSync(videoDir, { recursive: true });

  console.log('Launching fast Chrome (1440x900 HD, zero-lag)...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();

  // Fresh load
  await page.goto('https://quicktype-app.vercel.app', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.removeItem('quickTypeHistory');
    localStorage.removeItem('quickTypeStreak');
    localStorage.removeItem('quickTypePracticeSessions');
    localStorage.removeItem('quickTypeBadges');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Helper for buttery snappy scroll without lagging
  const snappyScroll = async (targetY) => {
    await page.evaluate(async (y) => {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, targetY);
    await page.waitForTimeout(1000);
  };

  // ── PART 1: HOMEPAGE TOUR (BRISK & SNAPPY) ─────────────────
  console.log('1. Brisk Homepage Showcase (No lag)...');

  // Quick cursor glide over keyboard
  await page.mouse.move(960, 240);
  await page.waitForTimeout(400);
  await page.mouse.move(1060, 290);
  await page.waitForTimeout(600);

  // Scroll to Marquee & Feature Cards
  console.log('   -> Feature Cards');
  await snappyScroll(480);

  // Scroll to AI Coach & Analytics
  console.log('   -> AI Coach & Analytics');
  await snappyScroll(1020);

  const aiRefreshBtn = page.locator('.btn-ai-refresh');
  if (await aiRefreshBtn.isVisible()) {
    await aiRefreshBtn.click();
    await page.waitForTimeout(700);
  }

  // Scroll to Image Gallery Slider
  console.log('   -> Slider & Goal');
  await snappyScroll(1580);

  const nextSlideBtn = page.locator('#typingSlider .slider-arrow-right');
  if (await nextSlideBtn.isVisible()) {
    await nextSlideBtn.click();
    await page.waitForTimeout(700);
  }

  // Fast scroll back to navigation
  console.log('   -> Fast scroll to top');
  await snappyScroll(0);

  // ── PART 2: TESTS SELECTION ─────────────────────────────────
  console.log('2. Navigating to Tests...');
  await page.click('nav button:has-text("Tests")');
  await page.waitForTimeout(900);

  console.log('3. Launching 1-Minute Challenge...');
  await page.click('.test-option button:has-text("Start Test")');
  await page.waitForTimeout(1000);

  // ── PART 3: ACCURATE ~50 WPM TYPING ─────────────────────────
  console.log('4. Reading exact passage from DOM...');
  await page.waitForSelector('.reference-text');

  const exactPassage = await page.evaluate(() => {
    const wordEls = Array.from(document.querySelectorAll('.reference-text .word'));
    return wordEls.map(w => {
      const chars = Array.from(w.querySelectorAll('.char:not(.space)')).map(c => c.textContent).join('');
      return chars;
    }).join(' ');
  });

  const input = page.locator('#typingInput');
  await input.click();
  await page.waitForTimeout(300);

  // 30 characters / 5 = 6 words.
  // At 50 WPM: (6 words / 50) * 60 = 7.2 seconds.
  // 30 keystrokes in 7.2s = 240ms per keystroke.
  const charsToType = Math.min(30, exactPassage.length);
  console.log(`   -> Fluid ~50 WPM typing: ${charsToType} exact characters...`);

  const typingStart = Date.now();
  for (let i = 0; i < charsToType; i++) {
    const char = exactPassage[i];
    const delay = char === ' ' ? 260 : Math.floor(Math.random() * 30) + 225;
    await page.keyboard.type(char, { delay });
  }

  const elapsedTyping = Date.now() - typingStart;
  const targetDurationMs = 7200;
  if (elapsedTyping < targetDurationMs) {
    await page.waitForTimeout(targetDurationMs - elapsedTyping);
  }

  console.log(`   -> Finished typing in ${( (Date.now() - typingStart) / 1000 ).toFixed(1)}s`);
  await page.waitForTimeout(400);

  // ── PART 4: FINISH & CONFETTI ──────────────────────────────
  console.log('5. Clicking Finish & Save Test...');
  await page.click('button:has-text("✓ Finish & Save Test")');
  await page.waitForTimeout(2200); // Snappy confetti & celebration showcase

  // ── PART 5: CERTIFICATE ────────────────────────────────────
  console.log('6. Viewing Certificate of Achievement...');
  await page.click('.result button:has-text("Certificate")');
  await page.waitForTimeout(2000); // Clean 2s showcase of certificate

  // ── PART 6: PROGRESS ANALYTICS ─────────────────────────────
  console.log('7. Viewing Progress Analytics & Updated Stats...');
  const progressBtn = page.locator('button:has-text("View Progress Analytics")');
  if (await progressBtn.isVisible()) {
    await progressBtn.click();
  } else {
    await page.click('nav button:has-text("Progress")');
  }
  await page.waitForTimeout(1000);

  // Scroll to show the updated history record cleanly
  await snappyScroll(300);
  await page.waitForTimeout(2200); // 2.2s showcase of updated 50 WPM score & history item

  // ── PART 7: FAST RETURN TO HOME ────────────────────────────
  console.log('8. Returning to Home Page...');
  await page.click('nav button:has-text("Home")');
  await page.waitForTimeout(1500);

  // Finalize video
  console.log('Closing browser & finalizing video...');
  await context.close();
  await browser.close();

  // Move video to Downloads
  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const srcVideo = path.join(videoDir, files[0]);
    const finalVideo = path.join('C:', 'Users', 'parve', 'Downloads', 'QuickType_Live_Simulation.webm');
    if (fs.existsSync(finalVideo)) fs.unlinkSync(finalVideo);
    fs.renameSync(srcVideo, finalVideo);
    console.log('SUCCESS: Fast-forwarded video generated at:', finalVideo);
  }
}

recordFastForwardSimulation().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
