import { createSlice } from "@reduxjs/toolkit";

// Her pomodoro tamamlandığında bir kayıt eklenir
export const reportSlice = createSlice({
  name: "report",
  initialState: {
    sessions: [],
    // Her session: { date: "2024-03-08", count: 5, focusMinutes: 125 }
  },
  reducers: {
    addSession: (state, action) => {
      const today = new Date().toISOString().split("T")[0];
      const existing = state.sessions.find((s) => s.date === today);
      const minutes = action.payload || 25;

      if (existing) {
        existing.count += 1;
        existing.focusMinutes += minutes;
      } else {
        state.sessions.push({
          date: today,
          count: 1,
          focusMinutes: minutes,
        });
      }
    },
    clearReport: (state) => {
      state.sessions = [];
    },
  },
});

export const { addSession, clearReport } = reportSlice.actions;
export default reportSlice.reducer;
