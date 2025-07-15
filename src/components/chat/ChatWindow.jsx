import ChatBubble from "./ChatBubble";
import { FiCopy, FiCheck } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function ChatWindow({
  messages,
  isTyping,
  bottomRef,
  onLoadMore,      // <-- function to load older messages
  hasMore,         // <-- whether more messages are available
}) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const topRef = useRef(null);

  const handleCopyTyping = () => {
    navigator.clipboard.writeText("Gemini is typing...");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Intersection Observer for top
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const topVisible = entries[0].isIntersecting;
        if (topVisible && hasMore) {
          onLoadMore(); // fetch older messages
        }
      },
      {
        root: containerRef.current,
        threshold: 0.1,
      }
    );

    if (topRef.current) observer.observe(topRef.current);

    return () => {
      if (topRef.current) observer.unobserve(topRef.current);
    };
  }, [onLoadMore, hasMore, messages.length]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 20) return "Good evening";
    return "Good night";
  };

  return (
    <div className="flex-1 overflow-y-auto" ref={containerRef}>
      <div className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4 space-y-4 sm:space-y-6">

        {/* Top anchor for reverse scroll */}
        <div ref={topRef} />

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
          <div className="flex justify-center items-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh]">
            <div className="text-center px-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#448aff] mb-2">
                {getGreeting()}
              </div>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="group flex items-start gap-2 sm:gap-3 px-2 sm:px-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--color-gemini-blue)] flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm sm:text-base text-[var(--text-secondary)] italic py-2">
                Gemini is typing...
              </div>
              <button
                onClick={handleCopyTyping}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors
                opacity-0 group-hover:opacity-100 cursor-pointer text-xs sm:text-sm flex items-center gap-1 mt-1 p-1 rounded hover:bg-[var(--interactive-hover)]"
              >
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
