import { useEffect, useState } from "react";
import axios from 'axios';
import styled from 'styled-components'

type Client = {
    id: number;
    naziv: string;
    pravni_naziv: string;
    dodatni_naziv: string;
    ulica: string;
    mesto: string;
}

const Message = styled.p<{ $error: boolean, $visible: boolean }>`
    color: ${(props) => (props.$error ? "red" : "green")};
    border: 1px solid ${(props) => (props.$error ? "#dc2626" : "#16a34a")};
    background-color: ${(props) => (props.$error ? "#fef2f2" : "#f0fdf4")};
    display: ${(props) => (props.$visible ? 'block' : 'none')};
    padding: 12px;
    border-radius: 8px;
    margin-top: 12px;
    margin-bottom: 12px;
    margin-left: 12px;
    margin-right: 12px;
`;

function ClientTable({setClientId, clientId, setStepOne, setStepTwo}: {setClientId: (value: number) => void, clientId?: number, setStepOne: (value: boolean) => void, setStepTwo: (value: boolean) => void}) {
    const [clients, setClients] = useState<Client[]>([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const API_URL = 'http://localhost:3002/api';

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
            <Message $error={isError} $visible={isVisible}>{message}</Message>

            <div className="grid grid-cols-1 md:grid-cols-10 gap-3 mt-6 mb-4 ">

                <input
                        id="iskanje"
                        type="text"
                        placeholder="Išči po komitentu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className=" md:col-span-4 border border-gray-300 rounded px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500  outline-none "
                    />

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

                <button
                    className=" md:col-span-1 bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                    onClick={() => {
                        setMessage("");
                    }}
                >
                    <i className="bi bi-arrow-clockwise text-lg"></i>
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#242996] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Naziv</th>
                            <th className="p-3">Pravni naziv</th>
                            <th className="p-3">Dodatni naziv</th>
                            <th className="p-3">Naslov</th>
                            <th className="p-3">Izberi</th>
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
                                <td className="p-3">{client.pravni_naziv}</td>
                                <td className="p-3">{client.dodatni_naziv}</td>
                                <td className="p-3">{client.ulica}, {client.mesto}</td>
                                <td className="p-3">
                                    <button
                                        className="bg-white border border-[#242996] text-[#242996] hover:bg-[#242996] hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        onClick={() => {
                                            setClientId(client.id);
                                            setStepOne(false);
                                            setStepTwo(true);
                                        }}
                                    >
                                        <i className={`bi ${clientId == client.id ? "bi-bookmark-check" : "bi-bookmark"}`}></i>
                                        Izberi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ClientTable;