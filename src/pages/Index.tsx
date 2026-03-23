import { useState } from "react";
import { CHATS, Tab, View, Message, Profile } from "@/components/messenger/types";
import Sidebar from "@/components/messenger/Sidebar";
import ChatArea from "@/components/messenger/ChatArea";
import EditProfileModal from "@/components/messenger/EditProfileModal";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [selectedChat, setSelectedChat] = useState(CHATS[0]);
  const [view, setView] = useState<View>("active");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState(CHATS[0].messages as Message[]);
  const [allChats, setAllChats] = useState(CHATS);
  const [stickerOpen, setStickerOpen] = useState(false);

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
    setMessages(chat.messages as Message[]);
    setActiveTab("chats");
    setAllChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
    );
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: message,
      from: "me",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
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

  const sendSticker = (emoji: string) => {
    const newMsg: Message = {
      id: messages.length + 1,
      text: emoji,
      from: "me",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: "sticker",
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setAllChats((prev) =>
      prev.map((c) =>
        c.id === selectedChat.id ? { ...c, messages: updated, lastMessage: emoji, time: newMsg.time } : c
      )
    );
    setStickerOpen(false);
  };

  const openEdit = () => {
    setEditProfile(profile);
    setEditOpen(true);
  };

  const saveProfile = () => {
    setProfile(editProfile);
    setEditOpen(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const newMsg: Message = {
      id: messages.length + 1,
      text: isImage ? "Изображение" : file.name,
      from: "me",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: isImage ? "image" : "file",
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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        view={view}
        setView={setView}
        filteredChats={filteredChats}
        selectedChat={selectedChat}
        selectChat={selectChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        openEdit={openEdit}
      />

      <ChatArea
        selectedChat={selectedChat}
        messages={messages}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendSticker={sendSticker}
        handleFile={handleFile}
        stickerOpen={stickerOpen}
        setStickerOpen={setStickerOpen}
      />

      {editOpen && (
        <EditProfileModal
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          saveProfile={saveProfile}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}
