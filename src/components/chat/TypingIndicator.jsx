export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-[var(--chat-assistant-bg)] rounded-lg shadow text-sm w-fit">
      <span className="dot dot1" />
      <span className="dot dot2" />
      <span className="dot dot3" />
      <style jsx>{`
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background-color: var(--text-primary);
          animation: bounce 1.2s infinite ease-in-out;
        }
        .dot1 {
          animation-delay: 0s;
        }
        .dot2 {
          animation-delay: 0.2s;
        }
        .dot3 {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
