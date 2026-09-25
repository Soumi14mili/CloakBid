import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

async function record() {
  const outputDir = path.resolve('./demo_output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching Chrome browser for demo recording...');
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

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const smoothScrollBy = async (deltaY, duration = 1200) => {
    await page.evaluate(
      async ({ dy, dur }) => {
        const startY = window.pageYOffset;
        const startTime = performance.now();
        await new Promise((resolve) => {
          function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / dur, 1);
            const ease =
              progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;
            window.scrollTo(0, startY + dy * ease);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              resolve();
            }
          }
          requestAnimationFrame(step);
        });
      },
      { dy: deltaY, dur: duration }
    );
  };

  const smoothScrollToElement = async (selector, duration = 1200) => {
    await page.evaluate(
      async ({ sel, dur }) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const targetY =
          el.getBoundingClientRect().top + window.pageYOffset - 80;
        const startY = window.pageYOffset;
        const diff = targetY - startY;
        const startTime = performance.now();
        await new Promise((resolve) => {
          function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / dur, 1);
            const ease =
              progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;
            window.scrollTo(0, startY + diff * ease);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              resolve();
            }
          }
          requestAnimationFrame(step);
        });
      },
      { sel: selector, dur: duration }
    );
  };

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await wait(2000);

  // ── Scene 1: Landing Page Hero & Architecture ──────────────────────────────
  console.log('[Scene 1] Landing Page: Hero & Cloak Vault visual...');
  await wait(2500);

  console.log('[Scene 1] Smoothly exploring marketing sections...');
  await smoothScrollToElement('#problem', 1400);
  await wait(2200);

  await smoothScrollToElement('#product', 1400);
  await wait(2200);

  await smoothScrollToElement('#how-it-works', 1400);
  await wait(2200);

  await smoothScrollToElement('#state', 1400);
  await wait(2500);

  await smoothScrollToElement('#product-preview', 1400);
  await wait(2500);

  await smoothScrollToElement('#security', 1400);
  await wait(2200);

  await smoothScrollToElement('#midnight', 1400);
  await wait(2200);

  await smoothScrollToElement('#developers', 1400);
  await wait(2200);

  // Scroll to Footer with 3D Cloak Vault banner
  console.log('[Scene 1] Scrolling to Footer with Cloak Vault banner...');
  await smoothScrollBy(1200, 1600);
  await wait(3000);

  // Scroll back to top
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await wait(2200);

  // ── Scene 2: Enter Live Protocol Console ──────────────────────────────────
  console.log('[Scene 2] Entering Live Protocol Console...');
  const exploreBtn = await page.$('button:has-text("Explore Auctions")');
  if (exploreBtn) {
    await exploreBtn.click();
    await wait(2000);
  }

  // ── Scene 3: Connect Lace Wallet ──────────────────────────────────────────
  console.log('[Scene 3] Connecting Midnight Lace Wallet...');
  const connectBtn = await page.$('button:has-text("Connect Wallet")');
  if (connectBtn) {
    await connectBtn.click();
    await wait(2500);
  }

  // ── Scene 4: Browse Auctions & Select Lot ─────────────────────────────────
  console.log('[Scene 4] Browsing active auctions & entering detail view...');
  await wait(1500);
  const placeBidBtns = await page.$$('button:has-text("Place Sealed Bid")');
  if (placeBidBtns.length > 0) {
    await placeBidBtns[0].click();
    await wait(2000);
  }

  // ── Scene 5: Place Sealed Bid & Execute ZK Proof Pipeline ─────────────────
  console.log('[Scene 5] Submitting a sealed bid...');
  const bidInput = await page.$('input[type="number"]');
  if (bidInput) {
    await bidInput.fill('');
    await bidInput.fill('25000');
    await wait(1000);
  }

  const sealBtn = await page.$('button:has-text("Seal & Submit Bid")');
  if (sealBtn) {
    console.log('[Scene 5] Executing 4-stage ZK proof pipeline (Reading witness -> Hash -> Proving -> Broadcast)...');
    await sealBtn.click();
    // Wait for proof generation to complete
    await wait(5500);
  }

  // Copy commitment hash
  const copyBtn = await page.$('button:has-text("Copy")');
  if (copyBtn) {
    await copyBtn.click();
    await wait(1200);
  }

  // ── Scene 6: Explore Detail Subtabs ───────────────────────────────────────
  console.log('[Scene 6] Exploring subtabs: Committed Bids & On-Chain State...');
  const committedTab = await page.$('button:has-text("Committed Bids")');
  if (committedTab) {
    await committedTab.click();
    await wait(2000);
  }

  const onChainTab = await page.$('button:has-text("On-Chain State")');
  if (onChainTab) {
    await onChainTab.click();
    await wait(2000);
  }

  // ── Scene 7: Settlement & Finalization ────────────────────────────────────
  console.log('[Scene 7] Demonstrating settlement controls: Close Bidding...');
  const closeBtn = await page.$('button:has-text("Close Bidding")');
  if (closeBtn) {
    await closeBtn.click();
    await wait(1500);
  }

  console.log('[Scene 7] Finalizing auction & verifying winner proof...');
  const finalizeBtn = await page.$('button:has-text("Finalize Auction")');
  if (finalizeBtn) {
    await finalizeBtn.click();
    await wait(5000);
  }

  // ── Scene 8: My Bids Portfolio View ───────────────────────────────────────
  console.log('[Scene 8] Navigating to My Bids portfolio...');
  const myBidsTab = await page.$('button:has-text("My Bids")');
  if (myBidsTab) {
    await myBidsTab.click();
    await wait(2500);
  }

  // ── Scene 9: 5-Step Create Auction Wizard ─────────────────────────────────
  console.log('[Scene 9] Stepping through Create Auction Wizard...');
  const createTab = await page.$('button:has-text("Create")');
  if (createTab) {
    await createTab.click();
    await wait(1800);

    const titleInput = await page.$('input[placeholder*="Meridian"]');
    if (titleInput) {
      await titleInput.fill('Sovereign Treasury Vault Lot #9');
      await wait(800);
    }

    const continueBtn = await page.$('button:has-text("Continue")');
    if (continueBtn) {
      await continueBtn.click(); // to step 1
      await wait(1200);
      await continueBtn.click(); // to step 2
      await wait(1200);
      await continueBtn.click(); // to step 3
      await wait(1500);
      await continueBtn.click(); // to step 4
      await wait(1500);
    }

    const deployBtn = await page.$('button:has-text("Deploy Auction Vault")');
    if (deployBtn) {
      console.log('Deploying simulated auction vault...');
      await deployBtn.click();
      await wait(4500);
    }
  }

  // ── Scene 10: Protocol Analytics & Telemetry ──────────────────────────────
  console.log('[Scene 10] Checking Protocol Analytics & Prover Benchmarks...');
  const analyticsTab = await page.$('button:has-text("Analytics")');
  if (analyticsTab) {
    await analyticsTab.click();
    await wait(3000);
  }

  // ── Scene 11: Return to Landing Page ──────────────────────────────────────
  console.log('[Scene 11] Returning to Landing Page...');
  const logoBtn = await page.$('button[aria-label="Go to landing page"]');
  if (logoBtn) {
    await logoBtn.click();
    await wait(2500);
  }

  console.log('Finalizing recording...');
  await page.close();
  await context.close();

  const finalDest = path.resolve('./CloakBid_MVP_Demo.webm');
  if (video) {
    console.log('Saving video to CloakBid_MVP_Demo.webm...');
    await video.saveAs(finalDest);
    const sizeMb = (fs.statSync(finalDest).size / (1024 * 1024)).toFixed(2);
    console.log(`Video saved: ${finalDest} (${sizeMb} MB)`);
  }

  // Also copy to current artifact directory
  const artifactDir = 'C:\\Users\\soumi\\.gemini\antigravity\\brain\\cbc58648-c7e4-4885-82af-6f29e2cbdee6';
  const artifactDest = path.join(artifactDir, 'CloakBid_MVP_Demo.webm');
  try {
    fs.copyFileSync(finalDest, artifactDest);
    console.log(`Copied to artifact directory: ${artifactDest}`);
  } catch (e) {
    console.log('Artifact copy note:', e.message);
  }

  await browser.close();
  console.log('✅ Demo video recording successfully completed!');
  process.exit(0);
}

record().catch((err) => {
  console.error('Recording error:', err);
  process.exit(1);
});
