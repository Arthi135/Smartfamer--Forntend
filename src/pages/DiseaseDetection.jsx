import { useState, useRef } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CROPS = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Groundnut', 'Sunflower', 'Tomato', 'Onion', 'Chilli', 'Sugarcane', 'Soybean'];

export default function DiseaseDetection() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [cropType, setCropType] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [drag, setDrag] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const handleFile = file => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (JPG, PNG, WEBP)');
            return;
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        setError('');
    };

    const handleSubmit = async () => {
        if (!image) return toast.error('Please upload a crop leaf image first.');
        setLoading(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('image', image);
            fd.append('cropType', cropType || 'Unknown');

            const res = await api.post('/disease/detect', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000
            });

            setResult(res.data);
            toast.success(`🔬 Detected: ${res.data.diseaseName} (${res.data.confidence}% confidence)`);
        } catch (err) {
            console.error('Disease detection error:', err);
            const msg = err.response?.data?.message || err.message || 'Detection failed. Please try again.';
            setError(msg);
            toast.error('Detection failed: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    const resetAll = () => {
        setImage(null);
        setPreview(null);
        setResult(null);
        setError('');
        setCropType('');
    };

    const sevColor = result ? (result.severity === 'severe' ? '#ef4444' : result.severity === 'moderate' ? '#f59e0b' : '#22c55e') : '#22c55e';
    const sevBg = result ? (result.severity === 'severe' ? 'rgba(239,68,68,0.08)' : result.severity === 'moderate' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)') : '';

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">🔬 AI Crop Disease Detection</h1>
                <p className="page-subtitle">Upload a photo of your crop leaf — AI will diagnose the disease and suggest treatment</p>
            </div>

            <div className="grid-2">
                {/* Upload Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Image Upload Zone */}
                    <div
                        className={`upload-zone ${drag ? 'dragover' : ''}`}
                        onClick={() => !loading && fileRef.current.click()}
                        onDragOver={e => { e.preventDefault(); setDrag(true); }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                        style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => handleFile(e.target.files[0])}
                        />
                        {preview ? (
                            <div style={{ width: '100%' }}>
                                <img src={preview} alt="Uploaded crop leaf" style={{ maxHeight: 220, width: '100%', objectFit: 'contain', borderRadius: 12, marginBottom: 12 }} />
                                <p style={{ color: 'var(--green-400)', fontWeight: 600, fontSize: '0.9rem' }}>✅ Photo ready! Click to change</p>
                            </div>
                        ) : (
                            <>
                                <div className="upload-icon">📷</div>
                                <h3 style={{ marginBottom: 8 }}>Drop crop leaf photo here</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>or click to browse files</p>
                                <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Supports: JPG, PNG, WEBP • Max 10MB</p>
                            </>
                        )}
                    </div>

                    {/* Crop Type */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">🌾 Crop Type (helps AI accuracy)</label>
                        <select className="form-select" value={cropType} onChange={e => setCropType(e.target.value)}>
                            <option value="">Unknown / Auto-detect</option>
                            {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: '12px 16px', color: '#fca5a5', fontSize: '0.9rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmit}
                            disabled={loading || !image}
                            style={{ flex: 1 }}
                        >
                            {loading ? (
                                <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Analyzing with AI...</>
                            ) : (
                                '🤖 Detect Disease'
                            )}
                        </button>
                        {(image || result) && (
                            <button className="btn btn-secondary" onClick={resetAll} title="Reset" style={{ padding: '12px 16px' }}>
                                🔄
                            </button>
                        )}
                    </div>

                    {/* Tips */}
                    <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '14px 16px' }}>
                        <p style={{ fontWeight: 700, color: 'var(--green-400)', marginBottom: 8, fontSize: '0.9rem' }}>📸 Tips for Best Results</p>
                        {[
                            'Take close-up of the affected leaf area',
                            'Use good natural lighting (avoid flash)',
                            'Focus on discolored or spotted areas',
                            'Include both healthy and diseased parts'
                        ].map((t, i) => (
                            <p key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>✓ {t}</p>
                        ))}
                    </div>

                    {/* Disease list cards */}
                    <div className="card">
                        <p style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem' }}>🦠 AI Detects These Diseases</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {['Leaf Blight', 'Powdery Mildew', 'Root Rot', 'Leaf Rust', 'Bacterial Spot', 'Stem Borer', 'Nutrient Deficiency'].map(d => (
                                <span key={d} style={{ padding: '4px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, fontSize: '0.75rem', color: 'var(--green-400)' }}>{d}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result Panel */}
                <div>
                    {!result && !loading && (
                        <div className="card" style={{ textAlign: 'center', padding: '60px 32px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: '5rem', marginBottom: 16 }}>🌿</div>
                            <h3 style={{ marginBottom: 8 }}>Awaiting Your Photo</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 260 }}>Upload a crop leaf image and click "Detect Disease" to get instant AI diagnosis</p>
                        </div>
                    )}

                    {loading && (
                        <div className="card loading-screen" style={{ height: 400 }}>
                            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔬</div>
                            <div className="spinner" style={{ width: 48, height: 48 }} />
                            <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontWeight: 600 }}>AI analyzing your crop image...</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 6 }}>Scanning for diseases, pests, and deficiencies</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Disease Header Card */}
                            <div className="card" style={{ background: sevBg, border: `1px solid ${sevColor}40` }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                                    <div style={{ width: 60, height: 60, background: `${sevColor}20`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0, border: `2px solid ${sevColor}40` }}>🦠</div>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: sevColor }}>{result.diseaseName}</h2>
                                        <p className="telugu" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 2 }}>{result.diseaseNameTelugu}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>Crop: <strong style={{ color: 'var(--text-primary)' }}>{result.cropType}</strong></p>
                                    </div>
                                </div>

                                {/* Severity Bar */}
                                <div style={{ marginBottom: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Severity Index</span>
                                        <span style={{ fontWeight: 700, color: sevColor }}>{result.severityScore}/100 — {result.severity?.toUpperCase()}</span>
                                    </div>
                                    <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' }}>
                                        <div style={{ width: `${result.severityScore}%`, height: '100%', background: `linear-gradient(90deg, ${sevColor}80, ${sevColor})`, borderRadius: 5, transition: 'width 1.5s ease' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <span className={`badge ${result.severity === 'severe' ? 'badge-red' : result.severity === 'moderate' ? 'badge-yellow' : 'badge-green'}`}>
                                        {result.severity === 'severe' ? '🚨' : result.severity === 'moderate' ? '⚡' : '✅'} {result.severity}
                                    </span>
                                    <span className="badge badge-blue">🎯 {result.confidence}% confidence</span>
                                    <span className="badge badge-orange">⏱️ Recovery: {result.estimatedRecoveryTime?.split(' ').slice(0, 3).join(' ')}</span>
                                </div>
                            </div>

                            {/* Cause */}
                            <div className="card">
                                <h4 style={{ fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>🔍 Disease Cause</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.cause}</p>
                                <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.2)' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#93c5fd' }}>⏱️ <strong>Estimated Recovery:</strong> {result.estimatedRecoveryTime}</p>
                                </div>
                            </div>

                            {/* Pesticides */}
                            <div className="card">
                                <h4 style={{ fontWeight: 700, marginBottom: 12, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>💊 Recommended Pesticides / Fungicides</h4>
                                {result.recommendedPesticides?.map((p, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(239,68,68,0.15)' }}>
                                        <span>🧪</span><span style={{ fontSize: '0.87rem', color: 'var(--text-secondary)' }}>{p}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Fertilizers */}
                            <div className="card">
                                <h4 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--earth-400)', display: 'flex', alignItems: 'center', gap: 8 }}>🌿 Fertilizer Recommendations</h4>
                                {result.recommendedFertilizers?.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', background: 'rgba(234,179,8,0.06)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(234,179,8,0.15)' }}>
                                        <span>⚗️</span><span style={{ fontSize: '0.87rem', color: 'var(--text-secondary)' }}>{f}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Organic Treatments */}
                            <div className="card">
                                <h4 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--green-400)', display: 'flex', alignItems: 'center', gap: 8 }}>🌱 Organic Treatments</h4>
                                {result.organicTreatments?.map((t, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(34,197,94,0.15)' }}>
                                        <span>🌿</span><span style={{ fontSize: '0.87rem', color: 'var(--text-secondary)' }}>{t}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Prevention */}
                            <div className="card">
                                <h4 style={{ fontWeight: 700, marginBottom: 12, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8 }}>🛡️ Prevention Methods</h4>
                                {result.preventionMethods?.map((m, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', background: 'rgba(14,165,233,0.06)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(14,165,233,0.15)' }}>
                                        <span>✅</span><span style={{ fontSize: '0.87rem', color: 'var(--text-secondary)' }}>{m}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Analyze again button */}
                            <button className="btn btn-secondary" onClick={resetAll} style={{ width: '100%' }}>
                                🔄 Analyze Another Photo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
