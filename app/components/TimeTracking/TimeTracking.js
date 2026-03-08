"use client";
import { useSelector } from "react-redux";

export default function TimeTracking() {
  const { data } = useSelector((state) => state.dataAnalysis);
  const { settings } = useSelector((state) => state.timerSetting);

  const totalSessions = data.reduce((t, s) => t + s.totalSessions, 0);
  const currentSession = data.reduce((t, s) => t + s.currentSession, 0);

  function getEstimate() {
    const remaining = totalSessions - currentSession;
    if (remaining <= 0) return { time: "Tamamlandı!", hours: "" };

    const { pomodoroTime, shortBreakTime, longBreakTime, longBreakInterval } = settings;
    const pomoMinutes = remaining * pomodoroTime;
    const longBreaks = Math.floor(remaining / longBreakInterval);
    const shortBreaks = remaining - longBreaks - 1;
    const totalMinutes = pomoMinutes + longBreaks * longBreakTime + Math.max(0, shortBreaks) * shortBreakTime;

    const endTime = new Date(Date.now() + totalMinutes * 60000);
    const time = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const hours = (totalMinutes / 60).toFixed(1);
    return { time, hours: `(${hours}h)` };
  }

  const estimate = getEstimate();

  return (
    <section
      className="w-full flex justify-center"
      style={{ maxWidth: "var(--max-width)", marginTop: "1.5rem" }}
      aria-label="İlerleme takibi"
    >
      <div
        className="w-full py-4 px-6 flex justify-center items-center gap-8 rounded-lg"
        style={{ backgroundColor: "rgba(0,0,0,0.1)", borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-baseline gap-1">
          <span className="text-sm opacity-80">Pomos:</span>
          <span className="text-xl font-bold opacity-95">{currentSession}</span>
          <span className="text-sm opacity-70">/ {totalSessions}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm opacity-80">Finish At:</span>
          <span className="text-xl font-bold opacity-95">{estimate.time}</span>
          {estimate.hours && (
            <span className="text-sm opacity-70">{estimate.hours}</span>
          )}
        </div>
      </div>
    </section>
  );
}
