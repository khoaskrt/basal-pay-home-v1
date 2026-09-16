import { StatusBattery, StatusCellular, StatusWifi } from "@/shared/ui/icons";

export function StatusBar({ time = "10:53" }: { time?: string }) {
  return (
    <div className="statusbar">
      <span className="statusbar__time">{time}</span>
      <span className="statusbar__icons">
        <StatusCellular />
        <StatusWifi />
        <StatusBattery />
      </span>
    </div>
  );
}
