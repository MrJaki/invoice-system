import { useEffect, useState } from "react";
import axios from 'axios';
import Modal from '../components/ModalWindow';
import BillLinesForm from '../components/BillLinesForm'
import Message from "./Message";

// Custom bill line type
type Bill = {
    id: number;
    id_racuna: number;
    kolicina: number;
    tip_kolicine: string;
    opis: string;
    cena: number;
}

function BillLinesTable({chosenID, updateAmount, currentAmount}: {chosenID: number, updateAmount: any, currentAmount: number | null}) {
    // Array for storing bill lines with custom type
    const [bills, setBills] = useState<Bill[]>([]);

    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [billLineData, setBillLineData] = useState({
        id: 0,
        id_racuna: 0,
        kolicina: 0,
        tip_kolicine: "",
        opis: "",
        cena: 0,
    })

    // Managing opening modal window
    const [openEditLineModal, setOpenEditLineModal] = useState(false);

    const API_URL = 'http://localhost:3002/api';

    // Loading bill lines
    const loadBillLines = async () => {
        try {
            const bill = await axios.get(
                `${API_URL}/bill_lines`,
                {
                    params: {
                        id: chosenID,
                    }
                }
            );

            const data = Array.isArray(bill.data.data)
                ? bill.data.data
                : [bill.data.data];

            setBills(data);

            var amount = 0;

            data.forEach((z: { cena: number; kolicina: number; }) => {
                amount += (z.cena * z.kolicina);
            });

            // If total amount doesn't match we update it
            if (currentAmount != amount)
                updateAmount(amount);

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju vrstic računa!"
            );
        }
    }

    useEffect(() => {
        loadBillLines();
    }, [])

    return (
        <>
            <h2 className="text-left font-bold  mb-5"> Vrstice Računa </h2>

            <Message error={isError} visible={isVisible}>{message}</Message>

            {/* Bill lines table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg mt-4">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#242996] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Količina</th>
                            <th className="p-3">Tip Količine</th>
                            <th className="p-3">Opis</th>
                            <th className="p-3">Cena</th>
                            <th className="p-3">Znesek</th>
                            <th className="p-3">Uredi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bills.map((bill) => (
                            <tr
                                key={bill.id}
                                className="hover:bg-gray-100 transition"
                            >
                                <td className="p-3">{bill.id}</td>
                                <td className="p-3">{bill.kolicina}</td>
                                <td className="p-3">{bill.tip_kolicine}</td>
                                <td className="p-3">{bill.opis}</td>
                                <td className="p-3">{bill.cena} €</td>
                                <td className="p-3">{bill.cena * bill.kolicina} €</td>
                                <td className="p-3">
                                    <button
                                        className="bg-white border border-[#242996] text-[#242996] hover:bg-[#242996] hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        onClick={() => {
                                            setOpenEditLineModal(true)
                                            setBillLineData(bill);
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
            
            {/* Modal for editing bill line */}
            <Modal 
                openModal={openEditLineModal}
                setOpenModal={setOpenEditLineModal}
                Form={BillLinesForm}
                Data={billLineData}
                setData={setBillLineData}
                refreshBillLines={loadBillLines}
                modal={setOpenEditLineModal}
            />
        </>
    );
}

export default BillLinesTable;