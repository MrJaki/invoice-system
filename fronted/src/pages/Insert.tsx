import { useEffect, useState } from "react";
import axios from 'axios';
import styled from "styled-components";
import ClientTable from '../components/ClientsTableChoose'


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

function EditPage() {
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const API_URL = 'http://localhost:3002/api';

    const [stepOne, setStepOne] = useState(true);
    const [stepTwo, setStepTwo] = useState(false);
    const [stepThree, setStepThree] = useState(false);

    const [clientId, setClientId] = useState(0);
    const [billSaved, setBillSaved] = useState(false);

    const saveNewBill = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await axios.post(
                `${API_URL}/bills`,
                {
                    
                }
            )
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

    useEffect(() => {
    }, [])

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Vnos novega računa
            </p>

            <Message $error={isError} $visible={isVisible}>{message}</Message>

            <div className="mt-10 mb-4 bg-white shadow rounded-lg p-5 w-full">
                <p className="text-lg font-bold text-gray-800 mb-6 text-left">
                    Korak 1: Izberite komitenta iz spodnje tabele
                    <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setStepOne(!stepOne)}></button>
                </p>
                <div className={`${stepOne ? "" : "hidden"}`}>
                    <ClientTable
                        setClientId={setClientId}
                        clientId={clientId}
                        setStepOne={setStepOne}
                        setStepTwo={setStepTwo}
                    />
                </div>
            </div>

            
            <div className="mb-4 bg-white shadow rounded-lg p-5 w-full">
                <p className="text-lg font-bold text-gray-800 mb-6 text-left">
                    Korak 2: Vnesite podatke računa
                    <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setStepTwo(!stepTwo)}></button>
                </p>


                <form className={`grid md:grid-cols-38 gap-4 items-end mt-6 ${stepTwo && clientId != 0 ? "" : "hidden"}`}>

                    <label className="block font-medium text-gray-800 mb-1 text-end self-center md:col-span-3">
                        Št. Računa
                    </label>
                    <input
                        name='cena'
                        type="text"
                        // value={Data.cena}
                        // onChange={handleChange}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50 md:col-span-4"
                    />

                    <label className="block font-medium text-gray-800 mb-1 text-end self-center md:col-span-4">
                        Datum izpisa:
                    </label>
                    <input
                        id="date_out"
                        type="date"
                        // value={dateOut}
                        // onChange={(e) => {
                        //     setDateOut(e.target.value);
                        // }}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none bg-gray-50 md:col-span-5"
                    />
                    <label className="block font-medium text-gray-800 mb-1 text-end self-center md:col-span-4">
                        Datum valute:
                    </label>
                    <input
                        id="date_value"
                        type="date"
                        // value={dateValue}
                        // onChange={(e) => {
                        //     setDateValue(e.target.value);
                        // }}
                        className="w-full border border-gray-400 rounded-lg px-3 py-2  outline-none bg-gray-50 md:col-span-5"
                    />

                    <label className="block font-medium text-gray-800 mb-1 text-end self-center md:col-span-4">
                        Datum plačila:
                    </label>
                    <input
                        id="date_payment"
                        type="date"
                        // value={datePayment}
                        // onChange={(e) => {
                        //     setDatePayment(e.target.value);
                        // }}
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
            <div className="mb-4 bg-white shadow rounded-lg p-5 w-full">
                <p className="text-lg font-bold text-gray-800 mb-6 text-left">
                    Korak 3: Dodajte ter vnesite vrtsice računa
                    <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setStepThree(!stepThree)}></button>
                </p>
            </div>

        </div>
    );
}

export default EditPage;