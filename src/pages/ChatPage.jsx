import { useEffect, useRef, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import InputBar from "../components/chat/InputBar";
import MessageHeader from "../components/chat/MessageHeader";
import Sidebar from "../components/sidebar/Sidebar";

const PAGE_SIZE = 20;

export default function ChatPage() {
  const [chatrooms, setChatrooms] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isNewChatPending, setIsNewChatPending] = useState(false);
  const [pagination, setPagination] = useState({}); // { chatId: { page: 1, hasMore: true } }

  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const activeChat = chatrooms.find((c) => c.id === activeChatId);
  const fullMessages = activeChat?.messages || [];

  const activePagination = pagination[activeChatId] || { page: 1, hasMore: true };

  const activeMessages = isNewChatPending
    ? []
    : fullMessages.slice(-PAGE_SIZE * activePagination.page);

  const handleNewChat = () => {
    setActiveChatId(null);
    setIsNewChatPending(true);
  };

  const handleRename = (id, title) => {
    setChatrooms((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  };

  const handleDelete = (id) => {
    setChatrooms((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
    setPagination((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const addMessage = (message) => {
    setChatrooms((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages: [...(c.messages || []), { ...message, timestamp: new Date() }] }
          : c
      )
    );
  };

  const handleSendMessage = (messageData) => {
    const content = messageData.text?.trim() || "";
    const image = messageData.image;

    if (!content && !image) return;

    if (isNewChatPending || !activeChatId) {
      const newId = Date.now().toString();
      const title = content
        ? content.substring(0, 20) + (content.length > 20 ? "..." : "")
        : "Image Chat";

      const newChat = {
        id: newId,
        title,
        messages: [
          { role: "user", content, image, timestamp: new Date() },
        ],
      };

      setChatrooms((prev) => [...prev, newChat]);
      setActiveChatId(newId);
      setIsNewChatPending(false);
      setPagination((prev) => ({ ...prev, [newId]: { page: 1, hasMore: false } }));

      setIsTyping(true);
      setTimeout(() => {
        setChatrooms((prev) =>
          prev.map((c) =>
            c.id === newId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      role: "assistant",
                      content: "This is a simulated Gemini response.",
                      image: null,
                      timestamp: new Date(),
                    },
                  ],
                }
              : c
          )
        );
        setIsTyping(false);
      }, 1500);
      return;
    }

    addMessage({ role: "user", content, image });

    setIsTyping(true);
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: "This is a simulated Gemini response.",
        image: null,
      });
      setIsTyping(false);
    }, 1500);
  };

  const handleLoadMore = () => {
    if (!activeChatId) return;

    const chat = chatrooms.find((c) => c.id === activeChatId);
    const current = pagination[activeChatId] || { page: 1, hasMore: true };

    const totalMessages = chat?.messages?.length || 0;
    const nextPage = current.page + 1;
    const nextHasMore = totalMessages > nextPage * PAGE_SIZE;

    setPagination((prev) => ({
      ...prev,
      [activeChatId]: { page: nextPage, hasMore: nextHasMore },
    }));
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isTyping]);

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chatrooms}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChatId}
        onRename={handleRename}
        onDelete={handleDelete}
        activeChatId={activeChatId}
        isNewChatPending={isNewChatPending}
      />

      <div className="flex-1 flex flex-col">
        <MessageHeader
          onClear={() =>
            setChatrooms((prev) =>
              prev.map((c) =>
                c.id === activeChatId ? { ...c, messages: [] } : c
              )
            )
          }
        />

        <ChatWindow
          messages={activeMessages}
          isTyping={isTyping}
          bottomRef={bottomRef}
          onLoadMore={handleLoadMore}
          hasMore={activePagination.hasMore}
        />

        <InputBar onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
