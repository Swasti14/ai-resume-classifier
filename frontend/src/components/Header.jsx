import React from 'react';
import {
  Sparkles,
  UserCheck,
  Briefcase,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Header({
  activeRole,
  onRoleChange,
  onResetDemo,
  serverStatus,
  userProfile
}) {
  return (
    <header className="navbar">
      {/* Brand */}
      <div className="nav-brand" onClick={() => onRoleChange('student')}>
        <div className="brand-icon">
          <Sparkles size={22} />
        </div>
        <div>
          <div className="brand-title">TalentAlign AI</div>
          <div className="brand-subtitle">NLP Resume Classifier & Alignment Engine</div>
        </div>
      </div>

      {/* Role Switcher Pill */}
      <div className="role-switcher">
        <button
          className={`role-tab ${activeRole === 'student' ? 'active' : ''}`}
          onClick={() => onRoleChange('student')}
        >
          <UserCheck size={16} />
          <span>Candidate / Student</span>
        </button>
        <button
          className={`role-tab ${activeRole === 'recruiter' ? 'active' : ''}`}
          onClick={() => onRoleChange('recruiter')}
        >
          <Briefcase size={16} />
          <span>Recruiter / HR Portal</span>
        </button>
      </div>

      {/* Right Actions & Profile */}
      <div className="nav-actions">
        {/* Reset Demo */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onResetDemo}
          title="Reset sample candidate pool and applications"
        >
          <RotateCcw size={14} />
          <span>Reset Demo</span>
        </button>

        {/* Server Status indicator */}
        <div
          className="badge"
          style={{
            background: serverStatus === 'online' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: serverStatus === 'online' ? '#34d399' : '#fbbf24',
            border: `1px solid ${serverStatus === 'online' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}
          title={serverStatus === 'online' ? 'FastAPI Backend Connected (Port 8000)' : 'Connecting to Backend...'}
        >
          {serverStatus === 'online' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          <span>{serverStatus === 'online' ? 'NLP Engine Live' : 'Connecting...'}</span>
        </div>

        {/* User Profile Badge */}
        <div className="user-badge">
          <div className="user-avatar">
            {activeRole === 'student'
              ? (userProfile?.name ? userProfile.name.charAt(0) : 'R')
              : 'S'}
          </div>
          <div className="user-info">
            <div className="user-name">
              {activeRole === 'student'
                ? (userProfile?.name || 'Rahul Sharma')
                : 'Sarah Jenkins'}
            </div>
            <div className="user-role-label">
              {activeRole === 'student' ? 'Applicant View' : 'Lead Recruiter'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
