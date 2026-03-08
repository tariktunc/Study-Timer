"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSetting } from "@/Redux/Slices/timerSlice";
import Themesetting from "./ThemeSettings/themesetting";
import TimerSettings from "./TimerSettings/timersettings";
import LongBreakInterval from "./LongBreakInterval/longBreakInterval";
import HeaderStyles from "../header.module.scss";
import AudioSettings from "./AudioSettings/audiosettings";
import AutoStartSettings from "./AutoStartSettings";
import ClearLocalStorage from "./ClearLocalStorage/clearLocalStorage";

function SectionHeader({ icon, title }) {
  return (
    <>
      <div className={HeaderStyles.sectionHeader}>
        {icon}
        <span>{title}</span>
      </div>
      <div className={HeaderStyles.sectionDivider} />
    </>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        backgroundColor: checked ? "#4caf50" : "#ccc",
        position: "relative",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: "block",
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#fff",
          position: "absolute",
          top: 2,
          left: checked ? 20 : 2,
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

export default function Setting({ closeSetting, handleColorClick }) {
  const dispatch = useDispatch();
  const { autoCheckTasks, checkToBottom } = useSelector(
    (state) => state.timerSetting.settings
  );

  return (
    <div
      className={HeaderStyles.setting}
      role="dialog"
      aria-modal="true"
      aria-label="Ayarlar"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSetting();
      }}
    >
      <div className={HeaderStyles.container}>
        <div className={HeaderStyles.headerTitle}>
          <p>AYARLAR</p>
          <button onClick={closeSetting} aria-label="Ayarları kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* TIMER Section */}
        <SectionHeader
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="TIMER"
        />
        <TimerSettings />
        <AutoStartSettings />
        <LongBreakInterval />

        {/* TASK Section */}
        <SectionHeader
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="TASK"
        />
        <div className={HeaderStyles.taskSettingRow}>
          <span>Otomatik Görev Tamamlama</span>
          <ToggleSwitch
            checked={autoCheckTasks}
            onChange={() => dispatch(toggleSetting("autoCheckTasks"))}
          />
        </div>
        <div className={HeaderStyles.taskSettingRow}>
          <span>Tamamlananları Alta Taşı</span>
          <ToggleSwitch
            checked={checkToBottom}
            onChange={() => dispatch(toggleSetting("checkToBottom"))}
          />
        </div>

        {/* SOUND Section */}
        <SectionHeader
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="SOUND"
        />
        <AudioSettings />

        {/* THEME Section */}
        <SectionHeader
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="8" r="2" fill="currentColor" />
              <circle cx="8" cy="14" r="2" fill="currentColor" />
              <circle cx="16" cy="14" r="2" fill="currentColor" />
            </svg>
          }
          title="THEME"
        />
        <Themesetting handleButtonClick={handleColorClick} />
        <ClearLocalStorage />

        <div className={HeaderStyles.modal}>
          <button className={HeaderStyles.okButton} onClick={closeSetting}>OK</button>
        </div>
      </div>
    </div>
  );
}
