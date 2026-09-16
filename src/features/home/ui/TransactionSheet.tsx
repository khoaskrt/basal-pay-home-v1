"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Transaction } from "@/features/home/model/types";
import { TransactionRow } from "./TransactionRow";
import { UtilitiesSection } from "./UtilitiesSection";
import { IconChevronRight } from "@/shared/ui/icons";

interface Props {
  transactions: Transaction[];
  onSelect: (tx: Transaction) => void;
  onViewAll: () => void;
  onRefresh: () => Promise<void>;
  onOpenMap?: () => void;
}

const PULL_THRESHOLD = 56;
const MAX_PULL = 84;

export function TransactionSheet({
  transactions,
  onSelect,
  onViewAll,
  onRefresh,
  onOpenMap,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ y: number; active: boolean } | null>(null);

  const runRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  /* --- pull to refresh: pointer driven, only when the list is at the top --- */
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el || el.scrollTop > 0 || refreshing) return;
    drag.current = { y: e.clientY, active: true };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!drag.current?.active || !el) return;
    const dy = e.clientY - drag.current.y;
    if (dy <= 0) {
      setPull(0);
      return;
    }
    if (el.scrollTop > 0) {
      drag.current.active = false;
      setDragging(false);
      setPull(0);
      return;
    }
    // rubber-band resistance
    setPull(Math.min(MAX_PULL, dy * 0.52));
  };

  const endDrag = () => {
    if (!drag.current?.active) return;
    drag.current = null;
    setDragging(false);
    setPull((current) => {
      if (current >= PULL_THRESHOLD) void runRefresh();
      return 0;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void runRefresh();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runRefresh]);

  const offset = refreshing ? PULL_THRESHOLD : pull;

  return (
    <section className="sheet" aria-label="Wallet activity">
      <UtilitiesSection
        onSelect={onOpenMap ? (id) => id === "map" && onOpenMap() : undefined}
      />

      <div className="sheet__head">
        <h2 className="sheet__title">Transaction history</h2>
        <button type="button" className="sheet__viewall" onClick={onViewAll}>
          View all
          <IconChevronRight size={16} />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="sheet__scroll"
        style={{
          transform: `translateY(${offset}px)`,
          transition: dragging ? "none" : "transform 0.32s var(--bp-ease)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} onSelect={onSelect} />
        ))}
      </div>

      {(offset > 0 || refreshing) && (
        <div
          className="ptr"
          style={{ top: `calc(var(--bp-sheet-top) + ${offset / 2 - 13}px)` }}
        >
          <div
            className="ptr__spinner"
            style={
              refreshing
                ? undefined
                : { animation: "none", transform: `rotate(${offset * 4}deg)` }
            }
          />
        </div>
      )}

      <div className="sheet__fade" aria-hidden="true" />
    </section>
  );
}
