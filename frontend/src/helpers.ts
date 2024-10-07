import { BADGE_TEXT_BG_COLOR, BADGE_TEXT_COLOR } from './constants';

export const getStorageData = <T>(key: string): Promise<T> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key]);
    });
  });
};

export const setStorageData = <T>(key: string, value: T): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
};

export const formatNotificationBadgeText = (unreadCount: number) => {
  if (unreadCount > 99) {
    return '99+';
  }

  return String(unreadCount);
};

export const setNotificationBadge = (unreadCount: number) => {
  if (unreadCount === 0) {
    // set empty text and transparent bg
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setBadgeBackgroundColor({ color: '#00000000' });
  } else {
    // Set the badge text to the number of unread messages
    chrome.action.setBadgeText({ text: formatNotificationBadgeText(unreadCount) });

    // Set the badge text color
    chrome.action.setBadgeTextColor({ color: BADGE_TEXT_COLOR });

    // Optionally, set the badge color
    chrome.action.setBadgeBackgroundColor({ color: BADGE_TEXT_BG_COLOR });
  }
};