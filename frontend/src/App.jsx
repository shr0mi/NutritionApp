import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Button } from './components/ui/button'
import Navbar from './components/Navbar'
import { ThemeProvider } from './components/theme-provider'

function App() {

  return (
    <>
      {/* Navbar 
      <nav style={{
        padding: '1rem',
        background: '#333',
        color: 'white',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
      </nav>
      */}
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Navbar/>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </ThemeProvider>

      
    </>
  )
}

export default App
