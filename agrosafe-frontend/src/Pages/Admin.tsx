import React, { useState, useEffect } from "react";
import { useAgroSafeRead, useAgroSafeWrite } from "../hooks/useAgroSafe";
import { LoadingButton } from "../components/Loading";

interface Farmer {
    id: number;
    name: string;
    wallet: string;
    location: string;
    verified: boolean;
}

interface Produce {
    id: number;
    farmerId: number;
    cropType: string;
    harvestDate: string;
    certified: boolean;
}

export default function Admin() {
    const read = useAgroSafeRead();
    const write = useAgroSafeWrite();
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [produce, setProduce] = useState<Produce[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'farmers' | 'produce'>('farmers');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Load farmers
            const totalFarmers = await read.totalFarmers();
            const farmersList: Farmer[] = [];
            for (let i = 1; i <= Number(totalFarmers); i++) {
                try {
                    const farmerData = await read.getFarmerById(i);
                    if (farmerData && typeof farmerData === 'object' && 'id' in farmerData) {
                        farmersList.push(farmerData as Farmer);
                    }
                } catch (err) {
                    console.log(`Farmer ${i} not found or error loading`);
                }
            }
            setFarmers(farmersList);

            // Load produce
            const totalProduce = await read.totalProduce();
            const produceList: Produce[] = [];
            for (let i = 1; i <= Number(totalProduce); i++) {
                try {
                    const produceData = await read.getProduce(i);
                    if (produceData && typeof produceData === 'object' && 'id' in produceData) {
                        produceList.push(produceData as Produce);
                    }
                } catch (err) {
                    console.log(`Produce ${i} not found or error loading`);
                }
            }
            setProduce(produceList);

        } catch (err) {
            console.error(err);
            setError("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyFarmer = async (farmerId: number, status: boolean) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            await write.verifyFarmer(farmerId, status);
            setSuccess(`Farmer ${status ? 'verified' : 'unverified'} successfully`);
            await loadData(); // Refresh data
        } catch (err) {
            console.error(err);
            setError("Failed to update farmer status: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    const handleCertifyProduce = async (produceId: number, status: boolean) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            await write.certifyProduce(produceId, status);
            setSuccess(`Produce ${status ? 'certified' : 'uncertified'} successfully`);
            await loadData(); // Refresh data
        } catch (err) {
            console.error(err);
            setError("Failed to update produce certification: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && farmers.length === 0) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[200px]">
                <Loading size="lg" text="Loading admin panel..." />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
            
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {success}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('farmers')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'farmers'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Farmers ({farmers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('produce')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'produce'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Produce ({produce.length})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Farmers Tab */}
            {activeTab === 'farmers' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Farmers Management</h3>
                        <button 
                            onClick={loadData}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                            disabled={loading}
                        >
                            Refresh
                        </button>
                    </div>
                    
                    {farmers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No farmers registered yet.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {farmers.map((farmer) => (
                                <div key={farmer.id} className="bg-white p-4 rounded shadow border">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg">{farmer.name}</h4>
                                            <p className="text-sm text-gray-600">ID: {farmer.id}</p>
                                            <p className="text-sm text-gray-600">Wallet: {farmer.wallet}</p>
                                            <p className="text-sm text-gray-600">Location: {farmer.location}</p>
                                            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                                                farmer.verified 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {farmer.verified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <LoadingButton
                                                onClick={() => handleVerifyFarmer(farmer.id, !farmer.verified)}
                                                loading={loading}
                                                loadingText="Updating..."
                                                className={`px-3 py-1 rounded text-sm ${
                                                    farmer.verified
                                                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                                                }`}
                                            >
                                                {farmer.verified ? 'Unverify' : 'Verify'}
                                            </LoadingButton>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Produce Tab */}
            {activeTab === 'produce' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Produce Management</h3>
                        <button 
                            onClick={loadData}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                            disabled={loading}
                        >
                            Refresh
                        </button>
                    </div>
                    
                    {produce.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No produce recorded yet.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {produce.map((item) => {
                                const farmer = farmers.find(f => f.id === item.farmerId);
                                return (
                                    <div key={item.id} className="bg-white p-4 rounded shadow border">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg">{item.cropType}</h4>
                                                <p className="text-sm text-gray-600">ID: {item.id}</p>
                                                <p className="text-sm text-gray-600">Farmer: {farmer?.name || `ID ${item.farmerId}`}</p>
                                                <p className="text-sm text-gray-600">Harvest Date: {item.harvestDate}</p>
                                                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                                                    item.certified 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {item.certified ? 'Certified' : 'Not Certified'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <LoadingButton
                                                    onClick={() => handleCertifyProduce(item.id, !item.certified)}
                                                    loading={loading}
                                                    loadingText="Updating..."
                                                    className={`px-3 py-1 rounded text-sm ${
                                                        item.certified
                                                            ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                                                    }`}
                                                >
                                                    {item.certified ? 'Uncertify' : 'Certify'}
                                                </LoadingButton>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
