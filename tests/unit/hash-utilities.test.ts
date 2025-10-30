import { describe, it, expect } from 'vitest';
import { hashMD5, hashInt } from '../../src';

describe('Hash Utilities', () => {
  describe('hashMD5', () => {
    it('should generate MD5 hash for simple string', () => {
      const result = hashMD5('hello');
      expect(result).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    it('should generate MD5 hash for empty string', () => {
      const result = hashMD5('');
      expect(result).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    it('should generate consistent hash for same input', () => {
      const input = 'test-string-123';
      const hash1 = hashMD5(input);
      const hash2 = hashMD5(input);
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = hashMD5('input1');
      const hash2 = hashMD5('input2');
      expect(hash1).not.toBe(hash2);
    });

    it('should handle unicode characters', () => {
      const result = hashMD5('你好世界'); // Chinese characters
      expect(result).toMatch(/^[a-f0-9]{32}$/);
    });

    it('should handle special characters', () => {
      const result = hashMD5('!@#$%^&*()_+-=[]{}|;:,.<>?');
      expect(result).toMatch(/^[a-f0-9]{32}$/);
    });

    it('should return 32-character lowercase hex string', () => {
      const result = hashMD5('any string');
      expect(result).toMatch(/^[a-f0-9]{32}$/);
      expect(result.length).toBe(32);
    });
  });

  describe('hashInt', () => {
    it('should generate integer hash for simple string', () => {
      const result = hashInt('hello');
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should return 0 for empty string', () => {
      const result = hashInt('');
      expect(result).toBe(0);
    });

    it('should generate consistent hash for same input', () => {
      const input = 'test-string-123';
      const hash1 = hashInt(input);
      const hash2 = hashInt(input);
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = hashInt('input1');
      const hash2 = hashInt('input2');
      expect(hash1).not.toBe(hash2);
    });

    it('should handle unicode characters', () => {
      const result = hashInt('你好世界');
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should produce 32-bit signed integer', () => {
      const result = hashInt('any string');
      expect(result).toBeGreaterThanOrEqual(-(2 ** 31));
      expect(result).toBeLessThan(2 ** 31);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const result = hashInt(longString);
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('Hash Consistency', () => {
    it('should maintain same MD5 hash across multiple calls', () => {
      const input = 'consistency-test';
      const hashes = Array.from({ length: 100 }, () => hashMD5(input));
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(1);
    });

    it('should maintain same integer hash across multiple calls', () => {
      const input = 'consistency-test';
      const hashes = Array.from({ length: 100 }, () => hashInt(input));
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(1);
    });
  });
});
