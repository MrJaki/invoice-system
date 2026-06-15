import { useState } from "react";
import { Dbf } from 'dbf-reader';
import { DataTable } from 'dbf-reader/models/dbf-file';
import { Buffer } from "buffer";

globalThis.Buffer = Buffer;

function ClientsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [head, setHead] = useState<any[]>([]);
    const [rows, setRows] = useState<any[]>([]);

    const handleFilChange = (e: any) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile)
            setFile(selectedFile);

        let reader = new FileReader();
        if (e.target.files && e.target.files.length > 0) {
            let file = e.target.files[0];
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                var arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
                if (arrayBuffer) {
                    const buffer = Buffer.from(arrayBuffer);
                    let datatable: DataTable = Dbf.read(buffer);
                    console.log(datatable);

                    const head = Array.isArray(datatable.columns) ? datatable.columns : [datatable.columns];
                    const rows = Array.isArray(datatable.rows) ? datatable.rows : [datatable.rows];

                    setHead(head);
                    setRows(rows);
                }
            };
        }
    }

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Nalaganje
            </p>

            <label htmlFor="dbf-upload" className="block w-full py-9 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 mt-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
                <div className="grid gap-3">
                    <div className="grid gap-1">
                        <h2 className="text-center text-gray-400 text-xs">
                            DBF file
                        </h2>
                    </div>

                    <div className="grid gap-2">
                        {!file ? (
                            <h4 className="text-center text-gray-900 text-sm font-medium mb-3">
                                Select .dbf file you want to import in database.
                            </h4>
                        ) : (
                            <h4 className="text-center text-gray-900 text-sm font-medium mb-3">
                                {file.name}
                            </h4>
                        )}

                        <div className="flex items-center justify-center">
                            <input
                                id="dbf-upload"
                                type="file"
                                accept=".dbf"
                                className="hidden"
                                onChange={handleFilChange}
                            />

                            <div className="flex items-center justify-center w-28 h-9 bg-indigo-600 hover:bg-indigo-700 transition rounded-full shadow text-white text-xs font-semibold">
                                Choose File
                            </div>
                        </div>
                    </div>
                </div>
            </label>

            {file && (
                <>
                    <div className="mt-6 mb-6 bg-white shadow rounded-lg p-5">
                        <button
                            className=" md:col-span-2 bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                            onClick={() => {
                            }}
                            >
                            <i className="bi bi-arrow-clockwise text-lg mr-2"></i>
                            Poveži tabelo
                        </button>
                    </div>
                    <div className="overflow-x-auto bg-white shadow rounded-lg mt-6">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#242996] text-white uppercase text-xs">
                                <tr>
                                    {head.map((cel) => (
                                        <th key={cel.name} className="p-3">{cel.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {head.map((cel) => (
                                            <th key={cel.name} className="p-3">{row[cel.name]}</th>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

        </div>
    );
}

export default ClientsPage;