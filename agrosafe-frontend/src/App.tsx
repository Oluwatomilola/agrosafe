import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  const handleRegister = () => {
    // Placeholder for registration logic
    alert(`Registering farmer: ${name} from ${location}`)
  }

  return (
    <>
      <div>
        <h1>AgroSafe</h1>
        <p>A blockchain-based platform for farmer verification and produce certification.</p>
      </div>
      <div className="card">
        <h2>Farmer Registration</h2>
        <input
          type="text"
          placeholder="Farmer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleRegister}>Register Farmer</button>
      </div>
    </>
  )
}

export default App
