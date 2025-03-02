import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PatientProfile } from '../../types';

interface PatientState {
  currentPatient: PatientProfile | null;
}

const initialState: PatientState = {
  currentPatient: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatient: (state, action: PayloadAction<PatientProfile>) => {
      state.currentPatient = action.payload;
    },
    updatePatient: (state, action: PayloadAction<Partial<PatientProfile>>) => {
      if (state.currentPatient) {
        state.currentPatient = {
          ...state.currentPatient,
          ...action.payload,
        };
      }
    },
    clearPatient: (state) => {
      state.currentPatient = null;
    },
  },
});

export const { setPatient, updatePatient, clearPatient } = patientSlice.actions;

export default patientSlice.reducer;