"""
Generates real PDF and DOCX sample resume files for instant drag-and-drop testing.
Uses pypdf / reportlab / docx.
"""

import os
from docx import Document

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "sample_resumes")
os.makedirs(OUTPUT_DIR, exist_ok=True)

SAMPLE_RESUMES = [
    {
        "filename": "Resume_Rahul_Sharma_DataAnalyst.docx",
        "title": "Rahul Sharma - Data Analyst Resume",
        "text": """RAHUL SHARMA
Email: rahul.sharma@email.com | Phone: +1 (555) 234-8901 | LinkedIn: linkedin.com/in/rahul-sharma-data
Location: San Francisco, CA | GitHub: github.com/rahul-sharma

PROFESSIONAL SUMMARY
Analytical and detail-oriented Data Analyst with 1.5 years of hands-on experience querying complex relational databases, creating interactive Power BI dashboards, and applying statistical models in Python. Proven track record of improving reporting efficiency by 35%.

EDUCATION
B.Tech in Computer Science and Engineering (2020 - 2024)
University of California, Berkeley
CGPA: 8.9 / 10.0

TECHNICAL SKILLS
• Programming: Python, SQL (PostgreSQL, MySQL), R
• BI & Analytics Tools: Power BI, Tableau, Microsoft Excel (Advanced Pivot Tables, VLOOKUP, DAX)
• Libraries & Frameworks: Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn
• Practices: Statistical Analysis, Exploratory Data Analysis (EDA), Git, Agile

EXPERIENCE
Data Analyst Intern | FinTech Analytics Global
June 2023 - Present (1.5 years experience)
• Engineered automated daily reporting pipelines in SQL and Python, reducing manual effort by 15 hours weekly.
• Designed executive Power BI dashboards monitoring $4.2M monthly transactions and conversion funnels.
• Executed statistical hypothesis testing (A/B testing) to evaluate marketing campaign performance.

KEY PROJECTS
Executive Sales KPI Dashboard
• Built multi-page dynamic Power BI dashboard integrated with SQL Server database.
• Modeled DAX measures for Year-over-Year revenue growth and customer retention rates.

Customer Churn Prediction Model
• Developed end-to-end machine learning classification pipeline with Pandas, NumPy, and Scikit-learn.
• Achieved 89% precision score in identifying at-risk subscription users.

CERTIFICATIONS
• Microsoft Certified: Power BI Data Analyst Associate
• IBM Data Science Professional Certificate
• HackerRank SQL Gold Badge
"""
    },
    {
        "filename": "Resume_Priya_Patel_ML_Intern.docx",
        "title": "Priya Patel - Machine Learning Intern Resume",
        "text": """PRIYA PATEL
Email: priya.patel@email.com | Phone: +1 (555) 345-6789 | LinkedIn: linkedin.com/in/priyapatel-ai
Location: New York, NY | GitHub: github.com/priyapatel-tech

OBJECTIVE
Passionate Data Science graduate seeking Machine Learning and Data Analyst opportunities to apply predictive modeling, deep learning, and exploratory data analysis.

EDUCATION
B.Sc in Data Science & Artificial Intelligence (2020 - 2024)
New York University
CGPA: 8.6 / 10.0

TECHNICAL SKILLS
• Languages: Python, SQL
• Machine Learning & AI: Machine Learning, Scikit-learn, TensorFlow, PyTorch, Deep Learning, NLP
• Data Analytics: Pandas, NumPy, Matplotlib, Seaborn, Statistics, Excel
• Developer Tools: Git, Jupyter Notebook, VS Code

EXPERIENCE
Machine Learning Research Intern | HealthTech AI Labs
September 2023 - May 2024 (1 year of experience)
• Preprocessed over 50,000 anonymized clinical records with Pandas and NumPy.
• Trained classification algorithms (Random Forest, XGBoost) to predict patient hospital readmission.
• Generated data visualizations with Matplotlib and Seaborn for medical research publications.

KEY PROJECTS
Clinical Diagnosis Neural Network
• Designed deep learning convolutional architecture for image classification in PyTorch.
• Achieved 92.4% validation accuracy on medical imaging benchmark.

Stock Market Trend Sentiment Engine
• Scraped financial news headlines and implemented NLP sentiment classification pipeline with Scikit-learn and NLTK.

CERTIFICATIONS
• Coursera Deep Learning Specialization by Andrew Ng
• HackerRank Problem Solving Gold Badge
"""
    },
    {
        "filename": "Resume_Alex_Chen_Junior_Developer.docx",
        "title": "Alex Chen - Junior Python Developer Resume",
        "text": """ALEX CHEN
Email: alex.chen@email.com | Phone: +1 (555) 456-7890 | LinkedIn: linkedin.com/in/alexchen-dev
Location: Austin, TX | GitHub: github.com/alexchen

SUMMARY
Motivated Junior Software Engineer with 10 months of internship experience building backend microservices and RESTful APIs using Python, FastAPI, and SQL databases.

EDUCATION
B.Tech in Information Technology (2020 - 2024)
Texas A&M University
CGPA: 8.1 / 10.0

SKILLS
• Languages: Python, JavaScript, SQL
• Frameworks: FastAPI, Flask, Express
• Databases: PostgreSQL, SQLite
• Tools: Git, Docker, Postman, Linux

EXPERIENCE
Backend Engineering Intern | CloudSync Technologies
July 2023 - April 2024 (10 months internship experience)
• Developed 12+ RESTful API endpoints in FastAPI with automated Pydantic request validation.
• Wrote SQL migration scripts and indexed PostgreSQL database tables to optimize response time by 28%.

PROJECTS
Cloud Task Orchestration Service
• Engineered an asynchronous task runner in Python utilizing Redis and Docker containers.
"""
    }
]

def generate_docs():
    for sample in SAMPLE_RESUMES:
        doc_path = os.path.join(OUTPUT_DIR, sample["filename"])
        doc = Document()
        doc.add_heading(sample["title"], 0)
        for line in sample["text"].split("\n"):
            if line.strip():
                if line.isupper() and len(line) < 40:
                    doc.add_heading(line, level=2)
                elif line.strip().startswith("•"):
                    doc.add_paragraph(line.strip()[1:].strip(), style='List Bullet')
                else:
                    doc.add_paragraph(line.strip())
        doc.save(doc_path)
        print(f"Generated DOCX: {doc_path}")

        # Also write plain text version for fast drag & drop
        txt_path = os.path.join(OUTPUT_DIR, sample["filename"].replace(".docx", ".txt"))
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(sample["text"])
        print(f"Generated TXT: {txt_path}")

if __name__ == "__main__":
    generate_docs()
