import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Bills from './pages/Bills'
import Edit from './pages/Edit'

function App() {
    const [page, setPage] = useState("bills");
    const [chosenBill, setChosenBill] = useState(0);

    return (
        <div className="">
            <Sidebar 
                setPage={setPage}
                page={page}
                setChosenBill={setChosenBill}
            />
            <div className='ml-48'>
                {page == "bills" ? (<Bills setPage={setPage} setChosenBill={setChosenBill}/>) : 
                 page == "edit" ? (<Edit chosenBill={chosenBill} setChosenBill={setChosenBill}/>) :
                 (<div></div>)
            }
                
            </div>
            
        </div>
    )
}

export default App
