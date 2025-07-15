import { useState, useRef } from "react";
import { Plus, Send, Mic } from "lucide-react";

// InputBar Component
export default function InputBar({ onSend, disabled }) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const handleSend = () => {
    if (!input.trim() && !file) return;

    onSend({
      text: input.trim(),
      image: file ? URL.createObjectURL(file) : null,
    });

    setInput("");
    setFile(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleVoice = (e) => {
    console.log("handle voice functionality here");
  };

  return (
    <div className="w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
      {/* File Preview */}
      {file && (
        <div className="mb-3 sm:mb-4 flex justify-center items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] truncate">
              {file.name}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {Math.round(file.size / 1024)}KB
            </p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 text-lg sm:text-xl"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Container */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-[var(--border-primary)] shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-end gap-2 p-2 sm:p-3">
          <div className="w-full">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={disabled}
            />

            {/* Text Input */}
            <div className="flex-1 min-h-[40px] sm:min-h-[44px] max-h-[120px] sm:max-h-[200px] overflow-y-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gemini"
                disabled={disabled}
                className="w-full resize-none border-0 outline-none bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm sm:text-base leading-5 sm:leading-6 py-2 px-1 disabled:cursor-not-allowed"
                rows={1}
                style={{
                  minHeight: '24px',
                  maxHeight: '100px',
                  resize: 'none',
                  overflow: 'hidden'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
              />
            </div>

            <div className="flex justify-between items-center w-full">
              {/* Plus Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex-shrink-0 p-1.5 sm:p-2 rounded-full hover:bg-[var(--interactive-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                <Plus size={18} className="text-[var(--text-secondary)] sm:w-5 sm:h-5" />
              </button>

              {/* Send Button */}
              <button
                onClick={input.trim() || file ? handleSend : handleVoice}
                disabled={disabled}
                className="flex-shrink-0 p-1.5 sm:p-2 rounded-full bg-[var(--color-background-dark-elevated)] hover:bg-[var(--color-background-dark-secondary)] disabled:bg-[var(--color-text-tertiary-dark)] transition-colors disabled:cursor-not-allowed touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center"
              >
                {input.trim() || file ? (
                  <Send size={18} className="text-[var(--color-text-primary-dark)] sm:w-5 sm:h-5" />
                ) : (
                  <Mic size={18} className="text-[var(--color-text-primary-dark)] sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full flex items-center justify-center mt-3 sm:mt-4 px-2">
        <small className="text-[var(--text-secondary)] text-xs sm:text-sm text-center">
          Gemini can make mistakes, so double-check it
        </small>
      </div>
    </div>
  );
}