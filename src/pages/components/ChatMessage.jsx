import ReactMarkdown from "react-markdown";

export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-md px-4 py-2 rounded-lg shadow-md ${
          isUser
            ? "bg-indigo-500 text-white"
            : "bg-white text-black border border-gray-300"
        }`}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
}
