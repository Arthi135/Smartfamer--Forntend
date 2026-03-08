import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan', 'Bihar', 'West Bengal', 'Odisha'];
const SOIL_TYPES = [['black', 'Black (Regur) Soil - నల్ల నేల'], ['red', 'Red Soil - ఎర్ర నేల'], ['loamy', 'Loamy Soil - గరప నేల'], ['sandy', 'Sandy Soil - ఇసుక నేల'], ['clay', 'Clay Soil - బంకమట్టి'], ['alluvial', 'Alluvial Soil - ఒండ్రు నేల'], ['laterite', 'Laterite Soil - మురం నేల']];
const WATER = [['abundant', 'Abundant (Canal/River)'], ['moderate', 'Moderate (Borewell)'], ['scarce', 'Scarce (Limited)'], ['rainfed', 'Rainfed Only']];

export default function Register() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', state: '', district: '', village: '', landSize: '', soilType: '', waterAvailability: '', preferredLanguage: 'english' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form, location: { state: form.state, district: form.district, village: form.village }, landSize: parseFloat(form.landSize) };
            const res = await api.post('/auth/register', payload);
            login(res.data.token, res.data.farmer);
            toast.success('🎉 Registration successful! Welcome to Smart Farmer!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)', top: '-150px', right: '-150px', pointerEvents: 'none' }} />

            <div className="auth-card" style={{ maxWidth: 560 }}>
                <div className="auth-logo">
                    <span className="logo-icon">🌱</span>
                    <h1>Create Account</h1>
                    <p>Join thousands of Smart Farmers across India</p>
                </div>

                {/* Step indicator */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, gap: 8 }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? 'var(--green-500)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                    ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                    Step {step} of 3: {step === 1 ? 'Personal Info' : step === 2 ? 'Farm Location' : 'Farm Details'}
                </p>

                <form onSubmit={step < 3 ? (e => { e.preventDefault(); setStep(s => s + 1); }) : handleSubmit}>
                    {step === 1 && <>
                        <div className="form-group">
                            <label className="form-label">👤 Full Name</label>
                            <input type="text" className="form-input" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">📱 Mobile Number</label>
                            <input type="tel" className="form-input" placeholder="10-digit mobile number" value={form.mobile} onChange={e => set('mobile', e.target.value)} required pattern="[0-9]{10}" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">📧 Email</label>
                            <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">🔒 Password</label>
                            <input type="password" className="form-input" placeholder="Minimum 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">🗣️ Preferred Language</label>
                            <select className="form-select" value={form.preferredLanguage} onChange={e => set('preferredLanguage', e.target.value)}>
                                <option value="english">English</option>
                                <option value="telugu">తెలుగు (Telugu)</option>
                                <option value="hindi">हिंदी (Hindi)</option>
                            </select>
                        </div>
                    </>}

                    {step === 2 && <>
                        <div className="form-group">
                            <label className="form-label">🗺️ State</label>
                            <select className="form-select" value={form.state} onChange={e => set('state', e.target.value)} required>
                                <option value="">Select State</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">🏢 District</label>
                            <input type="text" className="form-input" placeholder="e.g. Guntur, Kurnool" value={form.district} onChange={e => set('district', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">🏘️ Village / Town</label>
                            <input type="text" className="form-input" placeholder="Village or town name" value={form.village} onChange={e => set('village', e.target.value)} required />
                        </div>
                    </>}

                    {step === 3 && <>
                        <div className="form-group">
                            <label className="form-label">📐 Land Size (Acres)</label>
                            <input type="number" className="form-input" placeholder="e.g. 2.5" value={form.landSize} onChange={e => set('landSize', e.target.value)} required min="0.1" step="0.1" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">🌍 Soil Type</label>
                            <select className="form-select" value={form.soilType} onChange={e => set('soilType', e.target.value)} required>
                                <option value="">Select Soil Type</option>
                                {SOIL_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">💧 Water Availability</label>
                            <select className="form-select" value={form.waterAvailability} onChange={e => set('waterAvailability', e.target.value)} required>
                                <option value="">Select Water Source</option>
                                {WATER.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                        </div>

                        {/* Summary card */}
                        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: '0.85rem' }}>
                            <p style={{ color: 'var(--green-400)', fontWeight: 700, marginBottom: 8 }}>📋 Summary</p>
                            <p style={{ color: 'var(--text-secondary)' }}>👤 {form.name} | 📍 {form.district}, {form.state}</p>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>📐 {form.landSize} acres | 🌍 {form.soilType} soil</p>
                        </div>
                    </>}

                    <div style={{ display: 'flex', gap: 12 }}>
                        {step > 1 && <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>← Back</button>}
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                            {loading ? '⏳ Creating...' : step < 3 ? 'Next →' : '🌾 Create Account'}
                        </button>
                    </div>
                </form>

                <div className="auth-switch">
                    Already registered? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
}
