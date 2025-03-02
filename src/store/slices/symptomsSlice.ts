import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { HPOTerm, PatientSymptom } from '../../types';

// Function to fetch HPO terms from JSON file
export const searchHPOTerms = createAsyncThunk(
  'symptoms/searchHPOTerms',
  async (query: string) => {
    try {
      const response = await fetch('hpo_terms.json'); // Update with actual path
      if (!response.ok) {
        throw new Error('Failed to fetch HPO terms');
      }
      const hpoTerms: HPOTerm[] = await response.json();

      // Filter terms based on query
      return hpoTerms.filter(term =>
        term.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching HPO terms:', error);
      throw error;
    }
  }
);


export const getRelatedDisorders = createAsyncThunk(
  'symptoms/getRelatedDisorders',
  async (symptoms: PatientSymptom[]) => {
    try {
      const symptomNames = symptoms.map((s) => s.name);
      const frequencies = symptoms.map((s) => s.severity);

      const response = await fetch('http://localhost:8000/analyze_symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomNames, frequency: frequencies }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch disorder recommendations');
      }

      const data = await response.json();

      return data.disease_ranking.map((disease: any) => ({
        name: disease.Disease,
        relevanceScore: Math.round(disease["Similarity Score"]),
        matchedSymptomCount: symptoms.length,
        totalSymptomCount: symptoms.length,
        matchedSymptoms: symptomNames,
        unmatchedSymptoms: []
      }));

    } catch (error) {
      console.error('Error fetching related disorders:', error);
      throw error;
    }
  }
);


interface SymptomsState {
  selectedSymptoms: PatientSymptom[];
  searchResults: HPOTerm[];
  relatedDisorders: Array<{
    name: string;
    link: string;
    relevanceScore: number;
    matchedSymptomCount: number;
    totalSymptomCount: number;
    matchedSymptoms: string[];
    unmatchedSymptoms: string[];
  }>;
  searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  disordersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SymptomsState = {
  selectedSymptoms: [],
  searchResults: [],
  relatedDisorders: [],
  searchStatus: 'idle',
  disordersStatus: 'idle',
  error: null,
};

const symptomsSlice = createSlice({
  name: 'symptoms',
  initialState,
  reducers: {
    addSymptom: (state, action: PayloadAction<PatientSymptom>) => {
      // Check if symptom already exists
      const exists = state.selectedSymptoms.some(
        symptom => symptom.id === action.payload.id
      );
      
      if (!exists) {
        state.selectedSymptoms.push(action.payload);
      }
    },
    updateSymptom: (state, action: PayloadAction<{
      id: string;
      updates: Partial<PatientSymptom>;
    }>) => {
      const { id, updates } = action.payload;
      const index = state.selectedSymptoms.findIndex(symptom => symptom.id === id);
      
      if (index !== -1) {
        state.selectedSymptoms[index] = {
          ...state.selectedSymptoms[index],
          ...updates,
        };
      }
    },
    removeSymptom: (state, action: PayloadAction<string>) => {
      state.selectedSymptoms = state.selectedSymptoms.filter(
        symptom => symptom.id !== action.payload
      );
    },
    clearSymptoms: (state) => {
      state.selectedSymptoms = [];
      state.relatedDisorders = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchHPOTerms.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(searchHPOTerms.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(searchHPOTerms.rejected, (state, action) => {
        state.searchStatus = 'failed';
        state.error = action.error.message || 'Failed to search HPO terms';
      })
      .addCase(getRelatedDisorders.pending, (state) => {
        state.disordersStatus = 'loading';
      })
      .addCase(getRelatedDisorders.fulfilled, (state, action) => {
        state.disordersStatus = 'succeeded';
        state.relatedDisorders = action.payload;
      })
      .addCase(getRelatedDisorders.rejected, (state, action) => {
        state.disordersStatus = 'failed';
        state.error = action.error.message || 'Failed to get related disorders';
      });
  },
});

export const {
  addSymptom,
  updateSymptom,
  removeSymptom,
  clearSymptoms,
  clearSearchResults,
} = symptomsSlice.actions;

export default symptomsSlice.reducer;