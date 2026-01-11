import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";

export default function Admin() {
    const [farmerId, setFarmerId] = useState("");
    const [farmerStatus, setFarmerStatus] = useState(false);
    const [produceId, setProduceId] = useState("");
    const [produceStatus, setProduceStatus] = useState(false);
    const write = useAgroSafeWrite();

    const verifyFarmer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!farmerId) {
            alert("Enter farmer ID");
            return;
        }
        try {
            const tx = await write.verifyFarmer(Number(farmerId), farmerStatus);
            console.log("tx", tx);
            alert("Farmer verified");
        } catch (err) {
            console.error(err);
            alert("Failed: " + (err as any).message);
        }
    };

    const certifyProduce = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!produceId) {
            alert("Enter produce ID");
            return;
        }
        try {
            const tx = await write.certifyProduce(Number(produceId), produceStatus);
            console.log("tx", tx);
            alert("Produce certified");
        } catch (err) {
            console.error(err);
            alert("Failed: " + (err as any).message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">Verify Farmer</h2>
                <form onSubmit={verifyFarmer} className="space-y-4">
                    <input
                        value={farmerId}
                        onChange={e => setFarmerId(e.target.value)}
                        placeholder="Farmer ID"
                        className="input"
                        required
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={farmerStatus}
                            onChange={e => setFarmerStatus(e.target.checked)}
                        />
                        Verified
                    </label>
                    <button type="submit" className="btn">Verify Farmer</button>
                </form>
            </div>
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">Certify Produce</h2>
                <form onSubmit={certifyProduce} className="space-y-4">
                    <input
                        value={produceId}
                        onChange={e => setProduceId(e.target.value)}
                        placeholder="Produce ID"
                        className="input"
                        required
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={produceStatus}
                            onChange={e => setProduceStatus(e.target.checked)}
                        />
                        Certified
                    </label>
                    <button type="submit" className="btn">Certify Produce</button>
                </form>
            </div>
        </div>
    );
}