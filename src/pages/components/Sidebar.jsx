export default function Sidebar({ chats, onSelectChat, onStartNewChat }) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold border-b border-gray-700 pb-2">Chat History</h2>
        <button
          className="text-white text-lg bg-blue-600 px-2 rounded hover:bg-blue-500"
          onClick={onStartNewChat}
          title="Start new chat"
        >
          +
        </button>
      </div>

      <ul className="space-y-2">
        {chats.length === 0 && (
          <li className="text-gray-400 italic">No chats yet</li>
        )}
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer truncate"
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
