"use client";

import { useCallback, useMemo, useState } from "react";
import { BALANCE, NOTIFICATIONS, TRANSACTIONS, USER } from "@/features/home/fixtures/home";
import type { HomeModal } from "@/features/home/model/modal";
import type { Transaction } from "@/features/home/model/types";
import { USER as ZONE_USER, ZONES } from "@/features/map/fixtures/zones";
import { isInAnyZone } from "@/features/map/model/geo";
import { BalanceCard } from "./BalanceCard";
import { BottomNav, type Tab } from "./BottomNav";
import { HomeHeader } from "./HomeHeader";
import { HomeModals } from "./HomeModals";
import { StatusBar } from "./StatusBar";
import { TransactionSheet } from "./TransactionSheet";

const PREVIEW_COUNT = 8;

// TEMPORARY: only the Map utility button should react to taps; every other
// trigger on the home screen is locked. Flip this back to false (or delete
// the guard usages below) to restore normal behavior.
const LOCK_NON_MAP_TRIGGERS = true;
const noop = () => {};
const noopAsync = async () => {};

interface Props {
  onOpenMap?: () => void;
}

export function HomeScreen({ onOpenMap }: Props = {}) {
  const [hidden, setHidden] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<HomeModal>({ kind: "none" });
  const [toast, setToast] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [list, setList] = useState(TRANSACTIONS);

  const close = useCallback(() => setModal({ kind: "none" }), []);

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(
      () => setToast((current) => (current === message ? null : current)),
      1900,
    );
  }, []);

  const unread = useMemo(
    () => NOTIFICATIONS.filter((n) => n.unread && !readIds.includes(n.id)).length,
    [readIds],
  );

  // Same ZONES/USER + point-in-polygon check the map header pill uses, so the
  // two never disagree about whether the user is currently in a payment zone.
  const inZone = useMemo(() => isInAnyZone(ZONE_USER, ZONES), []);

  const refresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setList((current) => [...current]);
    flash("Transactions up to date");
  }, [flash]);

  const handleNavigate = useCallback((next: Tab) => {
    if (next === "spend") {
      setModal({ kind: "spend" });
      return;
    }

    setTab(next);
    if (next === "account") setModal({ kind: "account" });
  }, []);

  const openTransaction = useCallback((tx: Transaction) => {
    setModal({ kind: "tx", tx });
  }, []);

  return (
    <div className="screen">
      <StatusBar />

      <HomeHeader
        greeting={USER.greeting}
        name={USER.name}
        avatar="/assets/home/avatar.png"
        unread={unread}
        onOpenProfile={
          LOCK_NON_MAP_TRIGGERS ? noop : () => setModal({ kind: "account" })
        }
        onOpenNotifications={
          LOCK_NON_MAP_TRIGGERS
            ? noop
            : () => {
                setReadIds(NOTIFICATIONS.map((notification) => notification.id));
                setModal({ kind: "notifications" });
              }
        }
      />

      <BalanceCard
        amount={BALANCE.usdt}
        fiat={BALANCE.vnd}
        hidden={hidden}
        inZone={inZone}
        onToggleHidden={
          LOCK_NON_MAP_TRIGGERS ? noop : () => setHidden((value) => !value)
        }
        onDeposit={
          LOCK_NON_MAP_TRIGGERS ? noop : () => setModal({ kind: "deposit" })
        }
        onSend={LOCK_NON_MAP_TRIGGERS ? noop : () => setModal({ kind: "spend" })}
      />

      <TransactionSheet
        transactions={list.slice(0, PREVIEW_COUNT)}
        onSelect={LOCK_NON_MAP_TRIGGERS ? noop : openTransaction}
        onViewAll={
          LOCK_NON_MAP_TRIGGERS ? noop : () => setModal({ kind: "all" })
        }
        onRefresh={LOCK_NON_MAP_TRIGGERS ? noopAsync : refresh}
        onOpenMap={onOpenMap}
      />

      <BottomNav
        active={tab}
        onNavigate={LOCK_NON_MAP_TRIGGERS ? noop : handleNavigate}
      />

      <HomeModals
        modal={modal}
        transactions={list}
        notificationCount={NOTIFICATIONS.length}
        onClose={close}
        onSelectTransaction={openTransaction}
        onToast={flash}
      />

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

