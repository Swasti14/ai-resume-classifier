"""
Skill ontology and taxonomy for AI resume parsing and matching.
Covers core domains: Programming, ML/AI, Data Science, Web/Backend,
Databases, Cloud/DevOps, Software Engineering & Tools.
"""

# Categorized canonical skills
SKILL_CATEGORIES = {
    "Programming Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C", "C#", "Go", "Golang",
        "Rust", "Ruby", "PHP", "Swift", "Kotlin", "R", "Scala", "Dart", "Shell", "Bash", "SQL"
    ],
    "Machine Learning & AI": [
        "Machine Learning", "Deep Learning", "Natural Language Processing", "NLP",
        "Computer Vision", "PyTorch", "TensorFlow", "Keras", "Scikit-learn",
        "Hugging Face", "Large Language Models", "LLMs", "LangChain", "Transformers",
        "BERT", "GPT", "XGBoost", "LightGBM", "OpenCV", "NLTK", "spaCy", "Generative AI",
        "Reinforcement Learning", "Neural Networks", "LlamaIndex", "Vector Databases",
        "RAG", "Prompt Engineering"
    ],
    "Data Science & Analytics": [
        "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn", "Plotly", "Data Analysis",
        "Data Visualization", "Tableau", "Power BI", "Statistics", "Exploratory Data Analysis",
        "EDA", "Data Mining", "ETL", "Apache Spark", "PySpark", "Hadoop", "Excel",
        "Data Warehousing", "BigQuery", "Snowflake", "DAX", "Business Intelligence"
    ],
    "Web & Backend Engineering": [
        "React", "React.js", "Next.js", "Node.js", "Express", "Express.js", "FastAPI",
        "Flask", "Django", "Spring Boot", "ASP.NET", "REST APIs", "GraphQL", "HTML",
        "HTML5", "CSS", "CSS3", "Tailwind CSS", "Redux", "Vue.js", "Angular", "WebSockets",
        "Microservices", "System Design", "gRPC"
    ],
    "Databases & Storage": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra",
        "Elasticsearch", "DynamoDB", "Firebase", "Neo4j", "Supabase"
    ],
    "Cloud & DevOps": [
        "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Docker",
        "Kubernetes", "CI/CD", "Git", "GitHub", "GitLab", "Terraform", "Linux",
        "Jenkins", "Ansible", "Nginx", "Kubernetes", "Cloud Computing"
    ],
    "Software Practices & Methodologies": [
        "Object-Oriented Programming", "OOP", "Data Structures", "Algorithms",
        "Agile", "Scrum", "Test-Driven Development", "TDD", "Git Workflow",
        "Problem Solving", "Code Review", "Unit Testing"
    ]
}

# Alias/normalization mapping to canonical skill names
SKILL_ALIASES = {
    "py": "Python",
    "python3": "Python",
    "js": "JavaScript",
    "ts": "TypeScript",
    "cpp": "C++",
    "c plus plus": "C++",
    "c#": "C#",
    "csharp": "C#",
    "c sharp": "C#",
    "golang": "Go",
    "reactjs": "React",
    "react.js": "React",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "expressjs": "Express",
    "express.js": "Express",
    "vue": "Vue.js",
    "vuejs": "Vue.js",
    "ml": "Machine Learning",
    "machine-learning": "Machine Learning",
    "dl": "Deep Learning",
    "deep-learning": "Deep Learning",
    "nlp": "Natural Language Processing",
    "natural language processing": "Natural Language Processing",
    "cv": "Computer Vision",
    "sklearn": "Scikit-learn",
    "scikit learn": "Scikit-learn",
    "tf": "TensorFlow",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "torch": "PyTorch",
    "hf": "Hugging Face",
    "llm": "LLMs",
    "llms": "LLMs",
    "large language models": "LLMs",
    "genai": "Generative AI",
    "gen ai": "Generative AI",
    "powerbi": "Power BI",
    "power-bi": "Power BI",
    "ms excel": "Excel",
    "microsoft excel": "Excel",
    "postgres": "PostgreSQL",
    "psql": "PostgreSQL",
    "mongo": "MongoDB",
    "k8s": "Kubernetes",
    "amazon web services": "AWS",
    "google cloud platform": "GCP",
    "google cloud": "GCP",
    "microsoft azure": "Azure",
    "rest": "REST APIs",
    "restful": "REST APIs",
    "rest api": "REST APIs",
    "dsa": "Data Structures",
    "data structures and algorithms": "Data Structures",
    "data structure": "Data Structures",
    "oop": "Object-Oriented Programming",
    "oops": "Object-Oriented Programming"
}

# Flat set of all unique canonical skills
ALL_CANONICAL_SKILLS = set()
for cat_skills in SKILL_CATEGORIES.values():
    ALL_CANONICAL_SKILLS.update(cat_skills)

def normalize_skill(skill_raw: str) -> str:
    """Normalize any raw skill string into its canonical representation."""
    cleaned = skill_raw.strip().lower()
    if cleaned in SKILL_ALIASES:
        return SKILL_ALIASES[cleaned]
    # Check case-insensitive match against canonical skills
    for canonical in ALL_CANONICAL_SKILLS:
        if canonical.lower() == cleaned:
            return canonical
    # Return formatted title case if not in taxonomy
    return skill_raw.strip().title()

def get_skill_category(skill_name: str) -> str:
    """Find the category for a given canonical skill."""
    norm = normalize_skill(skill_name)
    for category, skills in SKILL_CATEGORIES.items():
        if norm in skills:
            return category
    return "Other Technical Skills"
