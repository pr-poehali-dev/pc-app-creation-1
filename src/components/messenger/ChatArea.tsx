import { useRef } from "react";
import Icon from "@/components/ui/icon";
import { Message, Chat, STICKERS } from "./types";

interface ChatAreaProps {
  selectedChat: Chat;
  messages: Message[];
  message: string;
  setMessage: (v: string) => void;
  sendMessage: () => void;
  sendSticker: (emoji: string) => void;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stickerOpen: boolean;
  setStickerOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export default function ChatArea({
  selectedChat,
  messages,
  message,
  setMessage,
  sendMessage,
  sendSticker,
  handleFile,
  stickerOpen,
  setStickerOpen,
}: ChatAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2" onClick={() => setStickerOpen(false)}>
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
                      {msg.fileName || msg.text}
                    </p>
                    <p className={`text-xs ${msg.from === "me" ? "text-black/60" : "text-[var(--text-muted)]"}`}>
                      {msg.fileSize || ""}
                    </p>
                  </div>
                  <Icon name="Download" size={14} className={msg.from === "me" ? "text-black/70" : "text-[var(--text-muted)]"} />
                </div>
              )}
              {msg.type === "image" && (
                <div>
                  <img
                    src={msg.imageUrl}
                    alt="изображение"
                    className="rounded-xl max-w-[240px] max-h-[200px] object-cover"
                  />
                </div>
              )}
              {msg.type === "sticker" && (
                <div className="text-5xl py-1 select-none">{msg.text}</div>
              )}
              {msg.type !== "sticker" && (
                <p className={`text-[10px] mt-1 text-right ${msg.from === "me" ? "text-black/60" : "text-[var(--text-muted)]"}`}>
                  {msg.time}
                  {msg.from === "me" && <Icon name="CheckCheck" size={10} className="inline ml-1" />}
                </p>
              )}
              {msg.type === "sticker" && (
                <p className={`text-[10px] text-right ${msg.from === "me" ? "text-black/60" : "text-[var(--text-muted)]"}`}>
                  {msg.time}
                  {msg.from === "me" && <Icon name="CheckCheck" size={10} className="inline ml-1" />}
                </p>
              )}
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
          <div className="relative">
            <button
              onClick={() => setStickerOpen((v) => !v)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${stickerOpen ? "bg-[var(--accent-dim)]" : "hover:bg-[var(--bg-hover)]"}`}
            >
              <Icon name="Smile" size={16} className={stickerOpen ? "text-[var(--accent)]" : "text-[var(--text-muted)]"} />
            </button>
            {stickerOpen && (
              <div className="absolute bottom-10 right-0 w-60 bg-[#12131c] border border-[var(--border)] rounded-2xl shadow-2xl p-3 z-20">
                <p className="text-[10px] text-[var(--text-muted)] font-medium mb-2 px-1">Стикеры</p>
                <div className="grid grid-cols-4 gap-1">
                  {STICKERS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => sendSticker(s.emoji)}
                      title={s.label}
                      className="w-12 h-12 rounded-xl text-2xl hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors hover:scale-110 transform"
                    >
                      {s.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
  );
}
