import { useState } from 'react'
import './App.css';
import Sidebar from './components/Sidebar';
import Bills from './pages/Bills';
import Edit from './pages/Edit';
import Insert from './pages/Insert';
import Clients from './pages/Clients';
import EditClient from './pages/EditClient';
import Tax from './pages/Tax';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    const [page, setPage] = useState("bills");
    const [chosenBill, setChosenBill] = useState(0);

    return (
        <BrowserRouter>
        <Sidebar 
            setChosenBill={setChosenBill}
            setPage={setPage}
            page={page}
        />
        <div className="md:ml-48">
            <Routes>
                <Route path="/bills" element={<Bills setPage={setPage} setChosenBill={setChosenBill}/>} />
                <Route path="/edit" element={<Edit chosenBill={chosenBill} setChosenBill={setChosenBill}/>} />
                <Route path="/insert" element={<Insert />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:id" element={<EditClient />} />
                <Route path="/tax" element={<Tax />} />
            </Routes>
        </div>
        </BrowserRouter>
    )
}

export default App
