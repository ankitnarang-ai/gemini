import ChatBubble from "./ChatBubble";
import { FiCopy, FiCheck } from "react-icons/fi";
import { useState } from "react";

export default function ChatWindow({ messages, isTyping, bottomRef }) {
  const [copied, setCopied] = useState(false);

  const handleCopyTyping = () => {
    navigator.clipboard.writeText("Gemini is typing...");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-4 space-y-6">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            message={msg.content}
            timestamp={msg.timestamp}
            image={msg.image}
          />
        ))}

        {messages.length === 0 && !isTyping && (
          <div className="flex justify-center items-center mt-64">
            <div
              className="text-4xl font-semibold text-[#448aff] "
            >
              Hello, Ankit 👋
            </div>
          </div>

        )}


        {/* Gemini is typing */}
        {isTyping && (
          <div className="group flex items-start gap-3">
            {/* Gemini Avatar/Icon space */}
            <div className="w-8 h-8 rounded-full bg-[var(--color-gemini-blue)] flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>

            {/* Message content */}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-[var(--text-secondary)] italic py-2">
                Gemini is typing...
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopyTyping}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition
                  opacity-0 group-hover:opacity-100 cursor-pointer text-xs flex items-center gap-1 mt-1"
              >
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}