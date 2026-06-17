import { useEffect, useState } from "react";
import axios from 'axios';
import BillsTable from '../components/BillTable'
import BillLinesTable from '../components/BillLinesTable'
import Message from "../components/Message";
import Modal from '../components/ModalWindow';
import AddBillLine from '../components/BillLineAdd';
import DeleteBill from '../components/BillDelete';
import { useNavigate } from "react-router-dom";

// Custom bill type
type Bill = {
    id: number;
    id_komitenta: number;
    naziv_komitenta: string;
    znesek: number;
    datum_izstavitve: string;
    datum_valute: string;
    datum_plačila: string;
    stevilka_racuna: number;
    pravni_naziv_komitenta: string;
    ulica: string;
    mesto: string;
    dodatni_naziv: string;
}

type bills = {
    chosenBill: number;
    setChosenBill: (value: number) => void;
}

function EditPage({ chosenBill, setChosenBill }: bills) {
    // Chosen bill ID
    const [chosenNumber, setChosenNumber] = useState(0);

    const [bill, setBill] = useState<Bill | null>(null);

    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [linesRefresh, setLinesRefresh] = useState(0);
    const refreshLines = () => {
        setLinesRefresh(prev => prev + 1);
    };

    // Date constants
    const [dateOut, setDateOut] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [dateValue, setDateValue] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [datePayment, setDatePayment] = useState(
        new Date().toISOString().split("T")[0]
    );

    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    /**
     * Formating date into local version
     * @param dateString 
     * @returns 
     */
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";

        const d = new Date(dateString);

        return [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(d.getDate()).padStart(2, "0")
        ].join("-");
    };

    /**
     * Loading chosen bill data
     * @returns 
     */
    const loadChosenBill = async () => {
        if (chosenBill == 0) return;
        try {
            const response = await axios.get(
                `${API_URL}/bills/${chosenBill}`,
            );

            const data = response.data.data;

            setBill(response.data.data);

            setDateOut(formatDate(data?.datum_izstavitve));
            setDateValue(formatDate(data?.datum_valute));
            setDatePayment(formatDate(data?.datum_plačila));

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju izbranega računa!"
            );
        }
    }

    /**
     * Updating bill
     * @param e 
     */
    const updateBill = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await axios.patch(
                `${API_URL}/bills`,
                {
                    dateOut,
                    dateValue,
                    datePayment,
                    id: chosenBill
                }
            );

            setIsVisible(false);
            setIsError(false);
            setMessage("");

            setTimeout(() => { navigate("/bills"), 500 })
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju računa!"
            );
        }
    }

    /**
     * Updating total bill amount
     * @param amount 
     */
    const updateAmount = async (amount: number) => {
        try {
            await axios.patch(
                `${API_URL}/bills/amount`,
                {
                    amount,
                    id: chosenBill
                }
            );

            loadChosenBill();

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
        loadChosenBill();
    }, [chosenBill])

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Uredi plačilo
            </p>

            {/* If bill is not chosen / set to zero we show table of bills */}
            {/* If bill is chosen / not zero we show bills data */}
            {
                chosenBill == 0 ? (
                    <>
                        {/* Input for manualy inserting bill ID */}
                        <div className="mt-6 mb-6 bg-white shadow rounded-lg p-5 md:w-2/4">
                            <div className="flex items-center justify-between">
                                <h3 className="text font-semibold text-gray-800">
                                    Vnesite ID računa
                                </h3>

                            </div>

                            {/* Bill ID input */}
                            <div className="grid md:grid-cols-6 gap-3 mt-4 mb-2">
                                <input
                                    id="iskanje"
                                    type="number"
                                    value={chosenNumber}
                                    onChange={(e) => setChosenNumber(Number(e.target.value))}
                                    className=" md:col-span-5 border border-gray-300 rounded px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500  outline-none "
                                />
                                <button
                                    className=" md:col-span-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                                    onClick={() => {
                                        setChosenBill(chosenNumber)
                                    }}
                                >
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                            <p className="text-left text-sm">
                                Če številke računa ne veste na pamet ga lahko izberete iz tabele spodaj.
                            </p>
                        </div>

                        {/* Bills table */}
                        <BillsTable
                            setChosenBill={setChosenBill}
                        />
                    </>
                ) :
                    (
                        <>
                            <div className="mt-6 mb-6 bg-white shadow rounded-xl p-6 w-full grid md:grid-cols-6 gap-8 text-left">

                                {/* LEFT: Bill form */}
                                <div className="md:col-span-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                        Podatki računa
                                    </h3>

                                    <form onSubmit={updateBill} className="space-y-5">

                                        {/* Date out input */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                                Datum izpisa
                                            </label>
                                            <input
                                                required
                                                id="date_out"
                                                type="date"
                                                value={dateOut}
                                                onChange={(e) => {
                                                    setDateOut(e.target.value);
                                                }}
                                                className="w-full border border-gray-400 rounded-lg px-3 py-2
                                            outline-none bg-gray-50"
                                            />
                                        </div>

                                        {/* Date value input */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                                Datum valute
                                            </label>
                                            <input
                                                required
                                                id="date_value"
                                                type="date"
                                                value={dateValue}
                                                onChange={(e) => {
                                                    setDateValue(e.target.value);
                                                }}
                                                className="w-full border border-gray-400 rounded-lg px-3 py-2
                                            outline-none bg-gray-50"
                                            />
                                        </div>

                                        {/* Date paid input */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                                Datum plačila
                                            </label>
                                            <input
                                                id="date_payment"
                                                type="date"
                                                value={datePayment}
                                                onChange={(e) => {
                                                    setDatePayment(e.target.value);
                                                }}
                                                className="w-full border border-gray-400 rounded-lg px-3 py-2
                                            outline-none bg-gray-50"
                                            />
                                        </div>

                                        {/* Total bill amount info */}
                                        <label className="block text-xs font-medium text-gray-500 mb-1 cols">
                                            Znesek
                                        </label>

                                        <div className="grid md:grid-cols-2 gap-4">

                                            <input
                                                type="text"
                                                value={bill?.znesek + ' €'}
                                                readOnly
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 col-span-1"
                                            />
                                            <button
                                                type="submit"
                                                className="col-span-1 inline-flex items-center gap-2 rounded-lg border-2 text-blue-600 hover:text-white border-blue-500 hover:bg-blue-500 px-3 py-2 font-medium text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                <i className="bi bi-floppy"></i>
                                                Shrani spremembe
                                            </button>
                                        </div>

                                    </form>
                                </div>

                                {/* RIGHT: Customer info */}
                                <div className="md:col-span-3 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                        Podatki o komitantu
                                    </h3>

                                    <Message error={isError} visible={isVisible}>{message}</Message>

                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                                        <div>
                                            <p className="text-xs text-gray-500">Naziv</p>
                                            <p className="text-gray-800 font-medium">
                                                {bill?.naziv_komitenta || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">Pravni naziv</p>
                                            <p className="text-gray-800">
                                                {bill?.pravni_naziv_komitenta || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">Dodatni naziv</p>
                                            <p className="text-gray-800">
                                                {bill?.dodatni_naziv || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">Naslov</p>
                                            <p className="text-gray-800">
                                                {bill?.ulica || "-"}, {bill?.mesto || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => setOpenModal(true)}
                                            className="col-span-1 inline-flex items-center gap-2 rounded-lg border-2 text-green-700 hover:text-white border-green-700 hover:bg-green-700 px-3 py-2 font-medium text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                                        >
                                            <i className="bi bi-file-earmark-plus"></i>
                                            Dodaj vrstico računa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOpenDelete(true)}
                                            className="col-span-1 inline-flex items-center gap-2 rounded-lg border-2 text-red-600 hover:text-white border-red-500 hover:bg-red-500 px-3 py-2 font-medium text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <i className="bi bi-trash"></i>
                                            Briši račun
                                        </button>
                                    </div>
                                </div>

                            </div>
                            
                            {/* Bill lines table */}
                            <BillLinesTable
                                chosenID={chosenBill}
                                updateAmount={updateAmount}
                                currentAmount={bill?.znesek ?? null}
                                refreshLines={linesRefresh}
                            />

                            {/* Add bill line modal */}
                            <Modal 
                                openModal={openModal}
                                setOpenModal={setOpenModal}
                                Form={AddBillLine}
                                billId={chosenBill}
                                refreshAmount={loadChosenBill}
                                refreshLines={refreshLines}
                            />

                            {/* Delete bill modal */}
                            <DeleteBill 
                                openModal={openDelete}
                                setOpenModal={setOpenDelete}
                                billId={chosenBill}
                            />
                        </>
                    )
            }


        </div>
    );
}

export default EditPage;