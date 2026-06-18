import { useState } from "react";
import Message from "../components/Message";
import { useAuth } from '../auth/AuthContext';


function ClientsPage() {
    const { generateCode } = useAuth();

    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [code, setCode] = useState('');


    const generateInviteCode = async () => {
        try {
            const code = await generateCode();

            setCode(code);

            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri generiranju kode!"
            );
        }

    }


    return (
        <div className="
                bg-white rounded-2xl shadow-sm border border-gray-200
                p-6 md:p-8 mt-5 text-left
                flex flex-col gap-5">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Generiraj kodo za povabilo
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Ustvari novo kodo, veljavna bo 24 ur.
                </p>
            </div>

            <Message error={isError} visible={isVisible}>{message}</Message>

            <div className='grid md:grid-cols-14 gap-2'>

                <button
                    onClick={generateInviteCode}
                    className="
                        w-fit px-5 py-2.5 rounded-xl
                        bg-blue-600 text-white font-medium
                        hover:bg-blue-700
                        transition-colors
                        shadow-sm
                        md:col-span-2
                    "
                >
                    Generiraj kodo
                </button>

                {code && (
                    <div className="
                        bg-gray-50 border border-gray-200
                        rounded-xl p-2
                        flex items-center justify-between
                        md:col-span-12
                    ">
                        <span className="text-sm text-gray-500">
                            Koda:
                        </span>

                        <h3 className="
                            font-mono text-lg font-bold
                            tracking-widest text-blue-600 md-auto
                        ">
                            {code}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClientsPage;