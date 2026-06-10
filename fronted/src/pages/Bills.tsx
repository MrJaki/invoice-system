import { useEffect, useState } from "react";
import axios from 'axios';
import styled from 'styled-components'

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

function BillsPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterVisible, setFilterVisible] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);

    const [start, setStart] = useState(
        new Date(new Date().getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0]
    );

    const [end, setEnd] = useState(
        new Date(new Date())
        .toISOString()
        .split("T")[0]
    );

    const API_URL = 'http://localhost:3002/api';

    const loadBills = async () => {
        try {
            const bill = await axios.get(
                `${API_URL}/bills`,
                {
                    params: {
                        limit: limit,
                        offset: offset,
                        start: start,
                        end: end,
                    }
                }
            );
            const data = Array.isArray(bill.data.data)
                ? bill.data.data
                : [bill.data.data];

            setBills(data);

            const totalRevenue = data.reduce(
                (sum: any, bill: any) => sum + Number(bill.znesek || 0),
                0
            );

            setTotalRevenue(totalRevenue);

            const totalUnpaid = data.reduce((sum: number, bill: any) => {
                const dueDate = new Date(bill.datum_plačila);

                if (!bill.datum_plačila || dueDate <= new Date()) {
                    return sum + Number(bill.znesek || 0);
                }

                return sum;
            }, 0);
            setTotalUnpaid(totalUnpaid);
            
            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage("Napaka pri nalaganju računov!");
        }
    }

    useEffect(() => {
        loadBills();
    }, [offset, limit])

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Vsa plačila
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6 mt-6">
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Skupna Plačila</p>
                    <p className="text-xl font-bold text-green-600">
                        {totalRevenue.toFixed(2)} €
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Neplačano</p>
                    <p className="text-xl font-bold text-red-600">
                        {totalUnpaid.toFixed(2)} €
                    </p>
                </div>
            </div>

            <Message $error={isError} $visible={isVisible}>{message}</Message>

            <div className="mt-6 mb-6 bg-white shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text font-semibold text-gray-800">
                        Filtri in iskanje
                        <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setFilterVisible(!filterVisible)}>
                        </button>
                        
                    </h3>
                    
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-24 gap-3 mt-4 ${filterVisible ? '' : 'hidden'}`}>
                    <input
                        id="iskanje"
                        type="text"
                        placeholder="Išči po komitentu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className=" md:col-span-8 border border-gray-300 rounded px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500  outline-none "
                    />

                    <label className="md:col-span-2 text-right self-center">St. prikazov: </label>

                    <input
                        id="limit"
                        type="number"
                        placeholder="Prikazanih"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setOffset(0);
                        }}
                        className="  md:col-span-2  border border-gray-300   rounded  px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500 outline-none "
                    />

                    <label className="md:col-span-3 text-right self-center">Datum valute od: </label>

                    <input
                        id="start"
                        type="date"
                        value={start}
                        onChange={(e) => {
                            setStart(e.target.value);
                            setOffset(0);
                        }}
                        className="  md:col-span-3 border border-gray-300   rounded  px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500 outline-none "
                    />

                    <label className="md:col-span-1 text-right self-center">Do: </label>

                    <input
                        id="end"
                        type="date"
                        value={end}
                        onChange={(e) => {
                            setEnd(e.target.value);
                            setOffset(0);
                        }}
                        className="  md:col-span-3 border border-gray-300   rounded  px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500 outline-none "
                    />

                    <button
                        className=" md:col-span-2 bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                        onClick={() => {
                            setMessage("");
                            loadBills();
                        }}
                        >
                        <i className="bi bi-arrow-clockwise text-lg"></i>
                    </button>
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
                        {bills.filter(
                            (item) =>
                                (item.naziv_komitenta ?? "").toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((bill) => (
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