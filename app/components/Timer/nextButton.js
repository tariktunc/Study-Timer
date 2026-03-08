"use client";
import React from "react";
import styles from "./timer.module.scss";

export default function NextButton({ click }) {
  return (
    <button
      onClick={click}
      className={styles.nextBtn}
      aria-label="Zamanlayıcıyı sıfırla"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M13 17l5-5-5-5M6 17l5-5-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
