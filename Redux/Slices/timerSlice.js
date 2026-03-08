import { createSlice } from "@reduxjs/toolkit";

export const timerSlice = createSlice({
  name: "timerSetting",
  initialState: {
    settings: {
      pomodoroTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      pomoCount: 0,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      autoCheckTasks: true,
      checkToBottom: true,
    },
  },
  reducers: {
    setTimerSettings: (state, action) => {
      const { settingName, value } = action.payload;
      state.settings[settingName] = value;
    },
    resetPomoCount: (state) => {
      state.settings.pomoCount = 0;
    },
    incrementPomoCount: (state) => {
      state.settings.pomoCount += 1;
    },
    toggleSetting: (state, action) => {
      const key = action.payload;
      state.settings[key] = !state.settings[key];
    },
  },
});

export const {
  setTimerSettings,
  resetPomoCount,
  incrementPomoCount,
  toggleSetting,
} = timerSlice.actions;

export default timerSlice.reducer;
