import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CROPS = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Groundnut', 'Sunflower', 'Tomato', 'Onion', 'Chilli', 'Sugarcane', 'Soybean', 'Jowar', 'Bajra'];
const EXPENSE_FIELDS = [['seeds', '🌰 Seeds'], ['fertilizers', '🌿 Fertilizers'], ['pesticides', '🧪 Pesticides'], ['labor', '👷 Labor'], ['irrigation', '💧 Irrigation'], ['machinery', '🚜 Machinery'], ['other', '📦 Other']];

export default function ExpenseTracker() {
    const [form, setForm] = useState({ cropName: '', season: '', landSize: '', expectedRevenue: '', notes: '', expenses: { seeds: 0, fertilizers: 0, pesticides: 0, labor: 0, irrigation: 0, machinery: 0, other: 0 } });
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [tab, setTab] = useState('add');

    const setExp = (k, v) => setForm(f => ({ ...f, expenses: { ...f.expenses, [k]: parseFloat(v) || 0 } }));
    const totalExp = Object.values(form.expenses).reduce((a, b) => a + b, 0);
    const estimatedProfit = (parseFloat(form.expectedRevenue) || 0) - totalExp;

    useEffect(() => {
        api.get('/expense').then(res => { setRecords(res.data.expenses); setLoadingList(false); }).catch(() => setLoadingList(false));
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.cropName) return toast.error('Please select a crop.');
        setLoading(true);
        try {
            const res = await api.post('/expense', form);
            setRecords(prev => [res.data.expense, ...prev]);
            toast.success('✅ Expense recorded successfully!');
            setForm({ cropName: '', season: '', landSize: '', expectedRevenue: '', notes: '', expenses: { seeds: 0, fertilizers: 0, pesticides: 0, labor: 0, irrigation: 0, machinery: 0, other: 0 } });
            setTab('list');
        } catch (err) {
            toast.error('Failed to save expense.');
        } finally { setLoading(false); }
    };

    const handleDelete = async id => {
        try {
            await api.delete(`/expense/${id}`);
            setRecords(prev => prev.filter(r => r.id !== id));
            toast.success('Expense deleted');
        } catch { toast.error('Delete failed'); }
    };

    const totalSummary = records.reduce((acc, r) => ({
        spent: acc.spent + (r.totalExpense || 0),
        profit: acc.profit + (r.profit || 0),
        revenue: acc.revenue + (r.expectedRevenue || 0)
    }), { spent: 0, profit: 0, revenue: 0 });

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">💰 Farm Expense Tracker</h1>
                <p className="page-subtitle">Track every rupee spent on your farm and calculate your profits</p>
            </div>

            {/* Summary */}
            <div className="grid-3" style={{ marginBottom: 24 }}>
                {[['💸 Total Spent', `₹${totalSummary.spent.toLocaleString()}`, '#ef4444'], ['💹 Total Revenue', `₹${totalSummary.revenue.toLocaleString()}`, '#38bdf8'], ['📈 Net Profit', `₹${totalSummary.profit.toLocaleString()}`, totalSummary.profit >= 0 ? '#22c55e' : '#ef4444']].map(([l, v, c]) => (
                    <div key={l} className="card stat-card">
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: c }}>{v}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>{l}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[['add', '➕ Add Expense'], ['list', '📋 My Records']].map(([t, l]) => (
                    <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t)}>{l}</button>
                ))}
            </div>

            {tab === 'add' && (
                <div className="grid-2">
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📝 New Expense Entry</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid-2" style={{ gap: 12 }}>
                                <div className="form-group">
                                    <label className="form-label">🌾 Crop Name</label>
                                    <select className="form-select" value={form.cropName} onChange={e => setForm(f => ({ ...f, cropName: e.target.value }))}>
                                        <option value="">Select crop</option>
                                        {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">📅 Season</label>
                                    <select className="form-select" value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))}>
                                        <option value="">Select</option>
                                        {['Kharif 2024', 'Rabi 2024-25', 'Summer 2025', 'Kharif 2025'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">📐 Land (Acres)</label>
                                    <input type="number" step="0.1" className="form-input" value={form.landSize} onChange={e => setForm(f => ({ ...f, landSize: e.target.value }))} placeholder="e.g. 2" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">💰 Expected Revenue (₹)</label>
                                    <input type="number" className="form-input" value={form.expectedRevenue} onChange={e => setForm(f => ({ ...f, expectedRevenue: e.target.value }))} placeholder="e.g. 80000" />
                                </div>
                            </div>
                            <h4 style={{ fontWeight: 700, marginBottom: 12, marginTop: 4 }}>💸 Expense Breakdown</h4>
                            <div className="grid-2" style={{ gap: 12 }}>
                                {EXPENSE_FIELDS.map(([k, l]) => (
                                    <div className="form-group" key={k}>
                                        <label className="form-label">{l}</label>
                                        <input type="number" className="form-input" value={form.expenses[k] || ''} onChange={e => setExp(k, e.target.value)} placeholder="₹0" />
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? '⏳ Saving...' : '💾 Save Expense Record'}
                            </button>
                        </form>
                    </div>

                    {/* Preview */}
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📊 Cost Preview</h3>
                        {EXPENSE_FIELDS.map(([k, l]) => form.expenses[k] > 0 && (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                                <span style={{ fontWeight: 600 }}>₹{form.expenses[k].toLocaleString()}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 8px', borderTop: '2px solid rgba(255,255,255,0.1)', marginTop: 8, fontSize: '1rem', fontWeight: 800 }}>
                            <span>Total Expense</span><span style={{ color: '#f87171' }}>₹{totalExp.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '1rem', fontWeight: 800 }}>
                            <span>Expected Revenue</span><span style={{ color: '#38bdf8' }}>₹{parseFloat(form.expectedRevenue || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ marginTop: 12, padding: '14px', background: estimatedProfit >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${estimatedProfit >= 0 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated Profit</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: estimatedProfit >= 0 ? '#22c55e' : '#ef4444' }}>₹{estimatedProfit.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'list' && (
                <div>
                    {loadingList && <div className="loading-screen"><div className="spinner" /></div>}
                    {!loadingList && records.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
                            <h3>No Expense Records Yet</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Click "Add Expense" to record your first farm expense</p>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {records.map(r => (
                            <div key={r.id} className="card" style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 700 }}>🌾 {r.cropName} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.85rem' }}>{r.season && `— ${r.season}`}</span></h4>
                                        <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: '0.88rem' }}>
                                            <span style={{ color: '#f87171' }}>Spent: ₹{(r.totalExpense || 0).toLocaleString()}</span>
                                            <span style={{ color: '#38bdf8' }}>Revenue: ₹{(r.expectedRevenue || 0).toLocaleString()}</span>
                                            <span style={{ color: r.profit >= 0 ? '#22c55e' : '#f87171', fontWeight: 700 }}>Profit: ₹{(r.profit || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
