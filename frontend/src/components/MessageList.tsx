import { useEffect, useState } from 'react';
import { getStorageData, setNotificationBadge, setStorageData } from '../helpers';
import { Message, NotificationState } from '../types';
import MessageItem from './MessageItem';
import { httpPatch } from '../http';

function MessageList() {
  const [state, setState] = useState<NotificationState>({
    messages: [],
    isLoading: true,
    error: null,
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await httpPatch(`/messages/${id}`, { read: true });

      const updatedMessages = state.messages.map((msg) =>
        msg.id === id ? { ...msg, read: true } : msg,
      );
      await setStorageData('messages', updatedMessages);
    } catch {
      // do sth with the error
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getStorageData<Message[]>('messages');
        const messages = data || [];
        const unreadCount = messages.filter((message: Message) => !message.read).length;
        setNotificationBadge(unreadCount);
        setState({ messages: messages, isLoading: false, error: null });
      } catch {
        setState({ messages: [], isLoading: false, error: 'Failed to load messages' });
      }
    };

    fetchMessages();

    // Listen for changes in Chrome storage
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.messages) {
        const unreadCount = changes.messages.newValue.filter((message: Message) => !message.read).length;

        setNotificationBadge(unreadCount);

        setState((prevState) => ({
          ...prevState,
          messages: changes.messages.newValue,
        }));

        window.scrollTo(0, 0);
      }
    });
  }, []);

  if (state.isLoading) {
    return (
      <div className="flex justify-center p-6">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex justify-center p-6">
        <p className="text-center">Error: {state.error}</p>
      </div>
    );
  }

  if (state.messages.length === 0) {
    return (
      <div className="flex justify-center p-6">
        <p className="text-center">No messages</p>
      </div>
    );
  } else {
    return (
      <ul>
        {state.messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} markAsRead={handleMarkAsRead}/>
        ))}
      </ul>
    );
  }
}

export default MessageList;
