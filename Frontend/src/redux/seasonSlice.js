// src/redux/seasonSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch season
export const fetchSeason = createAsyncThunk(
  'genres/fetchSeason',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`season/getall`, {
        params: { page, limit },
      });
      
      const { season, totalPages, currentPage } = response.data;
      return { season, totalPages, currentPage };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const seasonSlice = createSlice({
  name: 'season',
  initialState: {
    list: [],
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    updateSeasons: (state, action) => {
      state.list = action.payload.genres;
      state.totalPages = action.payload.totalPages;
    },
    addSeason: (state, action) => {
      state.list.push(action.payload);
    },
    updateSeason: (state, action) => {
      const index = state.list.findIndex(season => season.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteSeason: (state, action) => {
      state.list = state.list.filter(season => season.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeason.fulfilled, (state, action) => {
        state.list = action.payload.genres;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })
      .addCase(fetchSeason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateSeasons, addSeason, updateSeason, deleteSeason } = seasonSlice.actions;
export default seasonSlice.reducer;
