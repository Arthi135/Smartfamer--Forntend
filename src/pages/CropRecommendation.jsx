import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SOIL_TYPES = ['black', 'red', 'loamy', 'sandy', 'clay', 'alluvial', 'laterite'];
const SEASONS = [['kharif', '☔ Kharif (June-Nov)'], ['rabi', '❄️ Rabi (Nov-March)'], ['summer', '☀️ Summer (March-June)']];
const WATER = [['abundant', '🌊 Abundant'], ['moderate', '💧 Moderate'], ['scarce', '🏜️ Scarce'], ['rainfed', '🌧️ Rainfed Only']];
const DEMAND = [['high', '📈 High Demand'], ['medium', '➡️ Medium'], ['low', '📉 Low']];

export default function CropRecommendation() {
    const { farmer } = useAuth();
    const [form, setForm] = useState({ soilType: farmer?.soilType || '', season: '', rainfallProbability: 50, waterAvailability: farmer?.waterAvailability || '', budgetRange: 15000, marketDemand: 'high' });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/crop/recommend', form);
            setResults(res.data.recommendations);
            toast.success(`✅ Found ${res.data.count} crop recommendations!`);
        } catch (err) {
            toast.error('Failed to get recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const riskColor = { low: 'badge-green', medium: 'badge-yellow', high: 'badge-red' };
    const demandColor = { high: 'badge-green', medium: 'badge-blue', low: 'badge-yellow' };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">🌱 AI Crop Recommendation</h1>
                <p className="page-subtitle">Get AI-powered crop suggestions based on your soil, season, and budget</p>
            </div>

            <div className="grid-2">
                {/* Input Form */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📋 Farm Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">🌍 Soil Type</label>
                            <select className="form-select" value={form.soilType} onChange={e => set('soilType', e.target.value)} required>
                                <option value="">Select soil type</option>
                                {SOIL_TYPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} Soil</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">📅 Season</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {SEASONS.map(([v, l]) => (
                                    <button type="button" key={v} onClick={() => set('season', v)}
                                        style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: `1px solid ${form.season === v ? 'var(--green-500)' : 'rgba(255,255,255,0.1)'}`, background: form.season === v ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.03)', color: form.season === v ? 'var(--green-400)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s' }}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">🌧️ Rainfall Probability: <span style={{ color: 'var(--green-400)', fontWeight: 700 }}>{form.rainfallProbability}%</span></label>
                            <input type="range" min="0" max="100" value={form.rainfallProbability} onChange={e => set('rainfallProbability', e.target.value)} style={{ width: '100%', accentColor: 'var(--green-500)' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">💧 Water Availability</label>
                            <select className="form-select" value={form.waterAvailability} onChange={e => set('waterAvailability', e.target.value)} required>
                                <option value="">Select water source</option>
                                {WATER.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">💰 Budget: <span style={{ color: 'var(--earth-400)', fontWeight: 700 }}>₹{parseInt(form.budgetRange).toLocaleString()}/acre</span></label>
                            <input type="range" min="2000" max="50000" step="1000" value={form.budgetRange} onChange={e => set('budgetRange', e.target.value)} style={{ width: '100%', accentColor: 'var(--earth-500)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                <span>₹2,000</span><span>₹50,000</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">📈 Market Demand Preference</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {DEMAND.map(([v, l]) => (
                                    <button type="button" key={v} onClick={() => set('marketDemand', v)}
                                        style={{ flex: 1, padding: '8px 6px', borderRadius: 10, border: `1px solid ${form.marketDemand === v ? 'var(--green-500)' : 'rgba(255,255,255,0.1)'}`, background: form.marketDemand === v ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.03)', color: form.marketDemand === v ? 'var(--green-400)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s' }}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Analyzing with AI...</> : '🤖 Get AI Recommendations'}
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div>
                    {!results && !loading && (
                        <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌾</div>
                            <h3 style={{ marginBottom: 8 }}>Ready for Recommendations</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fill in your farm details on the left and click "Get AI Recommendations"</p>
                        </div>
                    )}
                    {loading && (
                        <div className="card loading-screen">
                            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
                            <div className="spinner" />
                            <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>AI is analyzing your farm data...</p>
                        </div>
                    )}
                    {results && !loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <h3 style={{ fontWeight: 700 }}>🏆 Top Recommendations</h3>
                                <span className="badge badge-green">{results.length} crops found</span>
                            </div>
                            {results.map((crop, i) => (
                                <div key={i} className="crop-card" onClick={() => setSelected(selected === i ? null : i)}>
                                    <div className="crop-card-header">
                                        <span className="crop-emoji">{crop.emoji}</span>
                                        <div>
                                            <h3>{crop.name}</h3>
                                            <div className="telugu-name telugu">{crop.nameTelugu}</div>
                                            {i === 0 && <span className="badge badge-yellow" style={{ marginTop: 4 }}>🥇 Best Match</span>}
                                        </div>
                                        <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--green-400)' }}>{crop.matchScore}%</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Match</div>
                                        </div>
                                    </div>
                                    <div className="crop-card-body">
                                        <div style={{ marginBottom: 10 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>AI Match Score</span>
                                                <span style={{ fontSize: '0.78rem', color: 'var(--green-400)', fontWeight: 700 }}>{crop.matchScore}%</span>
                                            </div>
                                            <div className="progress-bar"><div className="progress-fill progress-green" style={{ width: `${crop.matchScore}%` }} /></div>
                                        </div>
                                        <div className="crop-stats">
                                            <div className="crop-stat"><div className="cs-label">Duration</div><div className="cs-value">{crop.duration}</div></div>
                                            <div className="crop-stat"><div className="cs-label">Yield/Acre</div><div className="cs-value">{crop.yieldPerAcre}</div></div>
                                            <div className="crop-stat"><div className="cs-label">Avg Price</div><div className="cs-value" style={{ color: 'var(--earth-400)' }}>{crop.avgPrice}</div></div>
                                            <div className="crop-stat"><div className="cs-label">Profit/Acre</div><div className="cs-value" style={{ color: 'var(--green-400)' }}>{crop.estimatedProfit}</div></div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                                            <span className={`badge ${riskColor[crop.riskLevel]}`}>⚠️ {crop.riskLevel} risk</span>
                                            <span className={`badge ${demandColor[crop.marketDemand]}`}>📈 {crop.marketDemand} demand</span>
                                            <span className="badge badge-blue">💧 {crop.waterRequirement} water</span>
                                        </div>
                                        {selected === i && (
                                            <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(34,197,94,0.06)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.15)' }}>
                                                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{crop.description}</p>
                                                <div style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--green-400)', fontWeight: 600 }}>Budget: {crop.requiredBudget}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
