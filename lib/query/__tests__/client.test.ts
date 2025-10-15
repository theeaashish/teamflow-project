import { describe, it, expect } from 'vitest';
import { createQueryClient } from '../client';
import { QueryClient } from '@tanstack/react-query';

describe('createQueryClient', () => {
  describe('Query Client Creation', () => {
    it('should create a QueryClient instance', () => {
      const queryClient = createQueryClient();
      
      expect(queryClient).toBeInstanceOf(QueryClient);
    });

    it('should create a new instance each time', () => {
      const client1 = createQueryClient();
      const client2 = createQueryClient();
      
      expect(client1).not.toBe(client2);
    });

    it('should have default options configured', () => {
      const queryClient = createQueryClient();
      
      expect(queryClient.getDefaultOptions()).toBeDefined();
      expect(queryClient.getDefaultOptions().queries).toBeDefined();
    });
  });

  describe('Default Query Options', () => {
    it('should set staleTime to 60 seconds', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions().queries;
      
      expect(options?.staleTime).toBe(60 * 1000);
    });

    it('should have queryKeyHashFn defined', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions().queries;
      
      expect(options?.queryKeyHashFn).toBeDefined();
      expect(typeof options?.queryKeyHashFn).toBe('function');
    });

    it('should generate consistent hash for same query key', () => {
      const queryClient = createQueryClient();
      const hashFn = queryClient.getDefaultOptions().queries?.queryKeyHashFn;
      
      if (hashFn) {
        const key1 = ['test', 'key'];
        const hash1 = hashFn(key1);
        const hash2 = hashFn(key1);
        
        expect(hash1).toBe(hash2);
      }
    });

    it('should generate different hash for different query keys', () => {
      const queryClient = createQueryClient();
      const hashFn = queryClient.getDefaultOptions().queries?.queryKeyHashFn;
      
      if (hashFn) {
        const key1 = ['test', 'key1'];
        const key2 = ['test', 'key2'];
        const hash1 = hashFn(key1);
        const hash2 = hashFn(key2);
        
        expect(hash1).not.toBe(hash2);
      }
    });
  });

  describe('Dehydration Options', () => {
    it('should have dehydrate options configured', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions().dehydrate;
      
      expect(options).toBeDefined();
      expect(options?.shouldDehydrateQuery).toBeDefined();
      expect(options?.serializeData).toBeDefined();
    });

    it('should have serializeData function', () => {
      const queryClient = createQueryClient();
      const serializeFn = queryClient.getDefaultOptions().dehydrate?.serializeData;
      
      expect(typeof serializeFn).toBe('function');
    });

    it('should serialize data with json and meta', () => {
      const queryClient = createQueryClient();
      const serializeFn = queryClient.getDefaultOptions().dehydrate?.serializeData;
      
      if (serializeFn) {
        const data = { test: 'value' };
        const serialized = serializeFn(data);
        
        expect(serialized).toHaveProperty('json');
        expect(serialized).toHaveProperty('meta');
      }
    });
  });

  describe('Hydration Options', () => {
    it('should have hydrate options configured', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions().hydrate;
      
      expect(options).toBeDefined();
      expect(options?.deserializeData).toBeDefined();
    });

    it('should have deserializeData function', () => {
      const queryClient = createQueryClient();
      const deserializeFn = queryClient.getDefaultOptions().hydrate?.deserializeData;
      
      expect(typeof deserializeFn).toBe('function');
    });

    it('should deserialize data correctly', () => {
      const queryClient = createQueryClient();
      const serializeFn = queryClient.getDefaultOptions().dehydrate?.serializeData;
      const deserializeFn = queryClient.getDefaultOptions().hydrate?.deserializeData;
      
      if (serializeFn && deserializeFn) {
        const original = { test: 'value', number: 42 };
        const serialized = serializeFn(original);
        const deserialized = deserializeFn(serialized);
        
        expect(deserialized).toEqual(original);
      }
    });
  });

  describe('Query Operations', () => {
    it('should allow setting query data', () => {
      const queryClient = createQueryClient();
      const key = ['test-key'];
      const data = { value: 'test' };
      
      queryClient.setQueryData(key, data);
      const retrievedData = queryClient.getQueryData(key);
      
      expect(retrievedData).toEqual(data);
    });

    it('should allow getting query state', () => {
      const queryClient = createQueryClient();
      const key = ['test-key'];
      
      queryClient.setQueryData(key, { value: 'test' });
      const state = queryClient.getQueryState(key);
      
      expect(state).toBeDefined();
      expect(state?.data).toEqual({ value: 'test' });
    });

    it('should allow invalidating queries', () => {
      const queryClient = createQueryClient();
      const key = ['test-key'];
      
      queryClient.setQueryData(key, { value: 'test' });
      
      expect(async () => {
        await queryClient.invalidateQueries({ queryKey: key });
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty query keys', () => {
      const queryClient = createQueryClient();
      const emptyKey: string[] = [];
      
      expect(() => {
        queryClient.setQueryData(emptyKey, 'data');
      }).not.toThrow();
    });

    it('should handle complex nested query keys', () => {
      const queryClient = createQueryClient();
      const complexKey = ['level1', { nested: 'value' }, ['array', 'item']];
      
      queryClient.setQueryData(complexKey, 'data');
      const retrieved = queryClient.getQueryData(complexKey);
      
      expect(retrieved).toBe('data');
    });

    it('should handle undefined data', () => {
      const queryClient = createQueryClient();
      const key = ['undefined-key'];
      
      queryClient.setQueryData(key, undefined);
      const retrieved = queryClient.getQueryData(key);
      
      expect(retrieved).toBeUndefined();
    });
  });
});