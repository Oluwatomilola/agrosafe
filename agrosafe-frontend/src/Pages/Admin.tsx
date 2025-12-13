import React, { useState, useEffect } from "react";
import { useAgroSafeRead, useAgroSafeWrite } from "../hooks/useAgroSafe";

interface Farmer {
    id: number;
    name: string;
    location: string;
    isVerified: boolean;
}

interface Produce {
    id: number;
    cropType: string;
    harvestDate: string;
    farmerId: number;
    isCertified: boolean;
}

export default function Admin() {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [produce, setProduce] = useState<Produce[]>([]);
    const [activeTab, setActiveTab] = useState<'farmers' | 'produce'>('farmers');
    const [loading, setLoading] = useState(false);
    const read = useAgroSafeRead();
    const write = useAgroSafeWrite();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Sample data - in a real app, fetch from contract
            const sampleFarmers: Farmer[] = [
                { id: 1, name: "John Doe", location: "California, USA", isVerified: true },
                { id: 2, name: "Jane Smith", location: "Iowa, USA", isVerified: false },
                { id: 3, name: "Mike Johnson", location: "Texas, USA", isVerified: true },
                { id: 4, name: "Sarah Wilson", location: "Nebraska, USA", isVerified: false }
            ];

            const sampleProduce: Produce[] = [
                { id: 1, cropType: "Wheat", harvestDate: "2024-06-15", farmerId: 1, isCertified: true },
                { id: 2, cropType: "Corn", harvestDate: "2024-07-20", farmerId: 2, isCertified: false },
                { id: 3, cropType: "Rice", harvestDate: "2024-08-10", farmerId: 1, isCertified: true },
                { id: 4, cropType: "Soybeans", harvestDate: "2024-09-05", farmerId: 3, isCertified: false }
            ];

            setFarmers(sampleFarmers);
            setProduce(sampleProduce);
        } catch (e) {
            console.error("Error loading data:", e);
        }
    };

    const handleVerifyFarmer = async (farmerId: number, status: boolean) => {
        setLoading(true);
        try {
            const tx = await write.verifyFarmer(farmerId, status);
            console.log("Verification tx:", tx);
            alert(`Farmer ${status ? 'verified' : 'rejected'} successfully!`);
            // Update local state
            setFarmers(prev => prev.map(farmer => 
                farmer.id === farmerId ? { ...farmer, isVerified: status } : farmer
            ));
        } catch (err) {
            console.error(err);
            alert("Verification failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    const handleCertifyProduce = async (produceId: number, status: boolean) => {
        setLoading(true);
        try {
            const tx = await write.certifyProduce(produceId, status);
            console.log("Certification tx:", tx);
            alert(`Produce ${status ? 'certified' : 'decertified'} successfully!`);
            // Update local state
            setProduce(prev => prev.map(p => 
                p.id === produceId ? { ...p, isCertified: status } : p
            ));
        } catch (err) {
            console.error(err);
            alert("Certification failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            
            {/* Tab Navigation */}
            <div className="bg-white rounded shadow">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('farmers')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'farmers'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Farmers ({farmers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('produce')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'produce'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Produce ({produce.length})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {/* Farmers Tab */}
                    {activeTab === 'farmers' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Farmer Management</h3>
                            {farmers.length === 0 ? (
                                <p className="text-gray-500">No farmers found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {farmers.map((farmer) => (
                                                <tr key={farmer.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{farmer.id}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{farmer.name}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{farmer.location}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <span
                                                            className={`px-2 py-1 rounded text-sm ${
                                                                farmer.isVerified
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {farmer.isVerified ? "Verified" : "Pending"}
                                                        </span>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className="space-x-2">
                                                            <button
                                                                onClick={() => handleVerifyFarmer(farmer.id, true)}
                                                                disabled={loading || farmer.isVerified}
                                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                                            >
                                                                Verify
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerifyFarmer(farmer.id, false)}
                                                                disabled={loading}
                                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Produce Tab */}
                    {activeTab === 'produce' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Produce Certification</h3>
                            {produce.length === 0 ? (
                                <p className="text-gray-500">No produce found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Crop Type</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Harvest Date</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Farmer ID</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {produce.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{item.cropType}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{item.harvestDate}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{item.farmerId}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <span
                                                            className={`px-2 py-1 rounded text-sm ${
                                                                item.isCertified
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {item.isCertified ? "Certified" : "Pending"}
                                                        </span>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className="space-x-2">
                                                            <button
                                                                onClick={() => handleCertifyProduce(item.id, true)}
                                                                disabled={loading || item.isCertified}
                                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                                                            >
                                                                Certify
                                                            </button>
                                                            <button
                                                                onClick={() => handleCertifyProduce(item.id, false)}
                                                                disabled={loading}
                                                                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                                                            >
                                                                Decertify
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h4 className="text-sm font-medium text-gray-500">Total Farmers</h4>
                    <div className="text-2xl font-bold">{farmers.length}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h4 className="text-sm font-medium text-gray-500">Verified Farmers</h4>
                    <div className="text-2xl font-bold text-green-600">
                        {farmers.filter(f => f.isVerified).length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h4 className="text-sm font-medium text-gray-500">Total Produce</h4>
                    <div className="text-2xl font-bold">{produce.length}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h4 className="text-sm font-medium text-gray-500">Certified Produce</h4>
                    <div className="text-2xl font-bold text-blue-600">
                        {produce.filter(p => p.isCertified).length}
                    </div>
                </div>
            </div>
        </div>
    );
}