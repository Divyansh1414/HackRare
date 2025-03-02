from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import sqlite3
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# Load Excel file safely
CSV_FILE_PATH = "C:/Users/dpradhan/Downloads/hpo_disorders.xlsx"
try:
    df = pd.read_excel(CSV_FILE_PATH, engine="openpyxl")  # FIXED: Removed invalid encoding param
    print("Excel file loaded successfully!")
    print("Columns in Excel:", df.columns.tolist())
except Exception as e:
    print("Error loading Excel file:", e)
    df = None

# Ensure required columns exist
required_columns = ["HPO Term", "HPO ID", "Frequency", "Disease Name"]
if df is not None and all(col in df.columns for col in required_columns):
    df["HPO Term"] = df["HPO Term"].astype(str).str.strip().str.lower()
    df["HPO ID"] = df["HPO ID"].astype(str).str.strip()
else:
    df = None

# Convert CSV to SQLite for fast indexed queries
def setup_database():
    if df is None:
        print("Error: Dataset not loaded. Skipping database setup.")
        return
    
    conn = sqlite3.connect("hpo_disorders.db")
    df.to_sql("hpo_data", conn, if_exists="replace", index=False)
    conn.close()
    print("Database setup complete!")

setup_database()

# Trie Implementation for Fast Search
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.data = []  # Store matching HPO IDs and Terms

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, term, hpo_id):
        node = self.root
        for char in term:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.data.append({"HPO Term": term, "HPO ID": hpo_id})

    def search(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]
        return self.collect_data(node)

    def collect_data(self, node):
        results = []
        if node.is_end:
            results.extend(node.data)
        for child in node.children.values():
            results.extend(self.collect_data(child))
        return results

trie = Trie()
if df is not None:
    for _, row in df.iterrows():
        trie.insert(row["HPO Term"], row["HPO ID"])

@app.route('/search_symptoms/<prefix>', methods=['GET'])
def search_symptoms(prefix):
    prefix = prefix.lower()
    results = trie.search(prefix)
    return jsonify(results)

@app.route('/detect_disease', methods=['POST'])
def detect_disease():
    if df is None:
        return jsonify({"error": "Dataset not loaded"}), 500
    
    data = request.json
    selected_symptoms = data.get("symptoms", [])
    if not selected_symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    conn = sqlite3.connect("hpo_disorders.db")
    query = "SELECT `Disease Name` FROM hpo_data WHERE `HPO Term` IN ({})".format(
        ', '.join(['?'] * len(selected_symptoms)))
    diseases = pd.read_sql_query(query, conn, params=selected_symptoms)
    conn.close()
    
    if diseases.empty:
        return jsonify({"message": "No matching diseases found"}), 200
    
    disease_counts = diseases["Disease Name"].value_counts().to_dict()
    return jsonify({"matching_diseases": disease_counts})

if __name__ == '__main__':
    app.run(debug=True)
