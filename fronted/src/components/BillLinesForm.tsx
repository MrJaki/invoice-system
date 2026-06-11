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

function ModalEditTask({ Data, setData, refreshBillLines, modal }: any) {
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const API_URL = 'http://localhost:3002/api';

    const updateBillLine = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await axios.patch(
                `${API_URL}/bill_lines`,
                {
                    kolicina: Data.kolicina,
                    tip_kolicine: Data.tip_kolicine,
                    opis: Data.opis,
                    cena: Data.cena,
                    id: Data.id,
                }
            );

            setIsVisible(false);
            setIsError(false);
            setMessage("");

            refreshBillLines();
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
            <Message $error={isError} $visible={isVisible}>{message}</Message>

            <form onSubmit={updateBillLine} className="grid md:grid-cols-16 gap-4 items-end">

                <div className="md:col-span-2 ">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Količina
                    </label>
                    <input
                        name='kolicina'
                        type="number"
                        value={Data.kolicina}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tip Količine
                    </label>
                    <input
                        name='tip_kolicine'
                        type="text"
                        value={Data.tip_kolicine}
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
                        value={Data.opis}
                        onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Cena
                    </label>
                    <input
                        name='cena'
                        type="number"
                        value={Data.cena}
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

export default ModalEditTask;