import { useRef } from "react";
import Icon from "@/components/ui/icon";
import { Profile, AVATAR_COLORS } from "./types";

interface EditProfileModalProps {
  editProfile: Profile;
  setEditProfile: React.Dispatch<React.SetStateAction<Profile>>;
  saveProfile: () => void;
  onClose: () => void;
}

export default function EditProfileModal({
  editProfile,
  setEditProfile,
  saveProfile,
  onClose,
}: EditProfileModalProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditProfile((p) => ({ ...p, avatarImage: url }));
    e.target.value = "";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-4 bg-[#12131c] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Редактировать профиль</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors"
          >
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
              onClick={onClose}
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
  );
}
