import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<{ token: string | null }>({ token: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    return <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
