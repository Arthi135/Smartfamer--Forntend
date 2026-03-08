import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import SoilHealth from './pages/SoilHealth';
import DiseaseDetection from './pages/DiseaseDetection';
import MarketPrices from './pages/MarketPrices';
import GovernmentSchemes from './pages/GovernmentSchemes';
import AIAssistant from './pages/AIAssistant';
import ExpenseTracker from './pages/ExpenseTracker';
import YieldPrediction from './pages/YieldPrediction';
import Irrigation from './pages/Irrigation';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

const PrivateRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a1628' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌾</div>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ color: '#94a3b8', marginTop: '16px', fontFamily: 'Outfit, sans-serif' }}>Loading Smart Farmer...</p>
            </div>
        </div>
    );
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return null;
    return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="crop-recommendation" element={<CropRecommendation />} />
                <Route path="soil-health" element={<SoilHealth />} />
                <Route path="disease-detection" element={<DiseaseDetection />} />
                <Route path="market-prices" element={<MarketPrices />} />
                <Route path="government-schemes" element={<GovernmentSchemes />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="expense-tracker" element={<ExpenseTracker />} />
                <Route path="yield-prediction" element={<YieldPrediction />} />
                <Route path="irrigation" element={<Irrigation />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: { background: '#0f2040', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Outfit, sans-serif', borderRadius: '12px' },
                        success: { iconTheme: { primary: '#22c55e', secondary: '#0f2040' } },
                        error: { iconTheme: { primary: '#ef4444', secondary: '#0f2040' } }
                    }}
                />
            </BrowserRouter>
        </AuthProvider>
    );
}
