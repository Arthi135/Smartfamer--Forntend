import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function GovernmentSchemes() {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        api.get('/schemes/schemes').then(res => { setSchemes(res.data.schemes); setLoading(false); })
            .catch(() => { toast.error('Failed to load schemes'); setLoading(false); });
    }, []);

    const categoryIcons = { income_support: '💰', insurance: '🛡️', credit: '💳', technical_support: '🌱', marketing: '🏪', irrigation: '💧', seeds: '🌾', infrastructure: '📈' };
    const statusColors = { Active: 'badge-green', Inactive: 'badge-red' };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">🏛️ Government Schemes</h1>
                <p className="page-subtitle">Explore agricultural welfare schemes, subsidies, and loans available for farmers</p>
            </div>

            {/* Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(167,139,250,0.1))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '2rem' }}>💡</span>
                <div>
                    <p style={{ fontWeight: 700, color: '#93c5fd' }}>Did you know?</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>PM-KISAN alone has benefited over 11 crore farmers with ₹2.24 lakh crore direct transfers. Check if you're eligible!</p>
                </div>
            </div>

            {loading && <div className="loading-screen"><div className="spinner" /></div>}

            <div className="grid-auto">
                {schemes.map(scheme => (
                    <div key={scheme.id} className="card scheme-card" style={{ cursor: 'pointer' }} onClick={() => setSelected(selected === scheme.id ? null : scheme.id)}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                            <div className="scheme-icon-area">{scheme.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div className="scheme-tag">{categoryIcons[scheme.category]} {scheme.category.replace('_', ' ')}</div>
                                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4, lineHeight: 1.3 }}>{scheme.name}</h3>
                                <p className="telugu" style={{ fontSize: '0.82rem', color: 'var(--green-400)' }}>{scheme.nameTelugu}</p>
                            </div>
                        </div>

                        <div style={{ marginTop: 14 }}>
                            <span className={`badge ${statusColors[scheme.status]}`}>● {scheme.status}</span>
                            <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{scheme.benefit}</p>
                        </div>

                        {selected === scheme.id && (
                            <div style={{ marginTop: 16, borderTop: '1px solid var(--border-color)', paddingTop: 16, animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ marginBottom: 14 }}>
                                    <p style={{ fontWeight: 700, color: 'var(--green-400)', marginBottom: 8, fontSize: '0.85rem' }}>✅ Eligibility</p>
                                    {scheme.eligibility.map((e, i) => <p key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 4 }}>• {e}</p>)}
                                </div>
                                <div style={{ marginBottom: 14 }}>
                                    <p style={{ fontWeight: 700, color: 'var(--earth-400)', marginBottom: 8, fontSize: '0.85rem' }}>📋 Required Documents</p>
                                    {scheme.documents.map((d, i) => <p key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 4 }}>• {d}</p>)}
                                </div>
                                <a href={scheme.applyLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                                    🚀 Apply Now — {scheme.applyLink.replace('https://', '')}
                                </a>
                            </div>
                        )}

                        <div style={{ marginTop: 12, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {selected === scheme.id ? '▲ Click to collapse' : '▼ Click to see eligibility & apply'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
