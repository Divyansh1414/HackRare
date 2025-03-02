// Core data types for the application

// HPO Term (symptom) interface
export interface HPOTerm {
  id: string;          // HPO ID (e.g., "HP:0001250")
  name: string;        // Term name (e.g., "Seizure")
  definition?: string; // (Optional) Definition of the term
  synonyms?: string[]; // (Optional) Alternative names
  categories?: string[]; // (Optional) Categories this term belongs to
}

// Patient symptom with additional metadata
export interface PatientSymptom extends HPOTerm {
  severity: 'Excluded (0%)' | 'Occasional (29-5%)' | 'Frequent (79-30%)' | 'Very frequent (99-80%)' | 'Obligate (100%)' | 'Very rare (<4-1%)';
  duration: string;    // e.g., "2 weeks", "3 months"
  onset: string;       // When the symptom started
  notes?: string;      // (Optional) Additional notes
  dateAdded: string;   // When the symptom was added to the patient record
}

// Disease/Diagnosis interface
export interface Diagnosis {
  mim: string;          // MIM Number (instead of generic "id")
  name: string;         // Disease name
  description?: string; // (Optional) Description of the disease
  similarityScore: number; // Confidence score from API (renamed from `confidence`)
  matchedSymptoms?: Array<{
    hpoId: string;     // HPO ID of the matched symptom
    weight: number;    // How strongly this symptom indicates this diagnosis (0-1)
  }>;
  unmatchedSymptoms?: string[]; // HPO IDs of symptoms typically seen but not present
  references?: Array<{
    title: string;
    url: string;
  }>;
}

// Interface for disease ranking response from the API
export interface DiseaseRanking {
  mim: string;          // MIM ID from API response
  disease: string;      // Disease name
  similarityScore: number; // Matching confidence score
}

// Patient profile
export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  medicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
}

// Search history entry
export interface SearchHistoryEntry {
  id: string;
  timestamp: string;
  symptoms: PatientSymptom[];
  diagnoses: Diagnosis[];
}
