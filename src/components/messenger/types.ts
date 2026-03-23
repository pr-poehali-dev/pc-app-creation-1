export const AVATAR_COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

export const STICKERS = [
  { id: "s1", emoji: "😂", label: "Смеюсь" },
  { id: "s2", emoji: "🔥", label: "Огонь" },
  { id: "s3", emoji: "👍", label: "Лайк" },
  { id: "s4", emoji: "❤️", label: "Сердце" },
  { id: "s5", emoji: "🥹", label: "Тронут" },
  { id: "s6", emoji: "🤝", label: "Договорились" },
  { id: "s7", emoji: "🚀", label: "Поехали" },
  { id: "s8", emoji: "😎", label: "Круто" },
  { id: "s9", emoji: "🤔", label: "Думаю" },
  { id: "s10", emoji: "👀", label: "Смотрю" },
  { id: "s11", emoji: "💯", label: "Сотка" },
  { id: "s12", emoji: "🎉", label: "Ура" },
  { id: "s13", emoji: "😴", label: "Сплю" },
  { id: "s14", emoji: "🤡", label: "Клоун" },
  { id: "s15", emoji: "🧊", label: "Холод" },
  { id: "s16", emoji: "💀", label: "Умер" },
];

export const CHATS = [
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

export type Tab = "chats" | "search" | "settings";
export type View = "active" | "archive";

export interface Message {
  id: number;
  text: string;
  from: "me" | "them";
  time: string;
  type: "text" | "file" | "image" | "sticker";
  fileName?: string;
  fileSize?: string;
  imageUrl?: string;
}

export interface Profile {
  name: string;
  username: string;
  avatarText: string;
  avatarColor: string;
  avatarImage: string | null;
}

export type Chat = typeof CHATS[0];
