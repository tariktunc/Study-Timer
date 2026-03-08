import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
  name: "dataAnalysis",
  initialState: {
    data: [],
  },
  reducers: {
    addData: (state, action) => {
      state.data.push(action.payload);
    },

    incTaskCurrent: (state, action) => {
      const item = state.data.find((d) => d.key === action.payload);
      if (item) item.currentSession += 1;
    },

    setStatus: (state, action) => {
      const item = state.data.find((d) => d.key === action.payload);
      if (item) item.status = !item.status;
    },

    deleteData: (state, action) => {
      state.data = state.data.filter((d) => d.key !== action.payload);
    },

    updateData: (state, action) => {
      const { key, text, totalSessions, note } = action.payload;
      const item = state.data.find((d) => d.key === key);
      if (item) {
        if (text !== undefined) item.text = text;
        if (totalSessions !== undefined) item.totalSessions = totalSessions;
        if (note !== undefined) item.note = note;
      }
    },

    reorderData: (state, action) => {
      state.data = action.payload;
    },

    clearCompleted: (state) => {
      state.data = state.data.filter(
        (d) => d.currentSession < d.totalSessions
      );
    },

    clearAll: (state) => {
      state.data = [];
    },

    clearActPomodoros: (state) => {
      state.data.forEach((d) => {
        d.currentSession = 0;
      });
    },
  },
});

export const {
  addData,
  incTaskCurrent,
  setStatus,
  deleteData,
  updateData,
  reorderData,
  clearCompleted,
  clearAll,
  clearActPomodoros,
} = dataSlice.actions;

export default dataSlice.reducer;
