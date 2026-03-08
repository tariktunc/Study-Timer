"use client";
import React from "react";
import TaskCss from "./task.module.scss";
import VerifySVG from "../icons/verify/verify";

export default function Task({
  text,
  sessionCount,
  activeSession,
  taskId,
  editTaskClick,
  dragListeners,
}) {
  return (
    <div
      onClick={() => editTaskClick(taskId)}
      id={taskId}
      className={TaskCss.tasks}
      role="button"
      tabIndex={0}
      aria-label={`Görev: ${text}, ${activeSession}/${sessionCount} pomodoro`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          editTaskClick(taskId);
        }
      }}
    >
      {/* Drag handle */}
      <div
        {...dragListeners}
        className={TaskCss.dragHandle}
        onClick={(e) => e.stopPropagation()}
        aria-label="Sürükle ve bırak"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>

      <div className={TaskCss.tasksText}>
        <VerifySVG />
        <p>{text}</p>
      </div>
      <div className={TaskCss.task}>
        <p>{activeSession}/{sessionCount}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            editTaskClick(taskId);
          }}
          aria-label={`${text} görevini düzenle`}
          className={TaskCss.taskMenuBtn}
          style={{
            background: "none",
            width: "36px",
            height: "36px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
