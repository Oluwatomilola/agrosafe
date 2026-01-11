import React, { useState } from "react";
import { useAgroSafeRead } from "../hooks/useAgroSafe";

export default function Trace() {
    const read = useAgroSafeRead();
    const [farmerId, setFarmerId] = useState("");
    const [produceId, setProduceId] = useState("");
    const [farmer, setFarmer] = useState<any>(null);
    const [produce, setProduce] = useState<any>(null);

    const viewFarmer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!farmerId) return;
        try {
            const f = await read.getFarmerById(Number(farmerId));
            setFarmer(f);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch farmer");
        }
    };

    const viewProduce = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!produceId) return;
        try {
            const p = await read.getProduce(Number(produceId));
            setProduce(p);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch produce");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">View Farmer</h2>
                <form onSubmit={viewFarmer} className="space-y-4">
                    <input
                        value={farmerId}
                        onChange={e => setFarmerId(e.target.value)}
                        placeholder="Farmer ID"
                        className="input"
                        required
                    />
                    <button type="submit" className="btn">View Farmer</button>
                </form>
                {farmer && (
                    <div className="mt-4">
                        <p>ID: {farmer[0]}</p>
                        <p>Name: {farmer[1]}</p>
                        <p>Wallet: {farmer[2]}</p>
                        <p>Location: {farmer[3]}</p>
                        <p>Verified: {farmer[4] ? "Yes" : "No"}</p>
                    </div>
                )}
            </div>
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">View Produce</h2>
                <form onSubmit={viewProduce} className="space-y-4">
                    <input
                        value={produceId}
                        onChange={e => setProduceId(e.target.value)}
                        placeholder="Produce ID"
                        className="input"
                        required
                    />
                    <button type="submit" className="btn">View Produce</button>
                </form>
                {produce && (
                    <div className="mt-4">
                        <p>ID: {produce[0]}</p>
                        <p>Farmer ID: {produce[1]}</p>
                        <p>Crop Type: {produce[2]}</p>
                        <p>Harvest Date: {produce[3]}</p>
                        <p>Certified: {produce[4] ? "Yes" : "No"}</p>
                    </div>
                )}
            </div>
        </div>
    );
}