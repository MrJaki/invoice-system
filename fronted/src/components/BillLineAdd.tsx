import axios from 'axios';
import { useState } from "react";
import Message from "./Message";

type BillLinesFormProps = {
    index: number;
    billId: number;
    refreshAmount?: any;
    refreshLines?: any
};

function AddBillLine({ billId, refreshAmount, refreshLines }: BillLinesFormProps) {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Constant for tracking if adding new bill line was succesfull
    const [success, setSuccess] = useState(false);

    const [billLine, setBillLine] = useState({
        quantity: 0,
        quantity_type: "",
        desc: "",
        price: 0,
    })

    const API_URL = import.meta.env.VITE_API_URL;

    // Adding new bill line
    const addBillLine = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (billId == 0 || !billId) return;
        try {
            // Adding bill line
            const newLine = await axios.post(
                `${API_URL}/bill_lines`,
                {
                    quantity: billLine.quantity,
                    quantity_type: billLine.quantity_type,
                    desc: billLine.desc,
                    price: billLine.price,
                    id_bill: billId,
                }
            );

            // Hiding any error messages
            setIsVisible(false);
            setIsError(false);
            setMessage("");

            const success = newLine.data.success;

            // Checking if bill linewas created
            if (success) {
                setSuccess(true);
            } else {
                setIsVisible(true);
                setIsError(true);
                setMessage(
                    "Prišlo je do napake pri dodajanju vrstice računa!"
                );
            }

            // Getting bill by id so we can update amount
            const bill = await axios.get(
                `${API_URL}/bills/${billId}`
            );

            // Getting tarif amount
            const tarif = await axios.get(
                `${API_URL}/bill_lines/tax`,
                {
                    params: {id_bill: billId},
                }
            );

            const taxRate = Number(tarif.data.data.stopnja); // npr. 20, 8.5, 22

            const currentAmount = Number(bill.data.data.znesek);

            const lineNet = billLine.quantity * billLine.price;
            const lineVat = lineNet * (taxRate / 100);
            const lineGross = lineNet + lineVat;

            const newAmount = currentAmount + lineGross;

            // Updating total bill amoutn
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

    /**
     * Updating total bill amount
     * @param amount 
     * @returns 
     */
    const updateBillAmount = async (amount: number) => {
        if (billId == 0 || !billId) return;
        try {
            await axios.patch(
                `${API_URL}/bills/amount`,
                {
                    amount: amount,
                    id: billId
                }
            );

            setIsVisible(false);
            setIsError(false);
            setMessage("");

            if (refreshAmount) {
                refreshAmount();
                refreshLines();
            }

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

    // Handling any change that is made in form and saving them in billLine 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        setBillLine(prev => ({...prev, [name]: type === "number" ? Number(value) : value }));
    };


    return (
        <>
            <Message error={isError} visible={isVisible}>{message}</Message>

            {/* Form for adding new ill line */}
            <form onSubmit={addBillLine} className="grid md:grid-cols-16 gap-4 items-end">

                {/* Quantity input */}
                <div className="md:col-span-2 ">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Količina
                    </label>
                    <input
                        required
                        name='quantity'
                        type="number"
                        value={billLine.quantity}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Quantity type input */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tip Količine
                    </label>
                    <input
                        name='quantity_type'
                        type="text"
                        value={billLine.quantity_type}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Description input */}
                <div className="md:col-span-8">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Opis
                    </label>
                    <input
                        name='desc'
                        type="text"
                        value={billLine.desc}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Price input */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Cena
                    </label>
                    <input
                        required
                        name='price'
                        type="number"
                        value={billLine.price}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* If we already added new bill line p will be shown if not button for adding will be shown */}
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

export default AddBillLine;