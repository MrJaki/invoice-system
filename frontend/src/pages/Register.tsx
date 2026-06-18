import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_repeat, setPassword_repeat] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            await register( email, password, password_repeat, name, surname );
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Napaka pri prijavi.');
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
                    Registracija
                </h1>

                {error && (
                    <div className="mb-4 bg-red-50 text-red-600 border border-red-200 rounded px-3 py-2 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ime"
                        autoComplete="name"
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />

                    <input
                        type="text"
                        value={surname}
                        onChange={e => setSurname(e.target.value)}
                        placeholder="Priimek"
                        autoComplete="surname"
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        autoComplete="email"
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Geslo"
                        autoComplete="password"
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />

                    <input
                        type="password"
                        value={password_repeat}
                        onChange={e => setPassword_repeat(e.target.value)}
                        placeholder="Ponovite geslo"
                        autoComplete="password"
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={busy}
                    className="mt-5 w-full bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-2 transition disabled:opacity-50"
                >
                    {busy ? 'Registriram...' : 'Registracija'}
                </button>

                <div className="mt-4 text-sm text-center text-gray-600">
                    Že imate račun?{' '}
                    <a
                        href="/login"
                        className="text-[#242996] hover:underline font-medium"
                    >
                        Prijavite se tukaj
                    </a>
                </div>
            </form>
        </div>
    );
}