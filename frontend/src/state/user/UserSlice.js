// src/slices/userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api'; // Your API instance

// Async thunks for user actions
export const updateUserDetails = createAsyncThunk(
  'user/updateUserDetails',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/users/update', userData);
      return response.data;
    } catch (error) {
      // Extract and return error message
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/api/users/delete');
      return response.data;
    } catch (error) {
      // Extract and return error message
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const updateProfilePic = createAsyncThunk(
  'user/updateProfilePic',
  async (fileData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', fileData.file);
      const response = await api.post('/api/users/update-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Extract and return error message
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })
      .addCase(updateProfilePic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, profilePic: action.payload.profilePic };
      })
      .addCase(updateProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
  },
});

export const { setUser, clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;
