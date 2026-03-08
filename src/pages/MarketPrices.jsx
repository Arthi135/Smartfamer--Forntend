import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../utils/api';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MarketPrices() {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('modalPrice');
    const [profitCrop, setProfitCrop] = useState('');
    const [profitLand, setProfitLand] = useState(1);
    const [profitYield, setProfitYield] = useState('');
    const [profitResult, setProfitResult] = useState(null);

    useEffect(() => {
        api.get('/market/prices').then(res => { setPrices(res.data.prices); setLoading(false); })
            .catch(() => { toast.error('Failed to load prices'); setLoading(false); });
    }, []);

    const filtered = prices.filter(p => p.cropName.toLowerCase().includes(search.toLowerCase()) || p.cropNameTelugu.includes(search))
        .sort((a, b) => b[sortBy] - a[sortBy]);

    const chartData = {
        labels: prices.slice(0, 8).map(p => p.cropName),
        datasets: [{
            label: 'Modal Price (₹/quintal)',
            data: prices.slice(0, 8).map(p => p.modalPrice),
            backgroundColor: prices.slice(0, 8).map((p, i) => p.trend === 'rising' ? 'rgba(34,197,94,0.7)' : p.trend === 'falling' ? 'rgba(239,68,68,0.7)' : 'rgba(148,163,184,0.7)'),
            borderColor: prices.slice(0, 8).map(p => p.trend === 'rising' ? '#22c55e' : p.trend === 'falling' ? '#ef4444' : '#94a3b8'),
            borderWidth: 2, borderRadius: 8
        }]
    };

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `₹${ctx.raw.toLocaleString()}/quintal` } } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => `₹${v.toLocaleString()}` } }
        }
    };

    const calcProfit = () => {
        const crop = prices.find(p => p.cropName === profitCrop);
        if (!crop || !profitYield) return;
        const revenue = parseFloat(profitYield) * crop.modalPrice;
        setProfitResult({ crop: profitCrop, yield: profitYield, price: crop.modalPrice, revenue: revenue * profitLand });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">📊 Market Prices & Analysis</h1>
                <p className="page-subtitle">Live mandi prices from Andhra Pradesh & Telangana markets</p>
            </div>

            {/* Price Chart */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontWeight: 700 }}>📈 Price Comparison Chart</h3>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem' }}>
                        <span style={{ color: '#22c55e' }}>● Rising</span>
                        <span style={{ color: '#ef4444' }}>● Falling</span>
                        <span style={{ color: '#94a3b8' }}>● Stable</span>
                    </div>
                </div>
                {loading ? <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" /></div>
                    : <div style={{ height: 250 }}><Bar data={chartData} options={chartOptions} /></div>}
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* Price Table */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontWeight: 700 }}>🏪 Mandi Prices</h3>
                        <input className="form-input" style={{ width: 180 }} placeholder="🔍 Search crop" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Crop</th>
                                    <th>Mandi</th>
                                    <th>Price (₹/q)</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => (
                                    <tr key={i}>
                                        <td><div style={{ fontWeight: 600 }}>{p.icon} {p.cropName}</div><div style={{ fontSize: '0.78rem', color: 'var(--green-400)' }} className="telugu">{p.cropNameTelugu}</div></td>
                                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.mandiName}</td>
                                        <td><div className="price-badge">₹{p.modalPrice.toLocaleString()}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{p.minPrice}-{p.maxPrice}</div></td>
                                        <td>
                                            {p.trend === 'rising' && <span className="trend-up">↑ {p.priceChange}</span>}
                                            {p.trend === 'falling' && <span className="trend-down">↓ {p.priceChange}</span>}
                                            {p.trend === 'stable' && <span className="trend-stable">→ Stable</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Profit Calculator */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>💰 Profit Estimator</h3>
                    <div className="form-group">
                        <label className="form-label">Select Crop</label>
                        <select className="form-select" value={profitCrop} onChange={e => setProfitCrop(e.target.value)}>
                            <option value="">Choose a crop</option>
                            {prices.map(p => <option key={p.cropName} value={p.cropName}>{p.icon} {p.cropName}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Land Size (Acres)</label>
                        <input type="number" className="form-input" min="0.1" step="0.1" value={profitLand} onChange={e => setProfitLand(e.target.value)} placeholder="e.g. 2" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Expected Yield (Quintals/Acre)</label>
                        <input type="number" className="form-input" value={profitYield} onChange={e => setProfitYield(e.target.value)} placeholder="e.g. 20" />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={calcProfit} disabled={!profitCrop || !profitYield}>
                        💰 Calculate Profit
                    </button>
                    {profitResult && (
                        <div style={{ marginTop: 16, padding: '16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12 }}>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--green-400)', marginBottom: 8 }}>💹 Profit Estimate</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {[['Crop', profitResult.crop], ['Yield', `${profitResult.yield * profitLand} q`], ['Market Price', `₹${profitResult.price.toLocaleString()}/q`], ['Estimated Revenue', `₹${profitResult.revenue.toLocaleString()}`]].map(([k, v]) => (
                                    <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{k}</div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
