import React, { useState, useEffect } from "react";
import { useAgroSafeRead, useAgroSafeWrite } from "../hooks/useAgroSafe";

interface Produce {
    id: number;
    cropType: string;
    harvestDate: string;
    farmerId: number;
    isCertified: boolean;
}

export default function Produce() {
    const [cropType, setCropType] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [produceList, setProduceList] = useState<Produce[]>([]);
    const [loading, setLoading] = useState(false);
    const read = useAgroSafeRead();
    const write = useAgroSafeWrite();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const tx = await write.recordProduce(cropType, harvestDate);
            console.log("tx", tx);
            alert("Produce recorded successfully!");
            setCropType("");
            setHarvestDate("");
            // Refresh the produce list
            loadProduce();
        } catch (err) {
            console.error(err);
            alert("Recording failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    const loadProduce = async () => {
        try {
            // For demo purposes, we'll load a few sample produce entries
            // In a real app, you'd fetch from the contract
            const sampleProduce: Produce[] = [
                { id: 1, cropType: "Wheat", harvestDate: "2024-06-15", farmerId: 1, isCertified: true },
                { id: 2, cropType: "Corn", harvestDate: "2024-07-20", farmerId: 2, isCertified: false },
                { id: 3, cropType: "Rice", harvestDate: "2024-08-10", farmerId: 1, isCertified: true }
            ];
            setProduceList(sampleProduce);
        } catch (e) {
            console.error("Error loading produce:", e);
        }
    };

    useEffect(() => {
        loadProduce();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Produce Management</h2>
            
            {/* Record New Produce Form */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Record New Produce</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Crop Type</label>
                        <input
                            value={cropType}
                            onChange={e => setCropType(e.target.value)}
                            placeholder="e.g., Wheat, Corn, Rice"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Harvest Date</label>
                        <input
                            type="date"
                            value={harvestDate}
                            onChange={e => setHarvestDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Recording..." : "Record Produce"}
                    </button>
                </form>
            </div>

            {/* Produce List */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Produce Records</h3>
                {produceList.length === 0 ? (
                    <p className="text-gray-500">No produce records found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Crop Type</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Harvest Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Farmer ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produceList.map((produce) => (
                                    <tr key={produce.id}>
                                        <td className="border border-gray-300 px-4 py-2">{produce.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{produce.cropType}</td>
                                        <td className="border border-gray-300 px-4 py-2">{produce.harvestDate}</td>
                                        <td className="border border-gray-300 px-4 py-2">{produce.farmerId}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-sm ${
                                                    produce.isCertified
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {produce.isCertified ? "Certified" : "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}