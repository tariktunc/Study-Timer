"use client";
import React from "react";
import HeaderStyles from "../../header.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { setTimerSettings } from "@/Redux/Slices/timerSlice";

const TIMER_FIELDS = [
  { key: "pomodoroTime", label: "Pomodoro", min: 1, max: 120 },
  { key: "shortBreakTime", label: "Kısa Mola", min: 1, max: 60 },
  { key: "longBreakTime", label: "Uzun Mola", min: 1, max: 60 },
];

export default function TimerSettings() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.timerSetting);

  const handleChange = (settingName, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1) {
      dispatch(setTimerSettings({ settingName, value: num }));
    }
  };

  return (
    <div className={HeaderStyles.timerSettting}>
      {TIMER_FIELDS.map((field) => (
        <div key={field.key}>
          <p>{field.label}</p>
          <input
            type="number"
            min={field.min}
            max={field.max}
            step="1"
            value={settings[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
            aria-label={`${field.label} süresi (dakika)`}
          />
        </div>
      ))}
    </div>
  );
}
