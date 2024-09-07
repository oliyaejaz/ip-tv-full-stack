// src/redux/seriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch series
export const fetchSeries = createAsyncThunk(
  'series/fetchSeries',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`series/getall`, {
        params: { page, limit },
      });
      
      const { series, totalPages, currentPage } = response.data;
      return { series, totalPages, currentPage };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const seriesSlice = createSlice({
  name: 'series',
  initialState: {
    list: [],
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    updateSeries: (state, action) => {
      state.list = action.payload.series;
      state.totalPages = action.payload.totalPages;
    },
    addSeries: (state, action) => {
      state.list.push(action.payload);
    },
    updateSerie: (state, action) => {
      const index = state.list.findIndex(series => series.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteSeries: (state, action) => {
      state.list = state.list.filter(series => series.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeries.fulfilled, (state, action) => {
        state.list = action.payload.series;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })
      .addCase(fetchSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateSeries, addSeries, updateSerie, deleteSeries } = seriesSlice.actions;
export default seriesSlice.reducer;
