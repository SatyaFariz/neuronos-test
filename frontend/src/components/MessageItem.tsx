import { Message } from '../types';

const classname = {
  high: 'bg-error',
  medium: 'bg-info',
  low: 'bg-success',
};

const MessageItem = (props: { msg: Message, markAsRead: (id: string) => void }) => {
  const { msg, markAsRead } = props;

  return (
    <li key={msg.id} className="py-2 px-4 flex justify-between items-start">
      <div className="flex gap-4 w-[280px]">
        <div className={`h-[10px] mt-[6px] aspect-square rounded-full ${classname[msg.priority]}`}/>
        <div className="flex flex-col gap-[2px]">
          <p className="text-sm">{msg.content}</p>
          <p className="text-xs">{new Date(msg.timestamp).toLocaleString()}</p>
        </div>
      </div>
      {!msg.read && (
        <button
          onClick={() => markAsRead(msg.id)}
          className="text-blue-500 text-xs"
        >
          Mark as read
        </button>
      )}
    </li>
  );
};

export default MessageItem;