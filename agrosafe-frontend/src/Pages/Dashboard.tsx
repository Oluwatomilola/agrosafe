import React, { useEffect, useState } from "react";
import { useAgroSafeRead } from "../hooks/useAgroSafe";

export default function Dashboard() {
    const read = useAgroSafeRead();
    const [totalFarmers, setTotalFarmers] = useState<number | null>(null);
    const [totalProduce, setTotalProduce] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const f = await read.totalFarmers();
                setTotalFarmers(Number(f));
                const p = await read.totalProduce();
                setTotalProduce(Number(p));
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">AgroSafe Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm">Total Farmers</h3>
                    <div className="text-xl">{totalFarmers ?? "—"}</div>
                </div>
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm">Total Produce</h3>
                    <div className="text-xl">{totalProduce ?? "—"}</div>
                </div>
            </div>
        </div>
    );
}
