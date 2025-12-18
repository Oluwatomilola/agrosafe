import React, { useState, useEffect } from "react";
import { useAgroSafeRead, useAgroSafeWrite } from "../hooks/useAgroSafe";

interface Produce {
    id: number;
    cropType: string;
    harvestDate: string;
    farmerId: number;
    isCertified: boolean;
}
import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";
import { LoadingButton } from "../components/Loading";

export default function Produce() {
    const [cropType, setCropType] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [loading, setLoading] = useState(false);
    const write = useAgroSafeWrite();
    const [success, setSuccess] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cropType.trim() || !harvestDate.trim()) return;

        setLoading(true);
        setSuccess(false);
        try {
            const tx = await write.recordProduce(cropType, harvestDate);
            console.log("Transaction sent:", tx);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const write = useAgroSafeWrite();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const tx = await write.recordProduce(cropType, harvestDate);
            console.log("tx", tx);
            setSuccess(true);
            setCropType("");
            setHarvestDate("");
        } catch (err) {
            console.error(err);
            alert("Recording failed: " + (err as any).message);
            setError("Recording failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Record Produce</h2>
            
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">New Produce Entry</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Crop Type</label>
                        <input
                            type="text"
                            value={cropType}
                            onChange={e => setCropType(e.target.value)}
                            placeholder="e.g., Organic Wheat, Corn, Tomatoes"
                            className="input"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Harvest Date</label>
                        <input
                            type="date"
                            value={harvestDate}
                            onChange={e => setHarvestDate(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn w-full"
                    >
                        {loading ? "Recording..." : "Record Produce"}
                    </button>
                </form>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 p-4 rounded">
                    <p className="text-green-800">
                        ✅ Produce recorded successfully! The transaction has been sent to the blockchain.
                    </p>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Only verified farmers can record produce</li>
                    <li>• Make sure to provide accurate harvest dates</li>
                    <li>• You need to connect your wallet and be a registered farmer</li>
                    <li>• Produce will be unverified until an admin reviews it</li>
                </ul>
            </div>
        </div>
    );
}
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Record Produce</h2>
            
            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Produce recorded successfully! Your transaction has been submitted.
                </div>
            )}
            
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            
            <form onSubmit={onSubmit} className="space-y-4">
                <input 
                    value={cropType} 
                    onChange={e => setCropType(e.target.value)} 
                    placeholder="Crop Type (e.g., Maize, Rice, Wheat)" 
                    className="input"
                    disabled={loading}
                    required
                />
                <input 
                    type="date"
                    value={harvestDate} 
                    onChange={e => setHarvestDate(e.target.value)} 
                    placeholder="Harvest Date" 
                    className="input"
                    disabled={loading}
                    required
                />
                <LoadingButton 
                    type="submit" 
                    className="btn"
                    loading={loading}
                    loadingText="Recording..."
                >
                    Record Produce
                </LoadingButton>
            </form>
            
            <div className="mt-6 text-sm text-gray-600">
                <p><strong>Note:</strong> You must be a registered and verified farmer to record produce.</p>
            </div>
        </div>
    );
}
