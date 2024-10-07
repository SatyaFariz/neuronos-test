import { useEffect, useState } from 'react';
import MessageList from './components/MessageList';
import { IoSettingsOutline } from 'react-icons/io5';
import Settings from './components/Settings';

function App() {
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'popup' });
    return () => {
      port.disconnect();
    };
  }, []);

  return (
    <div className="w-[400px] relative">
      <div className="shadow-sm sticky top-0 bg-white">
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <p className="text-lg text-white font-bold">Messages</p>
          <IoSettingsOutline
            className="text-white cursor-pointer"
            size={18}
            onClick={() => setOpenSettings(true)}
          />
        </div>
        <div className="flex gap-3 items-center py-[7px] px-4">
          <p className="font-[600]">Priority:</p>
          <div className="badge badge-sm text-white badge-error">high</div>
          <div className="badge badge-sm text-white badge-info">medium</div>
          <div className="badge badge-sm text-white badge-success">low</div>
        </div>
      </div>
      <MessageList/>

      {openSettings &&
      <Settings close={() => setOpenSettings(false)}/>
      }
    </div>
  );
}

export default App;
