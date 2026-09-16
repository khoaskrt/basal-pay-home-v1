/** 5297.89 → "5,297.89" */
export function formatAmount(value: number, maxFraction = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: maxFraction,
  });
}

/** 142235044 → "142,235,044" */
export function formatInt(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/** Wallet amounts always show cents: 25 → "25.00", 0.5 → "0.50" */
export function formatMoney(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function signedAmount(value: number, direction: "in" | "out"): string {
  return `${direction === "in" ? "+ " : "- "}${formatMoney(value)}`;
}

export function shortAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function mask(value: string, visible = 4): string {
  if (value.length <= visible) return "•".repeat(value.length);
  return `${"•".repeat(Math.max(0, value.length - visible))}${value.slice(-visible)}`;
}
