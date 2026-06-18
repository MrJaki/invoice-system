import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [geslo, setGeslo] = useState('');
    const [napaka, setNapaka] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setNapaka('');
        setBusy(true);
        try {
            await login(email, geslo);
            navigate('/bills');
        } catch (err: any) {
            setNapaka(err.response?.data?.error || 'Napaka pri prijavi.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="flex items-center justify-center mt-16 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow rounded-lg p-6"
            >
                <h1 className="text-xl font-semibold text-gray-800 mb-6">
                    Prijava
                </h1>

                {napaka && (
                    <div className="mb-4 bg-red-50 text-red-600 border border-red-200 rounded px-3 py-2 text-sm">
                        {napaka}
                    </div>
                )}

                <div className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                        placeholder="Email"
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />

                    <input
                        type="password"
                        value={geslo}
                        onChange={e => setGeslo(e.target.value)}
                        autoComplete="password"
                        placeholder="Geslo"
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={busy}
                    className="mt-5 w-full bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-2 transition disabled:opacity-50"
                >
                    {busy ? 'Prijavljam…' : 'Prijava'}
                </button>

                <div className="mt-4 text-sm text-center text-gray-600">
                    Še nimate računa?{' '}
                    <a
                        href="/register"
                        className="text-[#242996] hover:underline font-medium"
                    >
                        Registrirajte se tukaj
                    </a>
                </div>
            </form>
        </div>
    );
}