import { useEffect, useState } from "react";
import axios from 'axios';
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";
import Modal from '../components/ModalWindow';
import BillLinesForm from '../components/BillLinesForm'
// import { exit } from "process";

type Bill = {
    id: number;
    id_racuna: number;
    kolicina: number;
    tip_kolicine: string;
    opis: string;
    cena: number;
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

function BillsPage({chosenID}: {chosenID: number}) {
    const [bills, setBills] = useState<Bill[]>([]);
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

    const [openEditLineModal, setOpenEditLineModal] = useState(false);


    const navigate = useNavigate();

    const API_URL = 'http://localhost:3002/api';

    const loadBills = async () => {
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

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage("Napaka pri nalaganju vrstic računa!");
        }
    }

    useEffect(() => {
        loadBills();
    }, [])

    return (
        <>
            <h2 className="text-left font-bold  mb-5"> Vrstice Računa </h2>

            <Message $error={isError} $visible={isVisible}>{message}</Message>

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

            <Modal 
                openModal={openEditLineModal}
                setOpenModal={setOpenEditLineModal}
                Form={BillLinesForm}
                Data={billLineData}
                setData={setBillLineData}
            />
        </>
    );
}

export default BillsPage;