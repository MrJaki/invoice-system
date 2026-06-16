import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useEffect, useState } from 'react';

type SelectType = {
    head: any;
    match: string;
    fixedHead: any[];
    setFixedHead: (value: any[]) => void;
    sqlAttribute: string;
}

function Select({ head, match, fixedHead, setFixedHead, sqlAttribute }: SelectType) {
    const [value, setValue] = useState<string | null>(null);

    // Convertng special characters in normalised form
    const normalize = (str: string) =>
        str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    useEffect(() => {
        // If head contains similar letters with match text we set bollean true
        const found = head.find((e: any) =>
            normalize(e.name?.toLowerCase().trim()).includes(normalize(match.toLowerCase().trim()))
        );

        // We set that value and rename fixed head name to sql correct one
        if (found) {
            setValue(found.name);
            updateSelection(found.name)
        }
    }, [head, match]);

    // Fixing head name attributes so they match sql ones
    const updateSelection = (selectedValue: string) => {
        if (!selectedValue) return; 

        setValue(selectedValue);

        // Finding index of currently selected option
        const index = head.findIndex(
            (item: any) => item.name === selectedValue
        );

        if (index === -1) return;
 
        // If we find index we first assign old values to constant, then change that onstant and assign it back to fixed head varible
        const updated = [...fixedHead];
        updated[index].name = sqlAttribute;
        setFixedHead(updated);
    };

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateSelection(e.target.value);
    }

    return (
        <select
            required
            name="id_vrsta_izjave"
            value={value ?? ""}
            onChange={onChange}
            className="w-2/3 max-w-xs border border-gray-400 rounded-lg px-3 py-1 bg-gray-50"
        >
            <option value="">Izberite</option>
            {head.map((cel: any) => (
                <option key={cel.name} value={cel.name}>{cel.name}</option>
            ))}
        </select>
    );
}

type MatchTableType = {
    openModal: any;
    setOpenModal: any;
    head: any[];
    fixedHead: any[];
    setFixedHead: (value: any[]) => void;
    setTable: (value: string) => void;
    submitAndInsert: any;
}

function MatchTable({ openModal, setOpenModal, head, fixedHead, setFixedHead, setTable, submitAndInsert }: MatchTableType) {
    const [openTab, setOpenTab] = useState(1);

    const activeClasses =
        "border-l border-t border-r rounded-t text-blue-700";
    const inactiveClasses =
        "text-blue-500 hover:text-blue-700";

    const tax = [
        { match: "Šifra", attribute: "sifra" },
        { match: "Tarifa", attribute: "tarifa" },
        { match: "Tip", attribute: "tip_davka" },
        { match: "Stopnja", attribute: "stopnja" },
        { match: "Opis", attribute: "opis" },
    ];
    const client = [
        { match: "ID", attribute: "id" },
        { match: "Naziv", attribute: "naziv" },
        { match: "Pravni naziv", attribute: "pravni_naziv" },
        { match: "Dodatni naziv", attribute: "dodatni_naziv" },
        { match: "Ulica", attribute: "ulica" },
        { match: "Mesto", attribute: "mesto" },
        { match: "Davcna Št", attribute: "davcna_st" },
        { match: "Izjava", attribute: "id_vrsta_izjave" },
        { match: "Zavezanec", attribute: "zavezanec" },
    ];
    const bill = [
        { match: "ID", attribute: "id" },
        { match: "ID Komitenta", attribute: "id_komitenta" },
        { match: "Datum Izpisa", attribute: "datum_izstavitve" },
        { match: "Datum Valute" , attribute: "datum_valute"},
        { match: "Datum Plačila", attribute: "datum_plačila" },
        { match: "Znesek", attribute: "znesek" },
    ];
    const bill_lines = [
        { match: "ID Računa", attribute: "id_racuna" },
        { match: "Količina" , attribute: "kolicina"},
        { match: "Tip Količine" , attribute: "tip_kolicine"},
        { match: "Opis", attribute: "opis" },
        { match: "Cena", attribute: "cena" },
    ];

    return (
        <Dialog open={openModal} onClose={setOpenModal} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        className={`
                                    relative
                                    w-full
                                    max-w-lg
                                    transform
                                    overflow-hidden
                                    rounded-lg
                                    bg-white
                                    text-left
                                    shadow-[0_0_70px_rgba(0,0,255,0.5)]
                                    transition-all
                                `}
                    >
                        <div className="p-6">
                            <h2>Kako pravilno povezati podatke v tabelah? </h2>
                            <p>Najprej iz zavihkov izberite pravilno kategorijo med zavihki. Nato preverite ali je ujemanje vrstic pravilno. Če se vrstice ne ujemajo jih popravite.</p>
                            
                            {/* Tabs */}
                            <ul className="flex border-b mt-6">
                                <li
                                    onClick={() => {setOpenTab(1); setTable("vrste_izjav");}}
                                    className={`-mb-px mr-1 cursor-pointer ${openTab === 1 ? "-mb-px" : ""}`}>
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className={`bg-white inline-block py-2 px-4 font-semibold ${openTab === 1 ? activeClasses : inactiveClasses}`}>
                                        Davki
                                    </a>
                                </li>

                                <li
                                    onClick={() => {setOpenTab(2); setTable("komitenti");}}
                                    className={`mr-1 cursor-pointer ${openTab === 2 ? "-mb-px" : ""}`}>
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className={`bg-white inline-block py-2 px-4 font-semibold ${openTab === 2 ? activeClasses : inactiveClasses}`} >
                                        Komitenti
                                    </a>
                                </li>

                                <li
                                    onClick={() => {setOpenTab(3); setTable("racuni");}}
                                    className={`mr-1 cursor-pointer ${openTab === 3 ? "-mb-px" : ""}`} >
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className={`bg-white inline-block py-2 px-4 font-semibold ${openTab === 3 ? activeClasses : inactiveClasses}`} >
                                        Računi
                                    </a>
                                </li>

                                <li
                                    onClick={() => {setOpenTab(4); setTable("vrstice_racuna");}}
                                    className={`mr-1 cursor-pointer ${openTab === 4 ? "-mb-px" : ""}`} >
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className={`bg-white inline-block py-2 px-4 font-semibold ${openTab === 4 ? activeClasses : inactiveClasses}`} >
                                        Vrstice Računa
                                    </a>
                                </li>
                            </ul>

                            {/* Tab data */}
                            <div className="w-full mt-4">
                                {openTab === 1 &&
                                    <div>
                                        <ul className="w-full text-left mb-4">
                                            {tax.map((e, index) => (
                                                <li className="p-3 flex items-center justify-between gap-4" key={index}>{e.match}<Select head={head} match={e.match}  fixedHead={fixedHead} setFixedHead={setFixedHead} sqlAttribute={e.attribute}/></li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                                {openTab === 2 &&
                                    <div>
                                        <ul className="w-full text-left mb-4">
                                            {client.map((e, index) => (
                                                <li className="p-3 flex items-center justify-between gap-4" key={index}>{e.match}<Select head={head} match={e.match}  fixedHead={fixedHead} setFixedHead={setFixedHead} sqlAttribute={e.attribute}/></li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                                {openTab === 3 &&
                                    <div>
                                        <ul className="w-full text-left mb-4">
                                            {bill.map((e, index) => (
                                                <li className="p-3 flex items-center justify-between gap-4" key={index}>{e.match}<Select head={head} match={e.match}  fixedHead={fixedHead} setFixedHead={setFixedHead} sqlAttribute={e.attribute}/></li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                                {openTab === 4 &&
                                    <div>
                                        <ul className="w-full text-left mb-4">
                                            {bill_lines.map((e, index) => (
                                                <li className="p-3 flex items-center justify-between gap-4" key={index}>{e.match}<Select head={head} match={e.match}  fixedHead={fixedHead} setFixedHead={setFixedHead} sqlAttribute={e.attribute}/></li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            </div>

                            {/* Submit button */}
                            <button
                                className=" md:col-span-2 bg-[#242996] hover:bg-[#1d217a] text-white rounded-lg px-4 py-1 flex items-center justify-center transition  "
                                onClick={() => {
                                    submitAndInsert();
                                    setOpenModal(false);
                                }}
                            >
                                <i className="bi bi-arrow-left-right mr-3 p-1"></i>
                                Potrdi
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

export default MatchTable;