import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";

export default function Produce() {
    const [cropType, setCropType] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { recordProduce } = useAgroSafeWrite();

    const validateDate = (date: string): boolean => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (!cropType.trim()) {
            setError("Crop type is required");
            return;
        }

        if (!harvestDate.trim()) {
            setError("Harvest date is required");
            return;
        }

        if (!validateDate(harvestDate)) {
            setError("Harvest date must be in YYYY-MM-DD format");
            return;
        }

        if (cropType.trim().length > 100) {
            setError("Crop type must be less than 100 characters");
            return;
        }

        try {
            setIsLoading(true);
            const tx = await recordProduce(cropType.trim(), harvestDate);
            console.log("Transaction hash:", tx);
            setSuccess("Produce recorded successfully! Transaction: " + tx);
            setCropType("");
            setHarvestDate("");
        } catch (err) {
            console.error("Record produce error:", err);
            const errorMessage = (err as any)?.message || "Unknown error occurred";
            setError("Failed to record produce: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Record Produce</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Crop Type *</label>
                    <input
                        type="text"
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                        placeholder="e.g., Tomato, Corn, Wheat"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        required
                    />
                    <small className="text-gray-500">Max 100 characters</small>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Harvest Date *</label>
                    <input
                        type="date"
                        value={harvestDate}
                        onChange={(e) => setHarvestDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        required
                    />
                    <small className="text-gray-500">Format: YYYY-MM-DD</small>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Recording..." : "Record Produce"}
                </button>
            </form>
        </div>
    );
}
