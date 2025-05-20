import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { supabase } from "../supabase";

export default function Chatbot() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);

  const bottomRef = useRef(null);

  // Scroll to bottom on messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch user session
  useEffect(() => {
    const getSession = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        router.push("/login");
        return;
      }
      if (!sessionData?.session?.user) {
        router.push("/login");
      } else {
        setUser(sessionData.session.user);
      }
    };
    getSession();

    // Optional: listen for auth state changes to handle logout elsewhere
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("chats")
        .select("id, title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching chats:", error);
        return;
      }

      setChats(data);
    };
    fetchChats();
  }, [user]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender, text")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
      setMessages(data || []);
    };
    fetchMessages();
  }, [chatId]);

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    let currentChatId = chatId;

    // Create new chat if none exists
    if (!chatId) {
      const { data: newChat, error } = await supabase
        .from("chats")
        .insert([
          {
            user_id: user.id,
            title: input.slice(0, 20),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating chat:", error);
        return;
      }

      currentChatId = newChat.id;
      setChatId(newChat.id);
      setChats((prev) => [newChat, ...prev]);
    }

    const userMessage = { sender: "user", text: input };
    const thinkingMessage = { sender: "bot", text: "Thinking..." };

    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await axios.post("/api/chat", {
        prompt: input,
        user_id: user.id,
        chat_id: currentChatId,
      });

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          sender: "bot",
          text: res.data.response || "No response from Gemini.",
        };
        return newMessages;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          sender: "bot",
          text: "Error contacting Gemini API.",
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col">
      <Header username={user.email} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          chats={chats}
          onSelectChat={(id) => setChatId(id)}
          onStartNewChat={() => {
            setChatId(null);
            setMessages([]);
            setInput("");
          }}
        />
        <div className="flex flex-col flex-1 bg-gray-100">
          <div className="flex-1 overflow-y-auto p-6">
            {messages?.map((msg, idx) => (
              <ChatMessage key={msg.id ?? idx} sender={msg.sender} text={msg.text} />
            ))}
            <div ref={bottomRef} />
          </div>
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSend={handleSend}
            disabled={loading || !input.trim()}
          />
        </div>
      </div>
    </div>
  );
}
