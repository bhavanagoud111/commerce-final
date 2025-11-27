import { useState, useEffect, useRef, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, ShieldCheck } from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
};

const initialMessage: Message = {
  id: 0,
  sender: "bot",
  text: "Hi there! 👋 I'm Commerce Assist. Ask me about transfers, card management, or security and I'll guide you.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const quickReplies = [
  { id: "transfers", label: "Transfers", reply: "How can I transfer money between accounts?" },
  { id: "card", label: "Card help", reply: "I need support with my debit or credit card." },
  { id: "security", label: "Security", reply: "Show me how to secure my account." },
];

const BANKING_SYSTEM_INSTRUCTION = `You are Commerce Assist, a helpful banking assistant for Commerce Bank's digital banking application. Your role is to assist customers with banking-related queries only.

IMPORTANT RULES:
1. ONLY answer questions related to banking services, account management, transfers, payments, cards, security, loans, mortgages, investments, and other financial services offered by Commerce Bank.
2. If a user asks about non-banking topics (weather, general knowledge, jokes, etc.), politely redirect them: "I'm here to help with banking questions. How can I assist you with your Commerce Bank account, transfers, payments, or other banking services?"
3. Be professional, friendly, and concise.
4. Guide users to specific features in the Commerce Bank application when relevant (e.g., "Go to Payments → Transfer Money").
5. Never provide financial advice or make recommendations about investments.
6. For sensitive account issues, suggest contacting customer support.

Available banking services: account management, money transfers, bill payments, card management, security settings, loan applications, mortgage services, investment services, and account statements.`;

const getBotReply = async (input: string, conversationHistory: Array<{sender: 'user' | 'bot', text: string}>): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return "I'm currently unavailable. Please try again later or contact support.";
  }

  try {
    const messages = [
      { role: "system", content: BANKING_SYSTEM_INSTRUCTION },
      ...conversationHistory
        .filter((msg) => msg.sender !== 'bot' || !msg.text.includes("Hi there! 👋"))
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      { role: "user", content: input },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm sorry, I didn't understand that. Could you rephrase your banking question?";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "I'm experiencing technical difficulties. Please try again or contact support for immediate assistance.";
  }
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);

    // ensure we scroll when opening
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const [isLoading, setIsLoading] = useState(false);

  const dispatchMessage = async (text: string) => {
    if (!text) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));
      
      const botReplyText = await getBotReply(text, conversationHistory);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "I'm sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    dispatchMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <Card className="w-[320px] shadow-2xl shadow-emerald-500/20 border-emerald-50">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">Commerce Assist</CardTitle>
              <p className="text-xs text-slate-500">Ask me about digital banking anytime.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800" onClick={handleToggle}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-xs text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
              Banking-grade encryption keeps this conversation secure.
            </div>

            <div className="h-48 overflow-y-auto space-y-3 pr-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        : "bg-white text-slate-700 border border-slate-100"
                    }`}
                  >
                    <p>{message.text}</p>
                    <span
                      className={`mt-1 block text-[10px] ${
                        message.sender === "user" ? "text-emerald-100" : "text-slate-400"
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm bg-white text-slate-700 border border-slate-100 flex items-center gap-2">
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <Badge
                  key={reply.id}
                  variant="outline"
                  className="cursor-pointer border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                  onClick={() => dispatchMessage(reply.reply)}
                >
                  {reply.label}
                </Badge>
              ))}
            </div>

            <form className="flex items-center gap-2" onSubmit={handleFormSubmit}>
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleToggle}
        size="icon"
        className="relative h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {messages.length > 1 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-600 shadow">
            {messages.length - 1}
          </span>
        )}
      </Button>
    </div>
  );
};

export default ChatWidget;

