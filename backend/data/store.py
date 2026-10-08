"""
In-memory & SQLite persistent database store.
Contains pre-seeded realistic job descriptions and candidate resumes
for instant demonstration and full CRUD operations.
"""

import copy
from typing import Dict, List, Any, Optional
try:
    from backend.nlp.matcher import calculate_match
except ImportError:
    from nlp.matcher import calculate_match

# Initial Seed Jobs
INITIAL_JOBS = [
    {
        "id": "job-1",
        "title": "Data Analyst",
        "company": "Apex Analytics Corp",
        "location": "San Francisco, CA (Hybrid)",
        "salary": "$75,000 - $95,000 / yr",
        "type": "Full-time",
        "min_experience_years": 1.0,
        "required_degree": "Bachelor's Degree",
        "degree_level": 2,
        "required_skills": ["Python", "SQL", "Excel", "Power BI", "Statistics"],
        "preferred_skills": ["Tableau", "Pandas", "BigQuery"],
        "description": (
            "We are seeking an enthusiastic Data Analyst to transform complex data into actionable "
            "business insights. You will query relational databases using SQL, build dynamic reports and "
            "executive dashboards in Power BI and Excel, and conduct statistical analysis using Python. "
            "Strong communication skills and proficiency with data cleaning (Pandas) is required."
        ),
        "created_at": "2026-10-01"
    },
    {
        "id": "job-2",
        "title": "Machine Learning Intern",
        "company": "Cognitive AI Labs",
        "location": "New York, NY (Remote)",
        "salary": "$45 - $55 / hr",
        "type": "Internship",
        "min_experience_years": 0.5,
        "required_degree": "Bachelor's Degree",
        "degree_level": 2,
        "required_skills": ["Python", "Machine Learning", "Scikit-learn", "Pandas", "NumPy"],
        "preferred_skills": ["PyTorch", "Deep Learning", "NLP"],
        "description": (
            "Join our cutting-edge AI research team as an ML Intern. You will design, train, and benchmark "
            "predictive machine learning models using Python, Scikit-learn, Pandas, and NumPy. "
            "Experience with deep learning frameworks (PyTorch or TensorFlow) and natural language processing is a huge plus."
        ),
        "created_at": "2026-10-02"
    },
    {
        "id": "job-3",
        "title": "Python Developer",
        "company": "NextGen Systems",
        "location": "Austin, TX (On-site)",
        "salary": "$85,000 - $110,000 / yr",
        "type": "Full-time",
        "min_experience_years": 1.5,
        "required_degree": "Bachelor's Degree",
        "degree_level": 2,
        "required_skills": ["Python", "FastAPI", "SQL", "PostgreSQL", "REST APIs"],
        "preferred_skills": ["Docker", "Redis", "AWS", "Git"],
        "description": (
            "Seeking a talented Python Backend Engineer to scale our distributed cloud microservices. "
            "You will develop high-throughput REST APIs using FastAPI/Flask, optimize PostgreSQL queries, "
            "and containerize services with Docker on AWS."
        ),
        "created_at": "2026-10-03"
    },
    {
        "id": "job-4",
        "title": "Data Scientist",
        "company": "Quantum Data Insights",
        "location": "Seattle, WA (Hybrid)",
        "salary": "$115,000 - $140,000 / yr",
        "type": "Full-time",
        "min_experience_years": 2.0,
        "required_degree": "Master's Degree",
        "degree_level": 3,
        "required_skills": ["Python", "Machine Learning", "Statistics", "SQL", "Deep Learning"],
        "preferred_skills": ["PyTorch", "NLP", "Tableau", "AWS"],
        "description": (
            "Looking for a Data Scientist to formulate predictive mathematical models and NLP solutions. "
            "Responsible for hypothesis testing, feature engineering, and deploying ML pipelines into production."
        ),
        "created_at": "2026-10-04"
    },
    {
        "id": "job-5",
        "title": "Full Stack React Developer",
        "company": "CloudFront Digital",
        "location": "Chicago, IL (Remote)",
        "salary": "$90,000 - $115,000 / yr",
        "type": "Full-time",
        "min_experience_years": 1.0,
        "required_degree": "Bachelor's Degree",
        "degree_level": 2,
        "required_skills": ["JavaScript", "TypeScript", "React", "Node.js", "HTML5", "CSS3"],
        "preferred_skills": ["Next.js", "MongoDB", "Tailwind CSS", "REST APIs"],
        "description": (
            "Build responsive web applications with React, TypeScript, and modern Node.js. "
            "Focus on clean UI components, state management, and seamless integration with backend APIs."
        ),
        "created_at": "2026-10-05"
    }
]

# Initial Seed Candidates
INITIAL_CANDIDATES = [
    {
        "id": "cand-1",
        "name": "Rahul Sharma",
        "email": "rahul.sharma@email.com",
        "phone": "+1 (555) 234-8901",
        "linkedin": "https://linkedin.com/in/rahul-sharma-data",
        "github": "https://github.com/rahul-sharma",
        "education": {
            "degree": "B.Tech",
            "major": "Computer Science and Engineering",
            "degree_level": 2,
            "graduation_year": "2024",
            "gpa": "8.9/10",
            "summary": "B.Tech in Computer Science and Engineering (2024)"
        },
        "experience": {
            "years": 1.5,
            "label": "1.5 years (Data Analyst Intern)",
            "internships_count": 1,
            "is_fresh_grad": False
        },
        "skills": ["Python", "SQL", "Excel", "Power BI", "Statistics", "Pandas", "NumPy", "Scikit-learn", "Git"],
        "categorized_skills": {
            "Programming Languages": ["Python", "SQL"],
            "Data Science & Analytics": ["Excel", "Power BI", "Statistics", "Pandas", "NumPy"],
            "Machine Learning & AI": ["Scikit-learn"],
            "Cloud & DevOps": ["Git"]
        },
        "projects": [
            {
                "title": "Executive Sales KPI Dashboard",
                "description": "Constructed interactive multi-page Power BI reports connected to SQL server, tracking $4M revenue metrics."
            },
            {
                "title": "Customer Churn Prediction Model",
                "description": "Implemented XGBoost and Scikit-learn pipelines with Pandas & NumPy, achieving 89% precision."
            }
        ],
        "certifications": [
            "Microsoft Certified: Power BI Data Analyst",
            "IBM Data Science Professional Certificate"
        ],
        "raw_text": (
            "Rahul Sharma rahul.sharma@email.com (555) 234-8901\n"
            "Education: B.Tech Computer Science and Engineering, 2024. CGPA: 8.9/10.\n"
            "Experience: 1.5 years as Data Analyst Intern at FinTech Analytics.\n"
            "Skills: Python, SQL, Excel, Power BI, Statistics, Pandas, NumPy, Scikit-learn, Git.\n"
            "Projects: Sales Dashboard in Power BI and SQL. Customer Churn Prediction model.\n"
            "Certifications: Microsoft Certified Power BI Analyst, IBM Data Science."
        ),
        "profile_completion": 94,
        "status": "shortlisted"
    },
    {
        "id": "cand-2",
        "name": "Priya Patel",
        "email": "priya.patel@email.com",
        "phone": "+1 (555) 345-6789",
        "linkedin": "https://linkedin.com/in/priyapatel-ai",
        "github": "https://github.com/priyapatel-tech",
        "education": {
            "degree": "B.Sc",
            "major": "Data Science",
            "degree_level": 2,
            "graduation_year": "2024",
            "gpa": "8.6/10",
            "summary": "B.Sc in Data Science (2024)"
        },
        "experience": {
            "years": 1.0,
            "label": "1.0 years",
            "internships_count": 1,
            "is_fresh_grad": False
        },
        "skills": ["Python", "SQL", "Excel", "Statistics", "Pandas", "Matplotlib", "Machine Learning", "Seaborn"],
        "categorized_skills": {
            "Programming Languages": ["Python", "SQL"],
            "Data Science & Analytics": ["Excel", "Statistics", "Pandas", "Matplotlib", "Seaborn"],
            "Machine Learning & AI": ["Machine Learning"]
        },
        "projects": [
            {
                "title": "Healthcare Clinical Analytics",
                "description": "Processed electronic health records using Pandas and SQL to model patient readmission probability."
            },
            {
                "title": "Financial Trends Visualizer",
                "description": "Built automated exploratory data analysis scripts with Matplotlib and Seaborn."
            }
        ],
        "certifications": ["Coursera Machine Learning Specialization", "HackerRank SQL Gold Badge"],
        "raw_text": (
            "Priya Patel priya.patel@email.com\n"
            "Education: B.Sc Data Science, 2024. CGPA: 8.6/10.\n"
            "Experience: 1 year data analytics internship.\n"
            "Skills: Python, SQL, Excel, Statistics, Pandas, Matplotlib, Machine Learning, Seaborn.\n"
            "Projects: Healthcare Clinical Analytics, Financial Trends Visualizer.\n"
        ),
        "profile_completion": 88,
        "status": "pending"
    },
    {
        "id": "cand-3",
        "name": "Alex Chen",
        "email": "alex.chen@email.com",
        "phone": "+1 (555) 456-7890",
        "linkedin": "https://linkedin.com/in/alexchen-dev",
        "github": "https://github.com/alexchen",
        "education": {
            "degree": "B.Tech",
            "major": "Information Technology",
            "degree_level": 2,
            "graduation_year": "2024",
            "gpa": "8.1/10",
            "summary": "B.Tech in Information Technology (2024)"
        },
        "experience": {
            "years": 0.8,
            "label": "10 months internship",
            "internships_count": 1,
            "is_fresh_grad": True
        },
        "skills": ["Python", "SQL", "Excel", "Pandas", "Git", "R", "HTML"],
        "categorized_skills": {
            "Programming Languages": ["Python", "SQL", "R"],
            "Data Science & Analytics": ["Excel", "Pandas"],
            "Cloud & DevOps": ["Git"],
            "Web & Backend Engineering": ["HTML"]
        },
        "projects": [
            {
                "title": "E-Commerce Metrics Analysis",
                "description": "Aggregated user purchasing behaviors via SQL and Python scripts."
            }
        ],
        "certifications": ["Google Data Analytics Professional Certificate"],
        "raw_text": (
            "Alex Chen alex.chen@email.com\n"
            "Education: B.Tech IT, 2024.\n"
            "Experience: 10 months internship experience.\n"
            "Skills: Python, SQL, Excel, Pandas, Git, R, HTML.\n"
            "Projects: E-Commerce Metrics Analysis."
        ),
        "profile_completion": 78,
        "status": "pending"
    },
    {
        "id": "cand-4",
        "name": "Sneha Roy",
        "email": "sneha.roy@email.com",
        "phone": "+1 (555) 567-8901",
        "linkedin": "https://linkedin.com/in/sneharoy",
        "github": "https://github.com/sneharoy",
        "education": {
            "degree": "BCA",
            "major": "Computer Applications",
            "degree_level": 2,
            "graduation_year": "2024",
            "gpa": "7.9/10",
            "summary": "BCA in Computer Applications (2024)"
        },
        "experience": {
            "years": 0.5,
            "label": "6 months",
            "internships_count": 0,
            "is_fresh_grad": True
        },
        "skills": ["Python", "HTML", "CSS", "JavaScript", "SQL"],
        "categorized_skills": {
            "Programming Languages": ["Python", "JavaScript", "SQL"],
            "Web & Backend Engineering": ["HTML", "CSS"]
        },
        "projects": [
            {
                "title": "Responsive Student Portal",
                "description": "Front-end interface using HTML, CSS, JavaScript and SQLite database."
            }
        ],
        "certifications": ["Python Data Structures"],
        "raw_text": (
            "Sneha Roy sneha.roy@email.com\n"
            "Education: BCA Computer Applications, 2024.\n"
            "Experience: 6 months entry-level.\n"
            "Skills: Python, HTML, CSS, JavaScript, SQL.\n"
            "Projects: Responsive Student Portal."
        ),
        "profile_completion": 68,
        "status": "pending"
    },
    {
        "id": "cand-5",
        "name": "David Miller",
        "email": "david.miller@email.com",
        "phone": "+1 (555) 678-9012",
        "linkedin": "https://linkedin.com/in/davidmiller",
        "github": "https://github.com/davidmiller-backend",
        "education": {
            "degree": "B.Tech",
            "major": "Computer Science",
            "degree_level": 2,
            "graduation_year": "2024",
            "gpa": "8.0/10",
            "summary": "B.Tech in Computer Science (2024)"
        },
        "experience": {
            "years": 0.5,
            "label": "6 months",
            "internships_count": 0,
            "is_fresh_grad": True
        },
        "skills": ["Java", "Spring Boot", "C++", "Docker", "Git", "Object-Oriented Programming"],
        "categorized_skills": {
            "Programming Languages": ["Java", "C++"],
            "Web & Backend Engineering": ["Spring Boot"],
            "Cloud & DevOps": ["Docker", "Git"],
            "Software Practices & Methodologies": ["Object-Oriented Programming"]
        },
        "projects": [
            {
                "title": "Banking Core API Engine",
                "description": "Built resilient transaction endpoints using Java and Spring Boot."
            }
        ],
        "certifications": ["Oracle Certified Java Associate"],
        "raw_text": (
            "David Miller david.miller@email.com\n"
            "Education: B.Tech Computer Science, 2024.\n"
            "Experience: 6 months.\n"
            "Skills: Java, Spring Boot, C++, Docker, Git, Object-Oriented Programming.\n"
            "Projects: Banking Core API Engine."
        ),
        "profile_completion": 65,
        "status": "rejected"
    }
]


class DatabaseStore:
    def __init__(self):
        self.jobs: Dict[str, Dict[str, Any]] = {j["id"]: copy.deepcopy(j) for j in INITIAL_JOBS}
        self.candidates: Dict[str, Dict[str, Any]] = {c["id"]: copy.deepcopy(c) for c in INITIAL_CANDIDATES}
        # Student active profile (defaults to Rahul Sharma or customized by user upload)
        self.student_profile = copy.deepcopy(self.candidates["cand-1"])
        self.candidate_status_by_job: Dict[str, str] = {
            "cand-1_job-1": "shortlisted",
            "cand-5_job-1": "rejected"
        }

    # Jobs
    def list_jobs(self) -> List[Dict[str, Any]]:
        return list(self.jobs.values())

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        return self.jobs.get(job_id)

    def create_job(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        job_id = f"job-{len(self.jobs) + 1}"
        job_data["id"] = job_id
        self.jobs[job_id] = job_data
        return job_data

    # Candidates
    def list_candidates(self) -> List[Dict[str, Any]]:
        return list(self.candidates.values())

    def get_candidate(self, cand_id: str) -> Optional[Dict[str, Any]]:
        return self.candidates.get(cand_id)

    def add_candidate(self, cand_data: Dict[str, Any]) -> Dict[str, Any]:
        cand_id = f"cand-{len(self.candidates) + 1}"
        cand_data["id"] = cand_id
        cand_data["status"] = "pending"
        self.candidates[cand_id] = cand_data
        return cand_data

    # Status / Shortlisting
    def get_candidate_status(self, cand_id: str, job_id: str) -> str:
        key = f"{cand_id}_{job_id}"
        return self.candidate_status_by_job.get(key, "pending")

    def set_candidate_status(self, cand_id: str, job_id: str, status: str) -> None:
        key = f"{cand_id}_{job_id}"
        self.candidate_status_by_job[key] = status
        if cand_id in self.candidates:
            self.candidates[cand_id]["status"] = status

    # Student Profile
    def get_student_profile(self) -> Dict[str, Any]:
        return self.student_profile

    def update_student_profile(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        self.student_profile = copy.deepcopy(profile_data)
        # Also ensure student is in candidates list
        cand_id = self.student_profile.get("id", "cand-student")
        self.student_profile["id"] = cand_id
        self.candidates[cand_id] = copy.deepcopy(self.student_profile)
        return self.student_profile

    # Matching & Ranking Engine
    def rank_candidates_for_job(self, job_id: str) -> List[Dict[str, Any]]:
        job = self.get_job(job_id)
        if not job:
            return []

        ranked_list = []
        for cand in self.candidates.values():
            match_result = calculate_match(cand, job)
            status = self.get_candidate_status(cand["id"], job_id)
            ranked_list.append({
                "candidate": cand,
                "job_id": job_id,
                "match": match_result,
                "score": match_result["match_score"],
                "status": status,
                "suitability": match_result["suitability"],
                "badge_info": match_result["badge_info"]
            })

        # Sort descending by match score
        ranked_list.sort(key=lambda x: x["score"], reverse=True)
        return ranked_list

    def get_recommended_jobs_for_student(self) -> List[Dict[str, Any]]:
        student = self.get_student_profile()
        recommendations = []
        for job in self.jobs.values():
            match_result = calculate_match(student, job)
            recommendations.append({
                "job": job,
                "match": match_result,
                "score": match_result["match_score"],
                "suitability": match_result["suitability"],
                "badge_info": match_result["badge_info"]
            })

        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return recommendations

    def reset(self):
        self.jobs = {j["id"]: copy.deepcopy(j) for j in INITIAL_JOBS}
        self.candidates = {c["id"]: copy.deepcopy(c) for c in INITIAL_CANDIDATES}
        self.student_profile = copy.deepcopy(self.candidates["cand-1"])
        self.candidate_status_by_job = {
            "cand-1_job-1": "shortlisted",
            "cand-5_job-1": "rejected"
        }


# Global database instance
db = DatabaseStore()
