import { useState } from 'react'

type SidebarProps = {
  setPage: (page: string) => void;
};

export default function Sidebar({ setPage }: SidebarProps) {
  const menu = [
    { title: "Vnos", icon: "bi-file-earmark-plus", link: "" },
    { title: "Urejanje", icon: "bi-pencil", link: "" },
    { title: "Tiskanje", icon: "bi-printer", link: "" },
    { title: "Plačila", icon: "bi-cash", link: "bills" },
    { title: "Komitenti", icon: "bi-person", link: "" },
  ];

  const [active, setActive] = useState(null);

  return (
    <div className="w-45 h-screen bg-white shadow-sm p-4 fixed">
      <p className="text-3xl font-bold mt-6 text-gray-800">Računi</p>

      <ul className="space-y-2 mt-8 text-left">
        {menu.map((item, index: any) => (
          <li key={index}
            onClick={() => {
              setActive(index);
              setPage(item.link);
            }}
            className={`p-2 text-sm rounded cursor-pointer transition
              ${active === index ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"}
            `}
          >
            <i className={`bi ${item.icon} mr-3`}></i>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
