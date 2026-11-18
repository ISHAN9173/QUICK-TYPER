const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function recordComprehensiveSimulation() {
  const videoDir = path.join('C:', 'Users', 'parve', 'Downloads', 'video_temp');
  if (fs.existsSync(videoDir)) {
    fs.rmSync(videoDir, { recursive: true, force: true });
  }
  fs.mkdirSync(videoDir, { recursive: true });

  console.log('Launching Chrome (1440x900 HD)...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  console.log('1. Loading QuickType website...');
  await page.goto('https://quicktype-app.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // ── PART 1: COMPLETE HOMEPAGE TOUR ─────────────────────────
  console.log('2. Showcasing Full Homepage...');

  // Hero & Interactive Keyboard
  await page.mouse.move(950, 250);
  await page.waitForTimeout(1000);
  await page.mouse.move(1050, 300);
  await page.waitForTimeout(1500);

  // Scroll to Marquee & Feature Cards
  console.log('   -> Marquee & Feature Cards');
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(2500);

  // Scroll to Stats Band, Weekly Rhythm & AI Coach
  console.log('   -> Weekly Rhythm & AI Coach');
  await page.evaluate(() => window.scrollBy({ top: 550, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  // Interact with AI Coach refresh button
  const aiRefreshBtn = page.locator('.btn-ai-refresh');
  if (await aiRefreshBtn.isVisible()) {
    await aiRefreshBtn.click();
    await page.waitForTimeout(1500);
  }

  // Scroll to Image Gallery Slider & Goal Slider
  console.log('   -> Gallery & Interactive Goal Slider');
  await page.evaluate(() => window.scrollBy({ top: 650, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  // Click next slide arrow
  const nextSlideBtn = page.locator('#typingSlider .slider-arrow-right');
  if (await nextSlideBtn.isVisible()) {
    await nextSlideBtn.click();
    await page.waitForTimeout(1500);
  }

  // Smoothly scroll back to top of page
  console.log('   -> Smooth scroll back to navigation header');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(2500);

  // ── PART 2: TESTS PAGE ─────────────────────────────────────
  console.log('3. Navigating to Tests Selection...');
  await page.click('nav button:has-text("Tests")');
  await page.waitForTimeout(2000);

  // Start 1 Minute Test
  console.log('4. Launching 1-Minute Speed Challenge...');
  await page.click('.test-option button:has-text("Start Test")');
  await page.waitForTimeout(2000);

  // ── PART 3: ACCURATE 100% CORRECT TYPING SIMULATION ───────
  console.log('5. Reading exact passage from DOM for 100% accuracy test...');
  await page.waitForSelector('.reference-text');

  // Extract the exact words from the DOM
  const exactPassage = await page.evaluate(() => {
    const wordEls = Array.from(document.querySelectorAll('.reference-text .word'));
    return wordEls.map(w => {
      const chars = Array.from(w.querySelectorAll('.char:not(.space)')).map(c => c.textContent).join('');
      return chars;
    }).join(' ');
  });

  console.log('   -> Actual Passage detected (' + exactPassage.length + ' chars)');

  const input = page.locator('#typingInput');
  await input.click();
  await page.waitForTimeout(500);

  // Type the first ~130 characters of the EXACT passage
  const charsToType = Math.min(130, exactPassage.length);
  console.log('   -> Typing ' + charsToType + ' exact characters (all green/correct)...');

  for (let i = 0; i < charsToType; i++) {
    const char = exactPassage[i];
    await page.keyboard.type(char, { delay: Math.floor(Math.random() * 25) + 40 });
  }

  await page.waitForTimeout(1500);

  // ── PART 4: FINISH, SAVE & CONFETTI CELEBRATION ────────────
  console.log('6. Finishing & Saving Test (Triggering Confetti)...');
  await page.click('button:has-text("✓ Finish & Save Test")');
  await page.waitForTimeout(4000); // Capture confetti & 100% accuracy results card

  // ── PART 5: CERTIFICATE OF ACHIEVEMENT ─────────────────────
  console.log('7. Viewing Certificate of Achievement...');
  await page.click('.result button:has-text("Certificate")');
  await page.waitForTimeout(3500);

  // ── PART 6: PROGRESS ANALYTICS & HISTORY ───────────────────
  console.log('8. Inspecting Progress Analytics & History List...');
  await page.click('button:has-text("View Progress Analytics")');
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
  await page.waitForTimeout(3000);

  // ── PART 7: FINAL WRAP-UP ON HOME ──────────────────────────
  console.log('9. Returning to Home with updated real-time score...');
  await page.click('nav button:has-text("Home")');
  await page.waitForTimeout(3000);

  // Finalize video
  console.log('Finalizing video file...');
  await context.close();
  await browser.close();

  // Move video to Downloads
  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const srcVideo = path.join(videoDir, files[0]);
    const finalVideo = path.join('C:', 'Users', 'parve', 'Downloads', 'QuickType_Live_Simulation.webm');
    if (fs.existsSync(finalVideo)) fs.unlinkSync(finalVideo);
    fs.renameSync(srcVideo, finalVideo);
    console.log('SUCCESS! Video generated at:', finalVideo);
  }
}

recordComprehensiveSimulation().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
