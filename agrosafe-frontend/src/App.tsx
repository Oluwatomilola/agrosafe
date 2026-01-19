import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>AgroSafe</h1>
        <p>A blockchain-based platform for farmer verification and produce certification.</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Welcome to AgroSafe - Secure farming with blockchain
        </p>
      </div>
    </>
  )
}

export default App
