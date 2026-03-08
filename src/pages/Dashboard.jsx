import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const RainfallPopup = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" style={{ textAlign: 'center', border: '1px solid rgba(239,68,68,0.5)', background: 'linear-gradient(135deg, #1a0a0a, #2a1010)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>⛈️</div>
            <h2 style={{ color: '#f87171', fontSize: '1.4rem', marginBottom: 12 }}>⚠️ Heavy Rainfall Alert!</h2>
            <p style={{ color: '#fca5a5', marginBottom: 8 }}>Rainfall probability is above 60%</p>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 24 }}>
                ❌ Avoid pesticide spraying<br />
                ❌ Hold fertilizer application<br />
                ✅ Check drainage channels<br />
                ✅ Protect stored produce
            </p>
            <button className="btn btn-danger" onClick={onClose}>✅ Got it, Thanks!</button>
        </div>
    </div>
);

export default function Dashboard() {
    const { farmer } = useAuth();
    const [weather, setWeather] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertDismissed, setAlertDismissed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (farmer && farmer.location) {
            const city = farmer.location.district || 'Hyderabad';
            api.get(`/weather/current?city=${city}`).then(res => {
                setWeather(res.data);
                if (res.data.rainfallProbability > 40 && !alertDismissed) {
                    setTimeout(() => setShowAlert(true), 1500);
                }
            }).catch(() => { });
        }
    }, [farmer, alertDismissed]);

    const quickActions = [
        { icon: '🌱', label: 'Get Crop AI', labelTe: 'పంట AI', path: '/crop-recommendation', color: '#16a34a', bg: 'rgba(22,163,74,0.15)' },
        { icon: '🔬', label: 'Detect Disease', labelTe: 'వ్యాధి గుర్తించు', path: '/disease-detection', color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)' },
        { icon: '🌍', label: 'Soil Analysis', labelTe: 'నేల పరీక్ష', path: '/soil-health', color: '#d97706', bg: 'rgba(217,119,6,0.15)' },
        { icon: '💧', label: 'Irrigation', labelTe: 'సేద్యం', path: '/irrigation', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
        { icon: '📊', label: 'Market Prices', labelTe: 'ధరలు', path: '/market-prices', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
        { icon: '🤖', label: 'Ask AI Bot', labelTe: 'AI అడుగు', path: '/ai-assistant', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    ];

    const stats = [
        { icon: '🌾', label: 'Land Size', value: `${farmer?.landSize || '?'} Acres`, desc: 'Your farm area' },
        { icon: '🌍', label: 'Soil Type', value: farmer?.soilType ? farmer.soilType.charAt(0).toUpperCase() + farmer.soilType.slice(1) : '?', desc: 'Primary soil type' },
        { icon: '📍', label: 'Location', value: farmer?.location?.district || '?', desc: farmer?.location?.state || '' },
        { icon: '💧', label: 'Water', value: farmer?.waterAvailability || '?', desc: 'Availability level' },
    ];

    return (
        <div className="page-container">
            {showAlert && <RainfallPopup onClose={() => { setShowAlert(false); setAlertDismissed(true); toast('⚠️ Rainfall alert noted!', { icon: '🌧️' }); }} />}

            {/* Welcome Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(16,185,129,0.1), rgba(234,179,8,0.1))', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '28px 32px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', fontSize: '5rem', opacity: 0.15 }}>🌾</div>
                <div style={{ position: 'absolute', right: 120, top: '30%', fontSize: '3rem', opacity: 0.1 }}>🌱</div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
                    🙏 Welcome, <span className="gradient-text">{farmer?.name || 'Farmer'}!</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Your AI-powered agricultural advisory is ready. Let's make today's farming smarter! 🚜
                </p>
                {farmer?.location && <p style={{ color: 'var(--green-400)', fontSize: '0.85rem', marginTop: 8 }}>📍 {farmer.location.village}, {farmer.location.district}, {farmer.location.state}</p>}
            </div>

            {/* Stats Row */}
            <div className="grid-4" style={{ marginBottom: 28 }}>
                {stats.map(s => (
                    <div key={s.label} className="card stat-card">
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-value" style={{ fontSize: '1.3rem' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.desc}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 28 }}>
                {/* Weather Widget */}
                <div className="weather-widget">
                    <h3 style={{ color: '#7dd3fc', marginBottom: 16, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>🌤️ Today's Weather — {weather?.city || 'Hyderabad'}</h3>
                    {weather ? (
                        <>
                            <div className="weather-main">
                                <div>
                                    <div className="weather-temp">{Math.round(weather.temperature)}°C</div>
                                    <div style={{ color: '#7dd3fc', fontSize: '0.9rem', textTransform: 'capitalize' }}>{weather.description}</div>
                                </div>
                                <div className="weather-icon">{weather.rainfallProbability > 60 ? '⛈️' : weather.rainfallProbability > 40 ? '🌦️' : weather.humidity > 70 ? '🌤️' : '☀️'}</div>
                            </div>
                            <div className="weather-details">
                                <div className="weather-detail"><div className="label">Humidity</div><div className="value">{weather.humidity}%</div></div>
                                <div className="weather-detail"><div className="label">Rain %</div><div className="value" style={{ color: weather.rainfallProbability > 60 ? '#f87171' : '#7dd3fc' }}>{weather.rainfallProbability}%</div></div>
                                <div className="weather-detail"><div className="label">Wind</div><div className="value">{weather.windSpeed} km/h</div></div>
                            </div>
                            {weather.rainfallProbability > 60 && (
                                <div className="rainfall-alert-banner">⚠️ High rainfall expected! Avoid pesticide spraying.</div>
                            )}
                            {weather.alerts && weather.alerts.length > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    {weather.alerts.slice(0, 2).map((a, i) => <div key={i} style={{ fontSize: '0.82rem', color: '#fcd34d', marginTop: 6, background: 'rgba(245,158,11,0.1)', borderRadius: 8, padding: '8px 12px' }}>{a}</div>)}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="loading-screen" style={{ minHeight: 120 }}><div className="spinner" /></div>
                    )}
                </div>

                {/* Quick advice */}
                <div className="card">
                    <h3 style={{ marginBottom: 16, fontWeight: 700 }}>🌿 Today's AI Advice</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { icon: '💩', tip: 'Apply organic compost before Kharif season begins for better soil structure.' },
                            { icon: '🌧️', tip: 'Monsoon approaching - ensure drainage channels are clear to avoid waterlogging.' },
                            { icon: '🐛', tip: 'Inspect crops weekly for early pest signs. Early detection saves 30% yield.' },
                            { icon: '📊', tip: 'Cotton and Chilli prices are rising. Consider these for next season.' },
                        ].map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ fontSize: '1.3rem' }}>{a.icon}</span>
                                <span style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: 28 }}>
                <h3 style={{ marginBottom: 20, fontWeight: 700, fontSize: '1.1rem' }}>⚡ Quick Actions</h3>
                <div className="grid-3" style={{ gap: 14 }}>
                    {quickActions.map(a => (
                        <button key={a.path} onClick={() => navigate(a.path)}
                            style={{ background: a.bg, border: `1px solid ${a.color}33`, borderRadius: 14, padding: '18px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.3s ease', color: a.color }}>
                            <span style={{ fontSize: '2.2rem' }}>{a.icon}</span>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 5-Day Forecast */}
            {weather?.forecast && (
                <div className="card">
                    <h3 style={{ marginBottom: 16, fontWeight: 700 }}>📅 5-Day Weather Forecast</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                        {weather.forecast.map((f, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '14px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{f.day}</div>
                                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{f.icon}</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{f.high}° / {f.low}°</div>
                                <div style={{ fontSize: '0.75rem', color: f.rain > 60 ? '#f87171' : 'var(--sky-400)', marginTop: 4 }}>💧 {f.rain}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
