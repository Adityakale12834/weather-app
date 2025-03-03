import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import locationReducer from "./slices/currentLocationSlice";

export const store = configureStore({
  reducer: {
    theme : themeReducer,
    location : locationReducer,
  },
})