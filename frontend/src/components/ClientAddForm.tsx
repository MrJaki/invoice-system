import api from '../lib/api'
import { useEffect, useState } from "react";
import Message from "./Message";

type statement_type = {
    id: number;
    tarifa: string;
    opis_davka: string;
    tip_davka: string;
    stopnja: number;
    opis: string;
}

type ClientAddFormProps = {
    loadClients: any;
    setModal: (value: boolean) => void;
}

function ClientAddForm({loadClients, setModal}: ClientAddFormProps) {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [client, setClient] = useState({
        naziv: "",
        pravni_naziv: "",
        dodatni_naziv: "",
        ulica: "",
        mesto: "",
        davcna_st: "",
        zavezanec: "",
    })

    const [statements, setStatements] = useState<statement_type[]>([]);

    const API_URL = import.meta.env.VITE_API_URL;

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
     * Adding new client
     * @param e 
     */
    const addNewClient = async (e: { preventDefault: () => void; target: HTMLFormElement | undefined; }) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        try {

            await api.post(
                `${API_URL}/clients`,
                {
                    title: client.naziv,
                    legal_title: client.pravni_naziv,
                    additional_title: client.dodatni_naziv,
                    street: client.ulica,
                    city: client.mesto,
                    tax_num: client.davcna_st,
                    obligee: formData.get("zavezanec"),
                    statement_type_id: formData.get("vrsta_izjave"),
                }
            )

            loadClients();
            setModal(false);

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

    useEffect(() => {
        getStatementTypes();
    }, [])

    
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Message error={isError} visible={isVisible}>{message}</Message>
        
            {/* Form for editing bill lines */}
            <form onSubmit={addNewClient} className="grid md:grid-cols-2 gap-4 items-end">

                <h2>Dodaj novega komitenta</h2>

                {/* Title input */}
                <div className="md:col-span-2 ">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Naziv
                    </label>
                    <input
                        required
                        name='naziv'
                        type="text"
                        placeholder="Vnesite naziv podjetja"
                        value={client.naziv}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Legal title input */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Pravni Naziv
                    </label>
                    <input
                        name='pravni_naziv'
                        type="text"
                        placeholder="Vnesite pravni naziv (neobvezno)"
                        value={client.pravni_naziv}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Additional title input */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Dodatni Naziv
                    </label>
                    <input
                        name='dodatni_naziv'
                        type="text"
                        placeholder="Dodatni naziv (neobvezno)"
                        value={client.dodatni_naziv}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Street input */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Ulica
                    </label>
                    <input
                        required
                        name='ulica'
                        type="text"
                        placeholder="npr. Slovenska cesta 10"
                        value={client.ulica}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* City input */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Mesto
                    </label>
                    <input
                        required
                        name='mesto'
                        type="text"
                        placeholder="npr. Celje 3000"
                        value={client.mesto}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Tax num input */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Davčna Št.
                    </label>
                    <input
                        name='davcna_st'
                        type="text"
                        placeholder="npr. SI12345678"
                        value={client.davcna_st}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Obligee input */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Zavezanec
                    </label>
                    <select
                        required
                        name="zavezanec"
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                        defaultValue="false"
                    >
                        <option value="true">DA</option>
                        <option value="false">NE</option>
                    </select>
                </div>

                {/* Statement type input */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Vrsta izjave
                    </label>
                    <select
                        required
                        name="vrsta_izjave"
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                        defaultValue=""
                    >
                        {statements.map((statement) => (
                            <option key={statement.id} value={statement.id}>{statement.opis}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="md:col-span-1 inline-flex items-center justify-center gap-2 rounded-lg
                   border-2 border-green-700 text-green-700
                   hover:bg-green-700 hover:text-white
                   px-4 py-2 font-medium text-sm transition"
                >
                    <i className="bi bi-floppy"></i>
                    Shrani
                </button>

            </form>
        </>
    );
}

export default ClientAddForm;