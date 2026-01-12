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
import { getErrorMessage } from "../utils/getErrorMessage";
import { logger } from "../utils/logger";

export default function Admin() {
    const [farmerId, setFarmerId] = useState("");
    const [verifyStatus, setVerifyStatus] = useState(false);
    const [produceId, setProduceId] = useState("");
    const [certifyStatus, setCertifyStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { verifyFarmer, certifyProduce } = useAgroSafeWrite();

    const handleVerifyFarmer = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!farmerId.trim()) {
            setError("Farmer ID is required");
            return;
        }

        try {
            setIsLoading(true);
            const tx = await verifyFarmer(Number(farmerId), verifyStatus);
            logger.info("Transaction hash:", tx);
            setSuccess(`Farmer ${verifyStatus ? "verified" : "unverified"} successfully! Transaction: ${tx}`);
            setFarmerId("");
            setVerifyStatus(false);
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError("Failed to verify farmer: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCertifyProduce = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!produceId.trim()) {
            setError("Produce ID is required");
            return;
        }

        try {
            setIsLoading(true);
            const tx = await certifyProduce(Number(produceId), certifyStatus);
            logger.info("Transaction hash:", tx);
            setSuccess(`Produce ${certifyStatus ? "certified" : "uncertified"} successfully! Transaction: ${tx}`);
            setProduceId("");
            setCertifyStatus(false);
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError("Failed to certify produce: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

            <div className="mb-8">
                <h3 className="text-md font-semibold mb-4">Farmer Verification</h3>
                <div className="space-y-4">
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">Verify Farmer</h2>
                <form onSubmit={verifyFarmer} className="space-y-4">
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
                        type="number"
                    />
                    <div className="flex space-x-2">
                        <button onClick={() => certifyProduce(true)} className="btn">Certify Produce</button>
                        <button onClick={() => certifyProduce(false)} className="btn">Uncertify Produce</button>
                    </div>
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
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Verify Farmer Form */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">Verify Farmer</h3>
                    <form onSubmit={handleVerifyFarmer} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Farmer ID *</label>
                            <input
                                type="number"
                                value={farmerId}
                                onChange={(e) => setFarmerId(e.target.value)}
                                placeholder="Enter farmer ID"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="verifyStatus"
                                checked={verifyStatus}
                                onChange={(e) => setVerifyStatus(e.target.checked)}
                                className="mr-2"
                                disabled={isLoading}
                            />
                            <label htmlFor="verifyStatus" className="text-sm font-medium">
                                Verify farmer
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Verify Farmer"}
                        </button>
                    </form>
                </div>

                {/* Certify Produce Form */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">Certify Produce</h3>
                    <form onSubmit={handleCertifyProduce} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Produce ID *</label>
                            <input
                                type="number"
                                value={produceId}
                                onChange={(e) => setProduceId(e.target.value)}
                                placeholder="Enter produce ID"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="certifyStatus"
                                checked={certifyStatus}
                                onChange={(e) => setCertifyStatus(e.target.checked)}
                                className="mr-2"
                                disabled={isLoading}
                            />
                            <label htmlFor="certifyStatus" className="text-sm font-medium">
                                Certify produce
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Certify Produce"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
}
