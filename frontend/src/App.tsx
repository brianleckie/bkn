import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Agendar from './pages/Agendar'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Agendar />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
