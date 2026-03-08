import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const urgencyStyles = {
    critical: { border: 'rgba(239,68,68,0.5)', bg: 'rgba(239,68,68,0.08)', color: '#f87171', icon: '🚨' },
    moderate: { border: 'rgba(245,158,11,0.5)', bg: 'rgba(245,158,11,0.08)', color: '#fcd34d', icon: '⚡' },
    low: { border: 'rgba(34,197,94,0.4)', bg: 'rgba(34,197,94,0.06)', color: '#86efac', icon: '✅' },
    normal: { border: 'rgba(34,197,94,0.4)', bg: 'rgba(34,197,94,0.06)', color: '#86efac', icon: '✅' }
};

export default function Irrigation() {
    const [form, setForm] = useState({ soilMoisture: 50, rainfallProbability: 30, temperature: 28, cropType: '', soilType: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/irrigation/suggest', form);
            setResult(res.data);
            toast.success(`💧 Suggestion: ${res.data.suggestion.action}`);
        } catch (err) {
            toast.error('Failed to get irrigation advice.');
        } finally { setLoading(false); }
    };

    const style = result ? (urgencyStyles[result.suggestion?.urgency] || urgencyStyles.normal) : null;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">💧 Smart Irrigation</h1>
                <p className="page-subtitle">Get AI-based irrigation timing and water quantity recommendations</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📡 Current Conditions</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">💧 Soil Moisture: <span style={{ color: 'var(--sky-400)', fontWeight: 700 }}>{form.soilMoisture}%</span></label>
                            <input type="range" min="0" max="100" value={form.soilMoisture} onChange={e => set('soilMoisture', e.target.value)} style={{ width: '100%', accentColor: 'var(--sky-500)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                <span>0% (Dry)</span><span style={{ color: form.soilMoisture < 30 ? '#f87171' : form.soilMoisture < 50 ? '#fcd34d' : '#86efac' }}>
                                    {form.soilMoisture < 30 ? '🚨 Critical' : form.soilMoisture < 50 ? '⚡ Low' : '✅ Adequate'}
                                </span><span>100% (Saturated)</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">🌧️ Rainfall Probability: <span style={{ color: '#38bdf8', fontWeight: 700 }}>{form.rainfallProbability}%</span></label>
                            <input type="range" min="0" max="100" value={form.rainfallProbability} onChange={e => set('rainfallProbability', e.target.value)} style={{ width: '100%', accentColor: '#0ea5e9' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">🌡️ Temperature: <span style={{ color: '#fb923c', fontWeight: 700 }}>{form.temperature}°C</span></label>
                            <input type="range" min="15" max="45" value={form.temperature} onChange={e => set('temperature', e.target.value)} style={{ width: '100%', accentColor: '#f97316' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                <span>15°C</span><span>45°C</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">🌾 Crop Type (Optional)</label>
                            <select className="form-select" value={form.cropType} onChange={e => set('cropType', e.target.value)}>
                                <option value="">Select crop</option>
                                {['Rice', 'Wheat', 'Cotton', 'Maize', 'Groundnut', 'Tomato', 'Onion', 'Chilli'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Moisture indicator visual */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', gap: 4, height: 24 }}>
                                {Array.from({ length: 10 }, (_, i) => (
                                    <div key={i} style={{
                                        flex: 1, borderRadius: 4,
                                        background: (i + 1) * 10 <= form.soilMoisture ? 'linear-gradient(135deg, #0ea5e9, #38bdf8)' : 'rgba(255,255,255,0.08)',
                                        transition: 'background 0.3s'
                                    }} />
                                ))}
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>Soil Moisture Level Indicator</p>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Analyzing...</> : '💧 Get Irrigation Advice'}
                        </button>
                    </form>
                </div>

                <div>
                    {!result && (
                        <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 16 }}>💧</div>
                            <h3>Awaiting Conditions</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Set your soil moisture and weather conditions to get irrigation advice</p>
                        </div>
                    )}
                    {result && style && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Main suggestion */}
                            <div style={{ background: style.bg, border: `2px solid ${style.border}`, borderRadius: 20, padding: '24px' }}>
                                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                    <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>{style.icon}</div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: style.color }}>{result.suggestion.action}</h2>
                                    <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.9rem' }}>{result.suggestion.reason}</p>
                                </div>
                                <div className="grid-2" style={{ gap: 12 }}>
                                    {[['⏰ Timing', result.suggestion.timing], ['💧 Amount', result.suggestion.amount], ['🌡️ Temperature', `${result.temperature}°C`], ['🌧️ Rainfall %', `${result.rainfallProbability}%`]].map(([l, v]) => (
                                        <div key={l} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{l}</div>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{v}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="card">
                                <h3 style={{ fontWeight: 700, marginBottom: 14 }}>💡 Irrigation Tips</h3>
                                {result.suggestion.tips?.map((tip, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'rgba(14,165,233,0.07)', borderRadius: 10, marginBottom: 8, border: '1px solid rgba(14,165,233,0.2)' }}>
                                        <span>💧</span><span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{tip}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Next check */}
                            <div className="card">
                                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>📅 Next Check</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monitor soil moisture again on <strong style={{ color: 'var(--green-400)' }}>{result.nextCheckDate}</strong></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
