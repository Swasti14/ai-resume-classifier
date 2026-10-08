import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StudentView from './components/student/StudentView';
import RecruiterView from './components/recruiter/RecruiterView';
import { api } from './services/api';
import './App.css';

export default function App() {
  const [activeRole, setActiveRole] = useState('student');
  const [serverStatus, setServerStatus] = useState('checking');
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Student Dashboard State
  const [studentProfile, setStudentProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [sampleResumes, setSampleResumes] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [activeGapData, setActiveGapData] = useState(null);

  // Recruiter Dashboard State
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [activeJobId, setActiveJobId] = useState('job-1');
  const [jobCandidates, setJobCandidates] = useState([]);
  const [activeCandidateDetail, setActiveCandidateDetail] = useState(null);
  const [activeComparisonData, setActiveComparisonData] = useState(null);

  // Display toast helper
  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Initial Data Fetch
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Health check
      await api.getHealth();
      setServerStatus('online');

      // 2. Student Data
      const [profileData, recJobs, samples] = await Promise.all([
        api.getStudentProfile(),
        api.getRecommendedJobs(),
        api.getSampleResumes()
      ]);
      setStudentProfile(profileData);
      setRecommendedJobs(recJobs);
      setSampleResumes(samples);

      // 3. Recruiter Data
      const jobsList = await api.getRecruiterJobs();
      setRecruiterJobs(jobsList);

      const targetJobId = jobsList.length > 0 ? jobsList[0].id : 'job-1';
      setActiveJobId(targetJobId);

      const candsData = await api.getJobCandidates(targetJobId);
      setJobCandidates(candsData.candidates || []);
    } catch (err) {
      console.warn('Backend connection notice:', err.message);
      setServerStatus('offline');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle switching active recruiter job
  const handleSelectJob = async (jobId) => {
    setActiveJobId(jobId);
    try {
      const data = await api.getJobCandidates(jobId);
      setJobCandidates(data.candidates || []);
    } catch (err) {
      showToast('Error loading candidates: ' + err.message, 'error');
    }
  };

  // --- Student Handlers ---
  const handleUploadStudentResume = async (file, rawText = null) => {
    setIsLoading(true);
    try {
      const res = await api.uploadResume({ file, rawText });
      setStudentProfile(res.profile);
      setRecommendedJobs(res.recommendations);
      showToast('Resume parsed successfully! Match scores updated.');

      // Also reload recruiter candidates to reflect parsed candidate
      if (activeJobId) {
        const cands = await api.getJobCandidates(activeJobId);
        setJobCandidates(cands.candidates || []);
      }
    } catch (err) {
      showToast('Failed to parse resume: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSampleResume = async (sample) => {
    setIsLoading(true);
    try {
      const res = await api.uploadResume({ rawText: sample.text });
      setStudentProfile(res.profile);
      setRecommendedJobs(res.recommendations);
      showToast(`Loaded ${sample.title.split(' - ')[0]} profile!`);

      if (activeJobId) {
        const cands = await api.getJobCandidates(activeJobId);
        setJobCandidates(cands.candidates || []);
      }
    } catch (err) {
      showToast('Failed to load sample: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      await api.applyToJob(jobId);
      setAppliedJobIds((prev) => [...prev, jobId]);
      showToast('Application submitted successfully!');

      // Refresh recruiter candidate list
      if (activeJobId === jobId) {
        const cands = await api.getJobCandidates(activeJobId);
        setJobCandidates(cands.candidates || []);
      }
    } catch (err) {
      showToast('Application error: ' + err.message, 'error');
    }
  };

  const handleOpenSkillGap = async (jobId) => {
    try {
      const gap = await api.getSkillGap(jobId);
      setActiveGapData(gap);
    } catch (err) {
      showToast('Error loading skill gap: ' + err.message, 'error');
    }
  };

  // --- Recruiter Handlers ---
  const handleCreateJob = async (jobData) => {
    try {
      const created = await api.createJob(jobData);
      showToast(`Job "${created.title}" published! Skills auto-extracted.`);

      // Refresh jobs list
      const jobsList = await api.getRecruiterJobs();
      setRecruiterJobs(jobsList);
      setActiveJobId(created.id);

      // Load candidates for new job
      const cands = await api.getJobCandidates(created.id);
      setJobCandidates(cands.candidates || []);

      // Also refresh student recommended jobs
      const studentRecs = await api.getRecommendedJobs();
      setRecommendedJobs(studentRecs);
    } catch (err) {
      showToast('Job creation failed: ' + err.message, 'error');
    }
  };

  const handleBulkUpload = async (files, jobId) => {
    try {
      const res = await api.bulkUploadResumes(files, jobId);
      showToast(res.message);
      setJobCandidates(res.ranked_candidates || []);

      // Refresh jobs metadata counts
      const jobsList = await api.getRecruiterJobs();
      setRecruiterJobs(jobsList);
    } catch (err) {
      showToast('Bulk upload failed: ' + err.message, 'error');
    }
  };

  const handleInspectCandidate = async (candidateId, jobId) => {
    try {
      const detail = await api.getCandidateDetail(candidateId, jobId);
      setActiveCandidateDetail(detail);
    } catch (err) {
      showToast('Error inspecting candidate: ' + err.message, 'error');
    }
  };

  const handleShortlistCandidate = async (candidateId, jobId) => {
    try {
      await api.shortlistCandidate(candidateId, jobId);
      showToast('Candidate shortlisted!');

      // Update candidate list locally
      setJobCandidates((prev) =>
        prev.map((c) =>
          c.candidate.id === candidateId ? { ...c, status: 'shortlisted' } : c
        )
      );

      // If detail modal is open, update status
      if (activeCandidateDetail && activeCandidateDetail.candidate.id === candidateId) {
        setActiveCandidateDetail((prev) => ({ ...prev, status: 'shortlisted' }));
      }

      // If comparison modal is open, update
      if (activeComparisonData) {
        setActiveComparisonData((prev) => ({
          ...prev,
          comparison: prev.comparison.map((item) =>
            item.candidate.id === candidateId ? { ...item, status: 'shortlisted' } : item
          )
        }));
      }
    } catch (err) {
      showToast('Shortlist error: ' + err.message, 'error');
    }
  };

  const handleRejectCandidate = async (candidateId, jobId) => {
    try {
      await api.rejectCandidate(candidateId, jobId);
      showToast('Candidate marked as rejected.');

      setJobCandidates((prev) =>
        prev.map((c) =>
          c.candidate.id === candidateId ? { ...c, status: 'rejected' } : c
        )
      );

      if (activeCandidateDetail && activeCandidateDetail.candidate.id === candidateId) {
        setActiveCandidateDetail((prev) => ({ ...prev, status: 'rejected' }));
      }

      if (activeComparisonData) {
        setActiveComparisonData((prev) => ({
          ...prev,
          comparison: prev.comparison.map((item) =>
            item.candidate.id === candidateId ? { ...item, status: 'rejected' } : item
          )
        }));
      }
    } catch (err) {
      showToast('Reject error: ' + err.message, 'error');
    }
  };

  const handleCompareCandidates = async (candidateIds, jobId) => {
    try {
      const res = await api.compareCandidates(candidateIds, jobId);
      setActiveComparisonData(res);
    } catch (err) {
      showToast('Comparison error: ' + err.message, 'error');
    }
  };

  const handleResetDemo = async () => {
    try {
      await api.resetData();
      setAppliedJobIds([]);
      await loadInitialData();
      showToast('Demo data and applications reset successfully!');
    } catch (err) {
      showToast('Reset failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Header
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onResetDemo={handleResetDemo}
        serverStatus={serverStatus}
        userProfile={studentProfile}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeRole === 'student' ? (
          <StudentView
            profile={studentProfile}
            jobs={recommendedJobs}
            sampleResumes={sampleResumes}
            onUploadResume={handleUploadStudentResume}
            onLoadSampleResume={handleLoadSampleResume}
            onApplyJob={handleApplyJob}
            appliedJobIds={appliedJobIds}
            onOpenSkillGap={handleOpenSkillGap}
            activeGapData={activeGapData}
            onCloseSkillGap={() => setActiveGapData(null)}
            isLoading={isLoading}
          />
        ) : (
          <RecruiterView
            jobs={recruiterJobs}
            activeJobId={activeJobId}
            onSelectJob={handleSelectJob}
            candidates={jobCandidates}
            onShortlist={handleShortlistCandidate}
            onReject={handleRejectCandidate}
            onCreateJob={handleCreateJob}
            onBulkUpload={handleBulkUpload}
            onInspectCandidate={handleInspectCandidate}
            activeCandidateDetail={activeCandidateDetail}
            onCloseCandidateDetail={() => setActiveCandidateDetail(null)}
            onCompareCandidates={handleCompareCandidates}
            activeComparisonData={activeComparisonData}
            onCloseComparison={() => setActiveComparisonData(null)}
            getExportUrl={api.getExportUrl}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
