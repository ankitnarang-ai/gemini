export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--chat-assistant-bg)] rounded-lg shadow text-xs sm:text-sm w-fit max-w-[200px] sm:max-w-none">
      <span className="dot dot1" />
      <span className="dot dot2" />
      <span className="dot dot3" />
      <style jsx>{`
        .dot {
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background-color: var(--text-primary);
          animation: bounce 1.2s infinite ease-in-out;
        }
        
        @media (min-width: 640px) {
          .dot {
            width: 6px;
            height: 6px;
          }
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