import Icon from "@/components/ui/icon";
import { Tab, View, Profile, Chat } from "./types";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  profile: Profile;
  view: View;
  setView: (v: View) => void;
  filteredChats: Chat[];
  selectedChat: Chat;
  selectChat: (chat: Chat) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: { chat: Chat; message: { id: number; text: string; from: string; time: string; type: string } }[];
  openEdit: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  profile,
  view,
  setView,
  filteredChats,
  selectedChat,
  selectChat,
  searchQuery,
  setSearchQuery,
  searchResults,
  openEdit,
}: SidebarProps) {
  return (
    <>
      {/* Nav bar */}
      <div className="w-16 flex flex-col items-center py-4 gap-2 bg-[var(--bg-nav)] border-r border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center mb-4">
          <Icon name="Zap" size={16} className="text-black" />
        </div>

        {[
          { tab: "chats" as Tab, icon: "MessageSquare", label: "Чаты" },
          { tab: "search" as Tab, icon: "Search", label: "Поиск" },
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

        <button
          onClick={() => setActiveTab("settings")}
          title="Настройки"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden ${
            activeTab === "settings"
              ? "ring-2 ring-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          <img
            src="https://cdn.poehali.dev/projects/14fe45a4-d745-4982-98d1-f7508597384f/bucket/174cc4e8-27c3-4a54-abbe-137db4a3fa20.png"
            alt="Настройки"
            className="w-6 h-6 object-contain"
            style={{ mixBlendMode: "screen" }}
          />
        </button>

        <div className="mt-auto">
          <button
            onClick={() => setActiveTab("settings")}
            className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold cursor-pointer border-2 border-transparent hover:border-[var(--accent)] transition-all"
            style={{ backgroundColor: profile.avatarColor }}
          >
            {profile.avatarImage
              ? <img src={profile.avatarImage} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-black text-[10px] font-bold">{profile.avatarText.slice(0, 2)}</span>
            }
          </button>
        </div>
      </div>

      {/* Panel */}
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
    </>
  );
}
