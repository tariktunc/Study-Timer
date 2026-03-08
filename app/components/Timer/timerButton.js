"use client";
import React from "react";
import styles from "./timer.module.scss";

const MODES = [
  { id: "pomodoroTime", title: "pomodoro", label: "Pomodoro" },
  { id: "shortBreakTime", title: "shortBreak", label: "Kısa Mola" },
  { id: "longBreakTime", title: "longBreak", label: "Uzun Mola" },
];

export default function TimerButton({ activeMode, onModeChange }) {
  return (
    <div className={styles.modeSelector} role="tablist" aria-label="Zamanlayıcı modu">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          role="tab"
          aria-selected={activeMode === mode.title}
          aria-controls="timer-display"
          className={`${styles.modeBtn} ${
            activeMode === mode.title ? styles.modeBtnActive : ""
          }`}
          onClick={() => onModeChange(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
