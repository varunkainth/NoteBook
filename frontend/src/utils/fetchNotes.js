// src/utils/fetchAndStoreNotes.js

import api from '../app/api.js'; // Adjust the import path if necessary
import { store } from '../state/store'; // Adjust the import path if necessary
import { setNotes } from '../state/slices/notesSlice'; // Adjust the import path if necessary

/**
 * Fetch all notes from the API and store them in local storage.
 * Also updates the Redux store with the fetched notes.
 */
export const fetchAndStoreNotes = async () => {
  try {
    // Fetch notes from API
    const response = await api.get('/api/notes/all'); // Adjust the endpoint if necessary
    const notes = response.data.notes;

    // Save notes to local storage
    localStorage.setItem('notes', JSON.stringify(notes));

    // Update Redux store
    store.dispatch(setNotes(notes));

    console.log('Notes fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching and storing notes:', error);
  }
};
