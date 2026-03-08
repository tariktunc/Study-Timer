"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./timer.module.scss";
import TimerButton from "./timerButton";
import StartButtons from "./startButtons";
import NextButton from "./nextButton";
import { useSelector, useDispatch } from "react-redux";
import { incrementPomoCount } from "@/Redux/Slices/timerSlice";
import { incTaskCurrent } from "@/Redux/Slices/taskSlice";
import { addSession } from "@/Redux/Slices/reportSlice";
import { playSound, startTicking, stopTicking } from "../Settings/Setting/AudioSettings/playAudio";

const MODE_CONFIG = {
  pomodoroTime: { colorKey: "focusColor", mode: "pomodoro" },
  shortBreakTime: { colorKey: "shortBreakColor", mode: "shortBreak" },
  longBreakTime: { colorKey: "longBreakColor", mode: "longBreak" },
};

export default function TimerMain() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.timerSetting);
  const { data } = useSelector((state) => state.dataAnalysis);
  const { colorSettings } = useSelector((state) => state.colorSettings);

  const [currentMinutes, setMinutes] = useState(settings.pomodoroTime);
  const [duration, setDuration] = useState(settings.pomodoroTime * 60);
  const [currentSeconds, setSeconds] = useState(0);
  const [isStop, setIsStop] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState("pomodoro");
  const [title, setTitle] = useState("StudyPomo");
  const [currentTimerKey, setCurrentTimerKey] = useState("pomodoroTime");

  const activeTask =
    data && data.length > 0
      ? data.find((d) => !d.status && d.currentSession < d.totalSessions)?.text || "StudyPomo"
      : "StudyPomo";

  const currentColor = (() => {
    const config = MODE_CONFIG[currentTimerKey];
    return config ? colorSettings[config.colorKey] : colorSettings.focusColor;
  })();

  useEffect(() => {
    document.body.style.backgroundColor = currentColor;
    document.body.style.transition = "background-color 0.5s ease";
  }, [currentColor]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  const findActiveTaskKey = useCallback(() => {
    if (!data || data.length === 0) return null;
    const active = data.find((d) => !d.status && d.currentSession < d.totalSessions);
    return active ? active.key : null;
  }, [data]);

  const countTask = useCallback(() => {
    const taskKey = findActiveTaskKey();
    if (taskKey !== null && taskKey !== undefined) {
      dispatch(incTaskCurrent(taskKey));
    }
  }, [dispatch, findActiveTaskKey]);

  const switchMode = useCallback(
    (timerKey) => {
      const config = MODE_CONFIG[timerKey];
      if (!config) return;
      const time = settings[timerKey];
      setMinutes(time);
      setDuration(time * 60);
      setSeconds(0);
      setIsRunning(false);
      setIsStop(false);
      setActiveMode(config.mode);
      setCurrentTimerKey(timerKey);
      setTitle("StudyPomo");
    },
    [settings]
  );

  const resetTimer = useCallback(() => {
    const time = settings[currentTimerKey];
    setMinutes(time);
    setDuration(time * 60);
    setSeconds(0);
    setIsRunning(false);
    setIsStop(false);
    setTitle("StudyPomo");
  }, [settings, currentTimerKey]);

  const handleTimerEnd = useCallback(() => {
    stopTicking();
    playSound(
      localStorage.getItem("selectedSound") || "alarm",
      localStorage.getItem("selectedVolume") || 50
    );

    const counter = settings.pomoCount;
    const longBreak = settings.longBreakInterval;
    const isLongBreakDue = (counter + 1) % longBreak === 0;

    let nextTimerKey;
    let shouldAutoStart = false;

    if (activeMode === "pomodoro") {
      dispatch(incrementPomoCount());
      dispatch(addSession(settings.pomodoroTime));
      countTask();
      nextTimerKey = isLongBreakDue ? "longBreakTime" : "shortBreakTime";
      shouldAutoStart = settings.autoStartBreaks;
    } else {
      nextTimerKey = "pomodoroTime";
      shouldAutoStart = settings.autoStartPomodoros;
    }

    // Switch to next mode
    const config = MODE_CONFIG[nextTimerKey];
    if (config) {
      const time = settings[nextTimerKey];
      setMinutes(time);
      setDuration(time * 60);
      setSeconds(0);
      setActiveMode(config.mode);
      setCurrentTimerKey(nextTimerKey);
      setTitle("StudyPomo");

      if (shouldAutoStart) {
        setIsRunning(true);
        setIsStop(false);
      } else {
        setIsRunning(false);
        setIsStop(false);
      }
    }
  }, [settings, activeMode, dispatch, countTask]);

  useEffect(() => {
    if (!isRunning) return;
    let timer = duration;
    const interval = setInterval(() => {
      if (--timer <= 0) {
        clearInterval(interval);
        handleTimerEnd();
      } else {
        const mins = Math.floor(timer / 60);
        const secs = timer % 60;
        setDuration(timer);
        setMinutes(String(mins).padStart(2, "0"));
        setSeconds(String(secs).padStart(2, "0"));
        setTitle(`${activeTask} ${mins}:${String(secs).padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, duration, activeTask, handleTimerEnd]);

  const handleTicking = useCallback((running) => {
    if (running) {
      const tickKey = localStorage.getItem("tickingSound") || "none";
      const tickVol = Number(localStorage.getItem("tickingVolume")) || 50;
      if (tickKey !== "none") startTicking(tickKey, tickVol);
    } else {
      stopTicking();
    }
  }, []);

  const startHandler = useCallback(() => {
    setDuration(currentMinutes * 60 + Number(currentSeconds));
    setIsRunning(true);
    handleTicking(true);
  }, [currentMinutes, currentSeconds, handleTicking]);

  const stopHandler = useCallback(() => {
    setIsStop(true);
    setIsRunning(false);
    handleTicking(false);
  }, [handleTicking]);

  const resumeHandler = useCallback(() => {
    setIsRunning(true);
    setIsStop(false);
    handleTicking(true);
  }, [handleTicking]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (!isRunning && !isStop) startHandler();
        else if (isRunning) stopHandler();
        else resumeHandler();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, isStop, startHandler, stopHandler, resumeHandler]);

  return (
    <section className={styles.container} aria-label="Pomodoro Zamanlayıcı">
      <div className={styles.timer}>
        <TimerButton activeMode={activeMode} onModeChange={switchMode} />

        <div
          id="timer-display"
          className={styles.time}
          role="timer"
          aria-live="off"
          aria-label={`${currentMinutes} dakika ${currentSeconds} saniye`}
        >
          {String(currentMinutes).padStart(2, "0")}:
          {String(currentSeconds).padStart(2, "0")}
        </div>

        <div className={styles.controls}>
          {!isRunning && !isStop && (
            <StartButtons text="START" buttonClick={startHandler} buttonColor={currentColor} />
          )}
          {isRunning && (
            <>
              <StartButtons text="PAUSE" buttonClick={stopHandler} buttonColor={currentColor} />
              <NextButton click={resetTimer} />
            </>
          )}
          {!isRunning && isStop && (
            <>
              <StartButtons text="START" buttonClick={resumeHandler} buttonColor={currentColor} />
              <NextButton click={resetTimer} />
            </>
          )}
        </div>
      </div>

      <div className={styles.pomoCounter}>#{settings.pomoCount}</div>
      <div className={styles.activeTask}>{activeTask}</div>

      <span className="sr-only" aria-live="polite">
        {isRunning ? "Zamanlayıcı çalışıyor" : "Zamanlayıcı durduruldu"}
      </span>
    </section>
  );
}
