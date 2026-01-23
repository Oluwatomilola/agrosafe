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

const contractAddress = "0xYourContractAddressHere" // Replace with actual deployed address

function App() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [farmerId, setFarmerId] = useState('')
  const [verifyStatus, setVerifyStatus] = useState('')
  const [cropType, setCropType] = useState('')
  const [harvestDate, setHarvestDate] = useState('')
  const [produceId, setProduceId] = useState('')
  const [certifyStatus, setCertifyStatus] = useState('')

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

  const handleVerify = async () => {
    if (!farmerId || !verifyStatus) {
      alert("Please fill in all fields!")
      return
    }
    if (!contract) {
      alert("Please connect your wallet first!")
      return
    }
    try {
      const tx = await contract.verifyFarmer(farmerId, verifyStatus === 'true')
      await tx.wait()
      alert(`Farmer verified successfully!`)
      setFarmerId('')
      setVerifyStatus('')
    } catch (error) {
      console.error(error)
      alert("Verification failed!")
    }
  }

  const handleRecordProduce = async () => {
    const trimmedCrop = cropType.trim()
    const trimmedDate = harvestDate.trim()
    if (!trimmedCrop || !trimmedDate) {
      alert("Please fill in all fields!")
      return
    }
    if (!contract) {
      alert("Please connect your wallet first!")
      return
    }
    try {
      const tx = await contract.recordProduce(trimmedCrop, trimmedDate)
      await tx.wait()
      alert(`Produce recorded successfully!`)
      setCropType('')
      setHarvestDate('')
    } catch (error) {
      console.error(error)
      alert("Recording failed!")
    }
  }

  const handleCertify = async () => {
    if (!produceId || !certifyStatus) {
      alert("Please fill in all fields!")
      return
    }
    if (!contract) {
      alert("Please connect your wallet first!")
      return
    }
    try {
      const tx = await contract.certifyProduce(produceId, certifyStatus === 'true')
      await tx.wait()
      alert(`Produce certified successfully!`)
      setProduceId('')
      setCertifyStatus('')
    } catch (error) {
      console.error(error)
      alert("Certification failed!")
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
      <div className="card">
        <h2>Verify Farmer (Admin Only)</h2>
        <input
          type="number"
          placeholder="Farmer ID"
          value={farmerId}
          onChange={(e) => setFarmerId(e.target.value)}
        />
        <select value={verifyStatus} onChange={(e) => setVerifyStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <button onClick={handleVerify}>Verify Farmer</button>
      </div>
      <div className="card">
        <h2>Record Produce</h2>
        <input
          type="text"
          placeholder="Crop Type"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
        />
        <input
          type="date"
          placeholder="Harvest Date"
          value={harvestDate}
          onChange={(e) => setHarvestDate(e.target.value)}
        />
        <button onClick={handleRecordProduce}>Record Produce</button>
      </div>
      <div className="card">
        <h2>Certify Produce (Admin Only)</h2>
        <input
          type="number"
          placeholder="Produce ID"
          value={produceId}
          onChange={(e) => setProduceId(e.target.value)}
        />
        <select value={certifyStatus} onChange={(e) => setCertifyStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="true">Certified</option>
          <option value="false">Uncertified</option>
        </select>
        <button onClick={handleCertify}>Certify Produce</button>
      </div>
    </>
  )
}

export default App
