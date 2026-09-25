import { computeCommitmentHash, generateSalt, truncateHash, formatDust } from './crypto';

describe('CloakBid Cryptographic Utilities', () => {
  it('generates a 64-character hex salt', () => {
    const salt = generateSalt();
    expect(salt).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(salt)).toBe(true);
  });

  it('computes deterministic commitment hash for given amount and salt', () => {
    const salt = 'a'.repeat(64);
    const hash1 = computeCommitmentHash(5000, salt);
    const hash2 = computeCommitmentHash(5000, salt);
    const hash3 = computeCommitmentHash(5001, salt);

    expect(hash1).toHaveLength(64);
    expect(hash1).toEqual(hash2);
    expect(hash1).not.toEqual(hash3);
  });

  it('truncates hashes properly for display', () => {
    const hash = '51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15';
    const truncated = truncateHash(hash, 6, 4);
    expect(truncated).toBe('0x51d23a...8b15');
  });

  it('formats tDUST currency values cleanly', () => {
    expect(formatDust(50000)).toBe('50,000 tDUST');
    expect(formatDust(1234)).toBe('1,234 tDUST');
  });
});
