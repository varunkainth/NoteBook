import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../state/auth/AuthSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other reducers here
  },
});


