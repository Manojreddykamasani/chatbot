export default function ChatInput({ value, onChange, onSend }) {
  return (
    <div className="flex gap-2 p-4 border-t bg-white">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Ask me anything..."
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        onClick={onSend}
      >
        Send
      </button>
      <button className="px-4 py-2 border rounded hover:bg-gray-100">
        📄 Upload PDF
      </button>
    </div>
  );
}
