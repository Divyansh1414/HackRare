import pandas as pd
from phrank_modified import Phrank
from phrank_modified import utils
import re

file_path = r"C:\Users\dpradhan\Downloads\HarvardRareDiseaseHackathon\HarvardRareDiseaseHackathon\hpo_disorders.csv"

################### Filtering ###################
def filter_hpo_data(file_path, symptoms=None, frequency=None):
   
    # Load the dataset
    df = pd.read_csv(file_path)
    
    # Apply filters
    if symptoms:
        df = df[df["HPO Term"].str.contains('|'.join(symptoms), case=False, na=False)]
    if frequency:
        df = df[df["Frequency"].isin(frequency)]    
    return df

# Example usage
# file_path = "/mnt/data/hpo_disorders.csv"
symptoms = ["Headache","Seizure"]
frequency = ["Very frequent (99-80%)","Very frequent (99-80%)"]
filtered_df = filter_hpo_data(file_path, symptoms, frequency)
ourpheno=set(list(filtered_df["HPO ID"]))


################### Phrank ###################
DAG=r"C:\Users\dpradhan\Downloads\HarvardRareDiseaseHackathon\HarvardRareDiseaseHackathon\data\hpodag.txt"
DISEASE_TO_PHENO=r"C:\Users\dpradhan\Downloads\HarvardRareDiseaseHackathon\HarvardRareDiseaseHackathon\data\disease_to_pheno.build127.txt"
DISEASE_TO_GENE=r"C:\Users\dpradhan\Downloads\HarvardRareDiseaseHackathon\HarvardRareDiseaseHackathon\data\gene_to_disease.build127.txt"
GENE_TO_PHENO=r"C:\Users\dpradhan\Downloads\HarvardRareDiseaseHackathon\HarvardRareDiseaseHackathon\data\gene_to_pheno.amelie.txt"
mim_file=r"C:\Users\dpradhan\Downloads\HarvardRareDiseaseHackathon\HarvardRareDiseaseHackathon\data\mimTitles.txt"

p_hpo = Phrank(DAG, diseaseannotationsfile=DISEASE_TO_PHENO, diseasegenefile=DISEASE_TO_GENE)
ourpheno=set(list(filtered_df["HPO ID"]))
patient_phenotypes = ourpheno

# sorting the disease by best match
disease_ranking = p_hpo.rank_diseases(patient_phenotypes)

################### Printing disease ranking with name ###################
def load_mim_titles(mim_file):
    mim_df = pd.read_csv(mim_file, sep="\t", comment='#', header=None, 
                         names=["Prefix", "MIM Number", "Preferred Title", "Alternative Titles", "Included Titles"],
                         dtype={"MIM Number": str})
    return mim_df

mim_df = load_mim_titles(mim_file)

# Map ranked diseases to MIM titles
ranked_diseases = []
for score, disease_id in disease_ranking:
    disease_id = re.sub(r'OMIM:', '', disease_id)  # Extract only the numeric part
    mim_title = mim_df.loc[mim_df["MIM Number"] == disease_id, "Preferred Title"].values
    disease_name = mim_title[0] if len(mim_title) > 0 else "Unknown Disease"
    ranked_diseases.append((disease_id, disease_name, score))

# Print results
print("\nDisease Ranking:")
for disease_id, disease_name, score in ranked_diseases[:5]:
    print(f"MIM: {disease_id} | Disease: {disease_name} | Similarity Score: {score:.2f}")

