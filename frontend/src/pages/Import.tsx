import { useState } from "react";
import { Dbf } from 'dbf-reader';
import { DataTable } from 'dbf-reader/models/dbf-file';
import { Buffer } from "buffer";
import MatchTable from "../components/MatchTable";
import axios from "axios";
import Message from "../components/Message";

globalThis.Buffer = Buffer;

function LoadingModal({ isOpen, text = "Loading..." }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-8 py-6 shadow-xl">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="text-sm font-medium text-slate-600">
                    {text}
                </p>
            </div>
        </div>
    );
}

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

    const [loading, setLoading] = useState(false);

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
        setLoading(true);

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
        setLoading(false);
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
            await axios.post(
                `${API_URL}/clients/repairIDSequence`
            );
            hideError();

        } catch (err: any) {
            showError(err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju vrstice računa!")
        }
        setLoading(false);
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
                        datePayment: z.datum_placila || "",
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
            await axios.post(
                `${API_URL}/bills/repairIDSequence`
            );
            hideError();

        } catch (err: any) {
            showError(err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri posodabljanju vrstice računa!")
        }
        setLoading(false);
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
        setLoading(false);
    }

    return (
        <div className="p-6 w-full">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-left">
                Uvoz podatkov
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
                                Izberite .dbf datoteko, ki jo želite vnesti v tabelo. Pred začetkom si preberite navodila za pravilen vnos.
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

                    <LoadingModal
                        isOpen={loading}
                        text="Importing data..."
                    />

                </>
            )}

            {/* Instructons */}
            <div className="mt-6 bg-white shadow rounded-lg p-5">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-gray-800">
                        Navodila za uvoz podatkov
                    </h3>

                    <i className="bi bi-info-circle text-[#242996] text-lg"></i>
                </div>

                <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h4 className="font-medium text-[#242996] mb-2">
                        Obvezen vrstni red uvoza podatkov.
                    </h4>

                    <p className="text-sm text-gray-700">
                        <strong>1.</strong> vrste_izjav →
                        <strong>2.</strong> komitenti →
                        <strong>3.</strong> racuni →
                        <strong>4.</strong> vrstice_racuna
                    </p>

                    <p className="text-sm text-gray-600 mt-2">
                        Zaradi povezav med podatki je pomembno, da podatke uvozite v tem vrstnem redu.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">

                    <div className="overflow-hidden rounded-lg border">
                        <div className="bg-[#242996] text-white px-4 py-2 font-medium">
                            vrste_izjav
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Polje</th>
                                    <th className="p-3 text-left">Kaj predstavlja</th>
                                    <th className="p-3 text-left">Pravila</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3">sifra</td>
                                    <td className="p-3">Šifra davčne stopnje</td>
                                    <td className="p-3">Obvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">tarifa</td>
                                    <td className="p-3">Oznaka tarife</td>
                                    <td className="p-3">Obvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">tip_davka</td>
                                    <td className="p-3">Vrsta davka</td>
                                    <td className="p-3">Neobvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">stopnja</td>
                                    <td className="p-3">Odstotek davka</td>
                                    <td className="p-3">Število</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">opis</td>
                                    <td className="p-3">Opis davčne stopnje</td>
                                    <td className="p-3">Obvezno</td>
                                </tr>

                                <tr className="border-t"></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <div className="bg-[#242996] text-white px-4 py-2 font-medium">
                            komitenti
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Polje</th>
                                    <th className="p-3 text-left">Kaj predstavlja</th>
                                    <th className="p-3 text-left">Pravila</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3">id</td>
                                    <td className="p-3">ID komitenta</td>
                                    <td className="p-3">Datoteka mora vsebovati</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">naziv</td>
                                    <td className="p-3">Naziv komitenta</td>
                                    <td className="p-3">Obvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">pravni_naziv</td>
                                    <td className="p-3">Polni pravni naziv</td>
                                    <td className="p-3">Neobvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">dodatni_naziv</td>
                                    <td className="p-3">Dodaten naziv</td>
                                    <td className="p-3">Neobvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">ulica</td>
                                    <td className="p-3">Ulica in hišna številka</td>
                                    <td className="p-3">Neobvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">mesto</td>
                                    <td className="p-3">Kraj</td>
                                    <td className="p-3">Neobvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">davcna_st</td>
                                    <td className="p-3">Davčna številka</td>
                                    <td className="p-3">Neobvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">zavezanec</td>
                                    <td className="p-3">Davčni zavezanec</td>
                                    <td className="p-3">D = Da</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">vrsta_izjave</td>
                                    <td className="p-3">Vrsta davčne izjave</td>
                                    <td className="p-3">Mora obstajati v vrstah izjav</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <div className="bg-[#242996] text-white px-4 py-2 font-medium">
                            racuni
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Polje</th>
                                    <th className="p-3 text-left">Kaj predstavlja</th>
                                    <th className="p-3 text-left">Pravila</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3">id</td>
                                    <td className="p-3">ID računa</td>
                                    <td className="p-3">Datoteka mora vsebovati</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">id_komitenta</td>
                                    <td className="p-3">ID komitenta</td>
                                    <td className="p-3">Mora obstajati v komitentih</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">znesek</td>
                                    <td className="p-3">Skupni znesek računa</td>
                                    <td className="p-3">Število ≥ 0</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">datum_izstavitve</td>
                                    <td className="p-3">Datum izdaje računa</td>
                                    <td className="p-3">Datum</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">datum_valute</td>
                                    <td className="p-3">Rok plačila</td>
                                    <td className="p-3">Datum</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">datum_placila</td>
                                    <td className="p-3">Datum plačila</td>
                                    <td className="p-3">Datum ali prazno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">stevilka_racuna</td>
                                    <td className="p-3">Številka računa</td>
                                    <td className="p-3">Mora biti unikatna</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <div className="bg-[#242996] text-white px-4 py-2 font-medium">
                            vrstice_racuna
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Polje</th>
                                    <th className="p-3 text-left">Kaj predstavlja</th>
                                    <th className="p-3 text-left">Pravila</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3">id_racuna</td>
                                    <td className="p-3">ID računa</td>
                                    <td className="p-3">Mora obstajati v računih</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">kolicina</td>
                                    <td className="p-3">Količina</td>
                                    <td className="p-3">Število ≥ 0</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">tip_kolicine</td>
                                    <td className="p-3">Enota (KOM, KG, H ...)</td>
                                    <td className="p-3">Neobvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">opis</td>
                                    <td className="p-3">Opis postavke</td>
                                    <td className="p-3">Neobvezno</td>
                                </tr>

                                <tr className="border-t">
                                    <td className="p-3">cena</td>
                                    <td className="p-3">Cena postavke</td>
                                    <td className="p-3">Število ≥ 0</td>
                                </tr>
                                <tr className="border-t"></tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Import;