"use client";

import { formatAmount, formatInt } from "@/shared/lib/format";
import { IconDepositCircle, IconEye, IconEyeOff, IconSendCircle } from "@/shared/ui/icons";

interface Props {
  amount: number;
  fiat: number;
  hidden: boolean;
  inZone: boolean;
  onToggleHidden: () => void;
  onDeposit: () => void;
  onSend: () => void;
}

export function BalanceCard({
  amount,
  fiat,
  hidden,
  inZone,
  onToggleHidden,
  onDeposit,
  onSend,
}: Props) {
  return (
    <section className="balance" aria-label="Wallet balance">
      <div className="balance__art" aria-hidden="true" />

      <div className="balance__top">
        <div className="balance__badges">
          <span className="balance__verified">
            <span className="balance__verified-dot" />
            Verified
          </span>

          <span className={`balance__zone${inZone ? "" : " balance__zone--out"}`}>
            <span className="balance__zone-dot" />
            {inZone ? "In zone" : "Out of zone"}
          </span>
        </div>

        <button
          type="button"
          className="balance__eye"
          onClick={onToggleHidden}
          aria-pressed={hidden}
          aria-label={hidden ? "Show balance" : "Hide balance"}
        >
          {hidden ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </button>
      </div>

      <div className="balance__body">
        <div className="balance__label">Available balance</div>

        <div className="balance__amount">
          {hidden ? (
            <span className="balance__mask" aria-label="Balance hidden">
              {Array.from({ length: 7 }).map((_, i) => (
                <i key={i} />
              ))}
            </span>
          ) : (
            <span className="balance__value">{formatAmount(amount)}</span>
          )}
          <span className="balance__ticker">USDT</span>
        </div>

        <div className="balance__fiat">
          {hidden ? "≈ •••,•••,••• VND" : `≈ ${formatInt(fiat)} VND`}
        </div>
      </div>

      <div className="balance__actions">
        <button
          type="button"
          className="balance__btn balance__btn--deposit"
          onClick={onDeposit}
        >
          <IconDepositCircle size={22} />
          Deposit
        </button>
        <button
          type="button"
          className="balance__btn balance__btn--send"
          onClick={onSend}
        >
          <IconSendCircle size={22} />
          Send
        </button>
      </div>
    </section>
  );
}
