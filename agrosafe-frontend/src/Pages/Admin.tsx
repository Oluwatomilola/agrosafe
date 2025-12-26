import React, { useState, useEffect } from "react";
import { useAgroSafeRead, useAgroSafeWrite } from "../hooks/useAgroSafe";

export default function Admin() {
    const [selectedFarmerId, setSelectedFarmerId] = useState("");
    const [selectedProduceId, setSelectedProduceId] = useState("");
    const [farmerData, setFarmerData] = useState<any>(null);
    const [produceData, setProduceData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const read = useAgroSafeRead();
    const write = useAgroSafeWrite();

    const fetchFarmerData = async () => {
        if (!selectedFarmerId) return;
        try {
            const data = await read.getFarmerById(parseInt(selectedFarmerId));
            setFarmerData(data);
        } catch (err) {
            console.error(err);
            setFarmerData(null);
        }
    };

    const fetchProduceData = async () => {
        if (!selectedProduceId) return;
        try {
            const data = await read.getProduce(parseInt(selectedProduceId));
            setProduceData(data);
        } catch (err) {
            console.error(err);
            setProduceData(null);
        }
    };

    useEffect(() => {
        fetchFarmerData();
    }, [selectedFarmerId]);

    useEffect(() => {
        fetchProduceData();
    }, [selectedProduceId]);

    const verifyFarmer = async (verified: boolean) => {
        if (!selectedFarmerId) return;
        setLoading(true);
        try {
            await write.verifyFarmer(parseInt(selectedFarmerId), verified);
            alert(`Farmer ${verified ? "verified" : "unverified"} successfully!`);
            fetchFarmerData(); // Refresh data
        } catch (err) {
            console.error(err);
            alert("Operation failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    const certifyProduce = async (certified: boolean) => {
        if (!selectedProduceId) return;
        setLoading(true);
        try {
            await write.certifyProduce(parseInt(selectedProduceId), certified);
            alert(`Produce ${certified ? "certified" : "uncertified"} successfully!`);
            fetchProduceData(); // Refresh data
        } catch (err) {
            console.error(err);
            alert("Operation failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            
            {/* Farmer Management */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Farmer Verification</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Farmer ID</label>
                        <input
                            type="number"
                            value={selectedFarmerId}
                            onChange={e => setSelectedFarmerId(e.target.value)}
                            placeholder="Enter Farmer ID"
                            className="input"
                        />
                    </div>
                    
                    {farmerData && (
                        <div className="border rounded p-4 bg-gray-50">
                            <h4 className="font-medium mb-2">Farmer Details</h4>
                            <p><strong>ID:</strong> {farmerData.id?.toString()}</p>
                            <p><strong>Name:</strong> {farmerData.name}</p>
                            <p><strong>Location:</strong> {farmerData.location}</p>
                            <p><strong>Wallet:</strong> {farmerData.wallet}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`px-2 py-1 rounded text-xs ${
                                    farmerData.verified 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-yellow-100 text-yellow-800"
                                }`}>
                                    {farmerData.verified ? "Verified" : "Unverified"}
                                </span>
                            </p>
                            
                            <div className="mt-4 space-x-2">
                                <button
                                    onClick={() => verifyFarmer(true)}
                                    disabled={loading || farmerData.verified}
                                    className="btn"
                                >
                                    Verify Farmer
                                </button>
                                <button
                                    onClick={() => verifyFarmer(false)}
                                    disabled={loading || !farmerData.verified}
                                    className="btn bg-red-600 hover:bg-red-700"
                                >
                                    Unverify Farmer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Produce Management */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Produce Certification</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Produce ID</label>
                        <input
                            type="number"
                            value={selectedProduceId}
                            onChange={e => setSelectedProduceId(e.target.value)}
                            placeholder="Enter Produce ID"
                            className="input"
                        />
                    </div>
                    
                    {produceData && (
                        <div className="border rounded p-4 bg-gray-50">
                            <h4 className="font-medium mb-2">Produce Details</h4>
                            <p><strong>ID:</strong> {produceData.id?.toString()}</p>
                            <p><strong>Crop Type:</strong> {produceData.cropType}</p>
                            <p><strong>Harvest Date:</strong> {produceData.harvestDate}</p>
                            <p><strong>Farmer ID:</strong> {produceData.farmerId?.toString()}</p>
                            <p>
                                <strong>Certification:</strong>{" "}
                                <span className={`px-2 py-1 rounded text-xs ${
                                    produceData.certified 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-yellow-100 text-yellow-800"
                                }`}>
                                    {produceData.certified ? "Certified" : "Uncertified"}
                                </span>
                            </p>
                            
                            <div className="mt-4 space-x-2">
                                <button
                                    onClick={() => certifyProduce(true)}
                                    disabled={loading || produceData.certified}
                                    className="btn"
                                >
                                    Certify Produce
                                </button>
                                <button
                                    onClick={() => certifyProduce(false)}
                                    disabled={loading || !produceData.certified}
                                    className="btn bg-red-600 hover:bg-red-700"
                                >
                                    Uncertify Produce
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <h4 className="font-medium text-yellow-900 mb-2">⚠️ Admin Notice:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Only contract owners can verify farmers and certify produce</li>
                    <li>• Make sure to verify farmers before they can record produce</li>
                    <li>• Certification indicates organic or quality standards compliance</li>
                    <li>• All actions are recorded on the blockchain and are irreversible</li>
                </ul>
            </div>
        </div>
    );
}
