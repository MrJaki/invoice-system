import { useNavigate } from 'react-router-dom';

type SidebarProps = {
    setPage: (page: string) => void;
    page: string;
    setChosenBill: (value: number) => void;
};

export default function Sidebar({ setPage, page, setChosenBill }: SidebarProps) {
    const menu = [
        { title: "Vnos", icon: "bi-file-earmark-plus", link: "insert" },
        { title: "Urejanje", icon: "bi-pencil", link: "edit" },
        { title: "Tiskanje", icon: "bi-printer", link: "print" },
        { title: "Plačila", icon: "bi-cash", link: "bills" },
        { title: "Komitenti", icon: "bi-person", link: "clients" },
        { title: "Davki", icon: "bi-bank", link: "tax" },
    ];

    const navigate = useNavigate();

    return (
        <div className="w-full md:w-46 md:h-screen md:fixed bg-white shadow-sm p-2 md:p-4">
            <p className="text-3xl font-bold mt-6 text-gray-800">Računi</p>

            <ul className="flex md:block gap-4 md:space-y-2 mt-4 md:mt-8 text-left">
                {menu.map((item, index: any) => (
                    <li key={index}
                        onClick={() => {
                            setPage(item.link);
                            setChosenBill(0);
                            navigate("/" + item.link)
                        }}
                        className={`p-2 text-sm rounded cursor-pointer transition
                                        ${page == item.link ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"}  
                                `}>
                        <i className={`bi ${item.icon} mr-3`}></i>
                        {item.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
