# AI Resume Classifier & Job Matching Platform

An end-to-end, AI-powered talent alignment platform featuring dual dashboards for **Students/Job Seekers** and **Recruiters/Hiring Managers**. It uses NLP entity parsing, technical skill ontology mapping, and a 5-factor scoring engine to match resumes with job descriptions with explainable AI insights.

---

## 🚀 Key Features

### 👨‍🎓 Student Dashboard
- **Instant Resume Upload & Parsing:** Upload PDF, DOCX, or TXT resumes and automatically extract contact info, education, experience, and categorized technical skills.
- **Job Matching & Ranking:** View real-time compatibility scores for open job roles.
- **Skill Gap & Career Guidance:** Interactive skill gap analysis highlighting missing skills and recommending next steps to qualify for desired roles.
- **Quick Profile Management:** Edit extracted profile data directly.

### 🏢 Recruiter Dashboard
- **Job Posting & Management:** Post new vacancies with specific required and preferred skills, minimum experience, and degree requirements.
- **Candidate Ranking & Leaderboard:** Sort applicants by 5-factor overall alignment score, suitability status (*Highly Suitable, Suitable, Moderate, Low Match*), and experience.
- **Side-by-Side Candidate Comparison:** Compare two applicants directly across skills, education, experience, and project matches.
- **CSV Data Export:** Export candidate scores and applicant metrics to CSV for ATS integration.

---

## 🧠 AI & NLP Architecture

The matching engine computes a comprehensive **100-point alignment score** using a 5-factor hybrid algorithm:

1. **Skills Alignment (50%):**
   - Weighted match comparing extracted candidate skills against required (85%) and preferred (15%) requirements using a categorized ontology of 100+ skills with alias normalization (e.g. `k8s` → `Kubernetes`, `py` → `Python`).
2. **Experience Alignment (20%):**
   - Experience ratio evaluation comparing candidate years vs. role requirements.
3. **Education Alignment (10%):**
   - Degree hierarchy ranking (Ph.D > Master's > Bachelor's > Diploma).
4. **Projects & Certifications (10%):**
   - Practical project keyword relevance and verified industry certifications.
5. **Semantic Similarity (10%):**
   - Scikit-learn **TF-IDF Vectorizer** (unigram + bigram) with **Cosine Similarity** between raw resume text and job description.

---

## 🛠 Tech Stack

- **Backend:** Python 3.10+, FastAPI, Uvicorn, Scikit-learn, NumPy, PyPDF, python-docx
- **Frontend:** React 19, Vite, Lucide Icons, Modern Vanilla CSS
- **API:** RESTful endpoints with interactive OpenAPI/Swagger documentation

---

## 📦 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# (Optional) Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

Backend will be running at:
- **API Base:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Frontend will be running at:
- **Local Application:** [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure

```text
ai_resume_classifier/
├── backend/
│   ├── data/
│   │   ├── generate_sample_files.py
│   │   ├── sample_resumes/
│   │   └── store.py               # In-memory mock database & persistence
│   ├── nlp/
│   │   ├── extractor.py           # Text extraction, regex & parsing engine
│   │   ├── matcher.py             # 5-factor scoring & explainable AI
│   │   └── skill_ontology.py      # Skill taxonomy & alias normalization
│   ├── main.py                    # FastAPI routes & endpoints
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/            # Student & Recruiter dashboard UI
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 📄 License
MIT License
