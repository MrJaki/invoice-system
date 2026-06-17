import axios from 'axios';
import { useEffect, useState } from "react";
import Message from "./Message";

function EditTaxStatement({refresh, modal, statements, setStatements }: any) {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const editTaxStatement = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await axios.patch(
                `${API_URL}/tax/${statements.id}`,
                {
                    tarif: statements.tarifa,
                    code: statements.sifra,
                    type: statements.tip_davka,
                    level: statements.stopnja,
                    longer_desc: statements.opis,
                }
            );

            setIsVisible(false);
            setIsError(false);
            setMessage("");

            // Refreshing  bill lines table
            refresh();

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
        setStatements({ ...statements, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Message error={isError} visible={isVisible}>{message}</Message>
        
            {/* Form for editing bill lines */}
            <form onSubmit={editTaxStatement} className="grid md:grid-cols-16 gap-4 items-end">

                {/* Tarif input*/}
                <div className="md:col-span-2 ">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tarifa
                    </label>
                    <input
                        required
                        name='tarifa'
                        type="text"
                        value={statements?.tarifa}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Desc input */}
                <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Šifra
                    </label>
                    <input
                        name='sifra'
                        type="text"
                        value={statements?.sifra}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Type input */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tip
                    </label>
                    <input
                        name='tip_davka'
                        type="text"
                        value={statements?.tip_davka}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Level input */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Stopnja
                    </label>
                    <input
                        required
                        name='stopnja'
                        type="number"
                        value={statements?.stopnja}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Longer desc input */}
                <div className="md:col-span-6">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Opis
                    </label>
                    <input
                        required
                        name='opis'
                        type="text"
                        value={statements?.opis}
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

export default EditTaxStatement;