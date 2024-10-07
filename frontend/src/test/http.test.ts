import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { httpGet, httpPatch } from '../http'; // assuming the file is named httpUtils.ts

// Mock the import.meta.env
vi.mock('import.meta', () => ({
  env: {
    VITE_API_URL: 'http://localhost:5000',
  },
}));

describe('HTTP Utility Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks();
  });

  describe('httpGet', () => {
    it('should make a GET request and return data on success', async () => {
      const mockData = [
        {
          id: 'e480d50a-611d-48db-b284-da0692594c70',
          incrementId: 155,
          content: 'Tenax thesaurus vinculum temporibus comprehendo dolores tego.',
          priority: 'medium',
          timestamp: '2024-10-06T22:19:46.385Z',
          read: false,
        },
      ];
      vi.spyOn(window, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const result = await httpGet('/messages');
      expect(result).toEqual(mockData);
      expect(window.fetch).toHaveBeenCalledWith('http://localhost:5000/messages');
    });

    it('should throw an error when the response is not ok', async () => {
      vi.spyOn(window, 'fetch').mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(httpGet('/messages')).rejects.toThrow('Network response was not ok Not Found');
    });
  });

  describe('httpPatch', () => {
    it('should make a PATCH request with the correct headers and body', async () => {
      const mockData = [
        {
          id: '1',
          incrementId: 155,
          content: 'Tenax thesaurus vinculum temporibus comprehendo dolores tego.',
          priority: 'medium',
          timestamp: '2024-10-06T22:19:46.385Z',
          read: false,
        },
      ];
      vi.spyOn(window, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const body = { read: true };
      const result = await httpPatch('/messages/1', body);

      expect(result).toEqual(mockData);
      expect(window.fetch).toHaveBeenCalledWith('http://localhost:5000/messages/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    });

    it('should throw an error when the response is not ok', async () => {
      vi.spyOn(window, 'fetch').mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(httpPatch('/messages/1', { read: true })).rejects.toThrow('Network response was not ok Internal Server Error');
    });
  });
});