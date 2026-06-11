import axios from 'axios';
import { useState } from "react";
import styled from 'styled-components';

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

type BillLinesFormProps = {
    index: number;
    billIds: number;
};

function ModalEditTask({ index, billIds }: BillLinesFormProps) {
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [success, setSuccess] = useState(false);

    const [billLine, setBillLine] = useState({
        kolicina: 0,
        tip_kolicine: "",
        opis: "",
        cena: 0,
    })

    const API_URL = 'http://localhost:3002/api';

    const updateBillLine = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (billIds == 0 || !billIds) return;
        try {
            const newLine = await axios.post(
                `${API_URL}/bill_lines`,
                {
                    quantity: billLine.kolicina,
                    quantity_type: billLine.tip_kolicine,
                    desc: billLine.opis,
                    price: billLine.cena,
                    id_bill: billIds,
                }
            );

            setIsVisible(false);
            setIsError(false);
            setMessage("");

            const success = newLine.data.success;

            if (success) {
                setSuccess(true);
            } else {
                setIsVisible(true);
                setIsError(true);
                setMessage(
                    "Prišlo je do napake pri dodajanju vrstice računa!"
                );
            }

            const bill = await axios.get(
                `${API_URL}/bills/selected_id`,
                {
                    params: {
                        id: billIds
                    }
                }
            );

            const currentAmount = Number(bill.data.data.znesek);
            const lineAmount = billLine.kolicina * billLine.cena;

            const newAmount = currentAmount + lineAmount;

            alert(newAmount);

            updateBillAmount(newAmount);

        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri dodajanju vrstice računa!"
            );
        }
    }

    const updateBillAmount = async (amount: number) => {
        if (billIds == 0 || !billIds) return;
        try {
            await axios.patch(
                `${API_URL}/bills/update_amount`,
                {
                    amount: amount,
                    id: billIds
                }
            );

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        setBillLine(prev => ({...prev, [name]: type === "number" ? Number(value) : value }));
    };


    return (
        <>
            <Message $error={isError} $visible={isVisible}>{message}</Message>

            <form onSubmit={updateBillLine} className="grid md:grid-cols-16 gap-4 items-end">

                <div className="md:col-span-2 ">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Količina
                    </label>
                    <input
                        required
                        name='kolicina'
                        type="number"
                        value={billLine.kolicina}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tip Količine
                    </label>
                    <input
                        required
                        name='tip_kolicine'
                        type="text"
                        value={billLine.tip_kolicine}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                <div className="md:col-span-8">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Opis
                    </label>
                    <input
                        name='opis'
                        type="text"
                        value={billLine.opis}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Cena
                    </label>
                    <input
                        required
                        name='cena'
                        type="number"
                        value={billLine.cena}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {success ? (
                    <p
                        className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg
                   border-2 bg-green-600 text-white
                   px-4 py-2 font-medium text-sm transition">

                        <i className="bi bi-check"></i>
                        Dodano
                    </p>

                ) : (

                    <button
                        type="submit"
                        className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg
                   border-2 border-blue-500 text-blue-600
                   hover:bg-blue-500 hover:text-white
                   px-4 py-2 font-medium text-sm transition"
                    >
                        <i className="bi bi-floppy"></i>
                        Shrani
                    </button>
                )}



            </form>
        </>
    );
}

export default ModalEditTask;