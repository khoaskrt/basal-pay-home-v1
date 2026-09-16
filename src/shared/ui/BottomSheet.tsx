"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconClose } from "@/shared/ui/icons";

interface Props {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

const focusableSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** A reusable modal primitive with Escape, focus containment, and focus return. */
export function BottomSheet({ title, subtitle, onClose, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    trigger.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        panel.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );
      if (focusable.length === 0) {
        event.preventDefault();
        panel.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    panel.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      trigger.current?.focus();
    };
  }, [onClose]);

  return (
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="modal__grabber" aria-hidden="true" />
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <IconClose size={15} />
        </button>
        <h3 className="modal__title">{title}</h3>
        {subtitle && <p className="modal__sub">{subtitle}</p>}
        {children}
      </div>
    </>
  );
}
