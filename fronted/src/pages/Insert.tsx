import { useEffect, useState } from "react";
import axios from 'axios';
import Message from "../components/Message";
import ClientTable from '../components/ClientsTableChoose'
import BillLinesAdd from '../components/BillLineAdd'
import { useNavigate } from "react-router-dom";

function EditPage() {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Bill lines add form number array
    const [billLines, setBillLines] = useState([0]);

    const API_URL = import.meta.env.VITE_API_URL;

    // Constants used to show steps to creating bill
    const [stepOne, setStepOne] = useState(true);
    const [stepTwo, setStepTwo] = useState(false);
    const [stepThree, setStepThree] = useState(false);

    // Client data
    const [clientId, setClientId] = useState(0);
    const [billSaved, setBillSaved] = useState(false);

    // Bill data
    const [billNum, setBillNum] = useState("");
    const [billId, setBillId] = useState(0);

    const navigate = useNavigate();

    // Date constants
    const [dateOut, setDateOut] = useState(
        new Date(new Date()).toISOString().split("T")[0]
    );
    const [dateValue, setDateValue] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d.toISOString().split("T")[0];
    });
    const [datePayment, setDatePayment] = useState("");

    /**
     * Getting next bill number 
     * @param date 
     */
    const getNextBillNum = async (date: Date) => {
        try {
            const newBill = await axios.get(
                `${API_URL}/bills/get_next_bill_num`,
                {
                    params: {
                        date: date.getFullYear(),
                    }
                }
            )

            setBillNum(newBill.data.data);
            setIsVisible(false);
            setIsError(false);
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri pridobivanju nove številke računa!"
            );
        }
    }

    /**
     * Saving new bill
     * @param e 
     */
    const saveNewBill = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const newBill = await axios.post(
                `${API_URL}/bills`,
                {
                    id_client: clientId,
                    dateOut: dateOut,
                    dateValue: dateValue,
                    datePayment: datePayment,
                    bill_num: billNum,
                }
            )

            const success = newBill.data.success;

            if (success === true) {
                setBillSaved(true);
                setStepThree(true);
                setStepTwo(false);
                setBillId(newBill.data.data.id)
            } else {
                setIsVisible(true);
                setIsError(true);
                setMessage(
                    "Prišlo je do napake pri dodajanju računa! Prosim poskusite kasneje!"
                );
            }
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri dodajanju računa!"
            );
        }
    }

    /**
     * Creating new container for bill lines
     */
    const addBillLine = () => {
        setBillLines(prev => [...prev, prev.length]);
    };

    useEffect(() => {
        getNextBillNum(new Date(dateOut));
    }, [dateOut]);

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Vnos novega računa
            </p>

            <Message error={isError} visible={isVisible}>{message}</Message>

            {/* Step one */}
            <div className="mt-10 mb-4 bg-white shadow rounded-lg p-5 w-full">
                <p className="text-lg font-bold text-gray-800 mb-6 text-left">
                    Korak 1: Izberite komitenta iz spodnje tabele
                    <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setStepOne(!stepOne)}></button>
                </p>
                <div className={`${stepOne && !billSaved ? "" : "hidden"}`}>
                    {/* Clients table */}
                    <ClientTable
                        setClientId={setClientId}
                        clientId={clientId}
                        setStepOne={setStepOne}
                        setStepTwo={setStepTwo}
                    />
                </div>
            </div>

            {/* Step two */}
            <div className="mb-4 bg-white shadow rounded-lg p-5 w-full">
                <p className="text-lg font-bold text-gray-800 mb-6 text-left">
                    Korak 2: Vnesite podatke računa
                    <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setStepTwo(!stepTwo)}></button>
                </p>

                {/* Form for adding data for new bill */}
                <form onSubmit={saveNewBill} className={`grid md:grid-cols-38 gap-4 items-end mt-6 ${stepTwo && clientId != 0 && !billSaved ? "" : "hidden"}`}>

                    {/* Bill number input */}
                    <label className="block font-medium text-gray-800 mb-1 text-end self-center md:col-span-3">
                        Št. Računa
                    </label>
                    <input
                        required
                        name='bill_num'
                        type="text"
                        value={billNum}
                        onChange={(e) => setBillNum(e.target.value)}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50 md:col-span-4"
                    />

                    {/* Date out input */}
                    <label className="block font-medium text-gray-800 mb-1 text-end self-center md:col-span-4">
                        Datum izpisa:
                    </label>
                    <input
                        required
                        id="date_out"
                        type="date"
                        value={dateOut}
                        onChange={(e) => {
                            setDateOut(e.target.value);
                            getNextBillNum(new Date(e.target.value));
                        }}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none bg-gray-50 md:col-span-5"
                    />

                    {/* Date value input */}
                    <label className="block font-medium text-gray-800 mb-1 text-end self-center md:col-span-4">
                        Datum valute:
                    </label>
                    <input
                        required
                        id="date_value"
                        type="date"
                        value={dateValue}
                        onChange={(e) => {
                            setDateValue(e.target.value);
                        }}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2  outline-none bg-gray-50 md:col-span-5"
                    />

                    {/* Date payment input */}
                    <label className="block font-medium text-gray-800 mb-1 text-end self-center md:col-span-4">
                        Datum plačila:
                    </label>
                    <input
                        id="date_payment"
                        type="date"
                        value={datePayment}
                        onChange={(e) => {
                            setDatePayment(e.target.value);
                        }}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none bg-gray-50 md:col-span-5"
                    />

                    <button
                        type="submit"
                        className="md:col-span-4 inline-flex items-center gap-2 rounded-lg border-2 text-blue-600 hover:text-white border-blue-500 hover:bg-blue-500 px-3 py-2 font-medium text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <i className="bi bi-floppy"></i>
                        Shrani
                    </button>

                </form>
            </div>

            {/* Step three */}
            <div className="mb-4 bg-white shadow rounded-lg p-5 w-full">
                <p className="text-lg font-bold text-gray-800 mb-6 text-left">
                    Korak 3: Dodajte ter vnesite vrtsice računa
                    <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setStepThree(!stepThree)}></button>
                </p>
                <div className={`${stepThree && billSaved && billId != 0 ? "space-y-4" : "hidden"} mt-5`}>
                    
                    {/* Displaying all bill lines add forms */}
                    <div className="space-y-4">
                        {billLines.map((id, index) => (
                            <div
                                key={id}
                                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                            >
                                <BillLinesAdd index={index} 
                                    billId={billId}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-start">
                        {/* Adding new container bill line */}
                        <button
                            onClick={addBillLine}
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-green-700
                                    text-green-700 hover:bg-green-700 hover:text-white
                                    px-5 py-2 font-medium text-sm transition shadow-sm"
                        >
                            <i className="bi bi-plus-circle"></i>
                            Dodaj vrstico
                        </button>

                        {/* Closing insert page */}
                        <button
                            onClick={() =>
                                navigate("/bills")
                            }
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-red-700
                                    text-red-700 hover:bg-red-700 hover:text-white
                                    px-5 py-2 font-medium text-sm transition shadow-sm ml-3"
                        >
                            <i className="bi bi-x-circle"></i>
                            Končaj in zapri
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default EditPage;