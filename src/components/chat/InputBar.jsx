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
    console.log("handle voice functionlaity here");

  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* File Preview */}
      {file && (
        <div className="mb-4 flex justify-center items-center gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-16 h-16 object-cover rounded-xl"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--text-primary)]">{file.name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{Math.round(file.size / 1024)}KB</p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Container */}
      <div className="relative rounded-3xl border border-[var(--border-primary)] shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-end gap-2 p-3">

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
            <div className="flex-1 min-h-[44px] max-h-[200px] overflow-y-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gemini"
                disabled={disabled}
                className="w-full resize-none border-0 outline-none bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-base leading-6 py-2 px-1 disabled:cursor-not-allowed"
                rows={1}
                style={{
                  minHeight: '28px',
                  maxHeight: '120px',
                  resize: 'none',
                  overflow: 'hidden'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
            </div>

            <div className="flex justify-between w-full">
              {/* Plus Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex-shrink-0 p-2 rounded-full hover:bg-[var(--interactive-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} className="text-[var(--text-secondary)]" />
              </button>


              {/* Send Button */}
              <button
                onClick={input.trim() || file ? handleSend : handleVoice}
                disabled={disabled}
                className="flex-shrink-0 p-2 rounded-full bg-[var(--color-background-dark-elevated)] hover:bg-[var(--color-background-dark-secondary)] disabled:bg-[var(--color-text-tertiary-dark)] transition-colors disabled:cursor-not-allowed"
              >
                {input.trim() || file ? (
                  <Send size={20} className="text-[var(--color-text-primary-dark)]" />
                ) : (
                  <Mic size={20} className="text-[var(--color-text-primary-dark)]" />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
      <div className="w-full flex items-center justify-center mt-4">

        <small className="text-[var(--text-secondary)]">Gemini can make mistakes, so double-check it</small>
      </div>

    </div>
  );
}