import type { Notification, Transaction, Utility } from "@/features/home/model/types";

export const USER = {
  name: "Hung Quach Bao",
  greeting: "Welcome Back!",
  email: "hung@gmail.com",
  uid: "123sw32ad",
  verified: true,
} as const;

export const BALANCE = {
  usdt: 5297.89,
  /** shown in the deposit/swap copy */
  rate: 26852,
  /** the fiat figure the frame displays next to the balance */
  vnd: 142235044,
} as const;


/**
 * Quick-access utility tiles shown between the balance card and the
 * transaction list. `soon` tiles render a "Soon" badge and are not tappable.
 */
export const UTILITIES: Utility[] = [
  { id: "map", label: "Map", soon: false },
  { id: "esim", label: "E-sim", soon: true },
  { id: "flights", label: "Flights", soon: true },
  { id: "tours", label: "Tours", soon: true },
];

/**
 * The Figma frame shows no unread badge on the bell, so the seed data starts
 * fully read; the badge renders again as soon as something is unread.
 */

/**
 * Rows 1–5 mirror the Figma frame exactly (copy, order, direction and amounts).
 * Rows 6+ continue the list so the sheet actually scrolls.
 */
export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    title: "Internal transfer to Quách Bảo Hưng",
    direction: "in",
    amount: 25,
    date: "22 OCT 2025 - 16:05",
    counterparty: "Quách Bảo Hưng",
    reference: "BP-251022-1605-8841",
    network: "Basal Pay internal",
    fee: "0.00 USDT",
    status: "Completed",
  },
  {
    id: "tx-2",
    title: "Internal transfer to Quách Bảo Hưng",
    direction: "in",
    amount: 25,
    date: "22 OCT 2025 - 16:04",
    counterparty: "Quách Bảo Hưng",
    reference: "BP-251022-1604-7213",
    network: "Basal Pay internal",
    fee: "0.00 USDT",
    status: "Completed",
  },
  {
    id: "tx-3",
    title: "Internal transfer to Hao Cao",
    direction: "in",
    amount: 0.5,
    date: "20 OCT 2025 - 11:09",
    counterparty: "Hao Cao",
    reference: "BP-251020-1109-3390",
    network: "Basal Pay internal",
    fee: "0.00 USDT",
    status: "Completed",
  },
  {
    id: "tx-4",
    title: "Withdraw to 0x5d...bed9",
    direction: "out",
    amount: 23,
    date: "17 OCT 2025 - 10:42",
    counterparty: "0x5d4f8a91c7b2e6d3a05f...bed9",
    reference: "BP-251017-1042-5567",
    network: "Base",
    fee: "0.42 USDT",
    status: "Completed",
  },
  {
    id: "tx-5",
    title: "Internal transfer to Quách Bảo Hưng",
    direction: "out",
    amount: 25,
    date: "18 OCT 2025 - 16:05",
    counterparty: "Quách Bảo Hưng",
    reference: "BP-251018-1605-1188",
    network: "Basal Pay internal",
    fee: "0.00 USDT",
    status: "Completed",
  },
  {
    id: "tx-6",
    title: "Internal transfer to Quách Bảo Hưng",
    direction: "in",
    amount: 25,
    date: "13 OCT 2025 - 10:28",
    counterparty: "Quách Bảo Hưng",
    reference: "BP-251013-1028-9042",
    network: "Basal Pay internal",
    fee: "0.00 USDT",
    status: "Completed",
  },
  {
    id: "tx-7",
    title: "Withdraw to 0x91c...44fa",
    direction: "out",
    amount: 120,
    date: "11 OCT 2025 - 09:14",
    counterparty: "0x91c3b7de5a28016fc4b9...44fa",
    reference: "BP-251011-0914-2276",
    network: "Base",
    fee: "0.38 USDT",
    status: "Completed",
  },
  {
    id: "tx-8",
    title: "Internal transfer to Hao Cao",
    direction: "in",
    amount: 12.75,
    date: "09 OCT 2025 - 21:47",
    counterparty: "Hao Cao",
    reference: "BP-251009-2147-6615",
    network: "Basal Pay internal",
    fee: "0.00 USDT",
    status: "Completed",
  },
  {
    id: "tx-9",
    title: "Deposit from 0x2b8...aa10",
    direction: "in",
    amount: 300,
    date: "07 OCT 2025 - 14:02",
    counterparty: "0x2b8f19c0d4e73a5b6c1d...aa10",
    reference: "BP-251007-1402-4408",
    network: "Base",
    fee: "0.31 USDT",
    status: "Completed",
  },
  {
    id: "tx-10",
    title: "Withdraw to 0x5d...bed9",
    direction: "out",
    amount: 48.5,
    date: "05 OCT 2025 - 08:36",
    counterparty: "0x5d4f8a91c7b2e6d3a05f...bed9",
    reference: "BP-251005-0836-7719",
    network: "Base",
    fee: "0.42 USDT",
    status: "Completed",
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    title: "You received 25.00 USDT",
    body: "Internal transfer from Quách Bảo Hưng landed in your wallet.",
    time: "2h ago",
    unread: false,
  },
  {
    id: "n-2",
    title: "Withdrawal completed",
    body: "23.00 USDT sent to 0x5d…bed9 on Base.",
    time: "5 days ago",
    unread: false,
  },
  {
    id: "n-3",
    title: "Verify your identity",
    body: "Finish KYC to remove transaction limits on your account.",
    time: "1 week ago",
    unread: false,
  },
  {
    id: "n-4",
    title: "New sign-in",
    body: "iPhone 15 Pro · Ho Chi Minh City. If this wasn't you, secure your account.",
    time: "2 weeks ago",
    unread: false,
  },
];
