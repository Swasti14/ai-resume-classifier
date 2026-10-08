import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Briefcase,
  MapPin,
  DollarSign,
  Sparkles,
  GraduationCap,
  Clock,
  Send,
  Zap,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import SkillGapModal from './SkillGapModal';

export default function StudentView({
  profile,
  jobs,
  sampleResumes,
  onUploadResume,
  onLoadSampleResume,
  onApplyJob,
  appliedJobIds,
  onOpenSkillGap,
  activeGapData,
  onCloseSkillGap,
  isLoading
}) {
  const [filter, setFilter] = useState('all');
  const [isDragActive, setIsDragActive] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef(null);

  // Filter jobs
  const filteredJobs = jobs.filter((item) => {
    if (filter === 'high') return item.score >= 85;
    if (filter === 'suitable') return item.score >= 70;
    if (filter === 'applied') return appliedJobIds.includes(item.job.id);
    return true;
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadResume(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadResume(e.target.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (pastedText.trim()) {
      onUploadResume(null, pastedText);
      setShowPasteModal(false);
      setPastedText('');
    }
  };

  const getBadgeStyle = (level) => {
    if (level === 'high') return 'badge-emerald';
    if (level === 'medium-high') return 'badge-blue';
    if (level === 'medium') return 'badge-amber';
    return 'badge-rose';
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#34d399';
    if (score >= 70) return '#38bdf8';
    if (score >= 55) return '#fbbf24';
    return '#fb7185';
  };

  return (
    <div className="student-grid animate-fade-in">
      {/* --- Left Column: Candidate Resume & Profile --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Upload Card */}
        <div className="glass-card profile-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Resume Parser</h3>
            {isLoading ? (
              <span className="badge badge-amber">
                <Loader2 size={11} className="animate-spin" />
                Parsing AI...
              </span>
            ) : (
              <span className="badge badge-primary">
                <Sparkles size={11} />
                NLP Extractor
              </span>
            )}
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
            />
            <div className="dropzone-icon">
              <UploadCloud size={24} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                Drag & drop your Resume here
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '4px' }}>
                Supports PDF, DOCX, or TXT
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '6px' }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Local Files
            </button>
          </div>

          {/* Quick Plain Text Option */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
              onClick={() => setShowPasteModal(true)}
            >
              <FileText size={14} />
              <span>Or Paste Raw Resume Text</span>
            </button>
          </div>

          {/* Quick Preloaded Samples */}
          <div className="quick-samples">
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Instant Demo Presets
            </div>
            {sampleResumes && sampleResumes.length > 0 ? (
              sampleResumes.map((sample, idx) => (
                <div
                  key={idx}
                  className="sample-chip"
                  onClick={() => onLoadSampleResume(sample)}
                  title="Click to parse and align this pre-loaded candidate"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={13} color="#818cf8" />
                    <span>{sample.title.split(' - ')[0]}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                    {sample.title.split(' - ')[1]?.replace(' Resume', '') || 'Profile'}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                Pre-seeded resumes ready
              </div>
            )}
          </div>
        </div>

        {/* Extracted Profile Details Card */}
        {profile && (
          <div className="glass-card profile-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'white'
                  }}
                >
                  {profile.name ? profile.name.charAt(0) : 'C'}
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{profile.name || 'Candidate'}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {profile.email || 'candidate@email.com'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
                  {profile.profile_completion || 90}%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>Completeness</div>
              </div>
            </div>

            {/* Completeness Bar */}
            <div className="completeness-bar">
              <div className="completeness-fill" style={{ width: `${profile.profile_completion || 90}%` }} />
            </div>

            {/* Quick Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div className="profile-meta-row">
                <GraduationCap size={16} />
                <span>
                  {profile.education?.degree || "Bachelor's Degree"} in{' '}
                  {profile.education?.major || 'Computer Science'}
                  {profile.education?.graduation_year && ` (${profile.education.graduation_year})`}
                </span>
              </div>

              <div className="profile-meta-row">
                <Clock size={16} />
                <span>
                  Experience: {profile.experience?.years || 1.0} year(s)
                  {profile.experience?.is_fresh_grad ? ' (Fresh Graduate)' : ''}
                </span>
              </div>

              {profile.phone && (
                <div className="profile-meta-row">
                  <span style={{ color: 'var(--text-subtle)' }}>Phone:</span>
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>

            {/* Parsed Technical Skills */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Parsed Technical Skills ({profile.skills?.length || 0})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profile.skills?.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Projects & Certifications */}
            {profile.projects && profile.projects.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Extracted Projects ({profile.projects.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {profile.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {proj.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {proj.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Right Column: Job Alignments & Recommendations --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Feed Header */}
        <div className="dash-hero">
          <div>
            <div className="dash-hero-title">AI Job Recommendations</div>
            <p className="dash-hero-desc">
              Multi-factor NLP alignment engine computes exact role compatibility across skills,
              experience, education, and semantic relevance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">
              <Sparkles size={12} />
              {jobs.length} Matches Found
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Roles ({jobs.length})
          </button>
          <button
            className={`filter-pill ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            ★ High Alignment (85%+)
          </button>
          <button
            className={`filter-pill ${filter === 'suitable' ? 'active' : ''}`}
            onClick={() => setFilter('suitable')}
          >
            ✓ Suitable (70%+)
          </button>
          <button
            className={`filter-pill ${filter === 'applied' ? 'active' : ''}`}
            onClick={() => setFilter('applied')}
          >
            Applied ({appliedJobIds.length})
          </button>
        </div>

        {/* Job Cards Feed */}
        <div className="job-feed">
          {filteredJobs.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <AlertCircle size={36} color="var(--text-subtle)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No roles match this filter</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Try switching filters or uploading your resume to update match scores.
              </p>
            </div>
          ) : (
            filteredJobs.map((item) => {
              const { job, score, suitability, badge_info, match } = item;
              const hasApplied = appliedJobIds.includes(job.id);

              return (
                <div key={job.id} className="glass-card job-card">
                  {/* Card Header */}
                  <div className="job-card-header">
                    <div className="job-title-group">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="job-title">{job.title}</span>
                        <span className={`badge ${getBadgeStyle(badge_info?.level)}`}>
                          {badge_info?.badge || suitability}
                        </span>
                      </div>
                      <div className="job-company">{job.company}</div>

                      <div className="job-tags-row" style={{ marginTop: '8px' }}>
                        <span className="job-tag">
                          <MapPin size={12} />
                          {job.location}
                        </span>
                        <span className="job-tag">
                          <DollarSign size={12} />
                          {job.salary}
                        </span>
                        <span className="job-tag">
                          <Briefcase size={12} />
                          {job.type}
                        </span>
                        <span className="job-tag">
                          <Clock size={12} />
                          Min {job.min_experience_years} yr(s) exp
                        </span>
                      </div>
                    </div>

                    {/* Fit Score Badge */}
                    <div className="match-score-badge" style={{ borderColor: getScoreColor(score) }}>
                      <div className="match-score-num" style={{ color: getScoreColor(score) }}>
                        {score}%
                      </div>
                      <div className="match-score-sub" style={{ color: getScoreColor(score) }}>
                        Fit Score
                      </div>
                    </div>
                  </div>

                  {/* 5-Factor Mini Breakdown */}
                  {match?.breakdown && (
                    <div className="factor-breakdown-mini">
                      <div className="factor-item">
                        <div className="factor-label">
                          <span>Skills</span>
                          <span>{match.breakdown.skill_match}/50</span>
                        </div>
                        <div className="factor-progress-track">
                          <div
                            className="factor-progress-bar"
                            style={{ width: `${match.breakdown.skill_match_percent}%`, background: '#38bdf8' }}
                          />
                        </div>
                      </div>

                      <div className="factor-item">
                        <div className="factor-label">
                          <span>Experience</span>
                          <span>{match.breakdown.experience_match}/20</span>
                        </div>
                        <div className="factor-progress-track">
                          <div
                            className="factor-progress-bar"
                            style={{ width: `${match.breakdown.experience_match_percent}%`, background: '#818cf8' }}
                          />
                        </div>
                      </div>

                      <div className="factor-item">
                        <div className="factor-label">
                          <span>Education</span>
                          <span>{match.breakdown.education_match}/10</span>
                        </div>
                        <div className="factor-progress-track">
                          <div
                            className="factor-progress-bar"
                            style={{ width: `${match.breakdown.education_match_percent}%`, background: '#34d399' }}
                          />
                        </div>
                      </div>

                      <div className="factor-item">
                        <div className="factor-label">
                          <span>Projects</span>
                          <span>{match.breakdown.projects_match}/10</span>
                        </div>
                        <div className="factor-progress-track">
                          <div
                            className="factor-progress-bar"
                            style={{ width: `${match.breakdown.projects_match_percent}%`, background: '#fbbf24' }}
                          />
                        </div>
                      </div>

                      <div className="factor-item">
                        <div className="factor-label">
                          <span>Semantic</span>
                          <span>{match.breakdown.semantic_match}/10</span>
                        </div>
                        <div className="factor-progress-track">
                          <div
                            className="factor-progress-bar"
                            style={{ width: `${match.breakdown.semantic_match_percent}%`, background: '#c084fc' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Required Skills Highlights */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>Required:</span>
                    {job.required_skills?.map((skill, idx) => {
                      const isMatched = match?.matched_skills?.includes(skill);
                      return (
                        <span
                          key={idx}
                          className={`skill-tag ${isMatched ? 'skill-tag-matched' : 'skill-tag-missing'}`}
                        >
                          {isMatched ? '✓ ' : '+ '}
                          {skill}
                        </span>
                      );
                    })}
                  </div>

                  {/* Action Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenSkillGap(job.id)}
                    >
                      <Sparkles size={14} color="#818cf8" />
                      <span>Skill Gap Analysis & AI Advice</span>
                    </button>

                    <button
                      className={`btn btn-sm ${hasApplied ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={hasApplied}
                      onClick={() => onApplyJob(job.id)}
                    >
                      {hasApplied ? (
                        <>
                          <CheckCircle2 size={14} color="#34d399" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Quick Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- Skill Gap Modal --- */}
      {activeGapData && (
        <SkillGapModal
          gapData={activeGapData}
          onClose={onCloseSkillGap}
          onApply={onApplyJob}
          hasApplied={appliedJobIds.includes(activeGapData.job.id)}
        />
      )}

      {/* --- Paste Raw Text Modal --- */}
      {showPasteModal && (
        <div className="modal-overlay" onClick={() => setShowPasteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Paste Resume Plain Text</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Paste the contents of your CV / resume below for instant AI parsing and categorization.
              </p>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <textarea
                className="form-textarea"
                rows={12}
                placeholder="Paste resume content here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setShowPasteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePasteSubmit} disabled={!pastedText.trim()}>
                <Sparkles size={14} />
                <span>Extract & Update Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
