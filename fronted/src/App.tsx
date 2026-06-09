import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import axios from 'axios';
import './App.css'
import Sidebar from './components/Sidebar'
import Bills from './pages/Bills'

function App() {
    const [tasks, setTasks] = useState("");

    const API_URL = 'http://localhost:3002/api';

    const getTasks = async () => {
        try {
            const tasks = await axios.get(`${API_URL}/tasks`);
            setTasks(tasks.data[0].title);
        } catch (err) {

        }
    }

    useEffect(() => {
        getTasks();
    }, [])

    return (
        <div className="flex">
            <Sidebar />

            <Bills />
        </div>
    )
}

export default App
