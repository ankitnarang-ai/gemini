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
      className={`group px-4 py-2 w-full flex flex-col ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      {/* Chat Bubble */}
      <div
        className={`relative max-w-[75%] px-4 py-2 rounded-lg text-sm shadow ${
          isUser
            ? "bg-[var(--chat-user-bg)] text-[var(--text-primary)]"
            : "bg-transparent text-[var(--text-primary)]"
        }`}
      >
        {/* Image Preview */}
        {image && (
          <img
            src={image}
            alt="uploaded"
            className="rounded mb-2 max-w-xs max-h-48 object-cover"
          />
        )}

        {/* Message Text */}
        {message && (
          <div
            className={`whitespace-pre-wrap transition-all ${
              !expanded && isTooLong ? "line-clamp-6 overflow-hidden" : ""
            }`}
            style={{ wordBreak: "break-word" }}
          >
            {message}
          </div>
        )}

        {/* Show More / Less Toggle */}
        {isTooLong && (
          <div
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs text-blue-500 cursor-pointer mt-1"
          >
            {expanded ? "Show less" : "Show more"}
          </div>
        )}

        {/* Timestamp */}
        {(message || image) && (
          <div className="text-[10px] text-[var(--text-tertiary)] mt-1 text-right">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      {/* Copy Button */}
      {message && (
        <button
          onClick={handleCopy}
          className={`mt-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition
            opacity-0 group-hover:opacity-100 ${
              isUser ? "self-end" : "self-start"
            } flex items-center gap-1 text-xs cursor-pointer`}
        >
          {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}
