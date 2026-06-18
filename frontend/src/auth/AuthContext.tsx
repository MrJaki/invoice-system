import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../lib/api';

interface User {
    id: number;
    email: string;
    ime: string;
    priimek: string;
    vloga: string;
}

interface AuthContextValue {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    register: (email: string, password: string, password_repeat: string, name: string, surname: string, invite_code: string) => Promise<void>;
    generateCode: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

    // On initial load, it tries to restore user from localStorage
    // Prevents losing login state on refresh
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Ensuring that token is valid and user session is restord on refresh
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        api.get(API_URL + '/auth/me')
            .then(res => setUser(res.data.data))
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const res = await api.post(API_URL + '/auth/login', { email, password });
        const { token, user } = res.data.data;
        // Saving token and user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    }

    async function register(email: string, password: string, password_repeat: string, name: string, surname: string, invite_code: string) {
        await api.post(API_URL + '/auth/register', { email, password, password_repeat, name, surname, invite_code });
    }

    async function generateCode() {
        const code = await api.post(API_URL + '/auth/invite-code');
        return code.data.data.koda;
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, register, generateCode }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth mora biti znotraj <AuthProvider>');
    return ctx;
}