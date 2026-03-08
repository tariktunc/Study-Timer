"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { resetPomoCount } from "@/Redux/Slices/timerSlice";
import { clearAll } from "@/Redux/Slices/taskSlice";
import { clearReport } from "@/Redux/Slices/reportSlice";
import HeaderStyles from "../../header.module.scss";

export default function ClearLocalStorage() {
  const dispatch = useDispatch();

  const handleClear = () => {
    if (!window.confirm("Tüm veriler ve ayarlar silinecek. Emin misiniz?")) return;

    dispatch(resetPomoCount());
    dispatch(clearAll());
    dispatch(clearReport());
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={HeaderStyles.localStorageClear}>
      <p>Verileri Temizle</p>
      <button onClick={handleClear} aria-label="Tüm verileri sil">
        Temizle
      </button>
    </div>
  );
}
