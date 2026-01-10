import React, { useEffect, useState } from "react";
import { useAgroSafeRead } from "../hooks/useAgroSafe";
import { getErrorMessage } from "../utils/getErrorMessage";
import { logger } from "../utils/logger";

export default function Dashboard() {
    const { getTotalFarmers, getTotalProduce } = useAgroSafeRead();
    const [farmersCount, setFarmersCount] = useState<number | null>(null);
    const [produceCount, setProduceCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const farmers = await getTotalFarmers();
                setFarmersCount(Number(farmers));
                const produce = await getTotalProduce();
                setProduceCount(Number(produce));
            } catch (err) {
                logger.error("Failed to fetch dashboard data:", err);
                const errorMessage = getErrorMessage(err);
                setError("Failed to load dashboard data: " + errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [getTotalFarmers, getTotalProduce]);

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
                        <div className="text-4xl font-bold text-blue-600 mt-2">{farmersCount ?? "—"}</div>
                        <p className="text-gray-500 text-sm mt-2">Registered farmers in the system</p>
                    </div>

                    <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                        <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Produce Records</h3>
                        <div className="text-4xl font-bold text-green-600 mt-2">{produceCount ?? "—"}</div>
                        <p className="text-gray-500 text-sm mt-2">Recorded produce items in the system</p>
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
        </div>
    );
}
