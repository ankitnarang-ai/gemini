export default function MessageHeader({ onClear }) {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex justify-between items-center shadow-sm">
      <h1 className="text-base sm:text-lg md:text-xl font-semibold text-[var(--text-primary)] truncate">
        Gemini 
      </h1>
    </div>
  );
}