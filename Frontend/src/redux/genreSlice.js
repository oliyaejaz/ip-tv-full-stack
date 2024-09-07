// src/redux/genreSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch genres
export const fetchGenres = createAsyncThunk(
  'genres/fetchGenres',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`genre/getall`, {
        params: { page, limit },
      });
      
      const { genres, totalPages, currentPage } = response.data;
      return { genres, totalPages, currentPage };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const genreSlice = createSlice({
  name: 'genres',
  initialState: {
    list: [],
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    updateGenres: (state, action) => {
      state.list = action.payload.genres;
      state.totalPages = action.payload.totalPages;
    },
    addGenre: (state, action) => {
      state.list.push(action.payload);
    },
    updateGenre: (state, action) => {
      const index = state.list.findIndex(genre => genre.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteGenre: (state, action) => {
      state.list = state.list.filter(genre => genre.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.list = action.payload.genres;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateGenres, addGenre, updateGenre, deleteGenre } = genreSlice.actions;
export default genreSlice.reducer;
