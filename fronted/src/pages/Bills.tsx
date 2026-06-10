import { useEffect, useState } from "react";
// import axios from 'axios';
// import styled from 'styled-components'
import BillsTable from '../components/BillTable'

function BillsPage({ setPage, setChosenBill }: { setPage?: (value: string) => void; setChosenBill?: (value: number) => void }) {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);

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

            <BillsTable 
                setTotalUnpaid={setTotalUnpaid}
                setTotalRevenue={setTotalRevenue}
                setPage={setPage}
                setChosenBill={setChosenBill}
            />
        </div>
    );
}

export default BillsPage;