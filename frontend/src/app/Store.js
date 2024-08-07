import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../state/auth/AuthSlice';
import notesReducer from '../state/notes/noteSlice'; // Import the notesReducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer, // Add the notesReducer here
    // add other reducers here
  },
});
