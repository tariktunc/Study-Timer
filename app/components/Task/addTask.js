"use client";
import React from "react";
import styles from "./task.module.scss";

export default function AddTask({ onAdd }) {
  return (
    <div className={styles.addTask}>
      <div>
        <button onClick={onAdd} aria-label="Yeni görev ekle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Görev Ekle
        </button>
      </div>
    </div>
  );
}
