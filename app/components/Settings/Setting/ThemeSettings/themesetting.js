"use client";
import React from "react";
import { useSelector } from "react-redux";
import HeaderStyles from "../../header.module.scss";

const THEME_BUTTONS = [
  { key: "focusColor", label: "Pomodoro" },
  { key: "shortBreakColor", label: "Kısa Mola" },
  { key: "longBreakColor", label: "Uzun Mola" },
];

export default function Themesetting({ handleButtonClick }) {
  const { colorSettings } = useSelector((state) => state.colorSettings);

  return (
    <div className={HeaderStyles.themesetting}>
      <p>Tema Renkleri</p>
      <div>
        <p>Renk Teması</p>
        <div>
          {THEME_BUTTONS.map((btn) => (
            <button
              key={btn.key}
              onClick={() => handleButtonClick(btn.key)}
              style={{ background: colorSettings[btn.key] }}
              aria-label={`${btn.label} rengini değiştir`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
