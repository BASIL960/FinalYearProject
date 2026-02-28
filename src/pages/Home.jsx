import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pdfIcon from '../assets/pdf-128.ico';
import { matchCompliance } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Framework definitions — IDs match the API spec
const FRAMEWORKS = [
  { id: 1, label: 'ECC', name: 'Essential Cybersecurity Controls' },
  { id: 2, label: 'NCA', name: 'NCA Cybersecurity Framework' },
  { id: 3, label: 'SAMA', name: 'SAMA Cybersecurity Framework' },
];

/* ─── Score ring ────────────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#374151" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="70" y="75" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color}>{score}%</text>
      </svg>
      <p className="text-xs text-gray-400 uppercase tracking-widest">Compliance Score</p>
    </div>
  );
};

/* ─── Status badge ──────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const styles = {
    COMPLIANT: 'bg-green-500/20 text-green-400 border-green-500/40',
    PARTIAL: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    NON_COMPLIANT: 'bg-red-500/20 text-red-400 border-red-500/40',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.PARTIAL}`}>
      {status}
    </span>
  );
};

/* ─── List card ─────────────────────────────────────────────────── */
const ListCard = ({ title, items, icon, colorClass, isDarkMode }) => (
  <div className={`rounded-xl border p-5 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
    }`}>
    <h4 className={`flex items-center gap-2 text-sm font-semibold mb-3 ${colorClass}`}>
      <span>{icon}</span>{title}
    </h4>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className={`flex gap-2 text-sm leading-snug ${isDarkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>
          <span className={`mt-0.5 shrink-0 ${colorClass}`}>•</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

/* ─── Main component ────────────────────────────────────────────── */
const Home = ({ isDarkMode }) => {
  const [frameworkId, setFrameworkId] = useState(1);
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState('detailed');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
      setResult(null);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await matchCompliance(file, frameworkId, reportType === 'detailed');
      setResult(data);
    } catch (err) {
      setError(
        err?.detail || err?.message || err?.error ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRadioStyle = (type) => {
    const isSelected = reportType === type;
    if (isDarkMode) {
      return isSelected
        ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-500/20'
        : 'border-gray-600 bg-gray-800 hover:bg-gray-700';
    }
    return isSelected
      ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50'
      : 'border-gray-300 bg-white hover:bg-gray-50';
  };

  const selectedFw = FRAMEWORKS.find(f => f.id === frameworkId);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">

      {/* ── Hero ── */}
      <div className="text-center mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome to Lytrex
        </h1>
        <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Upload your policy document and audit it against a compliance framework instantly.
        </p>
      </div>

      {/* ── Form ── */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Framework tabs */}
          <div>
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Compliance Framework:
            </p>
            <div className={`flex rounded-full p-1.5 gap-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  type="button"
                  onClick={() => setFrameworkId(fw.id)}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${frameworkId === fw.id
                    ? 'bg-indigo-600 text-white shadow'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-600'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>
            <p className={`mt-2 text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedFw.name}
            </p>
          </div>

          {/* Upload box */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors cursor-pointer
              ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:border-indigo-500' : 'border-gray-300 bg-white hover:border-indigo-400'}`}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <div className="text-center pointer-events-none">
              <img src={pdfIcon} alt="PDF" className="mx-auto mb-4 h-12 w-12 opacity-80" />
              {file ? (
                <p className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ {file.name}
                </p>
              ) : (
                <>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Click or drag &amp; drop a PDF
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>PDF up to 10MB</p>
                </>
              )}
            </div>
            <input
              id="file-upload" type="file" accept="application/pdf"
              className="sr-only" onChange={handleFileChange}
            />
          </div>

          {/* Report type */}
          <div>
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Report Type:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'summary', label: 'Summary', desc: 'Brief overview & score' },
                { value: 'detailed', label: 'Detailed', desc: 'Full analysis & steps' },
              ].map(({ value, label, desc }) => (
                <label key={value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm transition-all ${getRadioStyle(value)}`}>
                  <input type="radio" name="report-type" value={value} className="sr-only"
                    checked={reportType === value} onChange={() => setReportType(value)} />
                  <span className="flex flex-col text-left">
                    <span className={`block text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</span>
                    <span className={`block text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center items-center gap-2 rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow hover:bg-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing…
              </>
            ) : (
              'Generate Report'
            )}
          </button>

    
        </form>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="mt-16 space-y-8 animate-[fadeIn_0.4s_ease]">
          <hr className={isDarkMode ? 'border-gray-700' : 'border-gray-200'} />

          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Audit Report
              </h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Framework: <span className="font-medium">{selectedFw.label} — {selectedFw.name}</span>
              </p>
              <div className="mt-2 flex items-center gap-3">
                <StatusBadge status={result.calculated_status} />
                <span className="text-xs text-gray-500">Record ID: {result.record_id?.slice(0, 8)}…</span>
              </div>
            </div>
            <ScoreRing score={result.audit_result?.compliance_score ?? 0} />
          </div>

          {result.is_detailed_response ? (
            /* ── Detailed mode ── */
            <>
              {/* Executive Summary */}
              {result.audit_result?.executive_summary && (
                <div className={`rounded-xl border p-5 ${isDarkMode ? 'border-gray-700 bg-gray-800/40' : 'border-gray-200 bg-white'}`}>
                  <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    📋 Executive Summary
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {result.audit_result.executive_summary}
                  </p>
                </div>
              )}

              {/* Three columns */}
              <div className="grid md:grid-cols-3 gap-4">
                {result.audit_result?.compliant_areas?.length > 0 && (
                  <ListCard title="Compliant Areas" items={result.audit_result.compliant_areas} icon="✅" colorClass="text-green-400" isDarkMode={isDarkMode} />
                )}
                {result.audit_result?.violations?.length > 0 && (
                  <ListCard title="Violations" items={result.audit_result.violations} icon="⚠️" colorClass="text-red-400" isDarkMode={isDarkMode} />
                )}
                {result.audit_result?.recommendations?.length > 0 && (
                  <ListCard title="Recommendations" items={result.audit_result.recommendations} icon="💡" colorClass="text-yellow-400" isDarkMode={isDarkMode} />
                )}
              </div>
            </>
          ) : (
            /* ── Summary mode ── */
            <div className="space-y-6">
              {/* Summary text */}
              {result.audit_result?.summary && (
                <div className={`rounded-xl border p-5 ${isDarkMode ? 'border-gray-700 bg-gray-800/40' : 'border-gray-200 bg-white'}`}>
                  <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    📋 Summary
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {result.audit_result.summary}
                  </p>
                </div>
              )}

              {/* Key Issues */}
              {result.audit_result?.key_issues?.length > 0 && (
                <ListCard
                  title="Key Issues"
                  items={result.audit_result.key_issues}
                  icon="⚠️"
                  colorClass="text-red-400"
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Home;