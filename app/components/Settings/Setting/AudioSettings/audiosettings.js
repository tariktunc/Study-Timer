"use client";
import React, { useState, useEffect } from "react";
import { playSound, stopSound, SOUND_MAP, TICKING_MAP } from "./playAudio";
import AudioCss from "../../header.module.scss";

const Audiosettings = () => {
  const [volume, setVolume] = useState(50);
  const [selectedSound, setSelectedSound] = useState("alarm");
  const [tickingSound, setTickingSound] = useState("none");
  const [tickingVolume, setTickingVol] = useState(50);
  const [repeatCount, setRepeatCount] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVolume(Number(localStorage.getItem("selectedVolume")) || 50);
      setSelectedSound(localStorage.getItem("selectedSound") || "alarm");
      setTickingSound(localStorage.getItem("tickingSound") || "none");
      setTickingVol(Number(localStorage.getItem("tickingVolume")) || 50);
      setRepeatCount(Number(localStorage.getItem("alarmRepeat")) || 1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedVolume", volume);
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("selectedSound", selectedSound);
  }, [selectedSound]);

  useEffect(() => {
    localStorage.setItem("tickingSound", tickingSound);
  }, [tickingSound]);

  useEffect(() => {
    localStorage.setItem("tickingVolume", tickingVolume);
  }, [tickingVolume]);

  useEffect(() => {
    localStorage.setItem("alarmRepeat", repeatCount);
  }, [repeatCount]);

  const playSoundDemo = () => {
    stopSound();
    playSound(selectedSound, volume);
  };

  const sectionTitle = {
    fontSize: "var(--font-size-xs)",
    color: "var(--color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginTop: "var(--space-3)",
    marginBottom: "var(--space-1)",
  };

  return (
    <div className={AudioCss.audiosettings}>
      <h3>Ses Ayarları</h3>

      {/* Alarm Sound */}
      <div>
        <span style={sectionTitle}>Alarm Sesi</span>
        <select
          value={selectedSound}
          onChange={(e) => setSelectedSound(e.target.value)}
          aria-label="Alarm sesi seçin"
        >
          {Object.keys(SOUND_MAP).map((key) => (
            <option key={key} value={key}>
              {SOUND_MAP[key].name}
            </option>
          ))}
        </select>
      </div>

      {/* Alarm Volume */}
      <div>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          {volume}%
        </span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label={`Alarm ses seviyesi: ${volume}%`}
        />
      </div>

      {/* Alarm Repeat */}
      <div>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Tekrar: {repeatCount}x
        </span>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={repeatCount}
          onChange={(e) => setRepeatCount(Number(e.target.value))}
          aria-label={`Alarm tekrar sayısı: ${repeatCount}`}
        />
      </div>

      {/* Test Button */}
      <div>
        <button onClick={playSoundDemo}>Sesi Test Et</button>
      </div>

      {/* Ticking Sound */}
      <div style={{ marginTop: "var(--space-3)", paddingTop: "var(--space-3)", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <span style={sectionTitle}>Tikleme Sesi</span>
        <select
          value={tickingSound}
          onChange={(e) => setTickingSound(e.target.value)}
          aria-label="Tikleme sesi seçin"
        >
          {Object.keys(TICKING_MAP).map((key) => (
            <option key={key} value={key}>
              {TICKING_MAP[key].name}
            </option>
          ))}
        </select>
      </div>

      {tickingSound !== "none" && (
        <div>
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
            {tickingVolume}%
          </span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={tickingVolume}
            onChange={(e) => setTickingVol(Number(e.target.value))}
            aria-label={`Tikleme ses seviyesi: ${tickingVolume}%`}
          />
        </div>
      )}
    </div>
  );
};

export default Audiosettings;
