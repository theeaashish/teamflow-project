import { describe, it, expect } from 'vitest';
import { getAvatar } from '../get-avatar';

describe('getAvatar', () => {
  describe('Happy Path', () => {
    it('should return user picture when provided', () => {
      const userPicture = 'https://example.com/avatar.jpg';
      const userEmail = 'test@example.com';
      
      const result = getAvatar(userPicture, userEmail);
      
      expect(result).toBe(userPicture);
    });

    it('should return vercel avatar URL when picture is null', () => {
      const userEmail = 'user@example.com';
      
      const result = getAvatar(null, userEmail);
      
      expect(result).toBe('https://avatar.vercel.sh/user@example.com');
    });

    it('should handle email with special characters', () => {
      const userEmail = 'user+test@example.com';
      
      const result = getAvatar(null, userEmail);
      
      expect(result).toBe('https://avatar.vercel.sh/user+test@example.com');
    });

    it('should handle email with dots', () => {
      const userEmail = 'first.last@example.com';
      
      const result = getAvatar(null, userEmail);
      
      expect(result).toBe('https://avatar.vercel.sh/first.last@example.com');
    });
  });

  describe('Edge Cases', () => {
    it('should return vercel avatar when picture is empty string', () => {
      const userEmail = 'test@example.com';
      
      const result = getAvatar('', userEmail);
      
      expect(result).toBe('https://avatar.vercel.sh/test@example.com');
    });

    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      
      const result = getAvatar(null, longEmail);
      
      expect(result).toBe(`https://avatar.vercel.sh/${longEmail}`);
    });

    it('should handle email with uppercase letters', () => {
      const userEmail = 'User@Example.COM';
      
      const result = getAvatar(null, userEmail);
      
      expect(result).toBe('https://avatar.vercel.sh/User@Example.COM');
    });

    it('should handle picture URL with query parameters', () => {
      const pictureUrl = 'https://example.com/avatar.jpg?size=200&format=webp';
      const userEmail = 'test@example.com';
      
      const result = getAvatar(pictureUrl, userEmail);
      
      expect(result).toBe(pictureUrl);
    });

    it('should handle relative URLs in picture', () => {
      const pictureUrl = '/static/avatars/default.png';
      const userEmail = 'test@example.com';
      
      const result = getAvatar(pictureUrl, userEmail);
      
      expect(result).toBe(pictureUrl);
    });
  });

  describe('Type Safety', () => {
    it('should work with null picture and valid email', () => {
      const result = getAvatar(null, 'valid@email.com');
      
      expect(typeof result).toBe('string');
      expect(result).toContain('https://avatar.vercel.sh/');
    });

    it('should work with string picture and valid email', () => {
      const result = getAvatar('https://pic.com/img.jpg', 'test@test.com');
      
      expect(typeof result).toBe('string');
      expect(result).toBe('https://pic.com/img.jpg');
    });
  });

  describe('Security Considerations', () => {
    it('should handle email with potential XSS characters', () => {
      const userEmail = 'test<script>@example.com';
      
      const result = getAvatar(null, userEmail);
      
      expect(result).toBe('https://avatar.vercel.sh/test<script>@example.com');
    });

    it('should handle malicious picture URLs', () => {
      const maliciousUrl = 'javascript:alert("xss")';
      const userEmail = 'test@example.com';
      
      const result = getAvatar(maliciousUrl, userEmail);
      
      expect(result).toBe(maliciousUrl);
    });
  });
});