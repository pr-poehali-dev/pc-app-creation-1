import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const AVATAR_COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

const CHATS = [
  {
    id: 1,
    name: "Алексей Смирнов",
    avatar: "АС",
    color: "#6366f1",
    lastMessage: "Отправил файл проекта, посмотри когда сможешь",
    time: "14:32",
    unread: 3,
    online: true,
    archived: false,
    messages: [
      { id: 1, text: "Привет! Как дела с проектом?", from: "them", time: "13:10", type: "text" },
      { id: 2, text: "Работаю над этим. Есть пара вопросов по структуре.", from: "me", time: "13:15", type: "text" },
      { id: 3, text: "Конечно, спрашивай!", from: "them", time: "13:16", type: "text" },
      { id: 4, text: "Как лучше организовать модули?", from: "me", time: "13:22", type: "text" },
      { id: 5, text: "Отправил файл проекта, посмотри когда сможешь", from: "them", time: "14:32", type: "file", fileName: "project_structure.pdf", fileSize: "2.4 МБ" },
    ],
  },
  {
    id: 2,
    name: "Команда дизайна",
    avatar: "КД",
    color: "#10b981",
    lastMessage: "Макеты готовы к ревью 🎨",
    time: "12:05",
    unread: 0,
    online: false,
    archived: false,
    messages: [
      { id: 1, text: "Всем привет! Начинаем спринт.", from: "them", time: "09:00", type: "text" },
      { id: 2, text: "Какие задачи на сегодня?", from: "me", time: "09:05", type: "text" },
      { id: 3, text: "Финализируем главный экран и онбординг", from: "them", time: "09:10", type: "text" },
      { id: 4, text: "Макеты готовы к ревью 🎨", from: "them", time: "12:05", type: "text" },
    ],
  },
  {
    id: 3,
    name: "Мария Петрова",
    avatar: "МП",
    color: "#f59e0b",
    lastMessage: "Фото с встречи",
    time: "вчера",
    unread: 0,
    online: true,
    archived: false,
    messages: [
      { id: 1, text: "Привет! Была рада познакомиться на конференции!", from: "them", time: "18:00", type: "text" },
      { id: 2, text: "Аналогично! Отличное мероприятие.", from: "me", time: "18:10", type: "text" },
      { id: 3, text: "Фото с встречи", from: "them", time: "19:30", type: "image", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop" },
    ],
  },
  {
    id: 4,
    name: "Иван Козлов",
    avatar: "ИК",
    color: "#ef4444",
    lastMessage: "Увидимся на следующей неделе",
    time: "пн",
    unread: 0,
    online: false,
    archived: true,
    messages: [
      { id: 1, text: "Привет, как прошла поездка?", from: "me", time: "10:00", type: "text" },
      { id: 2, text: "Отлично! Много новых впечатлений.", from: "them", time: "10:30", type: "text" },
      { id: 3, text: "Увидимся на следующей неделе", from: "them", time: "11:00", type: "text" },
    ],
  },
];

type Tab = "chats" | "search" | "settings";
type View = "active" | "archive";

interface Message {
  id: number;
  text: string;
  from: "me" | "them";
  time: string;
  type: "text" | "file" | "image";
  fileName?: string;
  fileSize?: string;
  imageUrl?: string;
}

interface Profile {
  name: string;
  username: string;
  avatarText: string;
  avatarColor: string;
  avatarImage: string | null;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [selectedChat, setSelectedChat] = useState(CHATS[0]);
  const [view, setView] = useState<View>("active");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState(CHATS[0].messages);
  const [allChats, setAllChats] = useState(CHATS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    name: "Вы",
    username: "username",
    avatarText: "ВЫ",
    avatarColor: "#64dcb4",
    avatarImage: null,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<Profile>(profile);

  const filteredChats = allChats.filter((c) =>
    view === "active" ? !c.archived : c.archived
  );

  const searchResults = searchQuery.length > 1
    ? allChats.flatMap((chat) =>
        chat.messages
          .filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((m) => ({ chat, message: m }))
      )
    : [];

  const selectChat = (chat: typeof CHATS[0]) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
    setActiveTab("chats");
    setAllChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
    );
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      text: message,
      from: "me" as const,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: "text" as const,
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setAllChats((prev) =>
      prev.map((c) =>
        c.id === selectedChat.id ? { ...c, messages: updated, lastMessage: message, time: newMsg.time } : c
      )
    );
    setMessage("");
  };

  const openEdit = () => {
    setEditProfile(profile);
    setEditOpen(true);
  };

  const saveProfile = () => {
    setProfile(editProfile);
    setEditOpen(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditProfile((p) => ({ ...p, avatarImage: url }));
    e.target.value = "";
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const newMsg = {
      id: messages.length + 1,
      text: isImage ? "Изображение" : file.name,
      from: "me" as const,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: isImage ? ("image" as const) : ("file" as const),
      fileName: file.name,
      fileSize: (file.size / 1024 / 1024).toFixed(1) + " МБ",
      imageUrl: isImage ? URL.createObjectURL(file) : undefined,
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setAllChats((prev) =>
      prev.map((c) =>
        c.id === selectedChat.id ? { ...c, messages: updated, lastMessage: newMsg.text, time: newMsg.time } : c
      )
    );
    e.target.value = "";
  };

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-['IBM_Plex_Sans',sans-serif] overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-16 flex flex-col items-center py-4 gap-2 bg-[var(--bg-nav)] border-r border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center mb-4">
          <Icon name="Zap" size={16} className="text-black" />
        </div>

        {[
          { tab: "chats" as Tab, icon: "MessageSquare", label: "Чаты" },
          { tab: "search" as Tab, icon: "Search", label: "Поиск" },
          { tab: "settings" as Tab, icon: "Settings", label: "Настройки" },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            title={label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              activeTab === tab
                ? "bg-[var(--accent)] text-black shadow-[0_0_12px_var(--accent-glow)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <Icon name={icon} size={18} />
          </button>
        ))}

        <div className="mt-auto">
          <button onClick={() => { setActiveTab("settings"); }} className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold cursor-pointer border-2 border-transparent hover:border-[var(--accent)] transition-all" style={{ backgroundColor: profile.avatarColor }}>
            {profile.avatarImage
              ? <img src={profile.avatarImage} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-black text-[10px] font-bold">{profile.avatarText.slice(0, 2)}</span>
            }
          </button>
        </div>
      </div>

      {/* Chat List / Search / Settings Panel */}
      <div className="w-72 flex flex-col border-r border-[var(--border)] bg-[var(--bg-panel)]">
        {activeTab === "chats" && (
          <>
            <div className="px-4 pt-5 pb-3">
              <h2 className="text-base font-semibold tracking-wide text-[var(--text-primary)]">Сообщения</h2>
              <div className="flex gap-1 mt-3">
                {(["active", "archive"] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-all ${
                      view === v
                        ? "bg-[var(--accent)] text-black"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    {v === "active" ? "Активные" : "Архив"}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-3 pb-3">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl pl-8 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="Поиск по чатам..."
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={`w-full px-3 py-3 flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors text-left ${
                    selectedChat.id === chat.id ? "bg-[var(--bg-active)]" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: chat.color }}
                    >
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--online)] rounded-full border-2 border-[var(--bg-panel)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">{chat.name}</span>
                      <span className="text-xs text-[var(--text-muted)] ml-2 flex-shrink-0">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <p className="text-xs text-[var(--text-muted)] truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="ml-2 flex-shrink-0 w-5 h-5 bg-[var(--accent)] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === "search" && (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-5 pb-3">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Поиск</h2>
              <div className="relative mt-3">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl pl-8 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="Поиск по переписке..."
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <p className="text-center text-[var(--text-muted)] text-sm mt-8">Ничего не найдено</p>
              )}
              {searchResults.map(({ chat, message: msg }, i) => (
                <button
                  key={i}
                  onClick={() => selectChat(chat)}
                  className="w-full text-left px-3 py-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors mb-1"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: chat.color }}>
                      {chat.avatar[0]}
                    </div>
                    <span className="text-xs font-medium text-[var(--accent)]">{chat.name}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-auto">{msg.time}</span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)]">{msg.text}</p>
                </button>
              ))}
              {searchQuery.length < 2 && (
                <div className="text-center mt-16">
                  <Icon name="Search" size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--text-muted)]">Введите текст для поиска<br />по всем перепискам</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-5 pb-4">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Настройки</h2>
            </div>
            <div className="px-3 flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-hover)] rounded-xl mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold flex-shrink-0" style={{ backgroundColor: profile.avatarColor }}>
                  {profile.avatarImage
                    ? <img src={profile.avatarImage} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-black text-sm">{profile.avatarText.slice(0, 2)}</span>
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{profile.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">@{profile.username}</p>
                </div>
              </div>

              {[
                { icon: "User", label: "Редактировать профиль", action: openEdit as (() => void) | undefined },
                { icon: "Bell", label: "Уведомления", action: undefined as (() => void) | undefined },
                { icon: "Shield", label: "Конфиденциальность", action: undefined as (() => void) | undefined },
                { icon: "Palette", label: "Оформление", action: undefined as (() => void) | undefined },
                { icon: "HardDrive", label: "Данные и хранилище", action: undefined as (() => void) | undefined },
                { icon: "HelpCircle", label: "Помощь", action: undefined as (() => void) | undefined },
              ].map(({ icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left mb-1"
                >
                  <Icon name={icon} size={16} className="text-[var(--accent)]" />
                  <span className="text-sm text-[var(--text-primary)]">{label}</span>
                  <Icon name="ChevronRight" size={14} className="text-[var(--text-muted)] ml-auto" />
                </button>
              ))}

              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(239,68,68,0.1)] transition-colors text-left">
                  <Icon name="LogOut" size={16} className="text-[#ef4444]" />
                  <span className="text-sm text-[#ef4444]">Выйти</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[var(--bg-chat)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--bg-panel)]">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: selectedChat.color }}
            >
              {selectedChat.avatar}
            </div>
            {selectedChat.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--online)] rounded-full border-2 border-[var(--bg-panel)]" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{selectedChat.name}</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {selectedChat.online ? "В сети" : "Был(а) недавно"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors">
              <Icon name="Phone" size={16} className="text-[var(--text-muted)]" />
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors">
              <Icon name="Video" size={16} className="text-[var(--text-muted)]" />
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors">
              <Icon name="MoreHorizontal" size={16} className="text-[var(--text-muted)]" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-2.5 ${
                  msg.from === "me"
                    ? "bg-[var(--accent)] text-black rounded-br-sm"
                    : "bg-[var(--bg-message)] text-[var(--text-primary)] rounded-bl-sm"
                }`}
              >
                {msg.type === "text" && (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                )}
                {msg.type === "file" && (
                  <div className="flex items-center gap-2.5 min-w-[180px]">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.from === "me" ? "bg-black/20" : "bg-[var(--accent-dim)]"}`}>
                      <Icon name="FileText" size={16} className={msg.from === "me" ? "text-black" : "text-[var(--accent)]"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${msg.from === "me" ? "text-black" : "text-[var(--text-primary)]"}`}>
                        {(msg as Message).fileName || msg.text}
                      </p>
                      <p className={`text-xs ${msg.from === "me" ? "text-black/60" : "text-[var(--text-muted)]"}`}>
                        {(msg as Message).fileSize || ""}
                      </p>
                    </div>
                    <Icon name="Download" size={14} className={msg.from === "me" ? "text-black/70" : "text-[var(--text-muted)]"} />
                  </div>
                )}
                {msg.type === "image" && (
                  <div>
                    <img
                      src={(msg as Message).imageUrl}
                      alt="изображение"
                      className="rounded-xl max-w-[240px] max-h-[200px] object-cover"
                    />
                  </div>
                )}
                <p className={`text-[10px] mt-1 text-right ${msg.from === "me" ? "text-black/60" : "text-[var(--text-muted)]"}`}>
                  {msg.time}
                  {msg.from === "me" && <Icon name="CheckCheck" size={10} className="inline ml-1" />}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-panel)]">
          <div className="flex items-center gap-2 bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl px-3 py-2 focus-within:border-[var(--accent)] transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFile}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.zip,.txt"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-7 h-7 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Icon name="Paperclip" size={16} className="text-[var(--text-muted)]" />
            </button>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Написать сообщение..."
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <button className="w-7 h-7 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors">
              <Icon name="Smile" size={16} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_10px_var(--accent-glow)]"
            >
              <Icon name="Send" size={14} className="text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditOpen(false)}>
          <div
            className="w-full max-w-sm mx-4 bg-[#12131c] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Редактировать профиль</h3>
              <button onClick={() => setEditOpen(false)} className="w-7 h-7 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors">
                <Icon name="X" size={14} className="text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="px-5 py-5 flex flex-col gap-5">
              {/* Avatar section */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold cursor-pointer relative group"
                  style={{ backgroundColor: editProfile.avatarColor }}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {editProfile.avatarImage
                    ? <img src={editProfile.avatarImage} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-black">{editProfile.avatarText.slice(0, 2)}</span>
                  }
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <Icon name="Camera" size={20} className="text-white" />
                  </div>
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <p className="text-xs text-[var(--text-muted)]">Нажмите на аватар, чтобы сменить фото</p>

                {/* Color picker */}
                <div className="flex gap-2">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditProfile((p) => ({ ...p, avatarColor: color, avatarImage: null }))}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      {editProfile.avatarColor === color && !editProfile.avatarImage && (
                        <Icon name="Check" size={12} className="text-black" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-muted)]">Имя</label>
                <input
                  value={editProfile.name}
                  onChange={(e) => setEditProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="Ваше имя"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-muted)]">Имя пользователя</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">@</span>
                  <input
                    value={editProfile.username}
                    onChange={(e) => setEditProfile((p) => ({ ...p, username: e.target.value.replace(/\s/g, "") }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl pl-7 pr-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="username"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={saveProfile}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-black text-sm font-semibold hover:shadow-[0_0_16px_var(--accent-glow)] transition-all"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}