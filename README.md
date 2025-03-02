# 🧬 PhenoWise: AI-Driven Rare Disease Diagnosis

PhenoWise is an AI-powered *phenotypic analysis pipeline* that extracts *Human Phenotype Ontology (HPO) terms* from diverse inputs, including *manual text entry, PDFs, clinical notes, and structured text files. It maps extracted terms to their respective **HPO IDs* using the *ClinPhen API and an optimized NLP algorithm. By leveraging **PH Rank, it computes **similarity scores* between extracted phenotypes and potential diseases, offering ranked disease predictions.  

Users can further *refine* their results through an *iterative questioning mechanism*, ensuring enhanced diagnostic accuracy while maintaining a trackable medical history.  

---

## 📌 *Theoretical Background*

### 🔹 *Human Phenotype Ontology (HPO)*
HPO is a standardized vocabulary that describes *phenotypic abnormalities* found in human diseases. Each term is associated with a unique *HPO ID* (e.g., HP:0002090 for *shortness of breath). These structured ontologies facilitate **computational analysis, disease matching, and clinical diagnostics*.

### 🔹 *ClinPhen & Phenotypic Matching*
PhenoWise utilizes *ClinPhen, a lightweight **NLP-based API* that extracts *HPO terms from unstructured text. In addition to ClinPhen, the system employs an **optimized text parsing algorithm* for improved accuracy in *clinical text processing*.

### 🔹 *PH Rank Algorithm*
PhenoWise uses the *PH Rank* algorithm for disease ranking. It compares extracted *HPO terms* with known disease-associated terms to compute *similarity scores. Higher scores indicate a **stronger correlation* between the patient’s symptoms and a disease.

### 🔹 *Iterative Refinement*
The platform enhances diagnostic accuracy by enabling *user-driven feedback loops. If the initial prediction is **inconclusive or ambiguous*, users can:
1. *Answer additional questions* to provide context.
2. *Add or refine symptoms* for improved matching.
3. *Track previous queries* to monitor evolving diagnoses.

---

## 🏗 *Project Architecture*
PhenoWise consists of:
- *Flask Backend*: Handles API logic, HPO term extraction, disease ranking, and data storage.
- *React Frontend*: Provides an intuitive UI for users.
- *PostgreSQL Database*: Stores extracted HPO terms, disease mappings, and user interactions.
- *Machine Learning (NLP Models)*: Enhances term extraction accuracy.
- *Deployment: Supports **Docker, Heroku, and Vercel*.

---

## 📂 *Directory Structure*

---

## 🚀 *Installation & Setup*

### 1️⃣ *Backend (Flask)*
#### ✅ *Prerequisites:*
- Python 3.8+
- Virtual environment (optional)
- PostgreSQL (or SQLite for local)

#### 🛠 *Setup*
```bash
cd backend
python -m venv venv   # Create virtual environment (optional)
source venv/bin/activate  # Activate (Linux/macOS)
venv\Scripts\activate     # Activate (Windows)
pip install -r requirements.txt  # Install dependencies
python wsgi.py  # Start Flask server
cd frontend
npm install  # Install dependencies
npm start  # Start development server
