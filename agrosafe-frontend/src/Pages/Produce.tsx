import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";

export default function Produce() {
    const [cropType, setCropType] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const write = useAgroSafeWrite();

    const validateForm = () => {
        if (!cropType.trim()) {
            setError("Crop type is required");
            return false;
        }
        if (cropType.trim().length < 2) {
            setError("Crop type must be at least 2 characters long");
            return false;
        }
        if (!harvestDate.trim()) {
            setError("Harvest date is required");
            return false;
        }
        
        // Validate date format and ensure it's not in the future
        const selectedDate = new Date(harvestDate);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        if (selectedDate > today) {
            setError("Harvest date cannot be in the future");
            return false;
        }
        
        // Check if date is not too far in the past (optional validation)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        if (selectedDate < oneYearAgo) {
            setError("Harvest date cannot be more than 1 year ago");
            return false;
        }
        
        return true;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSuccess(false);
        
        try {
            const tx = await write.recordProduce(cropType.trim(), harvestDate);
            console.log("Transaction sent:", tx);
            setSuccess(true);
            setCropType("");
            setHarvestDate("");
            
            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Recording failed";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Set maximum date to today for the date input
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Record Produce</h2>
            
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">New Produce Entry</h3>
                
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
                        <p className="text-green-800">
                            ✅ Produce recorded successfully! The transaction has been sent to the blockchain.
                        </p>
                    </div>
                )}
                
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Crop Type</label>
                        <input
                            type="text"
                            value={cropType}
                            onChange={e => setCropType(e.target.value)}
                            placeholder="e.g., Organic Wheat, Corn, Tomatoes"
                            className="input"
                            disabled={loading}
                            maxLength={100}
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
                            max={today}
                            disabled={loading}
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

            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Only verified farmers can record produce</li>
                    <li>• Make sure to provide accurate harvest dates</li>
                    <li>• You need to connect your wallet and be a registered farmer</li>
                    <li>• Produce will be unverified until an admin reviews it</li>
                    <li>• Harvest dates cannot be in the future or more than 1 year old</li>
                </ul>
            </div>
        </div>
    );
}
