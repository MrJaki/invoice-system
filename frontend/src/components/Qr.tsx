import { useEffect, useState } from "react";
import api from '../lib/api'
import Message from "./Message";


function QR({ id }: { id: number }) {
    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [qr, setQr] = useState<any>();

    const API_URL = import.meta.env.VITE_API_URL;

    const getQR = async () => {
        if (!id || id === 0) return;
        try {
            const response = await api.post(
                `${API_URL}/qr/${id}`,
                {},
                {
                    responseType: 'blob',
                }
            );

            setQr(response.data);

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju QR kode!"
            );
        }
    }

    useEffect(() => {
        getQR()
    }, [id])

    return (
        <>
            {qr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-8 py-6 shadow-xl">
                        <Message error={isError} visible={isVisible}>{message}</Message>
                        <img
                            src={URL.createObjectURL(qr)}
                            alt="QR koda"
                        />
                        <div className="flex gap-5">
                            <a
                                href={URL.createObjectURL(qr)}
                                download={`racun-${id}.png`}
                                className="bg-white border border-[#242996] text-[#242996] hover:bg-[#242996] hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                >
                                <i className="bi bi-download"></i>
                                Naloži
                            </a>

                            <button
                                onClick={() => setQr(null)}
                                className="bg-white border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg px-2 py-1 flex items-center gap-2 transition-colors duration-200"
                                >
                                <i className="bi bi-x-lg"></i>
                                Zapri
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default QR;