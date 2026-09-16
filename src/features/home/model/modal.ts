import type { Transaction } from "./types";

export type HomeModal =
  | { kind: "none" }
  | { kind: "spend" }
  | { kind: "deposit" }
  | { kind: "notifications" }
  | { kind: "account" }
  | { kind: "all" }
  | { kind: "tx"; tx: Transaction };
