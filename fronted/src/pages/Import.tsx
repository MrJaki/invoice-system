import { useState } from "react";
import { Dbf } from 'dbf-reader';
import { DataTable } from 'dbf-reader/models/dbf-file';
import { Buffer } from "buffer";
import MatchTable from "../components/MatchTable";
import axios from "axios";
import Message from "../components/Message";

globalThis.Buffer = Buffer;

function Import() {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Constants used for storing data we read from files
    const [file, setFile] = useState<File | null>(null);
    const [head, setHead] = useState<any[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [fixedHead, setFixedHead] = useState<any[]>([]);

    const [modal, setModal] = useState(false);

    const [table, setTable] = useState("vrste_izjav");

    const API_URL = import.meta.env.VITE_API_URL;

    // Reading data from .dbf file and storing them in array constants
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

                    const clonedHead = structuredClone(head);
                    setFixedHead(clonedHead);

                    setRows(rows);
                }
            };
        }
    }

    // Showing and hiding error
    const showError = (msg: string) => {
        setIsVisible(true);
        setIsError(true);
        setMessage(msg);
    }
    const hideError = () => {
        setIsVisible(false);
        setIsError(false);
        setMessage("");
    }

    // Renaming name fields in array and choosing right function to post data to db
    const submitAndInsert = () => {
        const transformedRows = renameWholeTable();

        if (table === "vrste_izjav") {
            tableTax(transformedRows);
        } else if (table === "komitenti") {
            tableClients(transformedRows);
        } else if (table === "racuni") {
            tableBills(transformedRows);
        } else if (table === "vrstice_racuna") {
            tableBillLines(transformedRows);
        }
    }

    // Renaming table names so they match for inserts
    // Took from somewhere on internet
    const renameWholeTable = () => {
        return rows.map(row => {
            const renamed: any = {};

            head.forEach((originalColumn, index) => {
                renamed[fixedHead[index].name] =
                    row[originalColumn.name];
            });

            return renamed;
        });
    };

    // Posting tax data
    const tableTax = async (data: any[]) => {
        for (const z of data) {
            try {
                await axios.post(
                    `${API_URL}/tax`,
                    {
                        tarif: z.tarifa || "",
                        code: z.sifra || "",
                        type: z.tip_davka || "",
                        level: z.stopnja || 0,
                        longer_desc: z.opis || "",
                    }
                );

                hideError();

            } catch (err: any) {
                showError(err.response?.data?.error ||
                    err.message ||
                    "Prišlo je do napake pri posodabljanju vrstice računa!")
            }
        }
    }

    // Posting client data
    const tableClients = async (data: any[]) => {
        for (const z of data) {
            var zavezanec = false;
            if (z.zavezanec === "D") zavezanec = true;
            try {
                await axios.post(
                    `${API_URL}/clients/import`,
                    {
                        id: z.id,
                        title: z.naziv || "",
                        legal_title: z.pravni_naziv || "",
                        additional_title: z.dodatni_naziv || "",
                        street: z.ulica || "",
                        city: z.mesto || "",
                        tax_num: z.davcna_st || "",
                        obligee: zavezanec,
                        statement_type_id: Number(z.vrsta_izjave || 0) + 1,
                    }
                );

                hideError();

            } catch (err: any) {
                showError(err.response?.data?.error ||
                    err.message ||
                    "Prišlo je do napake pri posodabljanju vrstice računa!")
            }
        }

        try {
            await axios.get(
                `${API_URL}/clients/repairIDSequence`
            );
            hideError();

        } catch (err: any) {
            showError(err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju vrstice računa!")
        }
    }

    // Posting bills data
    const tableBills = async (data: any[]) => {
        for (const z of data) {
            try {
                await axios.post(
                    `${API_URL}/bills/import`,
                    {
                        id: Number(z.id),
                        id_client: Number(z.id_komitenta || 1),
                        dateOut: z.datum_izstavitve || "",
                        dateValue: z.datum_valute || "",
                        datePayment: z.datum_plačila || "",
                        bill_num: Number(z.id),
                        amount: Number(z.znesek || 0),
                    }
                );

                hideError();

            } catch (err: any) {
                showError(err.response?.data?.error ||
                    err.message ||
                    "Prišlo je do napake pri posodabljanju vrstice računa!")
            }
        }

        try {
            await axios.get(
                `${API_URL}/bills/repairIDSequence`
            );
            hideError();

        } catch (err: any) {
            showError(err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju vrstice računa!")
        }
    }

    // Posting bill line data
    const tableBillLines = async (data: any[]) => {
        for (const z of data) {
            try {
                await axios.post(
                    `${API_URL}/bill_lines`,
                    {
                        quantity: z.kolicina || 0,
                        quantity_type: z.tip_kolicine,
                        desc: z.opis,
                        price: z.cena || 0,
                        id_bill: z.id_racuna,
                    }
                );

                hideError();

            } catch (err: any) {
                showError(err.response?.data?.error ||
                    err.message ||
                    "Prišlo je do napake pri posodabljanju vrstice računa!")
            }
        }
    }

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Nalaganje
            </p>

            {/* Container for uploading file */}
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

                            <div className="flex items-center justify-center w-28 h-9 bg-[#242996] hover:bg-[#231996] transition rounded-full shadow text-white text-xs font-semibold">
                                Choose File
                            </div>
                        </div>
                    </div>
                </div>
            </label>

            <Message error={isError} visible={isVisible}>{message}</Message>

            {file && (
                <>
                    <div className="mt-6 mb-6 bg-white shadow rounded-lg p-5">
                        <button
                            className=" md:col-span-2 bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                            onClick={() => {
                                setModal(true);
                            }}
                        >
                            <i className="bi bi-arrow-left-right mr-3 p-1"></i>
                            Poveži tabelo
                        </button>
                    </div>

                    {/* Data table */}
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
                                        {head.map((cel) => {
                                            const value = row[cel.name];
                                            return (
                                                <th key={cel.name} className="p-3">{value instanceof Date
                                                    ? value.toLocaleString()
                                                    : value}</th>)
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <MatchTable
                        openModal={modal}
                        setOpenModal={setModal}
                        head={head}
                        fixedHead={fixedHead}
                        setFixedHead={setFixedHead}
                        setTable={setTable}
                        submitAndInsert={submitAndInsert}
                    />
                </>
            )}

        </div>
    );
}

export default Import;