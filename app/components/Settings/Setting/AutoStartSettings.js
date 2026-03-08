"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSetting } from "@/Redux/Slices/timerSlice";

export default function AutoStartSettings() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.timerSetting);

  const toggleStyle = (enabled) => ({
    position: "relative",
    width: "44px",
    height: "24px",
    borderRadius: "var(--radius-full)",
    backgroundColor: enabled ? "var(--color-success)" : "var(--color-surface-alt)",
    border: enabled ? "none" : "2px solid var(--color-text-muted)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    flexShrink: 0,
  });

  const knobStyle = (enabled) => ({
    position: "absolute",
    top: enabled ? "2px" : "1px",
    left: enabled ? "22px" : "2px",
    width: "18px",
    height: "18px",
    borderRadius: "var(--radius-full)",
    backgroundColor: "white",
    boxShadow: "var(--shadow-sm)",
    transition: "all var(--transition-fast)",
    pointerEvents: "none",
  });

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--space-3) var(--space-5)",
  };

  const containerStyle = {
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    padding: "var(--space-2) 0",
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <label
          htmlFor="autoStartBreaks"
          style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", cursor: "pointer" }}
        >
          Molaları Otomatik Başlat
        </label>
        <button
          id="autoStartBreaks"
          role="switch"
          aria-checked={settings.autoStartBreaks}
          aria-label="Molaları otomatik başlat"
          style={toggleStyle(settings.autoStartBreaks)}
          onClick={() => dispatch(toggleSetting("autoStartBreaks"))}
        >
          <span style={knobStyle(settings.autoStartBreaks)} />
        </button>
      </div>

      <div style={rowStyle}>
        <label
          htmlFor="autoStartPomodoros"
          style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", cursor: "pointer" }}
        >
          Pomodoro&apos;ları Otomatik Başlat
        </label>
        <button
          id="autoStartPomodoros"
          role="switch"
          aria-checked={settings.autoStartPomodoros}
          aria-label="Pomodoroları otomatik başlat"
          style={toggleStyle(settings.autoStartPomodoros)}
          onClick={() => dispatch(toggleSetting("autoStartPomodoros"))}
        >
          <span style={knobStyle(settings.autoStartPomodoros)} />
        </button>
      </div>
    </div>
  );
}
