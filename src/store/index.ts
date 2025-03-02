import { configureStore } from '@reduxjs/toolkit';
import symptomsReducer from './slices/symptomsSlice';
import diagnosesReducer from './slices/diagnosesSlice';
import patientReducer from './slices/patientSlice';
import historyReducer from './slices/historySlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    symptoms: symptomsReducer,
    diagnoses: diagnosesReducer,
    patient: patientReducer,
    history: historyReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;