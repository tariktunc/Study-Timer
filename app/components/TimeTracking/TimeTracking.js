"use client";
import { useSelector } from "react-redux";

export default function TimeTracking() {
  const { data } = useSelector((state) => state.dataAnalysis);
  const { settings } = useSelector((state) => state.timerSetting);

  const totalSessions = data.reduce((t, s) => t + s.totalSessions, 0);
  const currentSession = data.reduce((t, s) => t + s.currentSession, 0);

  function estimatedEndTime() {
    const remaining = totalSessions - currentSession;
    if (remaining <= 0) return "Tamamlandı!";

    const { pomodoroTime, shortBreakTime, longBreakTime, longBreakInterval } = settings;
    const pomoMinutes = remaining * pomodoroTime;
    const longBreaks = Math.floor(remaining / longBreakInterval);
    const shortBreaks = remaining - longBreaks - 1;
    const totalMinutes = pomoMinutes + longBreaks * longBreakTime + Math.max(0, shortBreaks) * shortBreakTime;

    const endTime = new Date(Date.now() + totalMinutes * 60000);
    return endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <section
      className="mt-6 py-4 px-6 flex justify-around items-center rounded-lg"
      style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      aria-label="İlerleme takibi"
    >
      <div className="flex items-end gap-2">
        <span className="text-sm opacity-80">Pomos:</span>
        <span className="text-xl opacity-95">
          {currentSession}/{totalSessions}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-sm opacity-80">Tahmini Bitiş:</span>
        <span className="text-xl opacity-95">{estimatedEndTime()}</span>
      </div>
    </section>
  );
}
