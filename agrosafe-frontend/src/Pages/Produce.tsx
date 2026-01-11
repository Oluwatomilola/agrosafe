import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";

export default function Produce() {
    const [cropType, setCropType] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const write = useAgroSafeWrite();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cropType.trim() || !harvestDate.trim()) {
            alert("Please fill in all fields");
            return;
        }
        try {
            const tx = await write.recordProduce(cropType, harvestDate);
            console.log("tx", tx);
            alert("Produce recorded successfully");
            setCropType("");
            setHarvestDate("");
        } catch (err) {
            console.error(err);
            alert("Failed to record produce: " + (err as any).message);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Record Produce</h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    value={cropType}
                    onChange={e => setCropType(e.target.value)}
                    placeholder="Crop Type"
                    className="input"
                    required
                />
                <input
                    value={harvestDate}
                    onChange={e => setHarvestDate(e.target.value)}
                    placeholder="Harvest Date"
                    className="input"
                    required
                />
                <button type="submit" className="btn">Record Produce</button>
            </form>
        </div>
    );
}