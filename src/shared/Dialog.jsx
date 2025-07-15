import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Dialog({ isOpen, onClose, title, children, showClose = true }) {
  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl shadow-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] relative">
        
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-secondary)]">
            {title && <h3 className="text-base font-semibold">{title}</h3>}
            {showClose && (
              <button
                onClick={onClose}
                className="cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
