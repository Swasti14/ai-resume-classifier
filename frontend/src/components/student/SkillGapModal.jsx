import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function SkillGapModal({ gapData, onClose, onApply, hasApplied }) {
  if (!gapData) return null;

  const { job, match_score, breakdown, matched_skills, missing_skills, ai_explanation, recommendations } = gapData;

  const getScoreColor = (score) => {
    if (score >= 85) return '#34d399';
    if (score >= 70) return '#38bdf8';
    if (score >= 55) return '#fbbf24';
    return '#fb7185';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '8px' }}>
                <Sparkles size={12} />
                <span>AI Skill Alignment Analysis</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{job.title}</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {job.company} • {job.location} • {job.salary}
              </p>
            </div>

            <div className="match-score-badge" style={{ borderColor: getScoreColor(match_score) }}>
              <div className="match-score-num" style={{ color: getScoreColor(match_score) }}>
                {match_score}%
              </div>
              <div className="match-score-sub" style={{ color: getScoreColor(match_score) }}>
                Fit Score
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* AI Explanation Box */}
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
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: '4px' }}>
                AI Match Narrative
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {ai_explanation}
              </p>
            </div>
          </div>

          {/* 5-Factor Score Breakdown */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="var(--primary-light)" />
              5-Factor Job Alignment Breakdown
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {/* Skills (50%) */}
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Skills Match (50%)</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{breakdown.skill_match} / 50 pts</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${breakdown.skill_match_percent}%`, background: '#38bdf8' }} />
                </div>
              </div>

              {/* Experience (20%) */}
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Experience (20%)</span>
                  <span style={{ fontWeight: 700, color: '#818cf8' }}>{breakdown.experience_match} / 20 pts</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${breakdown.experience_match_percent}%`, background: '#818cf8' }} />
                </div>
              </div>

              {/* Education (10%) */}
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Education (10%)</span>
                  <span style={{ fontWeight: 700, color: '#34d399' }}>{breakdown.education_match} / 10 pts</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${breakdown.education_match_percent}%`, background: '#34d399' }} />
                </div>
              </div>

              {/* Projects & Certs (10%) */}
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Projects & Certs (10%)</span>
                  <span style={{ fontWeight: 700, color: '#fbbf24' }}>{breakdown.projects_match} / 10 pts</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${breakdown.projects_match_percent}%`, background: '#fbbf24' }} />
                </div>
              </div>

              {/* Semantic (10%) */}
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Semantic Relevance (10%)</span>
                  <span style={{ fontWeight: 700, color: '#c084fc' }}>{breakdown.semantic_match} / 10 pts</span>
                </div>
                <div className="factor-progress-track">
                  <div className="factor-progress-bar" style={{ width: `${breakdown.semantic_match_percent}%`, background: '#c084fc' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Matched */}
            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>
                <CheckCircle2 size={16} />
                <span>Skills You Possess ({matched_skills?.length || 0})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {matched_skills?.length > 0 ? (
                  matched_skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag skill-tag-matched">
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>No direct skill matches detected.</span>
                )}
              </div>
            </div>

            {/* Missing */}
            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.04)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>
                <AlertTriangle size={16} />
                <span>Skill Gaps to Bridge ({missing_skills?.length || 0})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {missing_skills?.length > 0 ? (
                  missing_skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag skill-tag-missing">
                      + {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#34d399' }}>Zero skill gaps! You meet 100% of required skills.</span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Learning Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
                <Lightbulb size={16} />
                Actionable AI Upskilling Roadmap
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recommendations.map((rec, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13.5px', color: 'var(--text-main)' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '18px 28px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className={`btn ${hasApplied ? 'btn-secondary' : 'btn-primary'}`}
            disabled={hasApplied}
            onClick={() => onApply(job.id)}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Application Submitted</span>
              </>
            ) : (
              <>
                <span>Apply to this Role</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
