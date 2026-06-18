import Message from "../components/Message";
import { useEffect, useState } from "react";
import api from '../lib/api'
import { useNavigate, useParams } from "react-router-dom"
import DeleteClient from '../components/ClientModalDelete';

// Custom statemetn type
type statement_type = {
    id: number;
    tarifa: string;
    opis_davka: string;
    tip_davka: string;
    stopnja: number;
    opis: string;
}

function ClientsPage() {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);

    const [client, setClient] = useState({
        naziv: "",
        pravni_naziv: "",
        dodatni_naziv: "",
        ulica: "",
        mesto: "",
        davcna_st: "",
        zavezanec: false,
        id_vrsta_izjave: 0,
    })

    const [statements, setStatements] = useState<statement_type[]>([]);

    const navigate = useNavigate();
    const { id } = useParams();

    const API_URL = import.meta.env.VITE_API_URL;

    /**
     * Getting client info and pushing them in form
     */
    const getClientInfo = async () => {
        try {

            const client = await api.get(
                `${API_URL}/clients/${id}`
            )

            const data = client.data.data;

            setClient(data);

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju vrst izjav!"
            );
        }
    }

    /**
     * Getting tax statement types and pushing them in options element
     */
    const getStatementTypes = async () => {
        try {

            const statement = await api.get(
                `${API_URL}/tax`
            )

            const data = Array.isArray(statement.data.data)
                ? statement.data.data
                : [statement.data.data];

            setStatements(data);

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju vrst izjav!"
            );
        }
    }

    /**
     * Updating client data
     * @param e 
     */
    const updateClient = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        try {

            await api.patch(
                `${API_URL}/clients/${id}`,
                {
                    title: client.naziv,
                    legal_title: client.pravni_naziv,
                    additional_title: client.dodatni_naziv,
                    street: client.ulica,
                    city: client.mesto,
                    tax_num: client.davcna_st,
                    obligee: client.zavezanec,
                    statement_type_id: client.id_vrsta_izjave,
                }
            )

            navigate("/clients");

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju komitenta!"
            );
        }
    }

    // Handling changes for client constant
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        getStatementTypes();
        getClientInfo();
    }, [])

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 text-left">
                Uredi Komitenta
            </p>

            <Message error={isError} visible={isVisible}>{message}</Message>

            {/* Form for editing bill lines */}
            <form
                onSubmit={updateClient}
                className="
                    bg-white rounded-2xl shadow-sm border border-gray-200
                    p-6 md:p-8
                    grid md:grid-cols-8 gap-5 mt-5 text-left
                ">

                {/* Title input */}
                <div className="md:col-span-4 ">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Naziv
                    </label>
                    <input
                        required
                        name='naziv'
                        type="text"
                        placeholder="Vnesite naziv podjetja"
                        value={client.naziv ?? ""}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Legal title input */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Pravni Naziv
                    </label>
                    <input
                        name='pravni_naziv'
                        type="text"
                        placeholder="Vnesite pravni naziv (neobvezno)"
                        value={client.pravni_naziv ?? ""}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Additional title input */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Dodatni Naziv
                    </label>
                    <input
                        name='dodatni_naziv'
                        type="text"
                        placeholder="Dodatni naziv (neobvezno)"
                        value={client.dodatni_naziv ?? ""}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Street input */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Ulica
                    </label>
                    <input
                        required
                        name='ulica'
                        type="text"
                        placeholder="npr. Slovenska cesta 10"
                        value={client.ulica ?? ""}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* City input */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Mesto
                    </label>
                    <input
                        required
                        name='mesto'
                        type="text"
                        placeholder="npr. Celje 3000"
                        value={client.mesto ?? ""}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Tax num input */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Davčna Št.
                    </label>
                    <input
                        name='davcna_st'
                        type="text"
                        placeholder="npr. SI12345678"
                        value={client.davcna_st ?? ""}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Obligee input */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Zavezanec
                    </label>
                    <select
                        required
                        name="zavezanec"
                        value={String(client.zavezanec)}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    >
                        <option value="true">DA</option>
                        <option value="false">NE</option>
                    </select>
                </div>

                {/* Statement type input */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Vrsta izjave
                    </label>
                    <select
                        required
                        name="id_vrsta_izjave"
                        value={client.id_vrsta_izjave ?? 0}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    >
                        {statements.map((statement) => (
                            <option key={statement.id} value={statement.id}>{statement.opis}</option>
                        ))}
                    </select>
                </div>

                {/* Save button */}
                <button
                    type="submit"
                    className="md:col-span-1 inline-flex items-center justify-center gap-2 rounded-lg
                                border-2 bg-green-700
                                hover:bg-green-800 text-white
                                px-4 py-2 font-medium text-sm transition">
                    <i className="bi bi-floppy"></i>
                    Shrani
                </button>

                {/* Delete button */}
                <button
                    onClick={() => setDeleteModal(true)}
                    type="button"
                    className="md:col-span-1 inline-flex items-center justify-center gap-2 rounded-lg
                                border-2 bg-red-600
                                hover:bg-red-700 text-white
                                px-4 py-2 font-medium text-sm transition" >
                    <i className="bi bi-trash"></i>
                    Briši
                </button>

            </form>

            <DeleteClient 
                openModal={deleteModal}
                setOpenModal={setDeleteModal}
            />

        </div>
    );
}

export default ClientsPage;