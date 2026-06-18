import api from '../lib/api'
import { useEffect, useState } from "react";
import Message from "../components/Message";

type User = {
    ime: string;
    priimek: string;
    naziv: string;
    pravni_naziv: string;
    ulica: string;
    mesto: string;
    davcna_st: string;
    iban: string;
    banka: string;
};

function ClientsPage() {
    const API_URL = import.meta.env.VITE_API_URL;

    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [user, setUser] = useState<User>({
        ime: "",
        priimek: "",
        naziv: "",
        pravni_naziv: "",
        ulica: "",
        mesto: "",
        davcna_st: "",
        iban: "",
        banka: "",
    });


    const fetchUser = async () => {
        try {

            const response = await api.get(`${API_URL}/json/company`);
            setUser(response.data.data);

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju zneska računa!"
            );
        }
    };

    const updateUser = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {

            await api.patch(
                `${API_URL}/json/company-update`,
                {
                    name: user.ime,
                    surname: user.priimek,
                    title: user.naziv,
                    legal_title: user.pravni_naziv,
                    street: user.ulica,
                    city: user.mesto,
                    tax_num: user.davcna_st,
                    iban: user.iban,
                    bank: user.banka,
                }
            )
            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju zneska računa!"
            );
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Nastavitve
            </p>

            <Message error={isError} visible={isVisible}>{message}</Message>

            <form
                onSubmit={updateUser}
                className="
                    bg-white rounded-2xl shadow-sm border border-gray-200
                    p-6 md:p-8
                    grid md:grid-cols-2  mt-5 text-left
                ">

                <h2 className="col-span-2">Podatki o uporabniku</h2>

                {/* Name input */}
                <div className="mt-5 mx-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Ime
                    </label>
                    <input
                        type="text"
                        name="ime"
                        value={user.ime}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-100"
                    />
                </div>

                {/* Surname input */}
                <div className="mt-5 mx-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Priimek
                    </label>
                    <input
                        type="text"
                        name="priimek"
                        value={user.priimek}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-100"
                    />
                </div>

                {/* Title input */}
                <div className="mt-5 mx-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Naziv
                    </label>
                    <input
                        name="naziv"
                        value={user.naziv}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Legal title input */}
                <div className="mt-5 mx-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Pravni Naziv
                    </label>
                    <input
                        name="pravni_naziv"
                        value={user.pravni_naziv}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Street */}
                <div className="mt-5 mx-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Ulica
                    </label>
                    <input
                        name="ulica"
                        value={user.ulica}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* City */}
                <div className="mt-5 mx-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Mesto
                    </label>
                    <input
                        name="mesto"
                        value={user.mesto}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* IBAN input */}
                <div className="mt-5 mx-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        IBAN (TRR)
                    </label>
                    <input
                        name="iban"
                        value={user.iban}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Bank name input */}
                <div className="mt-5 mx-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Ime Banke
                    </label>
                    <input
                        name="banka"
                        value={user.banka}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                <label className="block text-xs font-medium text-gray-500 mb-1 col-span-2 mt-5 mx-3">
                    Davčna Št.
                </label>

                {/* Tax num input and sav button */}
                <div className="grid md:grid-cols-2  col-span-2">

                    <input
                        name="davcna_st"
                        value={user.davcna_st}
                        onChange={handleChange}
                        type="text"
                        className="border border-gray-400 rounded-lg px-3 py-2 bg-gray-50 col-span-1 mx-3"
                    />
                    <button
                        type="submit"
                        className="mx-3 col-span-1 inline-flex items-center gap-2 rounded-lg border-2 text-blue-600 hover:text-white border-blue-500 hover:bg-blue-500 px-3 py-2 font-medium text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <i className="bi bi-floppy"></i>
                        Shrani spremembe
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ClientsPage;