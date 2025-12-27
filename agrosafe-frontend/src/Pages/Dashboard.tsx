import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAgroSafeRead } from "../hooks/useAgroSafe";

export default function Dashboard() {
    const { totalFarmers, totalProduce } = useAgroSafeRead();
    const [farmers, setFarmers] = useState<number | null>(null);
    const [produce, setProduce] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [farmersCount, produceCount] = await Promise.all([
                    totalFarmers(),
                    totalProduce()
                ]);
                setFarmers(Number(farmersCount));
                setProduce(Number(produceCount));
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">AgroSafe Dashboard</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                        <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Farmers</h3>
                        <div className="text-4xl font-bold text-blue-600 mt-2">{farmers ?? "—"}</div>
                        <p className="text-gray-500 text-sm mt-2">Registered farmers in the system</p>
                    </div>

                    <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                        <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Produce Records</h3>
                        <div className="text-4xl font-bold text-green-600 mt-2">{produce ?? "—"}</div>
                        <p className="text-gray-500 text-sm mt-2">Recorded produce items</p>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">System Overview</h3>
                <div className="space-y-3 text-gray-700">
                    <p className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        AgroSafe is a blockchain-based produce traceability system
                    </p>
                    <p className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Farmers can register and record their produce
                    </p>
                    <p className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Admins can verify farmers and certify produce
                    </p>
                    <p className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                        Users can trace the origin and certification status of any produce
                    </p>
                </div>
            </div>
            
            <div className="mt-6 bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded">
                        <h4 className="font-medium mb-2">Register as Farmer</h4>
                        <p className="text-sm text-gray-600 mb-3">
                            Join the AgroSafe network to start recording your produce
                        </p>
                        <button className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Get Started
                        </button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded">
                        <h4 className="font-medium mb-2">Track Products</h4>
                        <p className="text-sm text-gray-600 mb-3">
                            Use our traceability system to track produce from farm to table
                        </p>
                        <button className="btn btn-secondary px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Trace Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-blue-50 p-6 rounded border border-blue-200">
                <h3 className="text-lg font-semibold mb-2 text-blue-900">Welcome to AgroSafe</h3>
                <p className="text-blue-800 text-sm">
                    AgroSafe is a blockchain-based platform for agricultural supply chain traceability and certification. 
                    Connect your wallet to start using the platform features.
                </p>
                <ul className="text-sm text-blue-700 mt-3 space-y-1">
                    <li>• Register as a farmer to start recording produce</li>
                    <li>• Admins can verify farmers and certify products</li>
                    <li>• Track products through the entire supply chain</li>
                </ul>
            </div>
            
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 text-sm">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Retry
                    </button>
                </div>
            )}
            
            {!isConnected && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-sm">
                        Please connect your wallet to access all dashboard features.
                    </p>
                </div>
            )}
        </div>
    );
}
