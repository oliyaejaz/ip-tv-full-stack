// src/redux/episodeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch episode
export const fetchGenres = createAsyncThunk(
  'genres/fetchEpisode',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`episode/getall`, {
        params: { page, limit },
      });
      
      const { episode, totalPages, currentPage } = response.data;
      return { episode, totalPages, currentPage };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const episodeSlice = createSlice({
  name: 'episode',
  initialState: {
    list: [],
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    updateEpisodes: (state, action) => {
      state.list = action.payload.genres;
      state.totalPages = action.payload.totalPages;
    },
    addEpisode: (state, action) => {
      state.list.push(action.payload);
    },
    updateEpisode: (state, action) => {
      const index = state.list.findIndex(genre => genre.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteEpisode: (state, action) => {
      state.list = state.list.filter(episode => episode.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisode.fulfilled, (state, action) => {
        state.list = action.payload.episode;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })
      .addCase(fetchEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateEpisodes, addEpisode, updateEpisode, deleteEpisode } = episodeSlice.actions;
export default episodeSlice.reducer;
