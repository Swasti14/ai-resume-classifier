"""
Resume-Job Description Matching Engine.
Calculates 5-factor Job Alignment Score:
1. Skills Match (50%)
2. Experience Match (20%)
3. Education Match (10%)
4. Projects & Certifications (10%)
5. Semantic Similarity (10%)

Provides explainable breakdowns, matched & missing skill gap analysis,
candidate suitability tags, and targeted AI recommendations.
"""

from typing import Dict, List, Any, Set
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def compute_semantic_similarity(resume_text: str, jd_text: str) -> float:
    """Compute TF-IDF N-gram cosine similarity between resume and job description."""
    if not resume_text or not jd_text:
        return 0.5
    try:
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True,
            max_features=5000
        )
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        # Normalize and scale similarity to range 0.0 - 1.0 with smooth curve
        norm_sim = min(1.0, max(0.0, float(sim) * 1.45))
        return norm_sim
    except Exception:
        return 0.6


def evaluate_skills(candidate_skills: List[str], required_skills: List[str], preferred_skills: List[str]) -> Dict[str, Any]:
    """
    Compare candidate skills against required and preferred skills.
    Skill Match Weight: 50% maximum (0 to 50 points).
    """
    cand_set: Set[str] = {s.lower() for s in candidate_skills}
    req_set: Set[str] = {s.lower() for s in required_skills}
    pref_set: Set[str] = {s.lower() for s in preferred_skills}

    matched_required = [s for s in required_skills if s.lower() in cand_set]
    missing_required = [s for s in required_skills if s.lower() not in cand_set]

    matched_preferred = [s for s in preferred_skills if s.lower() in cand_set]
    missing_preferred = [s for s in preferred_skills if s.lower() not in cand_set]

    # Required skills account for 85% of skills score, preferred account for 15%
    req_ratio = (len(matched_required) / len(required_skills)) if required_skills else 1.0
    pref_ratio = (len(matched_preferred) / len(preferred_skills)) if preferred_skills else 1.0

    skill_score_ratio = (req_ratio * 0.85) + (pref_ratio * 0.15)
    points = round(skill_score_ratio * 50.0, 1)

    matched_all = matched_required + matched_preferred
    missing_all = missing_required + missing_preferred

    return {
        "points": points,
        "max_points": 50,
        "percentage": round(skill_score_ratio * 100, 1),
        "matched_skills": matched_all,
        "missing_skills": missing_all,
        "matched_required": matched_required,
        "missing_required": missing_required,
        "matched_preferred": matched_preferred,
        "missing_preferred": missing_preferred
    }


def evaluate_experience(candidate_years: float, required_years: float) -> Dict[str, Any]:
    """
    Compare candidate experience vs required experience.
    Experience Match Weight: 20% maximum (0 to 20 points).
    """
    if required_years <= 0.0:
        ratio = 1.0
    elif candidate_years >= required_years:
        ratio = 1.0
    else:
        # Partial credit if close
        ratio = max(0.3, candidate_years / required_years)
    
    points = round(ratio * 20.0, 1)
    return {
        "points": points,
        "max_points": 20,
        "percentage": round(ratio * 100, 1),
        "candidate_years": candidate_years,
        "required_years": required_years
    }


def evaluate_education(candidate_level: int, required_level: int) -> Dict[str, Any]:
    """
    Compare education degrees.
    Education Match Weight: 10% maximum (0 to 10 points).
    """
    if candidate_level >= required_level:
        ratio = 1.0
    elif candidate_level == required_level - 1:
        ratio = 0.75
    else:
        ratio = 0.5
    
    points = round(ratio * 10.0, 1)
    return {
        "points": points,
        "max_points": 10,
        "percentage": round(ratio * 100, 1)
    }


def evaluate_projects_and_certifications(projects: List[Dict[str, str]], certs: List[str], required_skills: List[str]) -> Dict[str, Any]:
    """
    Evaluate relevance of projects and certifications.
    Projects & Certs Weight: 10% maximum (0 to 10 points).
    """
    proj_score = min(5.0, len(projects) * 2.5) if projects else 1.0
    cert_score = min(5.0, len(certs) * 2.5) if certs else 1.0

    # Extra bonus if project text mentions required skills
    combined_proj_text = " ".join([p.get("title", "") + " " + p.get("description", "") for p in projects]).lower()
    matches = sum(1 for s in required_skills if s.lower() in combined_proj_text)
    if matches >= 2:
        proj_score = min(5.0, proj_score + 1.0)

    total_points = round(proj_score + cert_score, 1)
    return {
        "points": total_points,
        "max_points": 10,
        "percentage": round((total_points / 10.0) * 100, 1)
    }


def generate_ai_explanation(
    candidate_name: str,
    job_title: str,
    overall_score: int,
    matched_skills: List[str],
    missing_skills: List[str],
    experience_years: float,
    required_years: float
) -> str:
    """Generate concise, natural language explainable AI summary."""
    top_matches = ", ".join(matched_skills[:4]) if matched_skills else "general fundamentals"
    top_missing = ", ".join(missing_skills[:3]) if missing_skills else None

    if overall_score >= 85:
        summary = (
            f"{candidate_name} is highly aligned with the {job_title} role due to strong "
            f"mastery in {top_matches} and relevant practical experience ({experience_years} yrs). "
        )
        if top_missing:
            summary += f"Acquiring {top_missing} would further perfect the match."
        else:
            summary += "Meets all core criteria with standout qualifications."
    elif overall_score >= 70:
        summary = (
            f"{candidate_name} is a strong suitable candidate for {job_title}. "
            f"Demonstrates solid foundation in {top_matches}. "
        )
        if top_missing:
            summary += f"Bridging the gap in {top_missing} is recommended for full synergy."
    elif overall_score >= 55:
        summary = (
            f"{candidate_name} exhibits moderate potential with foundational skills in {top_matches}. "
        )
        if top_missing:
            summary += f"Candidate currently lacks core requirements including {top_missing}."
    else:
        summary = (
            f"{candidate_name} currently has a low match for {job_title}. "
            f"Missing essential requirements ({top_missing or 'domain requirements'}). "
            f"Recommended to build relevant projects before applying."
        )

    return summary


def get_suitability_badge(score: int) -> Dict[str, str]:
    """Map alignment score to standardized suitability status and UI badge style."""
    if score >= 85:
        return {"status": "Highly Suitable", "level": "high", "color": "emerald", "badge": "★ Highly Suitable"}
    elif score >= 70:
        return {"status": "Suitable", "level": "medium-high", "color": "blue", "badge": "✓ Suitable"}
    elif score >= 55:
        return {"status": "Moderate", "level": "medium", "color": "amber", "badge": "▲ Moderate"}
    else:
        return {"status": "Low Match", "level": "low", "color": "rose", "badge": "✕ Low Match"}


def calculate_match(resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Complete matching pipeline between candidate resume and job requirements.
    Calculates breakdown, Job Alignment Score, and recommendations.
    """
    cand_skills = resume_data.get("skills", [])
    cand_exp_years = float(resume_data.get("experience", {}).get("years", 0.5))
    cand_edu_level = int(resume_data.get("education", {}).get("degree_level", 2))
    projects = resume_data.get("projects", [])
    certs = resume_data.get("certifications", [])
    raw_resume_text = resume_data.get("raw_text", "")

    req_skills = job_data.get("required_skills", [])
    pref_skills = job_data.get("preferred_skills", [])
    req_exp_years = float(job_data.get("min_experience_years", 1.0))
    req_edu_level = int(job_data.get("degree_level", 2))
    jd_text = job_data.get("description", "")

    # 1. Skills Match (50%)
    skill_eval = evaluate_skills(cand_skills, req_skills, pref_skills)

    # 2. Experience Match (20%)
    exp_eval = evaluate_experience(cand_exp_years, req_exp_years)

    # 3. Education Match (10%)
    edu_eval = evaluate_education(cand_edu_level, req_edu_level)

    # 4. Projects & Certs (10%)
    proj_eval = evaluate_projects_and_certifications(projects, certs, req_skills)

    # 5. Semantic Match (10%)
    sem_sim = compute_semantic_similarity(raw_resume_text, jd_text)
    semantic_points = round(sem_sim * 10.0, 1)
    sem_eval = {
        "points": semantic_points,
        "max_points": 10,
        "percentage": round(sem_sim * 100, 1)
    }

    # Total score calculation
    total_raw = (
        skill_eval["points"] +
        exp_eval["points"] +
        edu_eval["points"] +
        proj_eval["points"] +
        sem_eval["points"]
    )
    final_score = int(round(min(100.0, max(0.0, total_raw))))

    suitability = get_suitability_badge(final_score)
    candidate_name = resume_data.get("name", "Candidate")
    job_title = job_data.get("title", "Position")

    ai_explanation = generate_ai_explanation(
        candidate_name=candidate_name,
        job_title=job_title,
        overall_score=final_score,
        matched_skills=skill_eval["matched_skills"],
        missing_skills=skill_eval["missing_skills"],
        experience_years=cand_exp_years,
        required_years=req_exp_years
    )

    # Profile improvement recommendations for students
    recommendations = []
    if skill_eval["missing_required"]:
        recommendations.append(f"Learn core required skill(s): {', '.join(skill_eval['missing_required'][:3])}")
    if cand_exp_years < req_exp_years:
        recommendations.append(f"Gain internship or open-source practical experience to reach {req_exp_years} years threshold")
    if len(projects) < 2:
        recommendations.append(f"Add a capstone portfolio project demonstrating {job_title} workflow")
    if skill_eval["missing_preferred"]:
        recommendations.append(f"Familiarize yourself with preferred tools: {', '.join(skill_eval['missing_preferred'][:2])}")

    return {
        "match_score": final_score,
        "suitability": suitability["status"],
        "badge_info": suitability,
        "breakdown": {
            "skill_match": skill_eval["points"],
            "skill_match_max": 50,
            "skill_match_percent": skill_eval["percentage"],
            "experience_match": exp_eval["points"],
            "experience_match_max": 20,
            "experience_match_percent": exp_eval["percentage"],
            "education_match": edu_eval["points"],
            "education_match_max": 10,
            "education_match_percent": edu_eval["percentage"],
            "projects_match": proj_eval["points"],
            "projects_match_max": 10,
            "projects_match_percent": proj_eval["percentage"],
            "semantic_match": sem_eval["points"],
            "semantic_match_max": 10,
            "semantic_match_percent": sem_eval["percentage"]
        },
        "matched_skills": skill_eval["matched_skills"],
        "missing_skills": skill_eval["missing_skills"],
        "matched_required": skill_eval["matched_required"],
        "missing_required": skill_eval["missing_required"],
        "matched_preferred": skill_eval["matched_preferred"],
        "missing_preferred": skill_eval["missing_preferred"],
        "ai_explanation": ai_explanation,
        "recommendations": recommendations
    }
