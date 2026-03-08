import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../utils/api';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CROPS = ['rice', 'wheat', 'cotton', 'maize', 'groundnut', 'sunflower', 'tomato', 'onion', 'chilli', 'sugarcane', 'soybean'];
const WATER = [['abundant', '🌊 Abundant'], ['moderate', '💧 Moderate'], ['scarce', '🏜️ Scarce'], ['rainfed', '🌧️ Rainfed']];
const FERTILITY = [['high', '🌱 High'], ['medium', '⚖️ Medium'], ['low', '📉 Low']];

export default function YieldPrediction() {
    const [form, setForm] = useState({ cropName: '', landSize: '', waterAvailability: '', soilFertility: 'medium', rainfall: 50, usesFertilizer: true });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/yield/predict', form);
            setResult(res.data);
            toast.success(`📈 Yield prediction: ${res.data.totalYield} quintals`);
        } catch (err) {
            toast.error('Prediction failed. Please try again.');
        } finally { setLoading(false); }
    };

    const chartData = result ? {
        labels: result.monthlyData.map(d => d.month),
        datasets: [{
            label: 'Estimated Yield (Quintals)',
            data: result.monthlyData.map(d => d.estimatedYield),
            fill: true,
            backgroundColor: 'rgba(34,197,94,0.1)',
            borderColor: '#22c55e',
            pointBackgroundColor: '#22c55e',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            tension: 0.4
        }]
    } : null;

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } }, tooltip: { callbacks: { label: ctx => `${ctx.raw} quintals` } } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => `${v} q` } }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">📈 Yield Prediction</h1>
                <p className="page-subtitle">AI-powered harvest output estimation with monthly growth chart</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🌾 Crop Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">🌾 Crop Name</label>
                            <select className="form-select" value={form.cropName} onChange={e => set('cropName', e.target.value)} required>
                                <option value="">Select crop</option>
                                {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">📐 Land Size (Acres)</label>
                            <input type="number" step="0.1" min="0.1" className="form-input" value={form.landSize} onChange={e => set('landSize', e.target.value)} placeholder="e.g. 2" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">💧 Water Availability</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {WATER.map(([v, l]) => (
                                    <button type="button" key={v} onClick={() => set('waterAvailability', v)}
                                        style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${form.waterAvailability === v ? 'var(--green-500)' : 'rgba(255,255,255,0.1)'}`, background: form.waterAvailability === v ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.03)', color: form.waterAvailability === v ? 'var(--green-400)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">🌍 Soil Fertility</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {FERTILITY.map(([v, l]) => (
                                    <button type="button" key={v} onClick={() => set('soilFertility', v)}
                                        style={{ flex: 1, padding: '8px', borderRadius: 10, border: `1px solid ${form.soilFertility === v ? 'var(--earth-500)' : 'rgba(255,255,255,0.1)'}`, background: form.soilFertility === v ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)', color: form.soilFertility === v ? 'var(--earth-400)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">🌧️ Rainfall: {form.rainfall}%</label>
                            <input type="range" min="0" max="100" value={form.rainfall} onChange={e => set('rainfall', e.target.value)} style={{ width: '100%', accentColor: 'var(--sky-500)' }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.usesFertilizer} onChange={e => set('usesFertilizer', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--green-500)' }} />
                                <span className="form-label" style={{ margin: 0, textTransform: 'none' }}>🌿 Using chemical fertilizers</span>
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Predicting...</> : '🤖 Predict Yield'}
                        </button>
                    </form>
                </div>

                <div>
                    {!result ? (
                        <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📊</div>
                            <h3>Fill Farm Details</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Select crop, land size, and conditions to predict yield</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Result Cards */}
                            <div className="grid-2" style={{ gap: 12 }}>
                                {[['🌾 Total Yield', `${result.totalYield} q`, '#22c55e'], ['📐 Per Acre', `${result.predictedYieldPerAcre} q`, '#38bdf8'], ['🎯 Confidence', `${result.confidence}%`, '#a78bfa'], ['⚡ Factor', `${result.multiplierUsed}x`, '#f59e0b']].map(([l, v, c]) => (
                                    <div key={l} className="card" style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: c }}>{v}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{l}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Line Chart */}
                            <div className="card">
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📈 Monthly Growth Projection</h3>
                                <div style={{ height: 220 }}><Line data={chartData} options={chartOptions} /></div>
                            </div>

                            {/* Confidence bar */}
                            <div className="card">
                                <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🎯 Prediction Confidence</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>AI Confidence Level</span>
                                    <span style={{ fontWeight: 700, color: '#a78bfa' }}>{result.confidence}%</span>
                                </div>
                                <div className="progress-bar" style={{ height: 12 }}>
                                    <div style={{ width: `${result.confidence}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 6, transition: 'width 1.5s ease' }} />
                                </div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 10 }}>
                                    * Prediction based on crop variety, soil fertility, water availability, and regional yield data
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
