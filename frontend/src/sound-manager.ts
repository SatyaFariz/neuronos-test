import { SoundType } from './types';
import NotifySound from './assets/notify.webm';
import { getStorageData } from './helpers';

export class SoundManager {
  private audioElements: { [key in SoundType]?: HTMLAudioElement } = {};
  private isMuted: boolean = false;

  constructor() {
    this.audioElements.notify = new Audio(chrome.runtime.getURL(NotifySound));

    getStorageData<boolean>('mute').then((isMuted) => {
      if (isMuted) {
        this.mute();
      }
    });

    // Listen for changes in Chrome storage
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.mute) {
        if (changes.mute.newValue === true) {
          this.mute();
        } else {
          this.unmute();
        }
      }
    });
  }

  // Method to play a sound
  public playSound(sound: SoundType): void {
    const audio = this.audioElements[sound];
    if (audio && !this.isMuted) {
      audio.currentTime = 0; // Restart the sound from the beginning
      audio.play();
    }
  }

  // Mute all sounds
  public mute(): void {
    this.isMuted = true;
    this.pauseAll();
  }

  // Unmute all sounds
  public unmute(): void {
    this.isMuted = false;
  }

  // Helper to pause all sounds when muted
  private pauseAll(): void {
    Object.values(this.audioElements).forEach((audio) => {
      if (audio) {
        audio.pause();
      }
    });
  }
}

const soundManager = new SoundManager();

export default soundManager;