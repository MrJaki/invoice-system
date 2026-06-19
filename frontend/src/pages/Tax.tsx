import { useEffect, useState } from "react";
import Message from "../components/Message";
import api from '../lib/api'
import Modal from '../components/ModalWindow';
import AddTaxStatement from "../components/TaxStatementAdd";
import EditTaxStatement from "../components/TaxStatementEdit";
import TaxStatementDelete from "../components/TaxStatementDelete";

// Custom statemetn type
type statement_type = {
    id: number;
    sifra: string;
    tarifa: string;
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

    // Constants to manage modals
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Saved id for deleting statement
    const [deleteId, setDeleteId] = useState(0);

    const [chosenStatement, setChosenStatement] = useState({
        id: 0,
        tarifa: "",
        sifra: "",
        tip_davka: "",
        stopnja: 0,
        opis: "",
    })


    const loadStataments = async () => {
        try {
            const bill = await api.get(
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

    const exportCsv = async () => {
        try {
            const response = await api.post(
                `${API_URL}/tax/csv`,
                {},
                {
                    responseType: 'blob',
                }
            );

            const csvBlob = new Blob(
                ['\uFEFF', response.data],
                { type: 'text/csv;charset=utf-8;' }
            );

            const url = window.URL.createObjectURL(csvBlob);

            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.download = `vrste-izjav.csv`;

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
                        <button
                            className="bi bi-arrow-down-up ml-5 cursor-pointer"
                            onClick={() => setFilterVisible(!filterVisible)}
                        />
                    </h3>
                </div>


                <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 ${filterVisible ? '' : 'hidden'} text-left`}>

                    {/* Search */}
                    <div className="md:col-span-9 flex flex-col">
                        <label htmlFor="iskanje" className="text-sm font-small text-gray-500 mb-1">
                            Iskanje
                        </label>

                        <input
                            id="iskanje"
                            type="text"
                            placeholder="Išči..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>


                    {/* CSV */}
                    <div className="md:col-span-1 flex flex-col">
                        <label className="text-sm font-small text-gray-500 mb-1">
                            Izvoz izjav
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
                                Izvoz vseh vrst izjav
                            </span>
                        </div>
                    </div>


                    {/* Refresh */}
                    <div className="md:col-span-1 flex flex-col">
                        <label className="text-sm font-small text-gray-500 mb-1">
                            Osveži
                        </label>

                        <button
                            className="bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg py-2 flex items-center justify-center transition"
                            onClick={() => {
                                setMessage("");
                                loadStataments();
                            }}
                        >
                            <i className="bi bi-arrow-clockwise "></i>
                        </button>
                    </div>


                    {/* Add statement */}
                    <div className="md:col-span-1 flex flex-col">
                        <label className="text-sm font-small text-gray-500 mb-1">
                            Dodaj
                        </label>

                        <button
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 flex items-center justify-center transition"
                            onClick={() => {
                                setMessage("");
                                setOpenModal(true);
                            }}
                        >
                            <i className="bi bi-file-earmark-plus"></i>
                        </button>
                    </div>

                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg mt-6">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#242996] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Šifra</th>
                            <th className="p-3">Tarifa</th>
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
                                (item.sifra ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.tip_davka ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (String(item.stopnja) ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (item.opis ?? "").toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((statement) => (
                            <tr
                                key={statement.id}
                                className="hover:bg-gray-100 transition"
                            >
                                <td className="p-3">{statement.id}</td>
                                <td className="p-3">{statement.sifra}</td>
                                <td className="p-3 font-medium text-gray-800">
                                    {statement.tarifa}
                                </td>
                                <td className="p-3">{statement.tip_davka}</td>
                                <td className="p-3">{statement.stopnja}</td>
                                <td className="p-3">{statement.opis}</td>
                                <td className="p-3 flex gap-4 ">
                                    <button
                                        className="bg-white border border-[#242996] text-[#242996] hover:bg-[#242996] hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        onClick={() => {
                                            setChosenStatement(statement);
                                            setOpenEditModal(true);
                                        }}
                                    >
                                        <i className="bi bi-pencil"></i>
                                        Uredi
                                    </button>

                                    <button
                                        className="bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        onClick={() => {
                                            setOpenDeleteModal(true);
                                            setDeleteId(statement.id);
                                        }}
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

            {/* Add tax statement modal */}
            <Modal
                openModal={openModal}
                setOpenModal={setOpenModal}
                Form={AddTaxStatement}
                refresh={loadStataments}
                modal={setOpenModal}
            />

            {/* Edit tax statement modal */}
            <Modal
                openModal={openEditModal}
                setOpenModal={setOpenEditModal}
                Form={EditTaxStatement}
                statements={chosenStatement}
                setStatements={setChosenStatement}
                refresh={loadStataments}
                modal={setOpenEditModal}
            />

            {/* Delete tax stateent modal */}
            <TaxStatementDelete
                openModal={openDeleteModal}
                setOpenModal={setOpenDeleteModal}
                refresh={loadStataments}
                statementId={deleteId}
            />

        </div>
    );
}

export default TaxPage;