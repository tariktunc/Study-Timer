"use client";
import React from "react";
import styles from "./timer.module.scss";

export default function StartButtons({ text, buttonClick, buttonColor }) {
  return (
    <button
      className={styles.startBtn}
      onClick={buttonClick}
      style={{ color: buttonColor }}
      aria-label={text === "START" ? "Zamanlayıcıyı başlat" : "Zamanlayıcıyı durdur"}
    >
      {text}
    </button>
  );
}
