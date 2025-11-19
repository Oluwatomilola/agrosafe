import React, { useState } from "react";
import { useAgroSafeWrite, useAgroSafeRead } from "../hooks/useAgroSafe";

export default function Admin() {
    const write = useAgroSafeWrite();
    const read = useAgroSafeRead();
    const [farmerId, setFarmerId] = useState<number>(0);
    const [produceId, setProduceId] = useState<number>(0);

    const onVerify = async () => {
        try {
            await write.verifyFarmer(farmerId, true);
            alert("Farmer verified");
        } catch (e) {
            alert("Error: " + (e as any).message);
        }
    };

    const onCertify = async () => {
        try {
            await write.certifyProduce(produceId, true);
            alert("Produce certified");
        } catch (e) {
            alert("Error: " + (e as any).message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <div className="space-y-4 mt-4">
                <div>
                    <input type="number" value={farmerId} onChange={e => setFarmerId(Number(e.target.value))} className="input" placeholder="Farmer ID" />
                    <button onClick={onVerify} className="btn ml-2">Verify</button>
                </div>
                <div>
                    <input type="number" value={produceId} onChange={e => setProduceId(Number(e.target.value))} className="input" placeholder="Produce ID" />
                    <button onClick={onCertify} className="btn ml-2">Certify</button>
                </div>
            </div>
        </div>
    );
}
