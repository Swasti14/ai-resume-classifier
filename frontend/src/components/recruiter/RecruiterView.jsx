import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  PlusCircle,
  UploadCloud,
  Download,
  XCircle,
  Star,
  Eye,
  Columns,
  Award,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import CandidateModal from './CandidateModal';
import CompareModal from './CompareModal';
import PostJobModal from './PostJobModal';
import BulkUploadModal from './BulkUploadModal';

export default function RecruiterView({
  jobs,
  activeJobId,
  onSelectJob,
  candidates,
  onShortlist,
  onReject,
  onCreateJob,
  onBulkUpload,
  onInspectCandidate,
  activeCandidateDetail,
  onCloseCandidateDetail,
  onCompareCandidates,
  activeComparisonData,
  onCloseComparison,
  getExportUrl
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [suitabilityFilter, setSuitabilityFilter] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  // Active Job object
  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  // Filter candidates
  const filteredCandidates = candidates.filter((item) => {
    // Status filter
    if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    // Suitability filter
    if (suitabilityFilter !== 'all') {
      const level = item.badge_info?.level || '';
      if (suitabilityFilter === 'high' && level !== 'high') return false;
      if (suitabilityFilter === 'medium-high' && level !== 'medium-high') return false;
      if (suitabilityFilter === 'medium' && level !== 'medium') return false;
      if (suitabilityFilter === 'low' && level !== 'low') return false;
    }
    // Min score
    if (item.score < minScore) {
      return false;
    }
    return true;
  });

  // Stats calculation
  const totalApplicants = candidates.length;
  const avgScore = totalApplicants
    ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / totalApplicants)
    : 0;
  const shortlistedCount = candidates.filter((c) => c.status === 'shortlisted').length;
  const topScore = candidates.length > 0 ? candidates[0].score : 0;

  // Comparison toggle
  const toggleCompare = (candId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(candId)) {
        return prev.filter((id) => id !== candId);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 candidates simultaneously.');
        return prev;
      }
      return [...prev, candId];
    });
  };

  const handleTriggerCompare = () => {
    if (selectedForCompare.length >= 2) {
      onCompareCandidates(selectedForCompare, activeJob.id);
    }
  };

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-badge rank-badge-1';
    if (rank === 2) return 'rank-badge rank-badge-2';
    if (rank === 3) return 'rank-badge rank-badge-3';
    return 'rank-badge';
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#34d399';
    if (score >= 70) return '#38bdf8';
    if (score >= 55) return '#fbbf24';
    return '#fb7185';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* --- Top Bar: Job Postings Selector & Post Job Action --- */}
      <div className="dash-hero" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-primary">
              <Briefcase size={12} />
              Recruiter Talent Command
            </span>
            <span className="badge badge-subtle">{jobs.length} Active Positions</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
              Active Job Posting:
            </label>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '260px', fontWeight: 600 }}
              value={activeJob?.id}
              onChange={(e) => onSelectJob(e.target.value)}
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} • {j.company} ({j.candidates_count || 0} applicants)
                </option>
              ))}
            </select>
          </div>

          {/* Active Job Requirements Strip */}
          {activeJob && (
            <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <span className="job-tag">
                <MapPin size={12} />
                {activeJob.location}
              </span>
              <span className="job-tag">
                <DollarSign size={12} />
                {activeJob.salary}
              </span>
              <span className="job-tag">
                <Clock size={12} />
                Min {activeJob.min_experience_years} yr(s) exp
              </span>
              <span className="job-tag">
                <Award size={12} />
                {activeJob.required_degree}
              </span>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Skills:</span>
                {activeJob.required_skills?.map((s, idx) => (
                  <span key={idx} className="skill-tag" style={{ fontSize: '11.5px', padding: '2px 8px' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setShowBulkUploadModal(true)}>
            <UploadCloud size={16} />
            <span>Bulk Upload Resumes</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowPostJobModal(true)}>
            <PlusCircle size={16} />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* --- Stat Counters Strip --- */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value">{totalApplicants}</div>
            <div className="stat-label">Total Applicants Analyzed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-value">{avgScore}%</div>
            <div className="stat-label">Average Fit Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
            <Star size={22} />
          </div>
          <div>
            <div className="stat-value">{shortlistedCount}</div>
            <div className="stat-label">Shortlisted Candidates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
            <Award size={22} />
          </div>
          <div>
            <div className="stat-value">{topScore}%</div>
            <div className="stat-label">Top Candidate Alignment</div>
          </div>
        </div>
      </div>

      {/* --- Recruiter Toolbar & Filters --- */}
      <div className="recruiter-toolbar">
        {/* Suitability Filter */}
        <div className="filter-group">
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
            Alignment:
          </span>
          <button
            className={`filter-pill ${suitabilityFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSuitabilityFilter('all')}
          >
            All Fits
          </button>
          <button
            className={`filter-pill ${suitabilityFilter === 'high' ? 'active' : ''}`}
            onClick={() => setSuitabilityFilter('high')}
          >
            ★ Highly Suitable (85%+)
          </button>
          <button
            className={`filter-pill ${suitabilityFilter === 'medium-high' ? 'active' : ''}`}
            onClick={() => setSuitabilityFilter('medium-high')}
          >
            ✓ Suitable (70%+)
          </button>
          <button
            className={`filter-pill ${suitabilityFilter === 'medium' ? 'active' : ''}`}
            onClick={() => setSuitabilityFilter('medium')}
          >
            ▲ Moderate
          </button>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
            Status:
          </span>
          <button
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-pill ${statusFilter === 'shortlisted' ? 'active' : ''}`}
            onClick={() => setStatusFilter('shortlisted')}
          >
            Shortlisted
          </button>
          <button
            className={`filter-pill ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-pill ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>

        {/* Min Score Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <SlidersHorizontal size={14} color="var(--text-subtle)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
            Min Fit:
          </span>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
            style={{ width: '90px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 700, minWidth: '35px', color: 'var(--primary-light)', fontSize: '12px' }}>
            {minScore}%
          </span>
        </div>

        {/* Actions (Compare & Export) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className={`btn btn-sm ${selectedForCompare.length >= 2 ? 'btn-primary' : 'btn-secondary'}`}
            disabled={selectedForCompare.length < 2}
            onClick={handleTriggerCompare}
          >
            <Columns size={14} />
            <span>Compare Selected ({selectedForCompare.length})</span>
          </button>

          <a
            href={getExportUrl(activeJob.id, 'csv')}
            download
            className="btn btn-secondary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            <Download size={14} />
            <span>Export to CSV</span>
          </a>
        </div>
      </div>

      {/* --- Candidates Ranked Leaderboard Table --- */}
      <div className="candidates-table-wrap">
        <table className="candidates-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Compare</th>
              <th style={{ width: '60px' }}>Rank</th>
              <th>Candidate Name & Contact</th>
              <th style={{ width: '130px' }}>Match Score</th>
              <th>Skill Coverage</th>
              <th>Experience & Degree</th>
              <th style={{ width: '110px' }}>Status</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-subtle)' }}>
                  No candidates match the selected filters.
                </td>
              </tr>
            ) : (
              filteredCandidates.map((item, idx) => {
                const { candidate, score, suitability, badge_info, status, match } = item;
                const isSelected = selectedForCompare.includes(candidate.id);
                const rank = idx + 1;

                const getStatusPill = (st) => {
                  if (st === 'shortlisted') return <span className="badge badge-emerald">Shortlisted</span>;
                  if (st === 'rejected') return <span className="badge badge-rose">Rejected</span>;
                  return <span className="badge badge-amber">Pending</span>;
                };

                return (
                  <tr key={candidate.id}>
                    {/* Compare Checkbox */}
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCompare(candidate.id)}
                        style={{ cursor: 'pointer', accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                    </td>

                    {/* Rank */}
                    <td>
                      <div className={getRankBadgeClass(rank)}>
                        {rank}
                      </div>
                    </td>

                    {/* Candidate Info */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 800,
                            color: 'white',
                            flexShrink: 0
                          }}
                        >
                          {candidate.name ? candidate.name.charAt(0) : 'C'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {candidate.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {candidate.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Score */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: getScoreColor(score), fontFamily: 'var(--font-heading)' }}>
                          {score}%
                        </div>
                        <span className={`badge ${badge_info?.level === 'high' ? 'badge-emerald' : badge_info?.level === 'medium-high' ? 'badge-blue' : badge_info?.level === 'medium' ? 'badge-amber' : 'badge-rose'}`} style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                          {badge_info?.badge || suitability}
                        </span>
                      </div>
                    </td>

                    {/* Skill Coverage */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          <strong style={{ color: '#34d399' }}>{match?.matched_skills?.length || 0}</strong> matched /{' '}
                          <span style={{ color: '#fb7185' }}>{match?.missing_skills?.length || 0}</span> missing
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {match?.matched_skills?.slice(0, 3).map((s, i) => (
                            <span key={i} className="skill-tag skill-tag-matched" style={{ fontSize: '11px', padding: '2px 6px' }}>
                              {s}
                            </span>
                          ))}
                          {(match?.matched_skills?.length || 0) > 3 && (
                            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                              +{match.matched_skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Experience & Degree */}
                    <td>
                      <div style={{ fontSize: '13px' }}>
                        <div>{candidate.experience?.years} yr(s) practical exp</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          {candidate.education?.degree} ({candidate.education?.major})
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td>{getStatusPill(status)}</td>

                    {/* Quick Actions */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px' }}
                          title="Inspect full candidate breakdown"
                          onClick={() => onInspectCandidate(candidate.id, activeJob.id)}
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          className="btn btn-success btn-sm"
                          style={{ padding: '6px' }}
                          title="Shortlist Candidate"
                          onClick={() => onShortlist(candidate.id, activeJob.id)}
                        >
                          <Star size={14} />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px' }}
                          title="Reject Candidate"
                          onClick={() => onReject(candidate.id, activeJob.id)}
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- Deep Dive Candidate Modal --- */}
      {activeCandidateDetail && (
        <CandidateModal
          candidateDetail={activeCandidateDetail}
          onClose={onCloseCandidateDetail}
          onShortlist={onShortlist}
          onReject={onReject}
        />
      )}

      {/* --- Side-by-Side Comparison Modal --- */}
      {activeComparisonData && (
        <CompareModal
          comparisonData={activeComparisonData}
          onClose={onCloseComparison}
          onShortlist={onShortlist}
          onReject={onReject}
        />
      )}

      {/* --- Post Job Modal --- */}
      {showPostJobModal && (
        <PostJobModal
          onClose={() => setShowPostJobModal(false)}
          onSubmit={(jobData) => {
            onCreateJob(jobData);
            setShowPostJobModal(false);
          }}
        />
      )}

      {/* --- Bulk Upload Modal --- */}
      {showBulkUploadModal && (
        <BulkUploadModal
          activeJob={activeJob}
          onClose={() => setShowBulkUploadModal(false)}
          onUpload={(files, jobId) => {
            onBulkUpload(files, jobId);
          }}
        />
      )}
    </div>
  );
}
