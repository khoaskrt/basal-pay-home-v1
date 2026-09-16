"use client";

import type { Transaction } from "@/features/home/model/types";
import { signedAmount } from "@/shared/lib/format";
import { IconArrowDownLeft, IconArrowUpRight } from "@/shared/ui/icons";

interface Props {
  tx: Transaction;
  onSelect: (tx: Transaction) => void;
}

export function TransactionRow({ tx, onSelect }: Props) {
  const isIn = tx.direction === "in";

  return (
    <button
      type="button"
      className="tx"
      onClick={() => onSelect(tx)}
      aria-label={`${tx.title}, ${signedAmount(tx.amount, tx.direction)} USDT, ${tx.date}`}
    >
      <span className={`tx__icon tx__icon--${isIn ? "in" : "out"}`}>
        {isIn ? <IconArrowDownLeft size={22} /> : <IconArrowUpRight size={22} />}
      </span>

      <span className="tx__main">
        {/* The amount is centred on the title block, not on the whole row —
            that is how the frame lays it out. */}
        <span className="tx__head">
          <span className="tx__title">{tx.title}</span>
          <span className={`tx__amount tx__amount--${isIn ? "in" : "out"}`}>
            {signedAmount(tx.amount, tx.direction)}
          </span>
        </span>
        <span className="tx__date">{tx.date}</span>
      </span>
    </button>
  );
}
