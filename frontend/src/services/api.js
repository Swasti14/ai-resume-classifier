/**
 * API service for communicating with the FastAPI backend.
 * Provides typed helpers, automatic JSON handling, and fallback resilience.
 */

const BASE_URL = '';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Health & System
  async getHealth() {
    return handleResponse(await fetch(`${BASE_URL}/api/health`));
  },

  async login(role = 'student', email = null) {
    return handleResponse(
      await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email }),
      })
    );
  },

  async getSampleResumes() {
    return handleResponse(await fetch(`${BASE_URL}/api/demo/sample-resumes`));
  },

  async resetData() {
    return handleResponse(
      await fetch(`${BASE_URL}/api/recruiter/reset-data`, {
        method: 'POST',
      })
    );
  },

  // Student Endpoints
  async getStudentProfile() {
    return handleResponse(await fetch(`${BASE_URL}/api/student/profile`));
  },

  async uploadResume({ file, rawText }) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (rawText) {
      formData.append('raw_text', rawText);
    }

    return handleResponse(
      await fetch(`${BASE_URL}/api/student/resume/upload`, {
        method: 'POST',
        body: formData,
      })
    );
  },

  async getRecommendedJobs() {
    return handleResponse(await fetch(`${BASE_URL}/api/student/recommended-jobs`));
  },

  async getSkillGap(jobId) {
    return handleResponse(await fetch(`${BASE_URL}/api/student/skill-gap/${jobId}`));
  },

  async applyToJob(jobId) {
    return handleResponse(
      await fetch(`${BASE_URL}/api/student/apply/${jobId}`, {
        method: 'POST',
      })
    );
  },

  // Recruiter Endpoints
  async getRecruiterJobs() {
    return handleResponse(await fetch(`${BASE_URL}/api/recruiter/jobs`));
  },

  async createJob(jobData) {
    return handleResponse(
      await fetch(`${BASE_URL}/api/recruiter/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      })
    );
  },

  async bulkUploadResumes(files, jobId) {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    if (jobId) {
      formData.append('job_id', jobId);
    }

    return handleResponse(
      await fetch(`${BASE_URL}/api/recruiter/resumes/upload`, {
        method: 'POST',
        body: formData,
      })
    );
  },

  async getJobCandidates(jobId, statusFilter = null, minScore = null) {
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') {
      params.append('status_filter', statusFilter);
    }
    if (minScore !== null && minScore !== undefined) {
      params.append('min_score', minScore);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return handleResponse(await fetch(`${BASE_URL}/api/recruiter/candidates/${jobId}${query}`));
  },

  async getCandidateDetail(candidateId, jobId) {
    return handleResponse(await fetch(`${BASE_URL}/api/recruiter/candidate/${candidateId}/${jobId}`));
  },

  async shortlistCandidate(candidateId, jobId) {
    return handleResponse(
      await fetch(`${BASE_URL}/api/recruiter/shortlist/${candidateId}/${jobId}`, {
        method: 'POST',
      })
    );
  },

  async rejectCandidate(candidateId, jobId) {
    return handleResponse(
      await fetch(`${BASE_URL}/api/recruiter/reject/${candidateId}/${jobId}`, {
        method: 'POST',
      })
    );
  },

  async compareCandidates(candidateIds, jobId) {
    return handleResponse(
      await fetch(`${BASE_URL}/api/recruiter/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_ids: candidateIds, job_id: jobId }),
      })
    );
  },

  getExportUrl(jobId, format = 'csv') {
    return `${BASE_URL}/api/recruiter/export/${jobId}?format=${format}`;
  },
};
