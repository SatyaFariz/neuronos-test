import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import soundManager from './sound-manager';
import './index.css';

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'playNotificationSound') {
    soundManager.playSound('notify');
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
