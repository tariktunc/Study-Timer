"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./task.module.scss";
import { useDispatch } from "react-redux";
import { updateData, deleteData } from "@/Redux/Slices/taskSlice";

export default function EditTask({ task, onClose }) {
  const dispatch = useDispatch();
  const [text, setText] = useState(task.text);
  const [count, setCount] = useState(task.totalSessions);
  const [note, setNote] = useState(task.note || "");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (text.trim().length === 0) return;
    dispatch(
      updateData({
        key: task.key,
        text: text.trim(),
        totalSessions: count,
        note: note.trim(),
      })
    );
    onClose();
  };

  const handleDelete = () => {
    dispatch(deleteData(task.key));
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSave();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className={styles.newTask} role="dialog" aria-label="Görevi düzenle">
      <div className={styles.inputValue}>
        <input
          ref={inputRef}
          className={styles.newItemText}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          maxLength={50}
          placeholder="Görev adı"
          aria-label="Görev adı"
        />
      </div>

      <div className={styles.setNumber}>
        <div className={styles.title}>
          <p>
            Tamamlanan / Tahmini Pomodoro
          </p>
        </div>
        <div className={styles.values}>
          <div className={styles.number} aria-label={`Tamamlanan: ${task.currentSession}`}>
            {task.currentSession}
          </div>
          <span style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-lg)" }}>/</span>
          <div className={styles.number} aria-label={`Tahmini: ${count}`}>
            {count}
          </div>
          <button
            onClick={() => count < 99 && setCount(count + 1)}
            aria-label="Pomodoro sayısını artır"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => count > 1 && setCount(count - 1)}
            aria-label="Pomodoro sayısını azalt"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Note area */}
      <div style={{ padding: "0 1.5rem 1rem" }}>
        <p style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-2)",
          fontWeight: "var(--font-weight-bold)",
        }}>
          Not
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Görev hakkında not ekle..."
          maxLength={500}
          rows={3}
          aria-label="Görev notu"
          style={{
            width: "100%",
            padding: "var(--space-3)",
            borderRadius: "var(--radius-md)",
            border: "none",
            backgroundColor: "var(--color-surface-alt)",
            fontFamily: "inherit",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-primary)",
            resize: "vertical",
            outline: "none",
          }}
        />
      </div>

      <div className={styles.saveOrcancel}>
        <div className={styles.delete}>
          <button onClick={handleDelete} aria-label="Görevi sil">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div>
          <button onClick={onClose}>İptal</button>
          <button className={styles.save} onClick={handleSave}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
