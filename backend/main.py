"""
FastAPI Server for AI-Powered Resume Classifier & Job Matching Platform.
Provides RESTful endpoints for Student and Recruiter Dashboards,
NLP resume parsing, skill extraction, 5-factor matching engine, and ranking.
"""

import os
import sys
import io
import csv
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure local imports work cleanly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nlp.extractor import parse_resume, parse_job_description, extract_text_from_bytes
from nlp.matcher import calculate_match
from data.store import db

app = FastAPI(
    title="AI Resume Classifier & Job Matching Platform",
    description="NLP-powered dual-dashboard talent alignment system",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server (port 5173 / any local origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Request Models ---

class LoginRequest(BaseModel):
    role: str  # 'student' or 'recruiter'
    email: Optional[str] = None
    password: Optional[str] = None


class JobCreateRequest(BaseModel):
    title: str
    company: Optional[str] = "Acme Corp"
    location: Optional[str] = "Remote / Hybrid"
    salary: Optional[str] = "$80,000 - $105,000 / yr"
    type: Optional[str] = "Full-time"
    description: str
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    min_experience_years: Optional[float] = 1.0
    required_degree: Optional[str] = "Bachelor's Degree"


class CompareRequest(BaseModel):
    candidate_ids: List[str]
    job_id: str


class StudentProfileUpdate(BaseModel):
    name: Optional[str] = None
    skills: Optional[List[str]] = None
    education: Optional[dict] = None
    experience: Optional[dict] = None


# --- Core Routes ---

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Resume Classifier & Job Matching Platform",
        "version": "1.0.0",
        "active_jobs_count": len(db.jobs),
        "candidates_count": len(db.candidates)
    }


@app.post("/api/auth/login")
def login(req: LoginRequest):
    """Authenticate and return mock session for student or recruiter."""
    if req.role == "recruiter":
        return {
            "token": "recruiter-jwt-token-xyz",
            "role": "recruiter",
            "name": "Sarah Jenkins",
            "company": "Apex Talent Partners",
            "email": req.email or "s.jenkins@apextalent.io"
        }
    else:
        student = db.get_student_profile()
        return {
            "token": "student-jwt-token-abc",
            "role": "student",
            "name": student.get("name", "Rahul Sharma"),
            "email": student.get("email", "rahul.sharma@email.com")
        }


# --- Student Endpoints ---

@app.get("/api/student/profile")
def get_student_profile():
    """Retrieve extracted student profile data, skills, and completeness."""
    return db.get_student_profile()


@app.post("/api/student/resume/upload")
async def upload_student_resume(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None)
):
    """Upload resume as PDF, DOCX, TXT or pasted plain text for instant AI parsing."""
    if file:
        file_bytes = await file.read()
        parsed = parse_resume(file_bytes, file.filename)
    elif raw_text:
        file_bytes = raw_text.encode("utf-8")
        parsed = parse_resume(file_bytes, "resume_pasted.txt")
    else:
        raise HTTPException(status_code=400, detail="Must provide either a file or raw text.")

    # Update student profile in database
    updated = db.update_student_profile(parsed)
    # Recalculate job recommendations
    recommendations = db.get_recommended_jobs_for_student()

    return {
        "message": "Resume parsed and profile updated successfully",
        "profile": updated,
        "recommendations": recommendations
    }


@app.get("/api/student/recommended-jobs")
def get_recommended_jobs():
    """Get all jobs ranked by Job Alignment Score for the active student profile."""
    return db.get_recommended_jobs_for_student()


@app.get("/api/student/skill-gap/{job_id}")
def get_skill_gap_analysis(job_id: str):
    """Detailed skill gap analysis between student profile and specific job."""
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    student = db.get_student_profile()
    match_result = calculate_match(student, job)

    return {
        "job": job,
        "student_name": student.get("name"),
        "match_score": match_result["match_score"],
        "breakdown": match_result["breakdown"],
        "matched_skills": match_result["matched_skills"],
        "missing_skills": match_result["missing_skills"],
        "ai_explanation": match_result["ai_explanation"],
        "recommendations": match_result["recommendations"]
    }


@app.post("/api/student/apply/{job_id}")
def apply_to_job(job_id: str):
    """Submit application from active student."""
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    student = db.get_student_profile()
    db.set_candidate_status(student["id"], job_id, "applied")

    return {
        "message": f"Successfully applied to {job['title']} at {job.get('company', 'Company')}!",
        "status": "applied",
        "job_id": job_id
    }


# --- Recruiter Endpoints ---

@app.get("/api/recruiter/jobs")
def list_recruiter_jobs():
    """List all created jobs with applicant counts."""
    jobs = db.list_jobs()
    summary = []
    for j in jobs:
        ranked = db.rank_candidates_for_job(j["id"])
        shortlisted = [c for c in ranked if c["status"] == "shortlisted"]
        summary.append({
            **j,
            "candidates_count": len(ranked),
            "shortlisted_count": len(shortlisted),
            "top_match_score": ranked[0]["score"] if ranked else 0
        })
    return summary


@app.post("/api/recruiter/jobs")
def create_job(req: JobCreateRequest):
    """Create a new job posting. Parses description if skills are empty."""
    parsed_reqs = parse_job_description(
        req.description,
        title=req.title,
        min_exp=req.min_experience_years or 1.0,
        required_degree=req.required_degree or "Bachelor's Degree"
    )

    req_skills = req.required_skills if req.required_skills else parsed_reqs["required_skills"]
    pref_skills = req.preferred_skills if req.preferred_skills else parsed_reqs["preferred_skills"]

    new_job = {
        "title": req.title,
        "company": req.company or "Apex Talent Partners",
        "location": req.location or "San Francisco, CA (Hybrid)",
        "salary": req.salary or "$85,000 - $115,000 / yr",
        "type": req.type or "Full-time",
        "min_experience_years": req.min_experience_years or parsed_reqs["min_experience_years"],
        "required_degree": req.required_degree or parsed_reqs["required_degree"],
        "degree_level": parsed_reqs["degree_level"],
        "required_skills": req_skills,
        "preferred_skills": pref_skills,
        "description": req.description,
        "created_at": "2026-10-08"
    }

    created = db.create_job(new_job)
    return created


@app.post("/api/recruiter/resumes/upload")
async def bulk_upload_resumes(
    files: List[UploadFile] = File(...),
    job_id: Optional[str] = Form(None)
):
    """Bulk upload multiple resumes (PDF/DOCX/TXT) for automatic extraction and classification."""
    uploaded_results = []
    target_job_id = job_id or "job-1"

    for file in files:
        try:
            file_bytes = await file.read()
            parsed = parse_resume(file_bytes, file.filename)
            added_cand = db.add_candidate(parsed)
            uploaded_results.append({
                "candidate_id": added_cand["id"],
                "name": added_cand["name"],
                "filename": file.filename,
                "skills_count": len(added_cand["skills"])
            })
        except Exception as e:
            uploaded_results.append({
                "filename": file.filename,
                "error": str(e)
            })

    # Recalculate ranking for target job
    ranked = db.rank_candidates_for_job(target_job_id)

    return {
        "message": f"Successfully processed {len(uploaded_results)} resume(s)",
        "uploaded": uploaded_results,
        "ranked_candidates": ranked
    }


@app.post("/api/recruiter/match/{job_id}")
def run_job_matching(job_id: str):
    """Trigger AI Resume Classification and ranking for all candidates for a job."""
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    ranked = db.rank_candidates_for_job(job_id)
    return {
        "job": job,
        "total_analyzed": len(ranked),
        "ranked_candidates": ranked
    }


@app.get("/api/recruiter/candidates/{job_id}")
def get_job_candidates(
    job_id: str,
    status_filter: Optional[str] = Query(None),
    min_score: Optional[int] = Query(None)
):
    """Get ranked list of candidates with optional score or status filtering."""
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    ranked = db.rank_candidates_for_job(job_id)

    if status_filter and status_filter.lower() != "all":
        ranked = [c for c in ranked if c["status"].lower() == status_filter.lower()]

    if min_score is not None:
        ranked = [c for c in ranked if c["score"] >= min_score]

    return {
        "job": job,
        "total_count": len(ranked),
        "candidates": ranked
    }


@app.get("/api/recruiter/candidate/{candidate_id}/{job_id}")
def get_candidate_detail(candidate_id: str, job_id: str):
    """Get full deep-dive candidate inspection with 5-factor breakdown and AI summary."""
    candidate = db.get_candidate(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    match_result = calculate_match(candidate, job)
    status = db.get_candidate_status(candidate_id, job_id)

    return {
        "candidate": candidate,
        "job": job,
        "match": match_result,
        "status": status
    }


@app.post("/api/recruiter/shortlist/{candidate_id}/{job_id}")
def shortlist_candidate(candidate_id: str, job_id: str):
    """Shortlist a candidate for a job."""
    db.set_candidate_status(candidate_id, job_id, "shortlisted")
    return {"message": "Candidate shortlisted successfully", "candidate_id": candidate_id, "status": "shortlisted"}


@app.post("/api/recruiter/reject/{candidate_id}/{job_id}")
def reject_candidate(candidate_id: str, job_id: str):
    """Reject a candidate for a job."""
    db.set_candidate_status(candidate_id, job_id, "rejected")
    return {"message": "Candidate status set to rejected", "candidate_id": candidate_id, "status": "rejected"}


@app.post("/api/recruiter/compare")
def compare_candidates(req: CompareRequest):
    """Compare 2 to 3 candidates side-by-side against a job's requirements."""
    job = db.get_job(req.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    results = []
    for cid in req.candidate_ids:
        cand = db.get_candidate(cid)
        if cand:
            match_res = calculate_match(cand, job)
            results.append({
                "candidate": cand,
                "match": match_res,
                "status": db.get_candidate_status(cid, req.job_id)
            })

    return {
        "job": job,
        "comparison": results
    }


@app.get("/api/recruiter/export/{job_id}")
def export_candidates(job_id: str, format: str = "csv"):
    """Export ranked/shortlisted candidates as CSV or JSON."""
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    ranked = db.rank_candidates_for_job(job_id)

    if format.lower() == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Candidate Name", "Email", "Phone", "Match Score (%)",
            "Suitability", "Status", "Skill Points (Max 50)",
            "Experience (Years)", "Education Degree", "Matched Skills", "Missing Skills"
        ])

        for item in ranked:
            c = item["candidate"]
            m = item["match"]
            writer.writerow([
                c.get("name"),
                c.get("email"),
                c.get("phone"),
                item["score"],
                item["suitability"],
                item["status"],
                m["breakdown"]["skill_match"],
                c.get("experience", {}).get("years"),
                c.get("education", {}).get("degree"),
                "; ".join(m.get("matched_skills", [])),
                "; ".join(m.get("missing_skills", []))
            ])

        output.seek(0)
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=candidates_{job_id}.csv"}
        )

    return {"job": job, "candidates": ranked}


@app.get("/api/demo/sample-resumes")
def get_sample_resumes():
    """Retrieve pre-seeded realistic sample resumes for instant one-click testing."""
    try:
        from data.generate_sample_files import SAMPLE_RESUMES
        return SAMPLE_RESUMES
    except Exception:
        return []


@app.post("/api/recruiter/reset-data")
def reset_demo_data():
    """Reset candidate statuses, applications, and job listings back to initial seed data."""
    db.reset()
    return {"message": "Data successfully reset to initial demo seeds"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
