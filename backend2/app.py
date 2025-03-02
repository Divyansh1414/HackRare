from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import sqlite3
import re
from phrank_modified import Phrank
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File paths
CSV_FILE_PATH = "C:/Users/dpradhan/Downloads/hpo_disorders.xlsx"
MIM_FILE = "C:/Users/dpradhan/Downloads/HarvardRareDiseaseHackathon/HarvardRareDiseaseHackathon/data/mimTitles.txt"
DAG = "C:/Users/dpradhan/Downloads/HarvardRareDiseaseHackathon/HarvardRareDiseaseHackathon/data/hpodag.txt"
DISEASE_TO_PHENO = "C:/Users/dpradhan/Downloads/HarvardRareDiseaseHackathon/HarvardRareDiseaseHackathon/data/disease_to_pheno.build127.txt"
DISEASE_TO_GENE = "C:/Users/dpradhan/Downloads/HarvardRareDiseaseHackathon/HarvardRareDiseaseHackathon/data/gene_to_disease.build127.txt"

# Load dataset
try:
    df = pd.read_excel(CSV_FILE_PATH)
    df["HPO Term"] = df["HPO Term"].astype(str).str.strip().str.lower()
    df["HPO ID"] = df["HPO ID"].astype(str).str.strip()
    print("✅ CSV loaded successfully!")
except Exception as e:
    print(f"❌ Error loading CSV: {e}")
    df = None

# Convert CSV to SQLite for fast indexed queries
def setup_database():
    if df is not None:
        conn = sqlite3.connect("hpo_disorders.db")
        df.to_sql("hpo_data", conn, if_exists="replace", index=False)
        conn.close()
        print("✅ Database setup complete!")

setup_database()

# Load MIM titles
def load_mim_titles():
    mim_df = pd.read_csv(MIM_FILE, sep="\t", comment='#', header=None, 
                         names=["Prefix", "MIM Number", "Preferred Title", "Alternative Titles", "Included Titles"],
                         dtype={"MIM Number": str})
    return mim_df

mim_df = load_mim_titles()

# Initialize Phrank
p_hpo = Phrank(DAG, diseaseannotationsfile=DISEASE_TO_PHENO, diseasegenefile=DISEASE_TO_GENE)

# Unified function for filtering HPO data and ranking diseases
@app.post("/analyze_symptoms")
async def analyze_symptoms(data: dict):
    if df is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")

    symptoms = data.get("symptoms", [])
    frequency = data.get("frequency", [])
    
    # Filtering step
    filtered_df = df
    if symptoms:
        filtered_df = filtered_df[filtered_df["HPO Term"].str.contains('|'.join(symptoms), case=False, na=False)]
    if frequency:
        filtered_df = filtered_df[filtered_df["Frequency"].isin(frequency)]

    # Extract unique HPO IDs
    patient_phenotypes = set(filtered_df["HPO ID"])

    # Rank diseases
    disease_ranking = p_hpo.rank_diseases(patient_phenotypes)

    # Process ranked diseases
    ranked_diseases = []
    for score, disease_id in disease_ranking[0:5]:
        disease_id = re.sub(r'OMIM:', '', disease_id)  # Extract only the numeric part
        mim_title = mim_df.loc[mim_df["MIM Number"] == disease_id, "Preferred Title"].values
        disease_name = mim_title[0] if len(mim_title) > 0 else "Unknown Disease"
        ranked_diseases.append({"MIM": disease_id, "Disease": disease_name, "Similarity Score": round(score, 2)})

    return {
        # "filtered_symptoms": filtered_df[["HPO ID", "HPO Term", "Frequency"]].to_dict(orient="records"),
        "disease_ranking": ranked_diseases
    }

# 🔹 Symptom Suggestion Algorithm Using TF-IDF and Cosine Similarity
def suggest_symptoms(user_symptoms, top_n=5):
    print("🚀 Running Symptom Suggestion Algorithm")  # Debugging Print
    
    if df is None:
        print("❌ Error: Dataset not loaded")
        raise HTTPException(status_code=500, detail="Dataset not loaded")

    # Create a TF-IDF Vectorizer model
    vectorizer = TfidfVectorizer()
    
    # Get all unique diseases with associated symptoms
    disease_symptom_data = df.groupby("Disorder Name")["HPO Term"].apply(lambda x: " ".join(x)).reset_index()

    # Fit and transform symptoms into TF-IDF matrix
    tfidf_matrix = vectorizer.fit_transform(disease_symptom_data["HPO Term"])

    # Convert user symptoms to a TF-IDF vector
    user_symptom_query = " ".join(user_symptoms)
    user_vector = vectorizer.transform([user_symptom_query])

    # Compute cosine similarity between user symptoms and disease symptoms
    cosine_similarities = cosine_similarity(user_vector, tfidf_matrix).flatten()

    # Get the top similar diseases
    top_disease_indices = cosine_similarities.argsort()[-top_n:][::-1]

    suggested_symptoms = set()
    
    # Extract suggested symptoms from the most similar diseases
    for idx in top_disease_indices:
        disease_symptoms = disease_symptom_data.iloc[idx]["HPO Term"].split()
        suggested_symptoms.update(disease_symptoms)

    # Remove already selected symptoms
    suggested_symptoms = list(set(suggested_symptoms) - set(user_symptoms))
    
    # Fetch HPO IDs for suggested symptoms
    suggestions = df[df["HPO Term"].isin(suggested_symptoms)][["HPO ID", "HPO Term"]].drop_duplicates().to_dict(orient="records")

    print("🔍 Suggested Symptoms:", suggestions)  # Debugging Print

    return suggestions[:top_n]


# 🔹 New API Endpoint for Symptom Suggestions
@app.post("/suggest_symptoms")
async def suggest_additional_symptoms(data: dict):
    print("📥 Incoming Request Data:", data)  # Debugging Print
    
    user_symptoms = data.get("symptoms", [])
    
    if not user_symptoms:
        print("❌ No symptoms provided")  # Debugging Print
        raise HTTPException(status_code=400, detail="No symptoms provided for suggestion.")

    print("✅ Calling suggest_symptoms with:", user_symptoms)  # Debugging Print

    suggestions = suggest_symptoms(user_symptoms, top_n=5)

    print("✅ Suggestions Generated:", suggestions)  # Debugging Print

    return {"suggested_symptoms": suggestions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
