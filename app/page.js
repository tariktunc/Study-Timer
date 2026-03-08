"use client";
import React, { useState } from "react";
import Navbar from "./components/Settings/Navbar";
import Setting from "./components/Settings/Setting/setting";
import Timer from "./components/Timer/timer";
import TodoList from "./components/Task/todoList";
import TimeTracking from "./components/TimeTracking/TimeTracking";
import Colorsetting from "./components/Settings/Setting/ThemeSettings/colorsetting";
import { useSelector } from "react-redux";

export default function Home() {
  const [viewSetting, setViewSetting] = useState(false);
  const [colorSetting, setColorSetting] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const { data } = useSelector((state) => state.dataAnalysis);

  const toggleSettings = () => setViewSetting(!viewSetting);

  const handleThemeSetting = () => {
    setViewSetting(!viewSetting);
    setColorSetting(!colorSetting);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        İçeriğe atla
      </a>

      <div className="flex flex-col items-center min-h-screen">
        <Navbar settingTask={toggleSettings} />

        {viewSetting && (
          <Setting
            closeSetting={toggleSettings}
            handleColorClick={(key) => {
              setSelectedKey(key);
              handleThemeSetting();
            }}
          />
        )}

        {colorSetting && (
          <Colorsetting
            closeColorSetting={handleThemeSetting}
            selectedId={selectedKey}
          />
        )}

        <main id="main-content" className="container-main">
          <Timer />
          <TodoList />
          {data.length > 0 && <TimeTracking />}
        </main>
      </div>
    </>
  );
}
