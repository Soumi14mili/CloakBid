import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

async function record() {
  const outputDir = path.resolve('./demo_output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching isolated Chrome instance...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--autoplay-policy=no-user-gesture-required',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--no-first-run',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  const video = page.video();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  const smoothScrollTo = async (selector, duration = 1200) => {
    await page.evaluate(async ({ sel, dur }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const targetY = el.getBoundingClientRect().top + window.pageYOffset - 80;
      const startY = window.pageYOffset;
      const diff = targetY - startY;
      const startTime = performance.now();

      await new Promise(resolve => {
        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / dur, 1);
          const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
          window.scrollTo(0, startY + diff * ease);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }, { sel: selector, dur: duration });
  };

  console.log('[1/8] Scene 1: Top Navigation & Wallet Connection...');
  await wait(1500);
  const connectBtn = await page.$('button:has-text("Connect Wallet")');
  if (connectBtn) {
    console.log('Connecting Lace Wallet...');
    await connectBtn.click();
    await wait(2000);
  }

  console.log('[2/8] Scene 2: Luxury Hero & 3D Cryptographic Vault...');
  await wait(3500);

  // Switch lot to demonstrate reactive state
  const lotPills = await page.$$('button:has-text("Project")');
  if (lotPills.length > 0) {
    await lotPills[0].click();
    await wait(1800);
  }
  const genesisPills = await page.$$('button:has-text("Midnight")');
  if (genesisPills.length > 0) {
    await genesisPills[0].click();
    await wait(1800);
  }

  console.log('[3/8] Scene 3: Formulating Private Sealed Bid...');
  await smoothScrollTo('#private-bidding-panel', 1200);
  await wait(1500);

  // Regenerate salt
  const regenBtn = await page.$('button:has-text("Regenerate")');
  if (regenBtn) {
    await regenBtn.click();
    await wait(1000);
  }

  // Click increment button (+500)
  const incBtn = await page.$('button:has-text("+500")');
  if (incBtn) {
    await incBtn.click();
    await wait(1200);
  }

  // Click Generate ZK Proof
  const generateBtn = await page.$('button:has-text("GENERATE ZK PROOF")');
  if (generateBtn) {
    console.log('Triggering ZK Proof Generation Reactor...');
    await generateBtn.click();
    // Wait for the full 5-stage circular reactor animation
    await wait(7000);
  }

  console.log('[4/8] Scene 4: Zero-Knowledge Verification Pipeline...');
  await smoothScrollTo('#zk-pipeline-section', 1200);
  await wait(3500);

  console.log('[5/8] Scene 5: Dual-State Ledger (Private vs. Public)...');
  await smoothScrollTo('#dual-state-section', 1200);
  await wait(1500);

  // Click Peek button to demonstrate masked/unmasked witness
  const peekBtn = await page.$('button:has-text("Peek")');
  if (peekBtn) {
    await peekBtn.click();
    await wait(2200);
    await peekBtn.click();
    await wait(1200);
  }

  console.log('[6/8] Scene 6: Sealed Bidder 3D Capsules...');
  await smoothScrollTo('#sealed-bids-section', 1200);
  await wait(3500);

  console.log('[7/8] Scene 7: Privacy Attack Simulator...');
  await smoothScrollTo('#privacy-attack-section', 1200);
  await wait(1500);

  // Trigger attack simulation
  const attackBtn = await page.$('button:has-text("SIMULATE MEMPOOL ATTACK")');
  if (attackBtn) {
    console.log('Launching mempool attack simulation...');
    await attackBtn.click();
    await wait(4500);
  }

  console.log('[8/8] Scene 8: Settlement & Winner Verification...');
  await smoothScrollTo('#settlement-section', 1200);
  await wait(1500);

  // Click Close Auction Round
  const closeBtn = await page.$('button:has-text("Close Auction Round")');
  if (closeBtn) {
    console.log('Closing auction round...');
    await closeBtn.click();
    await wait(2000);
  }

  // Click Finalize & Reveal Winner
  const finalizeBtn = await page.$('button:has-text("Finalize & Reveal Winner")');
  if (finalizeBtn) {
    console.log('Finalizing auction and verifying winner proof...');
    await finalizeBtn.click();
    await wait(5500);
  }

  // Scroll back to top for closing grandeur
  await smoothScrollTo('header', 1500);
  await wait(2500);

  console.log('Closing page...');
  await page.close();
  await context.close();

  const finalDest = path.resolve('./CloakBid_MVP_Demo.webm');
  if (video) {
    console.log('Flushing and saving video to CloakBid_MVP_Demo.webm...');
    await video.saveAs(finalDest);
    console.log(`Video saved: ${finalDest} (${(fs.statSync(finalDest).size / (1024 * 1024)).toFixed(2)} MB)`);
  }

  // Also copy to artifact directory
  const artifactDest = 'C:\\Users\\soumi\\.gemini\\antigravity\\brain\\85cf623e-5078-4a49-a7ea-eaf32143ae34\\CloakBid_MVP_Demo.webm';
  fs.copyFileSync(finalDest, artifactDest);
  console.log(`Copied to artifact directory: ${artifactDest}`);

  await browser.close();
  console.log('Recording complete!');
  process.exit(0);
}

record().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
