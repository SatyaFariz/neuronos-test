import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { getStorageData, setStorageData } from '../helpers';

function Settings(props: { close: () => void }) {
  const [mute, setMute] = useState(false);

  const toggleMute = () => {
    setStorageData('mute', !mute);
  };

  useEffect(() => {
    const initMute = async () => {
      const mute = await getStorageData<boolean>('mute');
      setMute(mute || false);
    };

    initMute();

    // Listen for changes in Chrome storage
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.mute) {
        setMute(changes.mute.newValue);
      }
    });
  }, []);

  return (
    <div className="inset-0 absolute bg-white">
      <div className="shadow-sm sticky top-0 bg-white">
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <p className="text-lg text-white font-bold">Settings</p>
          <IoClose
            className="text-white cursor-pointer"
            size={18}
            onClick={props.close}
          />
        </div>
      </div>

      <ul>
        <li className="p-4 flex justify-between items-center">
          <p className="text-sm">Mute</p>
          <input type="checkbox" className="toggle toggle-success" checked={mute} onChange={toggleMute}/>
        </li>
      </ul>
    </div>
  );
}

export default Settings;
