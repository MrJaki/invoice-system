import { useState } from "react";
import BillsTable from '../components/BillTable'
import LineChart from '../components/LineChart'


function BillsPage({ setPage, setChosenBill }: { setPage?: (value: string) => void; setChosenBill?: (value: number) => void }) {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [year, setYear] = useState('');

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Vsa plačila
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6 mt-6">

                {/* Cards */}
                <div className="md:col-span-1 flex flex-col gap-4">

                    {/* Total revenue */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <p className="text-sm text-gray-500">Skupna Plačila</p>
                        <p className="text-xl font-bold text-green-600">
                            {totalRevenue.toFixed(2)} €
                        </p>
                    </div>

                    {/* Total unpaid */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <p className="text-sm text-gray-500">Neplačano</p>
                        <p className="text-xl font-bold text-red-600">
                            {totalUnpaid.toFixed(2)} €
                        </p>
                    </div>

                    {/* Total */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <p className="text-sm text-gray-500">Dobiček</p>
                        <p className="text-xl font-bold text-blue-600">
                            {(totalRevenue- totalUnpaid).toFixed(2)} €
                        </p>
                    </div>

                </div>


                {/* Chart */}
                <div className="md:col-span-2 bg-white shadow rounded-lg p-4">
                    <LineChart
                        year={year}
                    />
                </div>

            </div>

            {/* Bills table */}
            <BillsTable
                setTotalUnpaid={setTotalUnpaid}
                setTotalRevenue={setTotalRevenue}
                setPage={setPage}
                setYear={setYear}
            />
        </div>
    );
}

export default BillsPage;