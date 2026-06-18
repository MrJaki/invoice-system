import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type SidebarProps = {
    setPage: (page: string) => void;
    page: string;
};

export default function Sidebar({ setPage, page }: SidebarProps) {
    const menu = [
        { title: "Vnos", icon: "bi-file-earmark-plus", link: "insert" },
        { title: "Urejanje", icon: "bi-pencil", link: "edit" },
        // { title: "Tiskanje", icon: "bi-printer", link: "print" },
        { title: "Računi", icon: "bi-cash", link: "bills" },
        { title: "Komitenti", icon: "bi-person", link: "clients" },
        { title: "Davki", icon: "bi-bank", link: "tax" },
    ];

    const actions = [
        { title: "Uvoz podatkov", icon: "bi-box-arrow-in-down", link: "import" },
        { title: "Nastavitve", icon: "bi-gear", link: "settings" },
    ];

    const { logout } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        setPage(location.pathname.split("/")[1]);
    }, [location])

    return (
        <div className="w-full md:w-46 md:h-screen md:fixed bg-white shadow-sm p-2 md:p-4 flex flex-col">
            <p className="text-3xl font-bold mt-6 text-gray-800">Računi</p>

            <ul className="flex md:block gap-4 md:space-y-2 mt-4 md:mt-8 text-left">
                {menu.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => {
                            setPage(item.link);
                            navigate("/" + item.link);
                        }}
                        className={`p-2 text-sm rounded cursor-pointer transition
                    ${page === item.link
                                ? "bg-gray-200 text-gray-900"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <i className={`bi ${item.icon} mr-3`}></i>
                        {item.title}
                    </li>
                ))}
            </ul>

            {/* Bottom menu */}
            <ul className="flex md:block gap-4 md:space-y-2 mt-auto text-left">
                {actions.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => {
                            setPage(item.link);
                            navigate("/" + item.link);
                        }}
                        className={`p-2 text-sm rounded cursor-pointer transition
                    ${page === item.link
                                ? "bg-gray-200 text-gray-900"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <i className={`bi ${item.icon} mr-3`}></i>
                        {item.title}
                    </li>
                ))}
                <li
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                        className={`p-2 text-sm rounded cursor-pointer transition text-gray-600 hover:bg-gray-100`}
                    >
                        <i className="bi bi-box-arrow-left mr-3"></i>
                        Odjava
                    </li>
            </ul>
        </div>
    );
}
