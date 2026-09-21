// ============================================================
// CloakBid — Utility helpers
// ============================================================

/**
 * Simulates SHA-256-like commitment: hash(amount || salt)
 * In production this is done inside the Compact ZK circuit.
 */
export function computeCommitmentHash(amount: number, salt: string): string {
  // Deterministic mock hash for UI demonstration
  const combined = `${amount}:${salt}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  // Generate realistic-looking 64-char hex string
  const base = Math.abs(hash).toString(16).padStart(8, '0');
  const segments = [base, base.split('').reverse().join(''), base.repeat(2).slice(0, 16), base];
  return segments.join('').slice(0, 64).padEnd(64, '0');
}

/**
 * Generate a random 32-byte salt as hex
 */
export function generateSalt(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Truncate a hash for display: 0x1234...abcd
 */
export function truncateHash(hash: string, front = 6, back = 4): string {
  if (!hash || hash.length < front + back) return hash;
  return `0x${hash.slice(0, front)}...${hash.slice(-back)}`;
}

/**
 * Format DUST amount with commas
 */
export function formatDust(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' tDUST';
}

/**
 * Format timestamp to readable time ago
 */
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

/**
 * Generate a random realistic-looking tx hash
 */
export function generateTxHash(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Simulate ZK proof generation delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
