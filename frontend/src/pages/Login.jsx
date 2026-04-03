import { useState } from 'react'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Logged in with:', formData)
    alert('✅ Logged in! (Frontend simulation only)')
    // In a real app you would navigate to / after successful login
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '12px' }}>
          Login
        </button>
      </form>
    </div>
  )
}