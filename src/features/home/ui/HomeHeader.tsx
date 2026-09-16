"use client";

import { IconBell } from "@/shared/ui/icons";

interface Props {
  greeting: string;
  name: string;
  avatar: string;
  unread: number;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export function HomeHeader({
  greeting,
  name,
  avatar,
  unread,
  onOpenProfile,
  onOpenNotifications,
}: Props) {
  return (
    <header className="header">
      <button
        type="button"
        className="header__avatar"
        onClick={onOpenProfile}
        aria-label={`Open profile for ${name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt="" width={40} height={40} />
      </button>

      <div className="header__greeting">
        <div className="header__hint">{greeting}</div>
        <div className="header__name">{name}</div>
      </div>

      <button
        type="button"
        className="header__bell"
        onClick={onOpenNotifications}
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
        }
      >
        <IconBell />
        {unread > 0 && <span className="header__badge">{unread}</span>}
      </button>
    </header>
  );
}
