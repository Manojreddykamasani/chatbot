import { GoogleGenAI } from "@google/genai";
import { supabase } from "../../supabase"; // Adjust path as needed

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ parts: [{ text: prompt }] }],
  });
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  return text;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { prompt, chat_id, user_id } = req.body;
  if (!prompt || !chat_id || !user_id) return res.status(400).json({ error: "Missing data" });

  try {
    const botReply = await main(prompt);

    await supabase.from("messages").insert([
      { chat_id, sender: "user", text: prompt },
      { chat_id, sender: "bot", text: botReply },
    ]);

    res.status(200).json({ response: botReply });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Gemini API error" });
  }
}
