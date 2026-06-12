import { useEffect, useState } from "react";
import axios from 'axios';
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


    const API_URL = 'http://localhost:3002/api';

    /**
     * Loading all clients
     */
    const loadClients = async () => {
        try {
            const client = await axios.get(
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
                        <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setFilterVisible(!filterVisible)}>
                        </button>
                        
                    </h3>
                    
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 mt-4 ${filterVisible ? '' : 'hidden'}`}>
                    {/* Search filter */}
                    <input
                        id="iskanje"
                        type="text"
                        placeholder="Išči po komitentu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className=" md:col-span-8 border border-gray-300 rounded px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500  outline-none "
                    />

                    {/* Limit */}
                    <label className="md:col-span-1 md:text-right self-center">St. prikazov: </label>

                    <input
                        id="limit"
                        type="number"
                        placeholder="Prikazanih"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setOffset(0);
                        }}
                        className="  md:col-span-1  border border-gray-300   rounded  px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500 outline-none "
                    />

                    {/* Refresh button */}
                    <button
                        className=" md:col-span-1 bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                        onClick={() => {
                            setMessage("");
                            loadClients();
                        }}
                        >
                        <i className="bi bi-arrow-clockwise text-lg"></i>
                    </button>

                    {/* Add client */}
                    <button
                        className=" md:col-span-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                        onClick={() => {
                            setAddModal(true);
                        }}
                        >
                        <i className="bi bi-person-add"></i>
                    </button>
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