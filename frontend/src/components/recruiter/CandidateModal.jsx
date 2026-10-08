import React from 'react';
import {
  X,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  Star
} from 'lucide-react';

export default function CandidateModal({ candidateDetail, onClose, onShortlist, onReject }) {
  if (!candidateDetail) return null;

  const { candidate, job, match, status } = candidateDetail;

  const getScoreColor = (score) => {
    if (score >= 85) return '#34d399';
    if (score >= 70) return '#38bdf8';
    if (score >= 55) return '#fbbf24';
    return '#fb7185';
  };

  const getStatusBadge = (st) => {
    if (st === 'shortlisted') return { label: 'Shortlisted', cls: 'badge-emerald' };
    if (st === 'rejected') return { label: 'Rejected', cls: 'badge-rose' };
    return { label: 'Pending Review', cls: 'badge-amber' };
  };

  const currentStatus = getStatusBadge(status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'white'
                }}
              >
                {candidate.name ? candidate.name.charAt(0) : 'C'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{candidate.name}</h2>
                  <span className={`badge ${currentStatus.cls}`}>{currentStatus.label}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Evaluating for: <strong style={{ color: 'var(--text-main)' }}>{job.title}</strong>
                </div>
              </div>
            </div>

            {/* Score Ring */}
            <div className="match-score-badge" style={{ borderColor: getScoreColor(match.match_score) }}>
              <div className="match-score-num" style={{ color: getScoreColor(match.match_score) }}>
                {match.match_score}%
              </div>
              <div className="match-score-sub" style={{ color: getScoreColor(match.match_score) }}>
                {match.suitability}
              </div>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', fontSize: '13px' }}>
            {candidate.email && (
              <a href={`mailto:${candidate.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <Mail size={14} />
                <span>{candidate.email}</span>
              </a>
            )}
            {candidate.phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <Phone size={14} />
                <span>{candidate.phone}</span>
              </span>
            )}
            {candidate.linkedin && (
              <a href={candidate.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', textDecoration: 'none' }}>
                <Globe size={14} />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {candidate.github && (
              <a href={candidate.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', textDecoration: 'none' }}>
                <ExternalLink size={14} />
                <span>GitHub Profile</span>
              </a>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* AI Narrative */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}
          >
            <Sparkles size={20} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: '4px' }}>
                AI Recruiter Assessment
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {match.ai_explanation}
              </p>
            </div>
          </div>

          {/* 5-Factor Score Breakdown */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="var(--primary-light)" />
              5-Factor Job Alignment Score Breakdown
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Skill Match (50%)</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{match.breakdown.skill_match} / 50</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${match.breakdown.skill_match_percent}%`, background: '#38bdf8' }} />
                </div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Experience (20%)</span>
                  <span style={{ fontWeight: 700, color: '#818cf8' }}>{match.breakdown.experience_match} / 20</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${match.breakdown.experience_match_percent}%`, background: '#818cf8' }} />
                </div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Education (10%)</span>
                  <span style={{ fontWeight: 700, color: '#34d399' }}>{match.breakdown.education_match} / 10</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${match.breakdown.education_match_percent}%`, background: '#34d399' }} />
                </div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Projects & Certs (10%)</span>
                  <span style={{ fontWeight: 700, color: '#fbbf24' }}>{match.breakdown.projects_match} / 10</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${match.breakdown.projects_match_percent}%`, background: '#fbbf24' }} />
                </div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Semantic Match (10%)</span>
                  <span style={{ fontWeight: 700, color: '#c084fc' }}>{match.breakdown.semantic_match} / 10</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${match.breakdown.semantic_match_percent}%`, background: '#c084fc' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Matched & Missing Skills comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>
                <CheckCircle2 size={15} />
                <span>Matched Skills ({match.matched_skills?.length || 0})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {match.matched_skills?.length > 0 ? (
                  match.matched_skills.map((s, idx) => (
                    <span key={idx} className="skill-tag skill-tag-matched">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>None matched.</span>
                )}
              </div>
            </div>

            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.04)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>
                <XCircle size={15} />
                <span>Missing Requirements ({match.missing_skills?.length || 0})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {match.missing_skills?.length > 0 ? (
                  match.missing_skills.map((s, idx) => (
                    <span key={idx} className="skill-tag skill-tag-missing">
                      ✕ {s}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#34d399' }}>None - candidate satisfies all listed skills!</span>
                )}
              </div>
            </div>
          </div>

          {/* Experience & Education Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Education Background
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                {candidate.education?.degree} in {candidate.education?.major}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Graduation: {candidate.education?.graduation_year || 'N/A'} • GPA: {candidate.education?.gpa || 'N/A'}
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Experience Record
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                {candidate.experience?.years} Year(s) Practical Experience
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {candidate.experience?.label || (candidate.experience?.is_fresh_grad ? 'Fresh Graduate' : 'Professional')}
              </div>
            </div>
          </div>

          {/* Key Projects */}
          {candidate.projects && candidate.projects.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Candidate Projects
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {candidate.projects.map((proj, idx) => (
                  <div key={idx} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{proj.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{proj.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div style={{ padding: '18px 28px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Back to Candidates
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onReject(candidate.id, job.id)}
            >
              <XCircle size={15} />
              <span>Reject Candidate</span>
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => onShortlist(candidate.id, job.id)}
            >
              <Star size={15} />
              <span>Shortlist Candidate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
