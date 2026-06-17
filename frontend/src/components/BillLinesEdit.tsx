import axios from 'axios';
import { useState } from "react";
import Message from "./Message";

function BillLineForm({ Data, setData, refreshBillLines, modal }: any) {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    /**
     * Updating bill line
     * @param e 
     */
    const updateBillLine = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await axios.patch(
                `${API_URL}/bill_lines/${Data.id}`,
                {
                    quantity: Data.kolicina,
                    quantity_type: Data.tip_kolicine,
                    desc: Data.opis,
                    price: Data.cena,
                }
            );

            setIsVisible(false);
            setIsError(false);
            setMessage("");

            // Refreshing  bill lines table
            refreshBillLines();

            // Closing modal
            modal(false)
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju vrstice računa!"
            );
        }
    }

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setData({ ...Data, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Message error={isError} visible={isVisible}>{message}</Message>
        
            {/* Form for editing bill lines */}
            <form onSubmit={updateBillLine} className="grid md:grid-cols-16 gap-4 items-end">

                {/* Quantity input */}
                <div className="md:col-span-2 ">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Količina
                    </label>
                    <input
                        required
                        name='kolicina'
                        type="number"
                        value={Data?.kolicina}
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
                        name='tip_kolicine'
                        type="text"
                        value={Data?.tip_kolicine}
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
                        name='opis'
                        type="text"
                        value={Data?.opis}
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
                        name='cena'
                        type="number"
                        value={Data?.cena}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

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

            </form>
        </>
    );
}

export default BillLineForm;