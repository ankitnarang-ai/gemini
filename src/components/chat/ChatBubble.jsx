// ✅ ChatBubble (Mobile Responsive)
import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function ChatBubble({ role, message, image, timestamp }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isTooLong = message && message.length > 500;

  const handleCopy = () => {
    if (message) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      className={`group px-3 py-2 w-full flex flex-col sm:px-4 md:px-6 ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`relative max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[70%] px-3 py-2 sm:px-4 md:py-3 rounded-lg text-sm sm:text-base shadow-sm ${
          isUser
            ? "bg-[var(--chat-user-bg)] text-[var(--text-primary)]"
            : "bg-transparent text-[var(--text-primary)]"
        }`}
      >
        {image && (
          <img
            src={image}
            alt="uploaded"
            className="rounded mb-2 w-full max-w-[200px] sm:max-w-xs md:max-w-sm max-h-32 sm:max-h-40 md:max-h-48 object-cover"
          />
        )}

        {message && (
          <div
            className={`whitespace-pre-wrap transition-all text-sm sm:text-base leading-relaxed ${
              !expanded && isTooLong ? "line-clamp-6 overflow-hidden" : ""
            }`}
            style={{ wordBreak: "break-word" }}
          >
            {message}
          </div>
        )}

        {isTooLong && (
          <div
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs sm:text-sm text-blue-500 cursor-pointer mt-1 hover:text-blue-600 transition-colors"
          >
            {expanded ? "Show less" : "Show more"}
          </div>
        )}

        {(message || image) && (
          <div className="text-[10px] sm:text-xs text-[var(--text-tertiary)] mt-1 text-right">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      {message && (
        <button
          onClick={handleCopy}
          className={`mt-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors
            opacity-0 group-hover:opacity-100 ${
              isUser ? "self-end" : "self-start"
            } flex items-center gap-1 text-xs sm:text-sm cursor-pointer p-1 rounded hover:bg-[var(--interactive-hover)]`}
        >
          {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      )}
    </div>
  );
}