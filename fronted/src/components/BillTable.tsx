import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Message from "./Message";

// Custom bill type
type Bill = {
    id: number;
    id_komitenta: number;
    naziv_komitenta: string;
    znesek: number;
    datum_izstavitve: string;
    datum_valute: string;
    datum_placila: string;
    stevilka_racuna: number;
}

function BillsTable({setTotalRevenue,
                    setTotalUnpaid,
                    setPage
                }: {
                    setTotalRevenue?: (value: number) => void;
                    setTotalUnpaid?: (value: number) => void;
                    setPage?: (value: string) => void;
                }) {
    // Array for storing bills with custom type
    const [bills, setBills] = useState<Bill[]>([]);

    // Constants for defining number of loaded bills
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);

    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Constants for managing filtering 
    const [searchTerm, setSearchTerm] = useState("");
    const [filterVisible, setFilterVisible] = useState(true);

    // Filters for from and to date
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

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    /**
     * Loading all bills
     */
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

            if (setTotalRevenue) {
                const totalRevenue = data.reduce(
                    (sum: any, bill: any) => sum + Number(bill.znesek || 0),
                    0
                );

                setTotalRevenue(totalRevenue);
            }

            if (setTotalUnpaid) {
                const totalUnpaid = data.reduce((sum: number, bill: any) => {

                    if (!bill.datum_placila) {
                        return sum + Number(bill.znesek || 0);
                    }

                    return sum;
                }, 0);
                setTotalUnpaid(totalUnpaid);
            }
            
            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju računa!"
            );
        }
    }

    const getPdf = async (id: number) => {
        try {
            const response = await axios.post(
                `${API_URL}/bills/${id}/pdf`,
                {},
                {
                    responseType: 'blob', // had to add this one here
                }
            );

            const pdfBlob = new Blob([response.data], {type: "application/pdf"});

            const url = window.URL.createObjectURL(pdfBlob);

            const tempLink = document.createElement("a");
            tempLink.href = url;
            tempLink.setAttribute(
                "download",
                `bill_${id}.pdf`
            );

            document.body.appendChild(tempLink);
            tempLink.click();

            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(url);
                
            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju računa!"
            );
        }
    }

    useEffect(() => {
        loadBills();
    }, [offset, limit])

    return (
        <>
            <Message error={isError} visible={isVisible}>{message}</Message>

            {/* Filter and 'settings' container */}
            <div className="mt-6 mb-6 bg-white shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text font-semibold text-gray-800">
                        Filtri in iskanje
                        <button className="bi bi-arrow-down-up ml-5 cursor-pointer" onClick={() => setFilterVisible(!filterVisible)}>
                        </button>
                        
                    </h3>
                    
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-24 gap-3 mt-4 ${filterVisible ? '' : 'hidden'}`}>
                    {/* Search filter */}
                    <input
                        id="iskanje"
                        type="text"
                        placeholder="Išči po komitentu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className=" md:col-span-8 border border-gray-300 rounded px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500  outline-none "
                    />

                    {/* Limit */}
                    <label className="md:col-span-2 md:text-right self-center">St. prikazov: </label>

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

                    {/* Start / From date */}
                    <label className="md:col-span-3 md:text-right self-center">Datum valute od: </label>

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

                    {/* End / To date */}
                    <label className="md:col-span-1 md:text-right self-center">Do: </label>

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

                    {/* Refresh button */}
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

            {/* Bills table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#242996] text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Št. Računa</th>
                            <th className="p-3">Št. Komitenta</th>
                            <th className="p-3">Komitent</th>
                            <th className="p-3">Datum Izpisa</th>
                            <th className="p-3">Datum Valute</th>
                            <th className="p-3">Datum Plačila</th>
                            <th className="p-3">Znesek (€)</th>
                            <th className="p-3">Urejanje</th>
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
                                <td className="p-3">{bill.id}</td>
                                <td className="p-3 font-medium text-gray-800">
                                    {bill.stevilka_racuna}
                                </td>
                                <td className="p-3">{bill.id_komitenta}</td>
                                <td className="p-3">{bill.naziv_komitenta}</td>
                                <td className="p-3">{bill.datum_izstavitve ? new Date(bill.datum_izstavitve).toLocaleDateString("sl") : '-'}</td>
                                <td className="p-3">{bill.datum_valute ? new Date(bill.datum_valute).toLocaleDateString("sl") : '-'}</td>
                                <td className="p-3">{bill.datum_placila ? new Date(bill.datum_placila).toLocaleDateString("sl") : '-'}</td>
                                <td className="p-3">{bill.znesek}</td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        className="bg-white border border-[#242996] text-[#242996] hover:bg-[#242996] hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        onClick={() => {
                                            navigate("/edit/" + bill.id);
                                            setPage?.("edit");  
                                        }}
                                    >
                                        <i className="bi bi-pencil"></i>
                                        Uredi
                                    </button>

                                    <button
                                        className="bg-white border border-[#D97507] text-[#D97507] hover:bg-[#D97507] hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                        title="Uredi"
                                        onClick={() => {
                                            getPdf(bill.id);
                                        }}
                                    >
                                        <i className="bi bi-filetype-pdf"></i>
                                        PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Page shift bar */}
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
        </>
    );
}

export default BillsTable;