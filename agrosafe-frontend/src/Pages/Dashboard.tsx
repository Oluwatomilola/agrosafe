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
                    <h3 className="text-sm">Total Farmers</h3>
                    <div className="text-xl">{total ?? "—"}</div>
                </div>
            </div>
        </div>
    );
}
