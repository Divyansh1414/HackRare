import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchHistoryEntry } from '../../types';

interface HistoryState {
  searchHistory: SearchHistoryEntry[];
}

const initialState: HistoryState = {
  searchHistory: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryEntry: (state, action: PayloadAction<SearchHistoryEntry>) => {
      state.searchHistory.unshift(action.payload); // Add to the beginning of the array
    },
    clearHistory: (state) => {
      state.searchHistory = [];
    },
    removeHistoryEntry: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(
        entry => entry.id !== action.payload
      );
    },
  },
});

export const { addHistoryEntry, clearHistory, removeHistoryEntry } = historySlice.actions;

export default historySlice.reducer;