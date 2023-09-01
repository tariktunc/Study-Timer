"use client";
import React, { useState, useEffect } from "react";
import TimerCss from "./timer.module.scss";

export default function TimerMain(props) {
  const [activeButton, setActiveButton] = useState("pomodoro");

  useEffect(() => {
    if (activeButton === "pomodoro") {
      document.body.style.backgroundColor = "#ba4949"; // Aktifken arka plan rengi olarak istediğiniz rengi ayarlayın
      document.body.style.transition = "1s";
    } else if (activeButton === "shortBreak") {
      document.body.style.backgroundColor = "#38858A";
      document.body.style.transition = "1s";
    } else if (activeButton === "longBreak") {
      document.body.style.backgroundColor = "#7D53A2";
      document.body.style.transition = "1s";
    } else {
      document.body.style.backgroundColor = ""; // Aktif buton yoksa varsayılan rengi kullanın
    }

    // Temizlik fonksiyonu
    return () => {
      document.body.style.backgroundColor = ""; // Bileşen kaldırıldığında varsayılan rengi geri yükle
    };
  }, [activeButton]);

  const handleClickButton = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className={TimerCss.container}>
      <div className={TimerCss.timer}>
        <div className={TimerCss.button}>
          <button
            className={activeButton === "pomodoro" ? "buttonActive" : ""}
            onClick={() => handleClickButton("pomodoro")}>
            {props.pomodoro}
          </button>
          <button
            className={activeButton === "shortBreak" ? "buttonActive" : ""}
            onClick={() => handleClickButton("shortBreak")}>
            {props.shortBreak}
          </button>
          <button
            className={activeButton === "longBreak" ? "buttonActive" : ""}
            onClick={() => handleClickButton("longBreak")}>
            {props.longBreak}
          </button>
        </div>

        <div className={TimerCss.time}>{props.remainingTime}</div>

        <div className={TimerCss.start}>
          <button>{props.start}</button>
        </div>
      </div>
      <div className={TimerCss.level}>{props.level}</div>
      <div className={TimerCss.tasksLevel}>{props.taskLevel}</div>
    </div>
  );
}