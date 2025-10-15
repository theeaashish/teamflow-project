import { describe, it, expect } from 'vitest';
import { workspaceSchema, WorkspaceSchemaType } from '../workspace';
import { z } from 'zod';

describe('workspaceSchema', () => {
  describe('Valid Inputs', () => {
    it('should validate correct workspace name', () => {
      const validData = { name: 'My Workspace' };
      
      const result = workspaceSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('My Workspace');
      }
    });

    it('should accept minimum length name (2 characters)', () => {
      const validData = { name: 'AB' };
      
      const result = workspaceSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should accept maximum length name (50 characters)', () => {
      const validData = { name: 'A'.repeat(50) };
      
      const result = workspaceSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should accept names with spaces', () => {
      const validData = { name: 'Team Flow Workspace' };
      
      const result = workspaceSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should accept names with numbers', () => {
      const validData = { name: 'Workspace 123' };
      
      const result = workspaceSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should accept names with special characters', () => {
      const validData = { name: 'My-Workspace_2024\!' };
      
      const result = workspaceSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Inputs', () => {
    it('should reject name shorter than 2 characters', () => {
      const invalidData = { name: 'A' };
      
      const result = workspaceSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (\!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Name must be at least 2 characters'
        );
      }
    });

    it('should reject name longer than 50 characters', () => {
      const invalidData = { name: 'A'.repeat(51) };
      
      const result = workspaceSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (\!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Name must be less than 50 characters'
        );
      }
    });

    it('should reject empty string', () => {
      const invalidData = { name: '' };
      
      const result = workspaceSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (\!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Name must be at least 2 characters'
        );
      }
    });

    it('should reject non-string values', () => {
      const invalidData = { name: 123 };
      
      const result = workspaceSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should reject null', () => {
      const invalidData = { name: null };
      
      const result = workspaceSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should reject undefined', () => {
      const invalidData = { name: undefined };
      
      const result = workspaceSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should reject missing name field', () => {
      const invalidData = {};
      
      const result = workspaceSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle name with only spaces correctly', () => {
      const data = { name: '  ' };
      
      const result = workspaceSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });

    it('should handle Unicode characters', () => {
      const data = { name: '工作空间 😊' };
      
      const result = workspaceSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });

    it('should handle emojis in name', () => {
      const data = { name: '🚀 Rocket Team' };
      
      const result = workspaceSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });

    it('should handle exactly 51 characters (boundary test)', () => {
      const data = { name: 'A'.repeat(51) };
      
      const result = workspaceSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Type Inference', () => {
    it('should infer correct TypeScript type', () => {
      const data: WorkspaceSchemaType = { name: 'Test' };
      
      expect(data.name).toBe('Test');
    });

    it('should be compatible with Zod infer', () => {
      type InferredType = z.infer<typeof workspaceSchema>;
      const data: InferredType = { name: 'Test Workspace' };
      
      expect(data.name).toBeDefined();
    });
  });

  describe('Schema Properties', () => {
    it('should have name field defined', () => {
      const shape = workspaceSchema.shape;
      
      expect(shape.name).toBeDefined();
    });

    it('should be a Zod object schema', () => {
      expect(workspaceSchema).toBeInstanceOf(z.ZodObject);
    });
  });
});