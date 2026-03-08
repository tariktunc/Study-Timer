"use client";
import React from "react";
import HeaderStyles from "../../header.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { setTimerSettings } from "@/Redux/Slices/timerSlice";

export default function LongBreakInterval() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.timerSetting);

  const onChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      dispatch(setTimerSettings({ settingName: "longBreakInterval", value: val }));
    }
  };

  return (
    <div className={HeaderStyles.longBreakInterval}>
      <p>Uzun Mola Aralığı</p>
      <input
        type="number"
        onChange={onChange}
        value={settings.longBreakInterval}
        min="1"
        max="60"
        aria-label="Uzun mola aralığı (pomodoro sayısı)"
      />
    </div>
  );
}
