import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComplianceRecords, getComplianceRecord } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── Helpers ───────────────────────────────────────────────────── */
const STATUS_STYLES = {
      COMPLIANT: 'bg-green-500/20 text-green-400 border-green-500/30',
      PARTIAL: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      NON_COMPLIANT: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const StatusBadge = ({ status }) => (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] || STATUS_STYLES.PARTIAL}`}>
            {status}
      </span>
);

const ScoreBar = ({ score, isDarkMode }) => {
      const color = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';
      return (
            <div className="flex items-center gap-3 w-full">
                  <div className={`flex-1 h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                              className={`h-2 rounded-full transition-all duration-700 ${color}`}
                              style={{ width: `${score}%` }}
                        />
                  </div>
                  <span className={`text-sm font-semibold w-10 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {score}%
                  </span>
            </div>
      );
};

const formatDate = (iso) =>
      new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/* ─── Detail panel ──────────────────────────────────────────────── */
const DetailPanel = ({ record, isDarkMode, onClose }) => {
      // Single-record API returns { status, data: { report_data, ... } }
      const ar = record.report_data || record.audit_result || {};
      // Infer mode: detailed records have compliant_areas; summary records have key_issues
      const isDetailed = !!(ar.compliant_areas?.length || ar.executive_summary);

      const cardBase = `rounded-xl border p-5 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`;
      const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
      const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
      const textBody = isDarkMode ? 'text-gray-300' : 'text-gray-800';

      const ListSection = ({ title, icon, items, color }) =>
            items?.length > 0 ? (
                  <div className={cardBase}>
                        <h4 className={`flex items-center gap-2 text-sm font-semibold mb-3 ${color}`}>
                              <span>{icon}</span>{title}
                        </h4>
                        <ul className="space-y-2">
                              {items.map((item, i) => (
                                    <li key={i} className={`flex gap-2 text-sm leading-snug ${textBody}`}>
                                          <span className={`mt-0.5 shrink-0 ${color}`}>•</span>{item}
                                    </li>
                              ))}
                        </ul>
                  </div>
            ) : null;

      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border
        ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>

                        {/* Header */}
                        <div className={`sticky top-0 z-10 flex items-start justify-between gap-4 p-6 border-b
          ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                              <div>
                                    <p className={`text-xs font-mono mb-1 ${textMuted}`}>{record.framework_title}</p>
                                    <h3 className={`text-xl font-bold ${textPrimary}`}>Audit Detail</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                          <StatusBadge status={record.calculated_status || record.status} />
                                          <span className={`text-xs ${textMuted}`}>{formatDate(record.assessment_date)}</span>
                                    </div>
                              </div>
                              <button
                                    onClick={onClose}
                                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                              >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                              </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                              {/* Score */}
                              <div className={cardBase}>
                                    <p className={`text-xs font-semibold mb-2 ${textMuted}`}>COMPLIANCE SCORE</p>
                                    <ScoreBar score={ar.compliance_score ?? record.score ?? 0} isDarkMode={isDarkMode} />
                              </div>

                              {/* Summary / Executive Summary */}
                              {(ar.executive_summary || ar.summary) && (
                                    <div className={cardBase}>
                                          <h4 className={`text-sm font-semibold mb-2 ${textPrimary}`}>📋 {isDetailed ? 'Executive Summary' : 'Summary'}</h4>
                                          <p className={`text-sm leading-relaxed ${textBody}`}>{ar.executive_summary || ar.summary}</p>
                                    </div>
                              )}

                              {/* Key Issues (summary mode) */}
                              <ListSection title="Key Issues" icon="⚠️" items={ar.key_issues} color="text-red-400" />

                              {/* Detailed sections */}
                              {isDetailed && (
                                    <div className="grid md:grid-cols-3 gap-4">
                                          <ListSection title="Compliant Areas" icon="✅" items={ar.compliant_areas} color="text-green-400" />
                                          <ListSection title="Violations" icon="⚠️" items={ar.violations} color="text-red-400" />
                                          <ListSection title="Recommendations" icon="💡" items={ar.recommendations} color="text-yellow-400" />
                                    </div>
                              )}
                        </div>
                  </div>
            </div>
      );
};

/* ─── Main page ─────────────────────────────────────────────────── */
const Records = ({ isDarkMode }) => {
      const { user } = useAuth();
      const navigate = useNavigate();

      const [records, setRecords] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState('');
      const [selected, setSelected] = useState(null);   // full detail object
      const [loadingId, setLoadingId] = useState(null);   // id being fetched

      const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
      const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

      useEffect(() => {
            if (!user) { navigate('/login'); return; }

            (async () => {
                  try {
                        const data = await getComplianceRecords();
                        setRecords(data.records || []);
                  } catch (err) {
                        setError(err?.detail || err?.message || 'Failed to load records.');
                  } finally {
                        setIsLoading(false);
                  }
            })();
      }, [user, navigate]);

      const openRecord = async (id) => {
            setLoadingId(id);
            try {
                  const data = await getComplianceRecord(id);
                  // API returns: { status: 'success', data: { id, report_data, ... } }
                  setSelected(data.data || data.record || data);
            } catch (err) {
                  setError(err?.detail || err?.message || 'Failed to load record detail.');
            } finally {
                  setLoadingId(null);
            }
      };

      return (
            <section className="max-w-5xl mx-auto px-6 py-16">
                  <div className="mb-10">
                        <h1 className={`text-3xl font-bold ${textPrimary}`}>Audit Records</h1>
                        <p className={`mt-1 text-sm ${textMuted}`}>Your past compliance assessments.</p>
                  </div>

                  {isLoading && (
                        <div className="flex justify-center items-center py-20">
                              <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                        </div>
                  )}

                  {error && (
                        <div className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">{error}</div>
                  )}

                  {!isLoading && !error && records.length === 0 && (
                        <div className={`flex flex-col items-center justify-center py-20 gap-3 ${textMuted}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p className="text-sm">No audit records yet.</p>
                              <button onClick={() => navigate('/')}
                                    className="mt-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">
                                    Run your first audit
                              </button>
                        </div>
                  )}

                  {!isLoading && records.length > 0 && (
                        <div className="space-y-3">
                              {records.map((rec) => (
                                    <div
                                          key={rec.id}
                                          onClick={() => openRecord(rec.id)}
                                          className={`group flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border p-5 cursor-pointer transition-all
                ${isDarkMode
                                                      ? 'border-gray-700 bg-gray-800/50 hover:border-indigo-500 hover:bg-gray-800'
                                                      : 'border-gray-200 bg-white hover:border-indigo-400 hover:shadow-md'}`}
                                    >
                                          {/* Left: framework + date */}
                                          <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-mono truncate mb-1 ${textMuted}`}>{rec.framework_title}</p>
                                                <p className={`text-xs ${textMuted}`}>{formatDate(rec.assessment_date)}</p>
                                          </div>

                                          {/* Middle: score bar */}
                                          <div className="flex-[2] min-w-0">
                                                <ScoreBar score={rec.score} isDarkMode={isDarkMode} />
                                          </div>

                                          {/* Right: badge + arrow */}
                                          <div className="flex items-center gap-3 shrink-0">
                                                <StatusBadge status={rec.status} />
                                                {loadingId === rec.id ? (
                                                      <svg className="animate-spin h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                      </svg>
                                                ) : (
                                                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                      </svg>
                                                )}
                                          </div>
                                    </div>
                              ))}
                        </div>
                  )}

                  {/* Detail modal */}
                  {selected && (
                        <DetailPanel
                              record={selected}
                              isDarkMode={isDarkMode}
                              onClose={() => setSelected(null)}
                        />
                  )}
            </section>
      );
};

export default Records;
