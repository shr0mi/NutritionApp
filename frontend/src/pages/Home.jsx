import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const { isLoggedIn, logout, userId } = useAuth();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🏠 Welcome to the Homepage</h1>
      <p>This is your public landing page.</p>
      {isLoggedIn ? userId.toString() + " is your userId" : "You are not logged in!"}
    </div>
  )
}