import { useState, useEffect, useMemo, useRef } from "react";
import {
  FiMenu,
  FiPlus,
  FiSettings,
  FiSearch,
  FiCheck,
  FiX,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import Dialog from "../../shared/Dialog";
import { showToast } from "../../shared/Toast";

export default function Sidebar({
  chats = [],
  onNewChat,
  onSelectChat,
  onRename,
  onDelete,
  activeChatId,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isMobile, setIsMobile] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const inputRef = useRef(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelectChat = (chatId) => {
    onSelectChat(chatId);
    if (isMobile) setMobileOpen(false);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    const handleClickOutside = (e) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId, darkMode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.toLowerCase());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    if (editingChatId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(editingTitle.length, editingTitle.length);
    }
  }, [editingChatId]);

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      (chat.title || "").toLowerCase().includes(debouncedSearch)
    );
  }, [debouncedSearch, chats]);

  const handleEditStart = (chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title || "");
    setOpenMenuId(null);
  };

  const handleEditSave = () => {
    if (editingTitle.trim() && onRename) {
      onRename(editingChatId, editingTitle.trim());
    }
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleEditCancel = () => {
    const chat = chats.find((c) => c.id === editingChatId);
    if (editingTitle.trim() === "" && chat?.title === "") {
      if (onDelete) onDelete(editingChatId);
    }
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") handleEditSave();
    else if (e.key === "Escape") handleEditCancel();
  };

  const handleDelete = (chatId) => {
    setConfirmDeleteId(chatId);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (onDelete && confirmDeleteId) {
      onDelete(confirmDeleteId);
      showToast("Chat deleted successfully", "success");
    }
    if (editingChatId === confirmDeleteId) {
      setEditingChatId(null);
      setEditingTitle("");
    }
    setConfirmDeleteId(null);
  };


  const handleNewChat = async () => {
    await onNewChat();
    if (isMobile) setMobileOpen(false);
  };

  const toggleMenu = (chatId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    showToast("Logged out", "info");
    setTimeout(() => {
      localStorage.removeItem("auth");
      window.location.reload();
    }, 1000);
  };


  return (
    <>
      {isMobile && mobileOpen && (
        <div
          className="cursor-pointer fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="cursor-pointer relative top-1 left-1 h-10 z-50 p-2 rounded-md shadow-lg lg:hidden"
        >
          <FiMenu size={20} className="text-[var(--text-primary)]" />
        </button>
      )}

      <aside
        className={`
          h-screen bg-[var(--surface-primary)] border-r border-[var(--border-primary)]
          transition-all duration-300 flex flex-col
          ${isMobile
            ? `fixed left-0 top-0 z-50 shadow-lg ${mobileOpen ? 'w-64' : 'w-0 overflow-hidden'}`
            : `relative ${collapsed ? 'w-16' : 'w-64'}`
          }
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)] shrink-0">
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              title="Toggle"
              className="cursor-pointer text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
            >
              <FiMenu size={20} />
            </button>
          )}

          {isMobile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="cursor-pointer text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
              >
                <FiX size={20} />
              </button>
              <span className="text-[var(--text-primary)] font-medium">Chats</span>
            </div>
          )}

          <div className="flex-1" />

          {(!collapsed || isMobile) && (
            <button
              onClick={() => setShowSearchBar((prev) => !prev)}
              className="cursor-pointer text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
              title="Toggle Search"
            >
              <FiSearch size={18} />
            </button>
          )}
        </div>

        {(!collapsed || isMobile) && (
          <div className="p-2 space-y-2 shrink-0">
            <button
              onClick={handleNewChat}
              className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--interactive-hover)] transition"
            >
              <FiEdit2 className="text-[var(--text-secondary)]" size={16} />
              <span>New chat</span>
            </button>

            {showSearchBar && (
              <div className="relative">
                <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm outline-none text-[var(--text-primary)]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-1 px-2 py-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`group relative w-full rounded-md text-sm transition-colors ${activeChatId === chat.id
                ? "bg-[var(--interactive-active)] text-[var(--text-primary)]"
                : "hover:bg-[var(--interactive-hover)]"
                }`}
            >
              {collapsed && !isMobile ? (
                <button
                  className="w-full p-3 text-center text-[var(--text-primary)] flex items-center justify-center"
                  onClick={() => handleSelectChat(chat.id)}
                  title={chat.title || "New Chat"}
                >
                  💬
                </button>
              ) : editingChatId === chat.id ? (
                <div className="flex items-center gap-1 p-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onBlur={handleEditSave}
                    className="cursor-pointer flex-1 px-2 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded outline-none text-[var(--text-primary)]"
                    placeholder="Enter chat name"
                  />
                  <button
                    onClick={handleEditSave}
                    className="p-1 cursor-pointer text-green-600 hover:text-green-700"
                    title="Save"
                    disabled={!editingTitle.trim()}
                  >
                    <FiCheck size={14} />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="cursor-pointer p-1 text-red-600 hover:text-red-700"
                    title="Cancel"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    className="flex-1 text-left px-3 py-2 truncate text-[var(--text-primary)]"
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    {chat.title || "New Chat"}
                  </button>
                  <div className="relative pr-2">
                    <button
                      onClick={(e) => toggleMenu(chat.id, e)}
                      className="cursor-pointer p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="More"
                    >
                      <FiMoreVertical size={16} />
                    </button>
                    {openMenuId === chat.id && (
                      <div
                        ref={(el) => (menuRefs.current[chat.id] = el)}
                        className="cursor-pointer absolute right-0 top-full mt-1 w-28 bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-lg rounded z-20"
                      >
                        <button
                          onClick={() => handleEditStart(chat)}
                          className="cursor-pointer w-full text-left px-3 py-2 text-sm hover:bg-[var(--interactive-hover)] text-[var(--text-primary)] flex items-center gap-2"
                        >
                          <FiEdit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(chat.id)}
                          className="cursor-pointer w-full text-left px-3 py-2 text-sm hover:bg-[var(--interactive-hover)] text-red-600 flex items-center gap-2"
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-2 mt-auto shrink-0">
          <div className="space-y-2">
            <button
              onClick={() => alert("Settings clicked")}
              className={`w-full cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-[var(--interactive-hover)] text-[var(--text-secondary)] ${collapsed && !isMobile ? "justify-center" : ""
                }`}
              title="Settings"
            >
              <FiSettings size={16} />
              {(!collapsed || isMobile) && "Settings"}
            </button>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`w-full cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-[var(--interactive-hover)] text-[var(--text-secondary)] ${collapsed && !isMobile ? "justify-center" : ""
                }`}
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
              {(!collapsed || isMobile) && (darkMode ? "Light Mode" : "Dark Mode")}
            </button>

            <button
              onClick={handleLogout}
              className={`w-full cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-[var(--interactive-hover)] text-[var(--text-secondary)] ${collapsed && !isMobile ? "justify-center" : ""
                }`}
              title="Logout"
            >
              <FiX size={16} />
              {(!collapsed || isMobile) && "Logout"}
            </button>

          </div>
        </div>
      </aside>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete Chat"
      >
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          Are you sure you want to delete this chat? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setConfirmDeleteId(null)}
            className="cursor-pointer px-4 py-2 text-sm rounded-md bg-[var(--interactive-hover)] text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="cursor-pointer px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Dialog>
    </>
  );
}
