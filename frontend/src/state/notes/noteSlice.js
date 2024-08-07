/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api.js'; // Your API instance

// Async thunks for CRUD operations
export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/api/notes/create', noteData); // Adjusted endpoint
      dispatch(fetchNotes()); // Fetch all notes after creation to ensure the list is updated
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/notes/all'); // Adjusted endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ noteId, noteData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/api/notes/${noteId}`, noteData);
      dispatch(fetchNotes()); // Fetch all notes after update to ensure the list is updated
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/api/notes/${noteId}`);
      dispatch(fetchNotes()); // Fetch all notes after deletion to ensure the list is updated
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeAttachment = createAsyncThunk(
  'notes/removeAttachment',
  async ({ noteId, attachmentId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/api/notes/${noteId}/attachments/${attachmentId}`);
      dispatch(fetchNotes()); // Fetch all notes after removing an attachment
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveCoordinates = createAsyncThunk(
  'notes/saveCoordinates',
  async ({ noteId, coordinates }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/notes/${noteId}/coordinates`, coordinates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCoordinates = createAsyncThunk(
  'notes/getCoordinates',
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/notes/${noteId}/coordinates`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Save notes to local storage
export const saveNotesToLocalStorage = (notes) => (dispatch) => {
  localStorage.setItem('notes', JSON.stringify(notes));
  dispatch(setNotes(notes));
};

// Load notes from local storage
export const loadNotesFromLocalStorage = () => (dispatch) => {
  const savedNotes = localStorage.getItem('notes');
  if (savedNotes) {
    dispatch(setNotes(JSON.parse(savedNotes)));
  }
};

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    updateNotePosition: (state, action) => {
      const { noteId, x, y } = action.payload;
      const noteIndex = state.notes.findIndex(note => note._id === noteId);
      if (noteIndex !== -1) {
        state.notes[noteIndex].x = x;
        state.notes[noteIndex].y = y;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        // Notes are fetched in the `createNote` thunk
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes; // Make sure this matches the structure of your response
        localStorage.setItem('notes', JSON.stringify(action.payload.notes)); // Update local storage
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        // Notes are fetched in the `updateNote` thunk
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        // Notes are fetched in the `deleteNote` thunk
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(removeAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAttachment.fulfilled, (state, action) => {
        state.loading = false;
        // Notes are fetched in the `removeAttachment` thunk
      })
      .addCase(removeAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(saveCoordinates.fulfilled, (state, action) => {
        const { noteId, coordinates } = action.payload;
        const noteIndex = state.notes.findIndex(note => note._id === noteId);
        if (noteIndex !== -1) {
          state.notes[noteIndex].x = coordinates.x;
          state.notes[noteIndex].y = coordinates.y;
        }
      })
      .addCase(getCoordinates.fulfilled, (state, action) => {
        const { noteId, coordinates } = action.payload;
        const noteIndex = state.notes.findIndex(note => note._id === noteId);
        if (noteIndex !== -1) {
          state.notes[noteIndex].x = coordinates.x;
          state.notes[noteIndex].y = coordinates.y;
        }
      })
  },
});

export const { setNotes,updateNotePosition } = notesSlice.actions;

export default notesSlice.reducer;
