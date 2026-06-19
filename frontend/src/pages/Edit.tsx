import { useState } from "react";
import BillsTable from '../components/BillTable'
import { useNavigate } from "react-router-dom";


function EditPage() {
    // Chosen bill ID
    const [chosenNumber, setChosenNumber] = useState(0);

    const navigate = useNavigate();

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Uredi plačilo
            </p>

            {/* If bill is not chosen / set to zero we show table of bills */}
            {/* If bill is chosen / not zero we show bills data */}
            {/* Input for manualy inserting bill ID */}
            <div className="mt-6 mb-6 bg-white shadow rounded-lg p-5 md:w-2/4">
                <div className="flex items-center justify-between">
                    <h3 className="text font-semibold text-gray-800">
                        Vnesite ID računa
                    </h3>

                </div>

                {/* Bill ID input */}
                <div className="grid md:grid-cols-6 gap-3 mt-4 mb-2">
                    <input
                        id="iskanje"
                        type="number"
                        value={chosenNumber}
                        onChange={(e) => setChosenNumber(Number(e.target.value))}
                        className=" md:col-span-5 border border-gray-300 rounded px-4 py-1 focus:ring-2 focus:ring-blue-500  focus:border-blue-500  outline-none "
                    />
                    <button
                        className=" md:col-span-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                        onClick={() => {
                            navigate("/edit/" + chosenNumber)
                        }}
                    >
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                <p className="text-left text-sm">
                    Če številke računa ne veste na pamet lahko račun izberete iz tabele spodaj.
                </p>
            </div>

            {/* Bills table */}
            <BillsTable
            />



        </div>
    );
}

export default EditPage;