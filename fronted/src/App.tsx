import './App.css'
import Sidebar from './components/Sidebar'
import Bills from './pages/Bills'

function App() {
    return (
        <div className="">
            <Sidebar />
            <div className='ml-48'>
                <Bills />
            </div>
            
        </div>
    )
}

export default App
