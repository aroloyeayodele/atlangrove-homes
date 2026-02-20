import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<{
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}>({
    token: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = (newToken: string) => {
        sessionStorage.setItem('authToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        sessionStorage.removeItem('authToken');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
