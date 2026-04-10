import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CalorieCalc from './pages/CalorieCalc'
import HealthChat from './pages/HealthChat'
import { Button } from './components/ui/button'
import Navbar from './components/Navbar'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider} from './contexts/AuthContext'
import ProtectedRoute from './ProtectedRoute'

function App() {

  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Navbar/>
          
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          

          {/* Protected Profile Route */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calorie-calculator" 
            element={
              <ProtectedRoute>
                <CalorieCalc/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health-chat" 
            element={
              <ProtectedRoute>
                <HealthChat/>
              </ProtectedRoute>
            } 
          />

          </Routes>
          
        </AuthProvider>
      
      </ThemeProvider>

      
    </>
  )
}

export default App
