import React from "react";

export default function Dashboard() {
import React, { useEffect, useState } from "react";
import { useAgroSafeRead } from "../hooks/useAgroSafe";
import Loading from "../components/Loading";

export default function Dashboard() {
    const read = useAgroSafeRead();
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const t = await read.totalFarmers();
                setTotal(Number(t));
            } catch (e) {
                console.error(e);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[200px]">
                <Loading size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">AgroSafe Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm text-gray-600">Total Farmers</h3>
                    <div className="text-xl font-bold text-blue-600">—</div>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </div>
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm text-gray-600">Total Produce</h3>
                    <div className="text-xl font-bold text-green-600">—</div>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </div>
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm text-gray-600">Certified Products</h3>
                    <div className="text-xl font-bold text-purple-600">—</div>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </div>
            </div>
            
            <div className="mt-6 bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded">
                        <h4 className="font-medium mb-2">Register as Farmer</h4>
                        <p className="text-sm text-gray-600 mb-3">Join the AgroSafe network to start recording your produce</p>
                        <button className="btn">Get Started</button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded">
                        <h4 className="font-medium mb-2">Track Products</h4>
                        <p className="text-sm text-gray-600 mb-3">Use our traceability system to track produce from farm to table</p>
                        <button className="btn">Trace Now</button>
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
        </div>
    );
}
