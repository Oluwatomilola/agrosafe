import React from 'react'
import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

// Contract ABI
const contractABI = [
  "function registerFarmer(string name, string location) external",
  "function verifyFarmer(uint256 farmerId, bool status) external",
  "function recordProduce(string cropType, string harvestDate) external",
  "function certifyProduce(uint256 produceId, bool certified) external",
  "function totalFarmers() external view returns (uint256)",
  "function totalProduce() external view returns (uint256)",
  "function farmers(uint256) external view returns (uint256, string, address, string, bool)",
  "function produce(uint256) external view returns (uint256, uint256, string, string, bool)"
]

const contractAddress = "" 

function App() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      setContract(contract)
    } else {
      alert("Please install MetaMask!")
    }
  }

  const handleRegister = async () => {
    const trimmedName = name.trim()
    const trimmedLocation = location.trim()
    if (!trimmedName || !trimmedLocation) {
      alert("Please fill in all fields!")
      return
    }
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      alert("Name must be between 2 and 50 characters!")
      return
    }
    if (trimmedLocation.length < 2 || trimmedLocation.length > 100) {
      alert("Location must be between 2 and 100 characters!")
      return
    }
    if (!contract) {
      alert("Please connect your wallet first!")
      return
    }
    try {
      const tx = await contract.registerFarmer(trimmedName, trimmedLocation)
      await tx.wait()
      alert(`Farmer registered successfully!`)
      setName('')
      setLocation('')
    } catch (error) {
      console.error(error)
      alert("Registration failed!")
    }
  }

  return (
    <>
      <div>
        <h1>AgroSafe</h1>
        <p>A blockchain-based platform for farmer verification and produce certification.</p>
        <button onClick={connectWallet}>Connect Wallet</button>
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
