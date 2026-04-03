import { useState } from 'react'

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Signed up with:', formData)
    alert('✅ Account created! (Frontend only - no backend yet)')
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }}
          required
        />
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
          Create Account
        </button>
      </form>
    </div>
  )
}