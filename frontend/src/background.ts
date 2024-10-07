import { httpGet } from './http';
import { Message } from './types';
import { setNotificationBadge } from './helpers';

let isPopupOpen = false;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup') {
    isPopupOpen = true;
    port.onDisconnect.addListener(() => {
      isPopupOpen = false;
    });
  }
});

chrome.alarms.create('checkMessages', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkMessages') {
    chrome.storage.local.get('messages', async (result) => {
      const messages: Message[] = result.messages || [];
      const endpoint = '/messages';

      try {
        const newMessages: Message[] =
          await httpGet(messages.length === 0 ? endpoint : `${endpoint}?incrementId_gt=${messages[0].incrementId}`);

        if (isPopupOpen && newMessages.find((message) => message.priority === 'high')) {
          chrome.runtime.sendMessage({ action: 'playNotificationSound' });
        }

        const allMessages = [...newMessages, ...messages];

        const unreadCount = allMessages.filter((message) => !message.read).length;

        setNotificationBadge(unreadCount);

        chrome.storage.local.set({ messages: allMessages });
      } catch {
        // do sth with the error
      }
    });
  }
});