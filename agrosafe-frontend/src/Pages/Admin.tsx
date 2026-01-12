import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";

export default function Admin() {
    const [farmerId, setFarmerId] = useState("");
    const [produceId, setProduceId] = useState("");
    const write = useAgroSafeWrite();

    const verifyFarmer = async (status: boolean) => {
        if (!farmerId.trim()) {
            alert("Please enter a farmer ID");
            return;
        }
        const id = parseInt(farmerId);
        if (isNaN(id) || id <= 0) {
            alert("Invalid farmer ID");
            return;
        }
        try {
            const tx = await write.verifyFarmer(id, status);
            console.log("tx", tx);
            alert(`Farmer ${status ? "verified" : "unverified"} successfully`);
        } catch (err) {
            console.error(err);
            alert(`Failed to ${status ? "verify" : "unverify"} farmer: ${(err as any).message}`);
        }
    };

    const certifyProduce = async (status: boolean) => {
        if (!produceId.trim()) {
            alert("Please enter a produce ID");
            return;
        }
        const id = parseInt(produceId);
        if (isNaN(id) || id <= 0) {
            alert("Invalid produce ID");
            return;
        }
        try {
            const tx = await write.certifyProduce(id, status);
            console.log("tx", tx);
            alert(`Produce ${status ? "certified" : "uncertified"} successfully`);
        } catch (err) {
            console.error(err);
            alert(`Failed to ${status ? "certify" : "uncertify"} produce: ${(err as any).message}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

            <div className="mb-8">
                <h3 className="text-md font-semibold mb-4">Farmer Verification</h3>
                <div className="space-y-4">
                    <input
                        value={farmerId}
                        onChange={e => setFarmerId(e.target.value)}
                        placeholder="Farmer ID"
                        className="input"
                        type="number"
                    />
                    <div className="flex space-x-2">
                        <button onClick={() => verifyFarmer(true)} className="btn">Verify Farmer</button>
                        <button onClick={() => verifyFarmer(false)} className="btn">Unverify Farmer</button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-md font-semibold mb-4">Produce Certification</h3>
                <div className="space-y-4">
                    <input
                        value={produceId}
                        onChange={e => setProduceId(e.target.value)}
                        placeholder="Produce ID"
                        className="input"
                        type="number"
                    />
                    <div className="flex space-x-2">
                        <button onClick={() => certifyProduce(true)} className="btn">Certify Produce</button>
                        <button onClick={() => certifyProduce(false)} className="btn">Uncertify Produce</button>
                    </div>
                </div>
            </div>
        </div>
    );
}