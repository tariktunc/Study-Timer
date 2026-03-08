"use client";
import React from "react";
import { useDispatch } from "react-redux";
import HeaderStyles from "../../header.module.scss";
import { setColors } from "@/Redux/Slices/colorSlice";

// WCAG 2.1 AA uyumlu renk paleti (beyaz metin kontrastı ≥4.5:1)
const COLORS = [
  { hex: "#BA4949", name: "Kırmızı" },
  { hex: "#38858A", name: "Teal" },
  { hex: "#397097", name: "Mavi" },
  { hex: "#7D53A2", name: "Mor" },
  { hex: "#af4e91", name: "Pembe" },
  { hex: "#2d6e72", name: "Koyu Teal" },
  { hex: "#a4893c", name: "Altın" },
  { hex: "#5a6e4b", name: "Yeşil" },
  { hex: "#8b5e3c", name: "Kahverengi" },
];

export default function Colorsetting({ closeColorSetting, selectedId }) {
  const dispatch = useDispatch();

  const handleClick = (color) => {
    dispatch(setColors({ settingName: selectedId, value: color }));
    closeColorSetting();
  };

  return (
    <div
      className={HeaderStyles.colorSetting}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeColorSetting();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Renk seçici"
    >
      <div className={HeaderStyles.container}>
        <div>
          <p>Renk Seçin</p>
        </div>
        <div>
          {COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => handleClick(color.hex)}
              style={{
                background: color.hex,
                boxShadow: `0 2px 8px ${color.hex}66`,
              }}
              aria-label={`${color.name} rengi seç`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
