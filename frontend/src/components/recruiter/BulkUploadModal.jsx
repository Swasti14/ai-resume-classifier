import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileCheck,
  Sparkles,
  Layers
} from 'lucide-react';

export default function BulkUploadModal({ activeJob, onClose, onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles, activeJob?.id);
      onClose();
    }
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
            <Layers size={12} />
            <span>High-Throughput Batch Processing</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Bulk Resume Ingestion & Classification</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Target role:{' '}
            <strong style={{ color: 'var(--primary-light)' }}>
              {activeJob?.title || 'Selected Job'}
            </strong>
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Dropzone */}
          <div
            className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '36px 20px' }}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
            />
            <div className="dropzone-icon">
              <UploadCloud size={26} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                Drag & drop multiple resume files here
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-subtle)', marginTop: '4px' }}>
                Supports batch upload of PDF, DOCX, and TXT files
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '8px' }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select Multiple Files
            </button>
          </div>

          {/* Staged Files List */}
          {selectedFiles.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Staged Resumes ({selectedFiles.length})
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <FileCheck size={16} color="#34d399" />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>

                    <button
                      onClick={() => removeFile(idx)}
                      style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '2px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
          >
            <Sparkles size={14} />
            <span>Parse & Classify {selectedFiles.length} Resume(s)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
