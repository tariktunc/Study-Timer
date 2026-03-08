// Store.js
"use client";

import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./Slices/timerSlice";
import taskSlice from "./Slices/taskSlice";
import colorSlice from "./Slices/colorSlice";
import reportSlice from "./Slices/reportSlice";
import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "./localStorage";

const persistedState = loadStateFromLocalStorage();

const reducer = {
  timerSetting: timerReducer,
  dataAnalysis: taskSlice,
  colorSettings: colorSlice,
  report: reportSlice,
};

const store = configureStore({
  reducer,
  devTools: true,
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

export default store;
// store'un default olarak export edilmesi gerekiyor
