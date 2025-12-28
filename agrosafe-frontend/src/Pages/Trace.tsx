import React, { useState } from "react";
import { useAgroSafeRead } from "../hooks/useAgroSafe";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function Trace() {
    type Produce = {
        id: number;
        cropType: string;
        harvestDate: string;
        farmerId: number;
        certified: boolean;
    };

    const [produceId, setProduceId] = useState("");
    const [produce, setProduce] = useState<Produce | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { getProduce, getFarmerById } = useAgroSafeRead();

    const handleTrace = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setProduce(null);

        if (!produceId.trim()) {
            setError("Produce ID is required");
            return;
        }

        try {
            setIsLoading(true);
            const produceData = await getProduce(Number(produceId));
            console.log("Produce data:", produceData);
            setProduce(produceData);
        } catch (err) {
            console.error("Trace error:", err);
            const errorMessage = getErrorMessage(err);
            setError("Failed to trace produce: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Trace Produce</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleTrace} className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Produce ID *</label>
                    <input
                        type="number"
                        value={produceId}
                        onChange={(e) => setProduceId(e.target.value)}
                        placeholder="Enter produce ID to trace"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Tracing..." : "Trace Produce"}
                </button>
            </form>

            {produce && (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        <h3 className="text-md font-semibold mb-3">Produce Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Produce ID</label>
                                <p className="font-medium">{produce.id?.toString() || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Farmer ID</label>
                                <p className="font-medium">{produce.farmerId?.toString() || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Crop Type</label>
                                <p className="font-medium">{produce.cropType || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Harvest Date</label>
                                <p className="font-medium">{produce.harvestDate || "N/A"}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm text-gray-600">Certification Status</label>
                                <p className={`font-medium ${produce.certified ? "text-green-600" : "text-yellow-600"}`}>
                                    {produce.certified ? "✓ Certified" : "○ Pending Certification"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
