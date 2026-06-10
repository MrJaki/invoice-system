import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Bills from './pages/Bills'

function App() {
    const [page, setPage] = useState("bills");
    return (
        <div className="">
            <Sidebar 
                setPage={setPage}
            />
            <div className='ml-48'>
                {page == "bills" ? (<Bills />) : (<div></div>)}
                
            </div>
            
        </div>
    )
}

export default App
