import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";
import { usePublicClient } from "wagmi";
import AgroSafeABI from "../abi/AgroSafe.json";
import { Address } from "viem";

const CONTRACT_ADDRESS = (import.meta as any).env.VITE_AGROSAFE_ADDRESS as string;

export default function Produce() {
    const { address, isConnected } = useAccount();
    const write = useAgroSafeWrite();
    const publicClient = usePublicClient();
    const [cropType, setCropType] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isConnected && address) {
            checkVerification();
        } else {
            setIsVerified(null);
        }
    }, [isConnected, address]);

    const checkVerification = async () => {
        if (!publicClient) return;
        try {
            const farmerId = await publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "farmerIdsByWallet",
                args: [address]
            });
            if (Number(farmerId) === 0) {
                setIsVerified(false);
                return;
            }
            const farmer = await publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "farmers",
                args: [farmerId]
            }) as [bigint, string, Address, string, boolean];
            setIsVerified(farmer[4]); // verified is the 5th element
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to check verification status");
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        try {
            const tx = await write.recordProduce(cropType, harvestDate);
            console.log("tx", tx);
            setSuccessMessage("Produce recorded successfully!");
            setCropType("");
            setHarvestDate("");
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to record produce: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return <div>Please connect your wallet</div>;
    }

    if (isVerified === null) {
        return <div>Loading verification status...</div>;
    }

    if (!isVerified) {
        return <div>Only verified farmers can record produce.</div>;
    }

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Record New Produce</h2>
            {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
            {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    type="text"
                    value={cropType}
                    onChange={e => setCropType(e.target.value)}
                    placeholder="Crop Type"
                    className="input"
                    required
                />
                <input
                    type="date"
                    value={harvestDate}
                    onChange={e => setHarvestDate(e.target.value)}
                    className="input"
                    required
                />
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Recording..." : "Record Produce"}
                </button>
            </form>
        </div>
    );
}
