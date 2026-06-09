import { useState } from "react";


function BillsPage() {
    const [bills] = useState([
        {
            id: 1,
            number: "INV-1001",
            client: "Acme d.o.o.",
            date: "2026-06-01",
            amount: 120.5,
            status: "Paid",
        },
        {
            id: 2,
            number: "INV-1002",
            client: "Beta Ltd",
            date: "2026-06-03",
            amount: 340.0,
            status: "Unpaid",
        },
        {
            id: 3,
            number: "INV-1003",
            client: "Gamma Group",
            date: "2026-06-05",
            amount: 89.99,
            status: "Paid",
        },
    ]);

    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);

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
                            <th className="p-3">Znesek (€)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bills.map((bill) => (
                            <tr
                                key={bill.id}
                                className="hover:bg-gray-100 transition"
                            >
                                <td className="p-3 font-medium text-gray-800">
                                    {bill.number}
                                </td>
                                <td className="p-3">{bill.client}</td>
                                <td className="p-3">{bill.date}</td>
                                <td className="p-3">{bill.amount.toFixed(2)}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium
                      ${bill.status === "Paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {bill.status}
                                    </span>
                                </td>
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