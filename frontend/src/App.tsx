import { useState } from 'react'
import './App.css';
import Sidebar from './components/Sidebar';
import Bills from './pages/Bills';
import Edit from './pages/Edit';
import EditBillPage from './pages/EditBill';
import Insert from './pages/Insert';
import Clients from './pages/Clients';
import EditClient from './pages/EditClient';
import Tax from './pages/Tax';
import Import from './pages/Import';
import Settings from './pages/Settings';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    const [page, setPage] = useState("bills");

    return (
        <BrowserRouter>
        <Sidebar 
            setPage={setPage}
            page={page}
        />
        <div className="md:ml-48">
            <Routes>
                <Route path="/bills" element={<Bills setPage={setPage}/>} />
                <Route path="/edit" element={<Edit/>} />
                <Route path="/edit/:id" element={<EditBillPage />} />
                <Route path="/insert" element={<Insert />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:id" element={<EditClient />} />
                <Route path="/tax" element={<Tax />} />
                <Route path="/import" element={<Import />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </div>
        </BrowserRouter>
    )
}

export default App
