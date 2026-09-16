"use client";

import { NOTIFICATIONS, USER } from "@/features/home/fixtures/home";
import type { HomeModal } from "@/features/home/model/modal";
import type { Transaction } from "@/features/home/model/types";
import { signedAmount } from "@/shared/lib/format";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconBank,
  IconBell,
  IconPlusCircle,
  IconQr,
  IconShield,
  IconSwap,
} from "@/shared/ui/icons";
import { TransactionRow } from "./TransactionRow";

interface Props {
  modal: HomeModal;
  transactions: Transaction[];
  notificationCount: number;
  onClose: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onToast: (message: string) => void;
}

export function HomeModals({
  modal,
  transactions,
  notificationCount,
  onClose,
  onSelectTransaction,
  onToast,
}: Props) {
  const closeWithToast = (message: string) => {
    onClose();
    onToast(message);
  };

  return (
    <>
      {modal.kind === "spend" && (
        <BottomSheet
          title="Spend"
          subtitle="Move USDT out of your Basal Pay wallet."
          onClose={onClose}
        >
          <div className="modal__list">
            <button
              type="button"
              className="modal__row"
              onClick={() => closeWithToast("Opening QR scanner…")}
            >
              <span className="modal__row-icon modal__row-icon--blue">
                <IconQr size={21} />
              </span>
              <span className="modal__row-body">
                <span className="modal__row-title">Scan to pay</span>
                <span className="modal__row-sub">
                  Pay a merchant or a friend instantly
                </span>
              </span>
            </button>

            <button
              type="button"
              className="modal__row"
              onClick={() => closeWithToast("Choose a recipient to send to")}
            >
              <span className="modal__row-icon modal__row-icon--blue">
                <IconArrowUpRight size={21} />
              </span>
              <span className="modal__row-body">
                <span className="modal__row-title">Send USDT</span>
                <span className="modal__row-sub">
                  Internal transfer or on-chain withdraw
                </span>
              </span>
            </button>

            <button
              type="button"
              className="modal__row"
              onClick={() => closeWithToast("Off-ramp quote requested")}
            >
              <span className="modal__row-icon modal__row-icon--green">
                <IconBank size={21} />
              </span>
              <span className="modal__row-body">
                <span className="modal__row-title">Withdraw to bank</span>
                <span className="modal__row-sub">
                  Cash out VND · 1 USDT ≈ 26,852 VND
                </span>
              </span>
            </button>

            <button
              type="button"
              className="modal__row"
              onClick={() => closeWithToast("Swap USDT ⇄ VND")}
            >
              <span className="modal__row-icon modal__row-icon--orange">
                <IconSwap size={21} />
              </span>
              <span className="modal__row-body">
                <span className="modal__row-title">Swap</span>
                <span className="modal__row-sub">
                  Convert between USDT and VND
                </span>
              </span>
            </button>
          </div>
        </BottomSheet>
      )}

      {modal.kind === "deposit" && (
        <BottomSheet
          title="Deposit"
          subtitle="Top up your Basal Pay wallet."
          onClose={onClose}
        >
          <div className="modal__list">
            <button
              type="button"
              className="modal__row"
              onClick={() => closeWithToast("Showing deposit address")}
            >
              <span className="modal__row-icon modal__row-icon--blue">
                <IconArrowDownLeft size={21} />
              </span>
              <span className="modal__row-body">
                <span className="modal__row-title">On-chain deposit</span>
                <span className="modal__row-sub">Base network · USDT</span>
              </span>
            </button>

            <button
              type="button"
              className="modal__row"
              onClick={() => closeWithToast("Opening bank transfer details")}
            >
              <span className="modal__row-icon modal__row-icon--green">
                <IconBank size={21} />
              </span>
              <span className="modal__row-body">
                <span className="modal__row-title">Bank transfer</span>
                <span className="modal__row-sub">
                  From any Vietnamese bank account
                </span>
              </span>
            </button>

            <button
              type="button"
              className="modal__row"
              onClick={() => closeWithToast("Top-up code generated")}
            >
              <span className="modal__row-icon modal__row-icon--neutral">
                <IconPlusCircle size={21} />
              </span>
              <span className="modal__row-body">
                <span className="modal__row-title">Cash top-up</span>
                <span className="modal__row-sub">
                  At a partner counter near you
                </span>
              </span>
            </button>
          </div>
        </BottomSheet>
      )}

      {modal.kind === "notifications" && (
        <BottomSheet
          title="Notifications"
          subtitle={`${notificationCount} recent updates`}
          onClose={onClose}
        >
          <div className="modal__list">
            {NOTIFICATIONS.map((notification) => (
              <div key={notification.id} className="modal__row">
                <span className="modal__row-icon modal__row-icon--blue">
                  <IconBell size={20} />
                </span>
                <span className="modal__row-body">
                  <span className="modal__row-title">{notification.title}</span>
                  <span className="modal__row-sub">{notification.body}</span>
                </span>
                <span className="modal__row-value modal__row-value--muted">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>
        </BottomSheet>
      )}

      {modal.kind === "account" && (
        <BottomSheet
          title="Account"
          subtitle="Manage your Basal Pay profile."
          onClose={onClose}
        >
          <div className="modal__list modal__list--account">
            <div className="modal__row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/home/avatar.png"
                alt=""
                width={42}
                height={42}
                className="modal__avatar"
              />
              <span className="modal__row-body">
                <span className="modal__row-title">{USER.name}</span>
                <span className="modal__row-sub">{USER.email}</span>
              </span>
            </div>
          </div>

          <div className="notice">
            <div className="notice__item">
              <span className="notice__dot" />
              <span className="notice__text">
                Your account is <b>verified</b>. No limit on transaction count or
                volume.
              </span>
            </div>
            <div className="notice__item">
              <span className="notice__dot notice__dot--success" />
              <span className="notice__text">
                UID <b>{USER.uid}</b>
              </span>
            </div>
          </div>

          <div className="modal__list modal__list--security">
            <button
              type="button"
              className="modal__row"
              onClick={() => onToast("Opening security settings")}
            >
              <span className="modal__row-icon modal__row-icon--green">
                <IconShield size={21} />
              </span>
              <span className="modal__row-body">
                <span className="modal__row-title">Security</span>
                <span className="modal__row-sub">
                  Passcode, devices and sessions
                </span>
              </span>
            </button>
          </div>
        </BottomSheet>
      )}

      {modal.kind === "all" && (
        <BottomSheet
          title="All transactions"
          subtitle={`${transactions.length} movements`}
          onClose={onClose}
        >
          <div className="modal__list">
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                tx={transaction}
                onSelect={onSelectTransaction}
              />
            ))}
          </div>
        </BottomSheet>
      )}

      {modal.kind === "tx" && (
        <BottomSheet
          title={modal.tx.direction === "in" ? "Received" : "Sent"}
          onClose={onClose}
        >
          <div className="tx-detail">
            <span
              className={`tx__icon tx__icon--${
                modal.tx.direction === "in" ? "in" : "out"
              } tx-detail__icon`}
            >
              {modal.tx.direction === "in" ? (
                <IconArrowDownLeft size={28} />
              ) : (
                <IconArrowUpRight size={28} />
              )}
            </span>
            <span
              className={`tx-detail__amount${
                modal.tx.direction === "in" ? " tx-detail__amount--in" : ""
              }`}
            >
              {signedAmount(modal.tx.amount, modal.tx.direction)} USDT
            </span>
            <span className="tx-detail__date">{modal.tx.date}</span>
          </div>

          <div>
            <div className="kv">
              <span className="kv__k">Type</span>
              <span className="kv__v">{modal.tx.title}</span>
            </div>
            <div className="kv">
              <span className="kv__k">Counterparty</span>
              <span className="kv__v">{modal.tx.counterparty}</span>
            </div>
            <div className="kv">
              <span className="kv__k">Reference</span>
              <span className="kv__v">{modal.tx.reference}</span>
            </div>
            <div className="kv">
              <span className="kv__k">Network</span>
              <span className="kv__v">{modal.tx.network}</span>
            </div>
            <div className="kv">
              <span className="kv__k">Network fee</span>
              <span className="kv__v">{modal.tx.fee}</span>
            </div>
            <div className="kv">
              <span className="kv__k">Status</span>
              <span className="kv__v kv__v--success">{modal.tx.status}</span>
            </div>
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="balance__btn balance__btn--deposit balance__btn--quiet"
              onClick={() => {
                onClose();
                void navigator.clipboard?.writeText(modal.tx.reference);
                onToast("Reference copied");
              }}
            >
              Copy reference
            </button>
            <button
              type="button"
              className="balance__btn balance__btn--send"
              onClick={() => closeWithToast("This month's history requested")}
            >
              See all history
            </button>
          </div>
        </BottomSheet>
      )}
    </>
  );
}
