"use client";
import React from "react";
import TaskCss from "./task.module.scss";
import TrashSVG from "../icons/trash/trash";

export default function EndTask({ text, sessionCount, activeSession, deleteItem }) {
  return (
    <div className={TaskCss.Endtasks} aria-label={`Tamamlandı: ${text}`}>
      <div className={TaskCss.tasksText}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#4caf50" />
          <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>{text}</p>
      </div>
      <div className={TaskCss.task}>
        <p>{activeSession}/{sessionCount}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteItem();
          }}
          aria-label={`${text} görevini sil`}
        >
          <TrashSVG />
        </button>
      </div>
    </div>
  );
}
