import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [farmer, setFarmer] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('sf_token');
        const savedFarmer = localStorage.getItem('sf_farmer');
        if (savedToken && savedFarmer) {
            setToken(savedToken);
            setFarmer(JSON.parse(savedFarmer));
        }
        setLoading(false);
    }, []);

    const login = (tokenVal, farmerData) => {
        setToken(tokenVal);
        setFarmer(farmerData);
        localStorage.setItem('sf_token', tokenVal);
        localStorage.setItem('sf_farmer', JSON.stringify(farmerData));
    };

    const logout = () => {
        setToken(null);
        setFarmer(null);
        localStorage.removeItem('sf_token');
        localStorage.removeItem('sf_farmer');
    };

    return (
        <AuthContext.Provider value={{ farmer, token, login, logout, loading, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};

export default AuthContext;
