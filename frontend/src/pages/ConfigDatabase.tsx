import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { useAuth } from '../auth/AuthContext';

function DatabaseSetup() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        host: "localhost",
        port: 5432,
        database: "",
        user: "postgres",
        password: ""
    });

    const [isError, setIsError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const { databaseConfig } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        setForm(prev => ({...prev, [name]: type === "number" ? Number(value) : value }));
    };

    // Saving congif and redirecting to login page
    const saveConfig = async () => {

        try {

            setLoading(true);

            await databaseConfig(form.host, form.port, form.database, form.user, form.password);


            setIsError(false);
            setMessage(
                "Nastavitve shranjene."
            );
            setIsVisible(true);


            setTimeout(() => {
                navigate("/login");
            }, 1000);


        } catch (err: any) {

            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                "Shranjevanje ni uspelo."
            );
            setIsVisible(true);

        } finally {

            setLoading(false);

        }
    };




    return (
        <div className="flex items-center justify-center mt-16 px-4">
            <div className="mt-6 mb-6 bg-white shadow rounded-lg p-6">


                <div className="mb-6">

                    <h2 className="text-xl font-semibold text-gray-800">
                        PostgreSQL nastavitev
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Vnesite podatke za povezavo z bazo.
                    </p>

                </div>

                <Message error={isError} visible={isVisible}>{message}</Message>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">

                    <div className="flex flex-col">

                        <label className="text-sm text-gray-500 mb-1">
                            Gostitelj
                        </label>

                        <input
                            name="host"
                            value={form.host}
                            onChange={handleChange}
                            className="
                        border border-gray-300
                        rounded-lg
                        px-4 py-2
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "
                        />

                    </div>

                    <div className="flex flex-col">

                        <label className="text-sm text-gray-500 mb-1">
                            Port
                        </label>

                        <input
                            name="port"
                            type="number"
                            value={form.port}
                            onChange={handleChange}
                            className="
                        border border-gray-300
                        rounded-lg
                        px-4 py-2
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "
                        />

                    </div>

                    <div className="flex flex-col">

                        <label className="text-sm text-gray-500 mb-1">
                            Ime baze
                        </label>

                        <input
                            name="database"
                            placeholder="izdaja_racunov"
                            value={form.database}
                            onChange={handleChange}
                            className="
                        border border-gray-300
                        rounded-lg
                        px-4 py-2
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "
                        />

                    </div>

                    <div className="flex flex-col">

                        <label className="text-sm text-gray-500 mb-1">
                            Uporabnik
                        </label>

                        <input
                            name="user"
                            value={form.user}
                            onChange={handleChange}
                            className="
                        border border-gray-300
                        rounded-lg
                        px-4 py-2
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "
                        />

                    </div>

                    <div className="flex flex-col md:col-span-2">

                        <label className="text-sm text-gray-500 mb-1">
                            Geslo
                        </label>

                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="
                        border border-gray-300
                        rounded-lg
                        px-4 py-2
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "
                        />

                    </div>
                </div>

                <div className="flex gap-3 mt-6 justify-center">
                    <button
                        disabled={loading}
                        onClick={saveConfig}
                        className="
                    bg-[#242996]
                    hover:bg-[#1d217a]
                    text-white
                    rounded-lg
                    px-5 py-2
                    transition
                    disabled:opacity-50
                    "
                    >

                        <i className="bi bi-save mr-2"></i>

                        Shrani

                    </button>
                </div>


            </div>

        </div>
    );
}


export default DatabaseSetup;