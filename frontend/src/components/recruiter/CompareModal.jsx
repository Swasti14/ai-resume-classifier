import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  XCircle,
  Star
} from 'lucide-react';

export default function CompareModal({ comparisonData, onClose, onShortlist, onReject }) {
  if (!comparisonData || !comparisonData.comparison) return null;

  const { job, comparison } = comparisonData;

  const getScoreColor = (score) => {
    if (score >= 85) return '#34d399';
    if (score >= 70) return '#38bdf8';
    if (score >= 55) return '#fbbf24';
    return '#fb7185';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '1060px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="badge badge-primary" style={{ marginBottom: '8px' }}>
            <Award size={12} />
            <span>Side-by-Side Candidate Alignment Matrix</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Comparing Candidates for {job.title}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Comparing {comparison.length} applicants against requirements: {job.required_skills?.join(', ')}
          </p>
        </div>

        {/* Modal Body: Multi-column comparison grid */}
        <div style={{ padding: '24px 28px', overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${comparison.length}, minmax(280px, 1fr))`,
              gap: '20px'
            }}
          >
            {comparison.map((item, idx) => {
              const { candidate, match, status } = item;
              const score = match.match_score;

              return (
                <div
                  key={candidate.id || idx}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(15, 20, 32, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                  }}
                >
                  {/* Candidate Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '17px',
                          fontWeight: 800,
                          color: 'white'
                        }}
                      >
                        {candidate.name ? candidate.name.charAt(0) : 'C'}
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{candidate.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Status: <strong style={{ textTransform: 'capitalize' }}>{status}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="match-score-badge" style={{ borderColor: getScoreColor(score), minWidth: '75px', padding: '6px 10px' }}>
                      <div className="match-score-num" style={{ fontSize: '20px', color: getScoreColor(score) }}>
                        {score}%
                      </div>
                      <div className="match-score-sub" style={{ fontSize: '10px', color: getScoreColor(score) }}>
                        {match.suitability}
                      </div>
                    </div>
                  </div>

                  {/* 5-Factor Score Breakdown Bars */}
                  <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                      5-Factor Breakdown
                    </div>

                    {/* Skill */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                        <span>Skills (50 max)</span>
                        <span style={{ fontWeight: 700 }}>{match.breakdown?.skill_match}</span>
                      </div>
                      <div className="factor-progress-track">
                        <div className="factor-progress-bar" style={{ width: `${match.breakdown?.skill_match_percent}%`, background: '#38bdf8' }} />
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                        <span>Experience (20 max)</span>
                        <span style={{ fontWeight: 700 }}>{match.breakdown?.experience_match}</span>
                      </div>
                      <div className="factor-progress-track">
                        <div className="factor-progress-bar" style={{ width: `${match.breakdown?.experience_match_percent}%`, background: '#818cf8' }} />
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                        <span>Education (10 max)</span>
                        <span style={{ fontWeight: 700 }}>{match.breakdown?.education_match}</span>
                      </div>
                      <div className="factor-progress-track">
                        <div className="factor-progress-bar" style={{ width: `${match.breakdown?.education_match_percent}%`, background: '#34d399' }} />
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                        <span>Projects (10 max)</span>
                        <span style={{ fontWeight: 700 }}>{match.breakdown?.projects_match}</span>
                      </div>
                      <div className="factor-progress-track">
                        <div className="factor-progress-bar" style={{ width: `${match.breakdown?.projects_match_percent}%`, background: '#fbbf24' }} />
                      </div>
                    </div>

                    {/* Semantic */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                        <span>Semantic (10 max)</span>
                        <span style={{ fontWeight: 700 }}>{match.breakdown?.semantic_match}</span>
                      </div>
                      <div className="factor-progress-track">
                        <div className="factor-progress-bar" style={{ width: `${match.breakdown?.semantic_match_percent}%`, background: '#c084fc' }} />
                      </div>
                    </div>
                  </div>

                  {/* Skills Comparison */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CheckCircle2 size={13} />
                      <span>Matched Skills ({match.matched_skills?.length || 0})</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {match.matched_skills?.map((s, i) => (
                        <span key={i} className="skill-tag skill-tag-matched" style={{ fontSize: '11.5px', padding: '3px 8px' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <XCircle size={13} />
                      <span>Missing Skills ({match.missing_skills?.length || 0})</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {match.missing_skills?.length > 0 ? (
                        match.missing_skills.map((s, i) => (
                          <span key={i} className="skill-tag skill-tag-missing" style={{ fontSize: '11.5px', padding: '3px 8px' }}>
                            {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '12px', color: '#34d399' }}>None!</span>
                      )}
                    </div>
                  </div>

                  {/* Experience & Degree */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-muted)' }}>Experience:</strong> {candidate.experience?.years} yrs
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-muted)' }}>Degree:</strong> {candidate.education?.degree} ({candidate.education?.major})
                    </div>
                  </div>

                  {/* AI Verdict */}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, background: 'rgba(99, 102, 241, 0.06)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                    <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '4px' }}>AI Assessment</div>
                    {match.ai_explanation}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button
                      className="btn btn-success btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => onShortlist(candidate.id, job.id)}
                    >
                      <Star size={13} />
                      <span>Shortlist</span>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => onReject(candidate.id, job.id)}
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
