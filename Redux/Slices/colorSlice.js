import { createSlice } from "@reduxjs/toolkit";

// Pomofocus uyumlu varsayılan renkler (WCAG 2.1 AA)
export const colorSlice = createSlice({
  name: "colorSettings",
  initialState: {
    colorSettings: {
      focusColor: "#BA4949",
      shortBreakColor: "#38858A",
      longBreakColor: "#397097",
    },
  },
  reducers: {
    setColors: (state, action) => {
      const { settingName, value } = action.payload;
      state.colorSettings[settingName] = value;
    },
  },
});

export const { setColors } = colorSlice.actions;
export default colorSlice.reducer;
