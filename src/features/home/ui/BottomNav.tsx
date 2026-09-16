"use client";

import { IconHome, IconPerson, IconWallet } from "@/shared/ui/icons";

export type Tab = "home" | "spend" | "account";

interface Props {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

export function BottomNav({ active, onNavigate }: Props) {
  return (
    <>
      <nav className="nav" aria-label="Primary">
        <button
          type="button"
          className="nav__item"
          aria-current={active === "home" ? "page" : undefined}
          onClick={() => onNavigate("home")}
        >
          <IconHome
            size={22}
            style={{ color: active === "home" ? "#6085ff" : "#ffffff" }}
          />
          <span>Home</span>
        </button>

        {/* The elevated FAB covers this slot and is the actual control, so the
            middle item is a label only — otherwise two buttons share the name
            "Spend". */}
        <span className="nav__item" aria-hidden="true">
          <span style={{ width: 22, height: 22 }} />
          <span>Spend</span>
        </span>

        <button
          type="button"
          className="nav__item"
          aria-current={active === "account" ? "page" : undefined}
          onClick={() => onNavigate("account")}
        >
          <IconPerson size={22} />
          <span>Account</span>
        </button>
      </nav>

      <button
        type="button"
        className="fab"
        onClick={() => onNavigate("spend")}
        aria-label="Spend"
      >
        <IconWallet size={36} />
      </button>
    </>
  );
}
