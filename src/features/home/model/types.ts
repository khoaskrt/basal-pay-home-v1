export type TxDirection = "in" | "out";

export interface Transaction {
  id: string;
  title: string;
  direction: TxDirection;
  amount: number;
  /** Display timestamp, already formatted the way the design shows it. */
  date: string;
  counterparty: string;
  reference: string;
  network: string;
  fee: string;
  status: "Completed" | "Pending";
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export type UtilityId = "map" | "esim" | "flights" | "tours";

export interface Utility {
  id: UtilityId;
  label: string;
  /** Marks the tile as "coming soon": visually flagged and not tappable. */
  soon: boolean;
}
