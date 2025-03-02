import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Diagnosis, PatientSymptom } from '../../types';

// Mock API call to get diagnoses based on symptoms
export const fetchDiagnoses = createAsyncThunk(
  'diagnoses/fetchDiagnoses',
  async (symptoms: PatientSymptom[]) => {
    // In a real app, this would be an API call to a medical diagnosis service
    // For now, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract symptom IDs for the mock API
    const symptomIds = symptoms.map(s => s.id);
    
    // Mock diagnoses based on the provided symptoms
    const mockDiagnoses: Diagnosis[] = [
      {
        id: 'D001',
        name: 'Migraine',
        description: 'A neurological condition characterized by recurrent headaches.',
        confidence: symptomIds.includes('HP:0002315') ? 85 : 40,
        matchedSymptoms: [
          { hpoId: 'HP:0002315', weight: 0.9 }, // Headache
          { hpoId: 'HP:0001251', weight: 0.3 }, // Ataxia
          { hpoId: 'HP:0002018', weight: 0.7 }, // Nausea and vomiting
          { hpoId: 'HP:0000639', weight: 0.4 }, // Nystagmus
        ],
        unmatchedSymptoms: ['HP:0002094'], // Dyspnea
        references: [
          { title: 'Migraine: Diagnosis and Management', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560787/' }
        ]
      },
      {
        id: 'D002',
        name: 'Epilepsy',
        description: 'A neurological disorder characterized by recurrent seizures.',
        confidence: symptomIds.includes('HP:0001250') ? 90 : 30,
        matchedSymptoms: [
          { hpoId: 'HP:0001250', weight: 0.95 }, // Seizure
          { hpoId: 'HP:0001251', weight: 0.4 }, // Ataxia
          { hpoId: 'HP:0002353', weight: 0.8 }, // EEG abnormality
          { hpoId: 'HP:0001347', weight: 0.6 }, // Hyperreflexia
        ],
        references: [
          { title: 'Epilepsy - Diagnosis and Treatment', url: 'https://www.mayoclinic.org/diseases-conditions/epilepsy/diagnosis-treatment/drc-20350098' }
        ]
      },
      {
        id: 'D003',
        name: 'Pneumonia',
        description: 'An infection that inflames the air sacs in one or both lungs.',
        confidence: symptomIds.includes('HP:0002094') && symptomIds.includes('HP:0001945') ? 75 : 25,
        matchedSymptoms: [
          { hpoId: 'HP:0002094', weight: 0.8 }, // Dyspnea
          { hpoId: 'HP:0001945', weight: 0.7 }, // Fever
        ],
        references: [
          { title: 'Pneumonia - Diagnosis and Treatment', url: 'https://www.mayoclinic.org/diseases-conditions/pneumonia/diagnosis-treatment/drc-20354210' }
        ]
      },
      {
        id: 'D004',
        name: 'Cerebral Palsy',
        description: 'A group of disorders that affect movement and muscle tone or posture.',
        confidence: symptomIds.includes('HP:0001250') && symptomIds.includes('HP:0001257') ? 80 : 30,
        matchedSymptoms: [
          { hpoId: 'HP:0001250', weight: 0.7 }, // Seizure
          { hpoId: 'HP:0001257', weight: 0.9 }, // Spasticity
          { hpoId: 'HP:0002169', weight: 0.6 }, // Clonus
          { hpoId: 'HP:0001347', weight: 0.5 }, // Hyperreflexia
        ],
        references: [
          { title: 'Cerebral Palsy - Symptoms and Causes', url: 'https://www.mayoclinic.org/diseases-conditions/cerebral-palsy/symptoms-causes/syc-20353999' }
        ]
      },
      {
        id: 'D005',
        name: 'Chiari Malformation',
        description: 'A condition in which brain tissue extends into the spinal canal.',
        confidence: symptomIds.includes('HP:0002315') && symptomIds.includes('HP:0000256') ? 70 : 25,
        matchedSymptoms: [
          { hpoId: 'HP:0002315', weight: 0.8 }, // Headache
          { hpoId: 'HP:0000256', weight: 0.7 }, // Macrocephaly
          { hpoId: 'HP:0002169', weight: 0.5 }, // Abnormality of speech or vocalization
          { hpoId: 'HP:0002650', weight: 0.4 }, // Scoliosis
        ],
        references: [
          { title: 'Chiari Malformation - Diagnosis and Treatment', url: 'https://www.mayoclinic.org/diseases-conditions/chiari-malformation/diagnosis-treatment/drc-20354015' }
        ]
      },
      {
        id: 'D006',
        name: 'Tuberous Sclerosis',
        description: 'A rare genetic disease that causes benign tumors to grow in the brain and other organs.',
        confidence: symptomIds.includes('HP:0001250') && symptomIds.includes('HP:0001249') ? 65 : 20,
        matchedSymptoms: [
          { hpoId: 'HP:0001250', weight: 0.8 }, // Seizure
          { hpoId: 'HP:0001249', weight: 0.7 }, // Intellectual disability
          { hpoId: 'HP:0002007', weight: 0.6 }, // Frontal bossing
          { hpoId: 'HP:0001508', weight: 0.5 }, // Failure to thrive
        ],
        references: [
          { title: 'Tuberous Sclerosis - Symptoms and Causes', url: 'https://www.mayoclinic.org/diseases-conditions/tuberous-sclerosis/symptoms-causes/syc-20365969' }
        ]
      }
    ];
    
    // Filter and sort diagnoses based on confidence
    const relevantDiagnoses = mockDiagnoses
      .filter(diagnosis => {
        // Check if any of the matched symptoms are in the patient's symptoms
        return diagnosis.matchedSymptoms.some(
          match => symptomIds.includes(match.hpoId)
        );
      })
      .sort((a, b) => b.confidence - a.confidence);
    
    return relevantDiagnoses;
  }
);

interface DiagnosesState {
  diagnoses: Diagnosis[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DiagnosesState = {
  diagnoses: [],
  status: 'idle',
  error: null,
};

const diagnosesSlice = createSlice({
  name: 'diagnoses',
  initialState,
  reducers: {
    clearDiagnoses: (state) => {
      state.diagnoses = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiagnoses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiagnoses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.diagnoses = action.payload;
      })
      .addCase(fetchDiagnoses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch diagnoses';
      });
  },
});

export const { clearDiagnoses } = diagnosesSlice.actions;

export default diagnosesSlice.reducer;