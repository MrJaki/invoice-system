import { useEffect, useState } from "react";
import Message from "../components/Message";
import axios from 'axios';
import Modal from '../components/ModalWindow';
import AddTaxStatement from "../components/AddTaxStatement";

// Custom statemetn type
type statement_type = {
    id: number;
    tarifa: string;
    opis_davka: string;
    tip_davka: string;
    stopnja: number;
    opis: string;
}

function TaxPage() {

    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [statements, setStatements] = useState<statement_type[]>([]);

    // Constants for managing filtering 
    const [searchTerm, setSearchTerm] = useState("");
    const [filterVisible, setFilterVisible] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    const [openModal, setOpenModal] = useState(false);

    const loadStataments = async () => {
        try {
            const bill = await axios.get(
                `${API_URL}/tax`,
            );
            const data = Array.isArray(bill.data.data)
                ? bill.data.data
                : [bill.data.data];

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
                "Prišlo je do napake pri nalaganju računa!"
            );
        }
    }

    useEffect(() => {
        loadStataments();
    }, [])

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Davki
            </p>

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

                <div className={`grid grid-cols-1 md:grid-cols-10 gap-3 mt-4 ${filterVisible ? '' : 'hidden'}`}>
                    {/* Search filter */}
                    <input
                        id="iskanje"
                        type="text"
                        placeholder="Išči..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className=" md:col-span-8 border border-gray-300 rounded px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500  outline-none "
                    />

                    {/* Refresh button */}
                    <button
                        className=" md:col-span-1 bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                        onClick={() => {
                            setMessage("");
                            loadStataments();
                        }}
                        >
                        <i className="bi bi-arrow-clockwise text-lg"></i>
                    </button>

                    <button
                        className=" md:col-span-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                        onClick={() => {
                            setMessage("");
                            setOpenModal(true);
                        }}
                        >
                        <i className="bi bi-file-earmark-plus"></i>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg mt-6">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#242996] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Tarifa</th>
                            <th className="p-3">Opis Davka</th>
                            <th className="p-3">Tip Davka</th>
                            <th className="p-3">Stopnja</th>
                            <th className="p-3">Opis</th>
                            <th className="p-3">Akcije</th>
                        </tr>
                    </thead>

                    <tbody>
                        {statements.filter(
                            (item) =>
                                (item.tarifa ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.opis_davka ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.tip_davka ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (String(item.stopnja) ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.opis ?? "").toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((statement) => (
                            <tr
                                key={statement.id}
                                className="hover:bg-gray-100 transition"
                            >
                                <td className="p-3">{statement.id}</td>
                                <td className="p-3 font-medium text-gray-800">
                                    {statement.tarifa}
                                </td>
                                <td className="p-3">{statement.opis_davka}</td>
                                <td className="p-3">{statement.tip_davka}</td>
                                <td className="p-3">{statement.stopnja}</td>
                                <td className="p-3">{statement.opis}</td>
                                <td className="p-3 flex gap-4 ">
                                    <button
                                        className="bg-white border border-[#242996] text-[#242996] hover:bg-[#242996] hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        // onClick={() => {
                                        //     setChosenBill?.(bill.id);
                                        //     setPage?.("edit");  
                                        //     navigate("/edit")
                                        // }}
                                    >
                                        <i className="bi bi-pencil"></i>
                                        Uredi
                                    </button>

                                    <button
                                        className="bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        // onClick={() => {
                                        //     setChosenBill?.(bill.id);
                                        //     setPage?.("edit");  
                                        //     navigate("/edit")
                                        // }}
                                    >
                                        <i className="bi bi-trash"></i>
                                        Briši
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal 
                openModal={openModal}
                setOpenModal={setOpenModal}
                Form={AddTaxStatement}
                refresh={loadStataments}
                modal={setOpenModal}
            />

        </div>
    );
}

export default TaxPage;