import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SoilHealth() {
    const { farmer } = useAuth();
    const [form, setForm] = useState({ soilType: farmer?.soilType || '', pH: '', nitrogen: '', phosphorus: '', potassium: '', organicMatter: '', moisture: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/soil/analyze', form);
            setResult(res.data);
            toast.success(`🌍 Soil analysis complete! Rating: ${res.data.healthRating.toUpperCase()}`);
        } catch (err) {
            toast.error('Soil analysis failed. Check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    const healthColor = result ? (result.healthRating === 'strong' ? '#22c55e' : result.healthRating === 'moderate' ? '#eab308' : '#ef4444') : '#64748b';
    const ratingBg = result ? (result.healthRating === 'strong' ? 'rgba(34,197,94,0.1)' : result.healthRating === 'moderate' ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)') : '';

    const chartData = result ? {
        datasets: [{
            data: [result.healthScore, 100 - result.healthScore],
            backgroundColor: [healthColor, 'rgba(255,255,255,0.06)'],
            borderColor: [healthColor, 'transparent'],
            borderWidth: 2,
            circumference: 360,
            cutout: '75%',
        }],
    } : null;

    const SOIL_TYPES = ['black', 'red', 'loamy', 'sandy', 'clay', 'alluvial', 'laterite'];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">🌍 Soil Health Analysis</h1>
                <p className="page-subtitle">Enter your soil parameters to get a complete health report with fertilizer recommendations</p>
            </div>

            <div className="grid-2">
                {/* Input */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🔬 Soil Parameters</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">🌍 Soil Type</label>
                            <select className="form-select" value={form.soilType} onChange={e => set('soilType', e.target.value)} required>
                                <option value="">Select soil type</option>
                                {SOIL_TYPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} Soil</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">⚗️ pH Value (0–14) <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Optimal: 6.0–7.5</span></label>
                            <input type="number" step="0.1" min="0" max="14" className="form-input" placeholder="e.g. 6.5" value={form.pH} onChange={e => set('pH', e.target.value)} required />
                        </div>
                        <div className="grid-2" style={{ gap: 12 }}>
                            <div className="form-group">
                                <label className="form-label">🌿 Nitrogen (kg/ha)</label>
                                <input type="number" className="form-input" placeholder="e.g. 180" value={form.nitrogen} onChange={e => set('nitrogen', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">🔵 Phosphorus</label>
                                <input type="number" className="form-input" placeholder="e.g. 30" value={form.phosphorus} onChange={e => set('phosphorus', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">🟡 Potassium</label>
                                <input type="number" className="form-input" placeholder="e.g. 200" value={form.potassium} onChange={e => set('potassium', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">🌱 Organic Matter (%)</label>
                                <input type="number" step="0.1" className="form-input" placeholder="e.g. 1.5" value={form.organicMatter} onChange={e => set('organicMatter', e.target.value)} />
                            </div>
                        </div>
                        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: '0.82rem', color: '#93c5fd' }}>
                            💡 <strong>Typical values:</strong> N: 200-400 | P: 25-50 | K: 150-300 kg/ha
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Analyzing...</> : '🔬 Analyze Soil Health'}
                        </button>
                    </form>
                </div>

                {/* Result */}
                <div>
                    {!result && (
                        <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌍</div>
                            <h3>Awaiting Soil Data</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>Enter N, P, K values and pH from your soil test report</p>
                        </div>
                    )}
                    {result && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Score Gauge */}
                            <div className="card" style={{ textAlign: 'center', background: ratingBg }}>
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📊 Soil Health Score</h3>
                                <div className="soil-meter">
                                    {chartData && <Doughnut data={chartData} options={{ plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { animateRotate: true, duration: 1500 } }} />}
                                    <div className="soil-meter-center">
                                        <div className="soil-score" style={{ color: healthColor }}>{result.healthScore}</div>
                                        <div className="soil-label">/ 100</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 16, display: 'inline-block', background: `${healthColor}22`, border: `2px solid ${healthColor}`, borderRadius: 30, padding: '8px 24px' }}>
                                    <span style={{ color: healthColor, fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase' }}>
                                        {result.healthRating === 'strong' ? '💪 Strong' : result.healthRating === 'moderate' ? '⚖️ Moderate' : '⚠️ Weak'} Soil
                                    </span>
                                </div>
                            </div>

                            {/* NPK visual */}
                            <div className="card">
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🧪 NPK Status</h3>
                                {[['🌿 Nitrogen', form.nitrogen, 400, '#22c55e'], ['🔵 Phosphorus', form.phosphorus, 50, '#38bdf8'], ['🟡 Potassium', form.potassium, 300, '#eab308']].map(([label, val, max, color]) => (
                                    <div key={label} style={{ marginBottom: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{val} kg/ha</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div style={{ width: `${Math.min((val / max) * 100, 100)}%`, height: '100%', background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 4, transition: 'width 1.5s ease' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Fertilizer Suggestions */}
                            {result.suggestedFertilizers?.length > 0 && (
                                <div className="card">
                                    <h3 style={{ fontWeight: 700, marginBottom: 14 }}>💊 Fertilizer Recommendations</h3>
                                    {result.suggestedFertilizers.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'rgba(234,179,8,0.06)', borderRadius: 10, border: '1px solid rgba(234,179,8,0.15)', marginBottom: 8 }}>
                                            <span>⚗️</span><span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Organic Methods */}
                            {result.organicMethods?.length > 0 && (
                                <div className="card">
                                    <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🌱 Organic Improvement Methods</h3>
                                    {result.organicMethods.map((m, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'rgba(34,197,94,0.06)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.15)', marginBottom: 8 }}>
                                            <span>🌿</span><span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{m}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Crop Rotation */}
                            {result.cropRotation?.length > 0 && (
                                <div className="card">
                                    <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🔄 Crop Rotation Plan</h3>
                                    {result.cropRotation.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'rgba(14,165,233,0.06)', borderRadius: 10, border: '1px solid rgba(14,165,233,0.15)', marginBottom: 8 }}>
                                            <span>🔄</span><span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{r}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
