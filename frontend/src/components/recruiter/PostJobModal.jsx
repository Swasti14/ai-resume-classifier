import React, { useState } from 'react';
import {
  X,
  Sparkles
} from 'lucide-react';

export default function PostJobModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    company: 'Apex Talent Partners',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$85,000 - $115,000 / yr',
    type: 'Full-time',
    min_experience_years: 1.0,
    required_degree: "Bachelor's Degree",
    description: '',
    required_skills: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    // Process skills comma separated
    const reqSkills = formData.required_skills
      ? formData.required_skills.split(',').map((s) => s.trim()).filter(Boolean)
      : null;

    onSubmit({
      ...formData,
      min_experience_years: parseFloat(formData.min_experience_years) || 1.0,
      required_skills: reqSkills && reqSkills.length > 0 ? reqSkills : null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="badge badge-primary" style={{ marginBottom: '8px' }}>
            <Sparkles size={12} />
            <span>AI Powered Job Ingestion</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Create New Job Posting</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Paste the job description. Our NLP engine will automatically extract and categorize required skills.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title & Company */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. AI Research Engineer"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Quantum AI Labs"
                  className="form-input"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Location & Salary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Location / Work Mode</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. New York, NY (Remote)"
                  className="form-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label">Salary Range</label>
                <input
                  type="text"
                  name="salary"
                  placeholder="e.g. $95,000 - $125,000 / yr"
                  className="form-input"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Exp & Degree */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Min Experience (Yrs)</label>
                <input
                  type="number"
                  step="0.5"
                  name="min_experience_years"
                  className="form-input"
                  value={formData.min_experience_years}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label">Required Degree</label>
                <select
                  name="required_degree"
                  className="form-select"
                  value={formData.required_degree}
                  onChange={handleChange}
                >
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Ph.D">Ph.D</option>
                  <option value="Diploma">Diploma / Associate</option>
                </select>
              </div>

              <div>
                <label className="form-label">Employment Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Manual Skills (Optional) */}
            <div>
              <label className="form-label">
                Required Skills (Optional override, comma separated)
              </label>
              <input
                type="text"
                name="required_skills"
                placeholder="e.g. Python, PyTorch, Docker, PostgreSQL (leave blank for auto-extraction)"
                className="form-input"
                value={formData.required_skills}
                onChange={handleChange}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px', display: 'block' }}>
                Tip: If left blank, the NLP taxonomy parser will automatically extract canonical skills from the description.
              </span>
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Job Description *</label>
              <textarea
                name="description"
                required
                rows={7}
                placeholder="Paste the full job description detailing responsibilities, qualifications, and tool stack..."
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!formData.title || !formData.description}>
              <Sparkles size={14} />
              <span>Parse Requirements & Publish Role</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
