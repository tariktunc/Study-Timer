"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./task.module.scss";
import { useDispatch } from "react-redux";
import { addData } from "@/Redux/Slices/taskSlice";

export default function NewTask({ savesTask, cancelTask }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [text, setText] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleArrow = (direction) => {
    if (direction === "up" && count < 99) setCount(count + 1);
    if (direction === "down" && count > 1) setCount(count - 1);
  };

  const saveTask = () => {
    if (text.trim().length === 0) return;

    dispatch(
      addData({
        key: Date.now(),
        text: text.trim(),
        currentSession: 0,
        totalSessions: count,
        status: false,
        note: note.trim(),
      })
    );
    savesTask();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveTask();
    if (e.key === "Escape") cancelTask();
  };

  return (
    <div className={styles.newTask} role="dialog" aria-label="Yeni görev ekle">
      <div className={styles.inputValue}>
        <input
          ref={inputRef}
          className={styles.newItemText}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          maxLength={50}
          placeholder="Ne üzerinde çalışıyorsun?"
          aria-label="Görev adı"
        />
      </div>

      <div className={styles.setNumber}>
        <div className={styles.title}>
          <p>Tahmini Pomodoro</p>
        </div>
        <div className={styles.values}>
          <div className={styles.number} aria-label={`Pomodoro sayısı: ${count}`}>
            {count}
          </div>
          <button
            onClick={() => handleArrow("up")}
            aria-label="Pomodoro sayısını artır"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => handleArrow("down")}
            aria-label="Pomodoro sayısını azalt"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {!showNote ? (
        <div className={styles.addNoteLink}>
          <button onClick={() => setShowNote(true)}>+ Not Ekle</button>
        </div>
      ) : (
        <div className={styles.noteArea}>
          <textarea
            value={note}
            onChange={(e) => {
              if (e.target.value.length <= 500) setNote(e.target.value);
            }}
            placeholder="Not ekleyin..."
            maxLength={500}
            aria-label="Görev notu"
          />
          <div className={styles.charCount}>{note.length}/500</div>
        </div>
      )}

      <div className={styles.saveOrcancel}>
        <div className={styles.delete}>
          <button onClick={cancelTask} aria-label="Görevi iptal et">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div>
          <button onClick={cancelTask}>İptal</button>
          <button className={styles.save} onClick={saveTask}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
