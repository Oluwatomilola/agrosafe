import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAgroSafeRead } from "../hooks/useAgroSafe";

export default function Dashboard() {
    const { isConnected, address } = useAccount();
    const agroSafeRead = useAgroSafeRead();
    const [totalFarmers, setTotalFarmers] = useState<number | null>(null);
    const [totalProduce, setTotalProduce] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!isConnected) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                
                const [farmersCount, produceCount] = await Promise.all([
                    agroSafeRead.getTotalFarmers(),
                    agroSafeRead.getTotalProduce()
                ]);
                
                setTotalFarmers(Number(farmersCount));
                setTotalProduce(Number(produceCount));
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [isConnected, agroSafeRead]);

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">AgroSafe Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm text-gray-600">Total Farmers</h3>
                    <div className="text-xl font-bold text-blue-600">
                        {loading ? 'Loading...' : error ? 'Error' : (totalFarmers ?? 0)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {isConnected ? 'Active users' : 'Connect wallet to view'}
                    </p>
                </div>
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm text-gray-600">Total Produce</h3>
                    <div className="text-xl font-bold text-green-600">
                        {loading ? 'Loading...' : error ? 'Error' : (totalProduce ?? 0)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {isConnected ? 'Recorded items' : 'Connect wallet to view'}
                    </p>
                </div>
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm text-gray-600">Certified Products</h3>
                    <div className="text-xl font-bold text-purple-600">
                        {loading ? 'Loading...' : error ? 'Error' : '—'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Feature coming soon</p>
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
