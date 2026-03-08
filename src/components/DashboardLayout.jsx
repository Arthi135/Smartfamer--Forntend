import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard', labelTe: 'డ్యాష్‌బోర్డ్', section: 'main' },
    { path: '/crop-recommendation', icon: '🌱', label: 'Crop AI', labelTe: 'పంట AI', section: 'features', badge: 'AI' },
    { path: '/soil-health', icon: '🌍', label: 'Soil Health', labelTe: 'నేల ఆరోగ్యం', section: 'features' },
    { path: '/disease-detection', icon: '🔬', label: 'Disease Detect', labelTe: 'వ్యాధి గుర్తింపు', section: 'features', badge: 'AI' },
    { path: '/market-prices', icon: '📊', label: 'Market Prices', labelTe: 'మండి ధరలు', section: 'market' },
    { path: '/government-schemes', icon: '🏛️', label: 'Gov. Schemes', labelTe: 'ప్రభుత్వ పథకాలు', section: 'market' },
    { path: '/ai-assistant', icon: '🤖', label: 'AI Assistant', labelTe: 'AI సహాయకుడు', section: 'tools', badge: 'NEW' },
    { path: '/expense-tracker', icon: '💰', label: 'Expenses', labelTe: 'ఖర్చులు', section: 'tools' },
    { path: '/yield-prediction', icon: '📈', label: 'Yield Predict', labelTe: 'దిగుబడి అంచనా', section: 'tools', badge: 'AI' },
    { path: '/irrigation', icon: '💧', label: 'Irrigation', labelTe: 'సేద్యం', section: 'tools' },
];

const sectionLabels = { main: 'Overview', features: 'AI Features', market: 'Market & Govt', tools: 'Smart Tools' };

export default function DashboardLayout() {
    const { farmer, logout } = useAuth();
    const navigate = useNavigate();
    const [language, setLanguage] = useState(farmer?.preferredLanguage === 'telugu' ? 'te' : 'en');

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const sections = [...new Set(navItems.map(n => n.section))];

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <NavLink to="/dashboard" className="sidebar-logo">
                        <div className="sidebar-logo-icon">🌾</div>
                        <div className="sidebar-logo-text">
                            <h2>Smart Farmer</h2>
                            <span>AI Advisory System</span>
                        </div>
                    </NavLink>
                </div>
                <nav className="sidebar-nav">
                    {sections.map(section => (
                        <div key={section} className="nav-section">
                            <div className="nav-section-title">{sectionLabels[section]}</div>
                            {navItems.filter(n => n.section === section).map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span>{language === 'te' ? item.labelTe : item.label}</span>
                                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="farmer-profile-mini">
                        <div className="farmer-avatar">👨‍🌾</div>
                        <div className="farmer-info">
                            <div className="farmer-name">{farmer?.name || 'Farmer'}</div>
                            <div className="farmer-role">Smart Farmer</div>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%', marginTop: 12 }}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Topbar */}
            <header className="topbar">
                <div className="topbar-left">
                    <div className="topbar-greeting">
                        🌤️ Good Day, <span>{farmer?.name?.split(' ')[0] || 'Farmer'}!</span>
                    </div>
                </div>
                <div className="topbar-right">
                    <div className="lang-toggle">
                        <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
                        <button className={language === 'te' ? 'active' : ''} onClick={() => setLanguage('te')}>తె</button>
                    </div>
                    <div className="topbar-icon-btn" title="Notifications" onClick={() => navigate('/notifications')}>🔔</div>
                    <div className="topbar-icon-btn" title="Profile" onClick={() => navigate('/profile')}>👨‍🌾</div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <Outlet context={{ language }} />
            </main>
        </div>
    );
}
