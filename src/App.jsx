import ChatPage from "./pages/ChatPage";

export default function App() {

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <ChatPage />
      </div>
    </div>
  );
}
