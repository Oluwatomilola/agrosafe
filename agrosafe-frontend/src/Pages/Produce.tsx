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
            setError("Recording failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    return (
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