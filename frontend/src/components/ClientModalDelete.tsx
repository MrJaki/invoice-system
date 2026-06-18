import api from '../lib/api'
import { useState } from "react";
import Message from "./Message";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useNavigate, useParams } from 'react-router-dom';

type BillLinesFormProps = {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
};

function DeleteBillModal({  openModal, setOpenModal }: BillLinesFormProps) {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();

    const { id } = useParams();

    const API_URL = import.meta.env.VITE_API_URL;

    /**
     * Deleting client
     */
    const deleteClient = async () => {
        try {
            await api.delete(
                `${API_URL}/clients/${id}`
            )

            setOpenModal(false);
            setIsVisible(false);
            setIsError(false);
            setMessage("");

            navigate('/clients')
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri brisanju izbranega računa!"
            );
        }
    }


    return (
        <>
            <Dialog open={openModal} onClose={setOpenModal} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            className="
                                relative
                                w-full
                                max-w-md
                                transform
                                overflow-hidden
                                rounded-2xl
                                bg-white
                                p-6
                                text-left
                                shadow-[0_0_70px_rgba(255,0,0,0.5)]
                                transition-all
                            ">
                            <div className="flex items-start gap-4">

                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Ali ste prepričani, da želite izbrisati tega komitenta?
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-600">
                                        Tega dejanja ni mogoče razveljaviti. Komitent bo trajno izbrisan.
                                    </p>
                                </div>
                            </div>

                            <Message error={isError} visible={isVisible}>
                                {message}
                            </Message>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        hover:bg-gray-50
                                    ">
                                    Prekliči
                                </button>

                                <button
                                    onClick={deleteClient}
                                    className="
                                        rounded-lg
                                        bg-red-600
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        hover:bg-red-700
                                    ">
                                    Izbriši komitenta
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default DeleteBillModal;