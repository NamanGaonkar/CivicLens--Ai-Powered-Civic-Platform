import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; text: string }[]>([
    {
      id: "1",
      role: "assistant",
      text: "Hi! 👋 I'm the CivicLens AI Assistant. I can help you understand civic issues, analyze reports, and provide insights. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on civic data, I can help you with that.",
        "I'm analyzing the information you provided. Here's what I found...",
        "Thanks for asking! Let me help you with insights on this civic issue.",
        "I understand. This is an important matter for our community.",
        "Based on similar civic reports, here's what typically helps..."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        text: randomResponse
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        // On small screens keep the chatbot button above the report FAB by shifting it up;
        // on md+ screens restore previous position.
        className="fixed right-4 bottom-20 md:right-6 md:bottom-6 w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-blue-900 text-white shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={
              `fixed z-50 bg-white shadow-2xl border-2 border-red-200 flex flex-col ` +
              (typeof window !== "undefined" && window.innerWidth < 640
                ? "inset-x-0 bottom-0 top-0 rounded-t-2xl h-full"
                : "bottom-24 right-6 w-96 h-[600px] rounded-2xl")
            }
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-600 to-blue-900 text-white p-6 rounded-t-2xl">
              <h3 className="text-lg font-bold">CivicLens AI Assistant</h3>
              <p className="text-sm text-red-100">Powered by AI insights</p>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
                className="absolute right-3 top-3 bg-black/25 hover:bg-black/40 p-1 rounded-full text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-red-600 to-blue-900 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t-2 border-red-200 p-4 bg-slate-50 sm:rounded-b-2xl rounded-b-none sticky bottom-0">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none text-slate-900 placeholder-slate-500"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-blue-900 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
