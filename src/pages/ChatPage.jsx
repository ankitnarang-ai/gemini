import { useEffect, useRef, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import InputBar from "../components/chat/InputBar";
import MessageHeader from "../components/chat/MessageHeader";
import Sidebar from "../components/sidebar/Sidebar";

export default function ChatPage() {
  const [chatrooms, setChatrooms] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null); 
  const [isNewChatPending, setIsNewChatPending] = useState(false); 

  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const activeMessages = isNewChatPending
    ? []
    : chatrooms.find((c) => c.id === activeChatId)?.messages || [];


  const handleNewChat = () => {
    setActiveChatId(null);
    setIsNewChatPending(true);
  };

  const handleRename = (id, title) => {
    setChatrooms((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const handleDelete = (id) => {
    setChatrooms((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
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

    // If it's a pending new chat (draft), create chatroom now
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
      setIsNewChatPending(false); // reset draft mode

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

    // If a chatroom exists, just send message
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isTyping]);

  return (
    <div className="flex h-screen">
      {/* <div className="w-64"> */}
        <Sidebar
          chats={chatrooms}
          onNewChat={handleNewChat}
          onSelectChat={setActiveChatId}
          onRename={handleRename}
          onDelete={handleDelete}
          activeChatId={activeChatId}
          isNewChatPending={isNewChatPending}
        />
      {/* </div> */}

      <div className="flex-1 flex flex-col">
        <MessageHeader onClear={() => {
          setChatrooms((prev) => prev.map((c) => c.id === activeChatId ? { ...c, messages: [] } : c));
        }} />

        <ChatWindow messages={activeMessages} isTyping={isTyping} bottomRef={bottomRef} />
        <InputBar onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}