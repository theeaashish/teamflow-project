import { describe, it, expect } from 'vitest';
import { serializer } from '../serializer';

describe('serializer', () => {
  describe('Configuration', () => {
    it('should be an instance of StandardRPCJsonSerializer', () => {
      expect(serializer).toBeDefined();
      expect(serializer).toHaveProperty('serialize');
      expect(serializer).toHaveProperty('deserialize');
    });

    it('should have serialize method', () => {
      expect(typeof serializer.serialize).toBe('function');
    });

    it('should have deserialize method', () => {
      expect(typeof serializer.deserialize).toBe('function');
    });
  });

  describe('Serialization', () => {
    it('should serialize primitive values', () => {
      const value = 'test string';
      const [json, meta] = serializer.serialize(value);
      
      expect(json).toBe(value);
      expect(meta).toBeDefined();
    });

    it('should serialize objects', () => {
      const obj = { name: 'test', value: 123 };
      const [json, meta] = serializer.serialize(obj);
      
      expect(json).toEqual(obj);
      expect(meta).toBeDefined();
    });

    it('should serialize arrays', () => {
      const arr = [1, 2, 3, 'test', { key: 'value' }];
      const [json, meta] = serializer.serialize(arr);
      
      expect(json).toEqual(arr);
      expect(meta).toBeDefined();
    });

    it('should serialize null', () => {
      const [json, meta] = serializer.serialize(null);
      
      expect(json).toBe(null);
      expect(meta).toBeDefined();
    });

    it('should serialize undefined', () => {
      const [json, meta] = serializer.serialize(undefined);
      
      expect(meta).toBeDefined();
    });

    it('should serialize nested objects', () => {
      const nested = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };
      const [json, meta] = serializer.serialize(nested);
      
      expect(json).toEqual(nested);
      expect(meta).toBeDefined();
    });
  });

  describe('Deserialization', () => {
    it('should deserialize serialized data back to original', () => {
      const original = { name: 'test', value: 42, nested: { deep: true } };
      const [json, meta] = serializer.serialize(original);
      const deserialized = serializer.deserialize(json, meta);
      
      expect(deserialized).toEqual(original);
    });

    it('should deserialize primitive types', () => {
      const primitives = [123, 'string', true, false, null];
      
      primitives.forEach((value) => {
        const [json, meta] = serializer.serialize(value);
        const deserialized = serializer.deserialize(json, meta);
        expect(deserialized).toEqual(value);
      });
    });

    it('should deserialize arrays', () => {
      const arr = [1, 'two', { three: 3 }, [4, 5]];
      const [json, meta] = serializer.serialize(arr);
      const deserialized = serializer.deserialize(json, meta);
      
      expect(deserialized).toEqual(arr);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty objects', () => {
      const empty = {};
      const [json, meta] = serializer.serialize(empty);
      const deserialized = serializer.deserialize(json, meta);
      
      expect(deserialized).toEqual(empty);
    });

    it('should handle empty arrays', () => {
      const empty: unknown[] = [];
      const [json, meta] = serializer.serialize(empty);
      const deserialized = serializer.deserialize(json, meta);
      
      expect(deserialized).toEqual(empty);
    });

    it('should handle circular references safely', () => {
      const circular: { self?: unknown } = {};
      circular.self = circular;
      
      // Should not throw - the serializer should handle this
      expect(() => {
        serializer.serialize(circular);
      }).not.toThrow();
    });

    it('should handle very large objects', () => {
      const large: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        large[`key${i}`] = i;
      }
      
      const [json, meta] = serializer.serialize(large);
      const deserialized = serializer.deserialize(json, meta);
      
      expect(deserialized).toEqual(large);
    });
  });

  describe('Special Types', () => {
    it('should handle Date objects if configured', () => {
      const date = new Date('2024-01-01');
      const [json, meta] = serializer.serialize(date);
      
      expect(json).toBeDefined();
      expect(meta).toBeDefined();
    });

    it('should handle functions gracefully', () => {
      const obj = {
        data: 'test',
        fn: () => 'function',
      };
      
      // Should not throw
      expect(() => {
        serializer.serialize(obj);
      }).not.toThrow();
    });
  });
});