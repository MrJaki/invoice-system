import { useEffect, useState } from "react";
import axios from 'axios';

type Bill = {
    id: number;
    id_komitenta: number;
    naziv_komitenta: string;
    znesek: number;
    datum_izstavitve: string;
    datum_valute: string;
    datum_plačila: string;
    stevilka_racuna: number;
}

function BillsPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);

    const API_URL = 'http://localhost:3002/api';

    const getTasks = async () => {
        try {
            const bill = await axios.get(`${API_URL}/bills`);
            setBills(
                Array.isArray(bill.data.data)
                ? bill.data.data
                : [bill.data.data]
            );
        } catch (err) {

        }
    }

    useEffect(() => {
        getTasks();
    }, [])

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Vsa plačila
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6 mt-6">
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">
                        {/* € {totalRevenue.toFixed(2)} */}
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Unpaid</p>
                    <p className="text-xl font-bold text-red-600">
                        {/* € {totalUnpaid.toFixed(2)} */}
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total Invoices</p>
                    <p className="text-xl font-bold text-gray-800">
                        {/* € {total.toFixed(2)} */}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#242996] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">Št. Računa</th>
                            <th className="p-3">Št. Komitenta</th>
                            <th className="p-3">Komitent</th>
                            <th className="p-3">Datum Izpisa</th>
                            <th className="p-3">Datum Valute</th>
                            <th className="p-3">Datum Plačila</th>
                            <th className="p-3">Znesek (€)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bills.map((bill) => (
                            <tr
                                key={bill.stevilka_racuna}
                                className="hover:bg-gray-100 transition"
                            >
                                <td className="p-3 font-medium text-gray-800">
                                    {bill.stevilka_racuna}
                                </td>
                                <td className="p-3">{bill.id_komitenta}</td>
                                <td className="p-3">{bill.naziv_komitenta}</td>
                                <td className="p-3">{bill.datum_izstavitve ? new Date(bill.datum_izstavitve).toLocaleDateString("sl") : '-'}</td>
                                <td className="p-3">{bill.datum_valute ? new Date(bill.datum_valute).toLocaleDateString("sl") : '-'}</td>
                                <td className="p-3">{bill.datum_plačila ? new Date(bill.datum_plačila).toLocaleDateString("sl") : '-'}</td>
                                <td className="p-3">{bill.znesek}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-center gap-2 my-4">
                <button
                    disabled={offset === 0}
                    className="px-3 py-1 border bg-white rounded-md hover:bg-gray-200 disabled:opacity-50"
                    onClick={() => {
                        setOffset(prev => Math.max(0, prev - limit))
                    }}
                >
                    ← Previous
                </button>

                <span className="px-4 py-1 border bg-white rounded-md bg-gray-50 font-medium">
                    {offset / limit + 1}
                </span>

                <button
                    className="px-3 py-1 border bg-white rounded-md hover:bg-gray-200 disabled:opacity-50"
                    onClick={() => {
                        setOffset(prev => prev + limit);
                    }}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default BillsPage;