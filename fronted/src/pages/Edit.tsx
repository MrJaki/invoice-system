import { useEffect, useState } from "react";
import axios from 'axios';
// import styled from 'styled-components'
import BillsTable from '../components/BillTable'

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
    const [chosenNumber, setChosenNumber] = useState(0);
    const [bill, setBill] = useState<Bill | null>(null);

    const API_URL = 'http://localhost:3002/api';

    const loadChosenBill = async () => {
        if (chosenBill == 0) return;
        try {
            const response = await axios.get(
                `${API_URL}/bills/selected_id`,
                {
                    params: {
                        id: chosenBill
                    }
                }
            );

            setBill(response.data.data);
        } catch (err) {

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

            {
                chosenBill == 0 ? (
                    <>
                        <div className="mt-6 mb-6 bg-white shadow rounded-lg p-5 w-2/4">
                            <div className="flex items-center justify-between">
                                <h3 className="text font-semibold text-gray-800">
                                    Vnesite številko računa
                                </h3>

                            </div>

                            <div className="grid md:grid-cols-6 gap-3 mt-4 mb-2">
                                <input
                                    id="iskanje"
                                    type="number"
                                    placeholder="Išči po računih..."
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

                        <BillsTable
                            setChosenBill={setChosenBill}
                        />
                    </>
                ) :
                    (
                        <div className="mt-6 mb-6 bg-white shadow rounded-xl p-6 w-full grid md:grid-cols-6 gap-8 text-left">

                            {/* LEFT: invoice form */}
                            <div className="md:col-span-3">
                                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                    Podatki računa
                                </h3>

                                <div className="space-y-5">

                                    {/* Field */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Datum izpisa
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2
                               focus:ring-2 focus:ring-[#242996] focus:border-[#242996]
                               outline-none bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Datum valute
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2
                               focus:ring-2 focus:ring-[#242996] focus:border-[#242996]
                               outline-none bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Datum plačila
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2
                               focus:ring-2 focus:ring-[#242996] focus:border-[#242996]
                               outline-none bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Znesek
                                        </label>
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2
                               bg-gray-100 text-gray-700"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* RIGHT: customer info */}
                            <div className="md:col-span-3">
                                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                    Podatki o komitantu
                                </h3>

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
                            </div>

                        </div>
                    )
            }


        </div>
    );
}

export default EditPage;