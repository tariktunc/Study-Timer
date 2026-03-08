"use client";
import React from "react";
import Themesetting from "./ThemeSettings/themesetting";
import TimerSettings from "./TimerSettings/timersettings";
import LongBreakInterval from "./LongBreakInterval/longBreakInterval";
import HeaderStyles from "../header.module.scss";
import AudioSettings from "./AudioSettings/audiosettings";
import AutoStartSettings from "./AutoStartSettings";
import ClearLocalStorage from "./ClearLocalStorage/clearLocalStorage";

export default function Setting({ closeSetting, handleColorClick }) {
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

        <TimerSettings />
        <AutoStartSettings />
        <LongBreakInterval />
        <Themesetting handleButtonClick={handleColorClick} />
        <AudioSettings />
        <ClearLocalStorage />

        <div className={HeaderStyles.modal}>
          <button onClick={closeSetting}>Kapat</button>
        </div>
      </div>
    </div>
  );
}
