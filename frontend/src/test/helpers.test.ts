import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStorageData, setStorageData, formatNotificationBadgeText, setNotificationBadge } from '../helpers';
import { BADGE_TEXT_BG_COLOR, BADGE_TEXT_COLOR } from '../constants';

// Mock the chrome API
const mockChrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  action: {
    setBadgeText: vi.fn(),
    setBadgeTextColor: vi.fn(),
    setBadgeBackgroundColor: vi.fn(),
  },
};

vi.stubGlobal('chrome', mockChrome);

describe('Helper Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStorageData', () => {
    it('retrieves data from chrome storage', async () => {
      const mockData = { testKey: 'testValue' };
      mockChrome.storage.local.get.mockImplementation((key, callback) => {
        callback(mockData);
      });

      const result = await getStorageData('testKey');
      expect(result).toBe('testValue');
      expect(mockChrome.storage.local.get).toHaveBeenCalledWith('testKey', expect.any(Function));
    });
  });

  describe('setStorageData', () => {
    it('sets data in chrome storage', async () => {
      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      await setStorageData('testKey', 'testValue');
      expect(mockChrome.storage.local.set).toHaveBeenCalledWith({ testKey: 'testValue' }, expect.any(Function));
    });
  });

  describe('formatNotificationBadgeText', () => {
    it('returns the number as a string for counts up to 99', () => {
      expect(formatNotificationBadgeText(0)).toBe('0');
      expect(formatNotificationBadgeText(1)).toBe('1');
      expect(formatNotificationBadgeText(99)).toBe('99');
    });

    it('returns "99+" for counts over 99', () => {
      expect(formatNotificationBadgeText(100)).toBe('99+');
      expect(formatNotificationBadgeText(1000)).toBe('99+');
    });
  });

  describe('setNotificationBadge', () => {
    it('sets empty badge for zero unread count', () => {
      setNotificationBadge(0);
      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({ text: '' });
      expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: '#00000000' });
    });

    it('sets badge text and colors for non-zero unread count', () => {
      setNotificationBadge(5);
      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({ text: '5' });
      expect(mockChrome.action.setBadgeTextColor).toHaveBeenCalledWith({ color: BADGE_TEXT_COLOR });
      expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: BADGE_TEXT_BG_COLOR });
    });

    it('sets "99+" for unread count over 99', () => {
      setNotificationBadge(100);
      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({ text: '99+' });
    });
  });
});