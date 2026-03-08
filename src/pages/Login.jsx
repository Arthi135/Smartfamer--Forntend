import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', form);
            login(res.data.token, res.data.farmer);
            toast.success(`🌾 Welcome back, ${res.data.farmer.name}!`);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmerText { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes spinRing { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 40px rgba(0,0,0,0.6),0 30px 80px rgba(0,0,0,0.5)} 50%{box-shadow:0 0 60px rgba(34,197,94,0.2),0 30px 80px rgba(0,0,0,0.5)} }
        @keyframes sunRay { 0%,100%{opacity:0.06} 50%{opacity:0.14} }
        @keyframes particleDrift { 0%{transform:translateY(0) scale(1);opacity:0.8} 100%{transform:translateY(-120vh) scale(0.2);opacity:0} }
        .li { transition:all 0.3s; border:1px solid rgba(34,197,94,0.2) !important; background:rgba(0,0,0,0.35) !important; }
        .li:focus { border-color:#22c55e !important; background:rgba(0,0,0,0.5) !important; box-shadow:0 0 0 3px rgba(34,197,94,0.2) !important; outline:none !important;}
        .lbtn:hover:not(:disabled) { transform:translateY(-3px); box-shadow:0 16px 50px rgba(34,197,94,0.5) !important; }
        .rlnk:hover { background:rgba(34,197,94,0.2) !important; border-color:rgba(74,222,128,0.5) !important; }
      `}</style>

            {/* ═══════ FULL PAGE WRAPPER with FARM BG ═══════ */}
            <div style={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                fontFamily: 'Outfit, sans-serif', padding: '20px',
                backgroundImage: 'url(/farm-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
            }}>

                {/* Dark overlay to make card readable */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,10,5,0.55) 0%, rgba(2,15,8,0.45) 50%, rgba(0,8,4,0.6) 100%)', backdropFilter: 'brightness(0.85)' }} />

                {/* Subtle vignette edges */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />

                {/* Sun rays fan from horizon */}
                {[...Array(7)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute', bottom: '40%', left: '50%',
                        width: 2, height: '55%',
                        background: 'linear-gradient(0deg, rgba(253,224,71,0.18) 0%, transparent 100%)',
                        transformOrigin: 'bottom center',
                        transform: `rotate(${-50 + i * 17}deg)`,
                        animation: `sunRay ${3 + i * 0.7}s ease-in-out ${i * 0.3}s infinite`,
                        pointerEvents: 'none'
                    }} />
                ))}

                {/* Floating pollen particles */}
                {[...Array(12)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: i % 3 === 0 ? 6 : 4, height: i % 3 === 0 ? 6 : 4,
                        borderRadius: '50%',
                        background: i % 2 === 0 ? 'rgba(253,224,71,0.6)' : 'rgba(134,239,172,0.5)',
                        left: `${(i * 8.3 + 5) % 92}%`,
                        bottom: `${(i * 13 + 5) % 50}%`,
                        animation: `particleDrift ${5 + (i % 5) * 2}s linear ${(i * 0.8) % 5}s infinite`,
                        pointerEvents: 'none',
                        boxShadow: i % 2 === 0 ? '0 0 6px rgba(253,224,71,0.7)' : '0 0 4px rgba(74,222,128,0.6)'
                    }} />
                ))}

                {/* ═══════ CARD ═══════ */}
                <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 450, animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1)' }}>

                    {/* Spinning ring decoration */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 520, height: 520, border: '1px dashed rgba(74,222,128,0.1)', borderRadius: '50%', animation: 'spinRing 35s linear infinite', pointerEvents: 'none' }} />

                    <div style={{
                        background: 'linear-gradient(155deg, rgba(2,20,10,0.88) 0%, rgba(1,12,7,0.93) 100%)',
                        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                        border: '1px solid rgba(34,197,94,0.22)',
                        borderRadius: 26, padding: '44px 40px',
                        animation: 'glowPulse 6s ease-in-out infinite',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(34,197,94,0.15)'
                    }}>

                        {/* Card top shimmer border */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.7) 40%, rgba(234,179,8,0.5) 60%, transparent 100%)', borderRadius: '26px 26px 0 0' }} />
                        {/* Card bottom border */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)', borderRadius: '0 0 26px 26px' }} />

                        {/* ── Logo ── */}
                        <div style={{ textAlign: 'center', marginBottom: 30 }}>
                            <div style={{
                                width: 88, height: 88, borderRadius: 24,
                                background: 'linear-gradient(135deg, #052e16, #15803d)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2.8rem', margin: '0 auto 16px',
                                boxShadow: '0 0 0 6px rgba(34,197,94,0.1), 0 0 40px rgba(34,197,94,0.4), 0 8px 32px rgba(0,0,0,0.7)',
                                border: '2px solid rgba(74,222,128,0.3)',
                                animation: 'floatCard 5s ease-in-out infinite'
                            }}>🌾</div>

                            <h1 style={{
                                fontSize: '2rem', fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.5px',
                                background: 'linear-gradient(90deg, #fde68a, #86efac, #4ade80, #86efac, #fde68a)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                animation: 'shimmerText 3.5s linear infinite'
                            }}>Smart Farmer</h1>

                            <p style={{ color: 'rgba(253,224,71,0.75)', fontSize: '0.85rem', marginBottom: 14 }}>
                                🌅 AI-Powered Crop Planning & Advisory
                            </p>

                            {/* Feature badges */}
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                                {['🤖 AI Crops', '🔬 Disease AI', '🌦️ Alerts', '💰 Market'].map(b => (
                                    <span key={b} style={{
                                        padding: '4px 11px',
                                        background: 'rgba(0,0,0,0.4)',
                                        border: '1px solid rgba(74,222,128,0.2)', borderRadius: 20,
                                        fontSize: '0.7rem', color: '#86efac', fontWeight: 700
                                    }}>{b}</span>
                                ))}
                            </div>
                        </div>

                        {/* ── Form ── */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: 'rgba(253,224,71,0.8)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '1.2px' }}>📧 Email Address</label>
                                <input className="li" type="email" placeholder="you@example.com"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                                    style={{ width: '100%', padding: '13px 16px', borderRadius: 12, color: '#f0fdf4', fontSize: '0.95rem', fontFamily: 'Outfit,sans-serif', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: 26 }}>
                                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: 'rgba(253,224,71,0.8)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '1.2px' }}>🔒 Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input className="li" type={showPass ? 'text' : 'password'} placeholder="Your password"
                                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                                        style={{ width: '100%', padding: '13px 48px 13px 16px', borderRadius: 12, color: '#f0fdf4', fontSize: '0.95rem', fontFamily: 'Outfit,sans-serif', boxSizing: 'border-box' }} />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(134,239,172,0.6)', cursor: 'pointer', fontSize: '1rem' }}>
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="lbtn" disabled={loading}
                                style={{
                                    width: '100%', padding: '15px', borderRadius: 14,
                                    background: loading ? 'rgba(10,50,25,0.7)' : 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #16a34a 100%)',
                                    color: '#fff', fontSize: '1.05rem', fontWeight: 800, fontFamily: 'Outfit,sans-serif',
                                    border: '2px solid rgba(74,222,128,0.3)', cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    boxShadow: '0 8px 35px rgba(22,163,74,0.4)',
                                    transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
                                }}>
                                {loading
                                    ? <><span style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spinSlow 0.8s linear infinite' }} /> Logging in...</>
                                    : <>🚀 Login to Dashboard</>
                                }
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(253,224,71,0.2))' }} />
                            <span style={{ color: 'rgba(253,224,71,0.45)', fontSize: '0.78rem', fontWeight: 600 }}>NEW HERE?</span>
                            <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(253,224,71,0.2))' }} />
                        </div>

                        <Link to="/register" className="rlnk"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '13px', borderRadius: 12,
                                border: '1px solid rgba(74,222,128,0.2)',
                                background: 'rgba(34,197,94,0.06)',
                                color: '#4ade80', fontWeight: 700, fontSize: '0.95rem',
                                textDecoration: 'none', transition: 'all 0.3s', fontFamily: 'Outfit,sans-serif'
                            }}>
                            🌱 Create Free Farmer Account
                        </Link>

                        {/* Mini feature grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 18 }}>
                            {[['🌾', 'Crop AI'], ['🔬', 'Disease'], ['🌦️', 'Weather'], ['💹', 'Profit']].map(([ic, lb]) => (
                                <div key={lb} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.2rem' }}>{ic}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(134,239,172,0.65)', fontWeight: 600, marginTop: 3 }}>{lb}</div>
                                </div>
                            ))}
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(253,224,71,0.35)', marginTop: 16 }}>
                            🇮🇳 Smart Farmer · AI for every Indian farmer
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
