import { useEffect, useState } from "react";
import api from '../lib/api'
import Message from "./Message";
import Modal from './ModalWindow';
import ClientForm from './ClientAddForm';
import { useNavigate } from "react-router-dom";

// Custom client type
type Client = {
    id: number;
    naziv: string;
    pravni_naziv: string;
    dodatni_naziv: string;
    ulica: string;
    mesto: string;
    davcna_st: string;
    zavezanec: boolean;
}

function ClientTable() {
    // Array for storing clients with custom type
    const [clients, setClients] = useState<Client[]>([]);

    // Constants for defining number of loaded clients
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);

    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterVisible, setFilterVisible] = useState(true);

    const [addModal, setAddModal] = useState(false);

    const navigate = useNavigate();


    const API_URL = import.meta.env.VITE_API_URL;

    /**
     * Loading all clients
     */
    const loadClients = async () => {
        try {
            const client = await api.get(
                `${API_URL}/clients`,
                {
                    params: {
                        limit: limit,
                        offset: offset
                    }
                }
            );

            const data = Array.isArray(client.data.data) ? client.data.data : [client.data.data];

            setClients(data);

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju komitentov!"
            );
        }
    }

    const exportCsv = async () => {
        try {
            const response = await api.post(
                `${API_URL}/clients/csv`,
                {},
                {
                    responseType: 'blob', // had to add this one here
                }
            );

            const csvBlob = new Blob(
                ['\uFEFF', response.data],
                { type: 'text/csv;charset=utf-8;' }
            );

            const url = window.URL.createObjectURL(csvBlob);

            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.download = `komitenti-.csv`;

            document.body.appendChild(tempLink);
            tempLink.click();
            tempLink.remove();

            window.URL.revokeObjectURL(url);

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri izvažanu podatkov!"
            );
        }
    }


    useEffect(() => {
        loadClients();
    }, [offset, limit])

    return (
        <>
            <Message error={isError} visible={isVisible}>{message}</Message>

            {/* Filter and 'settings' container */}
            <div className="mt-6 mb-6 bg-white shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text font-semibold text-gray-800">
                        Filtri in iskanje
                        <button
                            className="bi bi-arrow-down-up ml-5 cursor-pointer"
                            onClick={() => setFilterVisible(!filterVisible)}
                        />
                    </h3>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-18 gap-4 mt-4 ${filterVisible ? '' : 'hidden'} text-left`}>

                    {/* Search */}
                    <div className="md:col-span-10 flex flex-col">
                        <label htmlFor="iskanje" className="text-sm font-small text-gray-500 mb-1">
                            Iskanje po komitentu
                        </label>

                        <input
                            id="iskanje"
                            type="text"
                            placeholder="Išči po komitentu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>


                    {/* Limit */}
                    <div className="md:col-span-2 flex flex-col">
                        <label htmlFor="limit" className="text-sm font-small text-gray-500 mb-1">
                            Št. prikazov
                        </label>

                        <input
                            id="limit"
                            type="number"
                            placeholder="Prikazanih"
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setOffset(0);
                            }}
                            className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>


                    {/* CSV export */}
                    <div className="md:col-span-2 flex flex-col">
                        <label className="text-sm font-small text-gray-500 mb-1">
                            Izvoz komitentov
                        </label>

                        <div className="relative group">
                            <button
                                className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white w-full py-2 flex items-center justify-center transition"
                                onClick={exportCsv}
                            >
                                <i className="bi bi-filetype-csv"></i>
                            </button>

                            <span
                                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                    rounded-lg bg-black px-2 py-1 text-xs text-white
                    opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                Izvoz vseh komitentov
                            </span>
                        </div>
                    </div>


                    {/* Refresh */}
                    <div className="md:col-span-2 flex flex-col">
                        <label className="text-sm font-small text-gray-500 mb-1">
                            Osveži
                        </label>

                        <button
                            className="bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg py-2 flex items-center justify-center transition"
                            onClick={() => {
                                setMessage("");
                                loadClients();
                            }}
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>


                    {/* Add client */}
                    <div className="md:col-span-2 flex flex-col">
                        <label className="text-sm font-small text-gray-500 mb-1">
                            Dodaj
                        </label>

                        <button
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 flex items-center justify-center transition"
                            onClick={() => {
                                setAddModal(true);
                            }}
                        >
                            <i className="bi bi-person-add"></i>
                        </button>
                    </div>

                </div>
            </div>

            {/* Client table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#242996] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Naziv</th>
                            <th className="p-3">Pravni naziv</th>
                            <th className="p-3">Dodatni naziv</th>
                            <th className="p-3">Naslov</th>
                            <th className="p-3">Davcna St</th>
                            <th className="p-3">Akcije</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.filter(
                            (item) =>
                                (item.naziv ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.pravni_naziv ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.dodatni_naziv ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.ulica ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.mesto ?? "").toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((client) => (
                            <tr key={client.id} className="hover:bg-gray-100 transition">
                                <td className="p-3">{client.id}</td>
                                <td className="p-3">{client.naziv}</td>
                                <td className="p-3">{client.pravni_naziv ? client.pravni_naziv : '-'}</td>
                                <td className="p-3">{client.dodatni_naziv ? client.dodatni_naziv : '-'}</td>
                                <td className="p-3">{client.ulica}, {client.mesto}</td>
                                <td className="p-3">{client.davcna_st}</td>
                                <td className="p-3">
                                    <button
                                        className="bg-white border border-[#242996] text-[#242996] hover:bg-[#242996] hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        onClick={() => {
                                            navigate("/clients/" + client.id)
                                        }}
                                    >
                                        <i className="bi bi-pencil"></i>
                                        Uredi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Page shift bar */}
            <div className="flex items-center justify-center gap-2 my-4">
                <button
                    disabled={offset === 0}
                    className="px-3 py-1 border bg-white rounded-md hover:bg-gray-200 disabled:opacity-50"
                    onClick={() => {
                        setOffset(prev => Math.max(0, prev - limit))
                    }}
                >
                    ← Previous
                </button>

                <span className="px-4 py-1 border bg-white rounded-md bg-gray-50 font-medium">
                    {offset / limit + 1}
                </span>

                <button
                    className="px-3 py-1 border bg-white rounded-md hover:bg-gray-200 disabled:opacity-50"
                    onClick={() => {
                        setOffset(prev => prev + limit);
                    }}
                >
                    Next →
                </button>
            </div>

            <Modal
                openModal={addModal}
                setOpenModal={setAddModal}
                Form={ClientForm}
                size={"small"}
                loadClients={loadClients}
                setModal={setAddModal}
            />
        </>
    );
}

export default ClientTable;