import React, { useState, useEffect } from "react";
import { useAgroSafeRead } from "../hooks/useAgroSafe";
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

interface TraceResult {
    produce: Produce;
    farmer: Farmer | null;
}

export default function Trace() {
    const read = useAgroSafeRead();
    const [searchId, setSearchId] = useState("");
    const [searchResult, setSearchResult] = useState<TraceResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchHistory, setSearchHistory] = useState<TraceResult[]>([]);

    useEffect(() => {
        // Load search history from localStorage
        const history = localStorage.getItem('agrosafe-trace-history');
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const produceId = parseInt(searchId);
        if (isNaN(produceId) || produceId <= 0) {
            setError("Please enter a valid produce ID");
            return;
        }

        setLoading(true);
        setError(null);
        setSearchResult(null);

        try {
            // Get produce information
            const produceData = await read.getProduce(produceId);
            
            if (!produceData || typeof produceData !== 'object' || !('id' in produceData)) {
                setError(`Produce with ID ${produceId} not found`);
                return;
            }

            const produce = produceData as Produce;

            // Get farmer information
            let farmer: Farmer | null = null;
            try {
                const farmerData = await read.getFarmerById(produce.farmerId);
                if (farmerData && typeof farmerData === 'object' && 'id' in farmerData) {
                    farmer = farmerData as Farmer;
                }
            } catch (err) {
                console.log(`Farmer ${produce.farmerId} not found`);
            }

            const result: TraceResult = { produce, farmer };
            setSearchResult(result);

            // Add to search history
            const newHistory = [result, ...searchHistory.filter(h => h.produce.id !== produce.id)].slice(0, 10);
            setSearchHistory(newHistory);
            localStorage.setItem('agrosafe-trace-history', JSON.stringify(newHistory));

        } catch (err) {
            console.error(err);
            setError("Failed to trace produce: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('agrosafe-trace-history');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Produce Traceability</h2>
            
            {/* Search Form */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">Search Produce</h3>
                
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="number"
                        value={searchId}
                        onChange={e => setSearchId(e.target.value)}
                        placeholder="Enter Produce ID"
                        className="flex-1 input"
                        disabled={loading}
                        min="1"
                    />
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Searching..."
                        className="btn"
                        disabled={!searchId.trim()}
                    >
                        Trace
                    </LoadingButton>
                </form>
                
                <p className="text-sm text-gray-600 mt-2">
                    Enter a produce ID to view its complete traceability information including farmer details and certification status.
                </p>
            </div>

            {/* Search Result */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <Loading size="lg" text="Tracing produce..." />
                </div>
            )}

            {searchResult && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Trace Results Found</h3>
                    
                    {/* Produce Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Produce Information</h4>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Produce ID:</span>
                                    <span>{searchResult.produce.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Crop Type:</span>
                                    <span>{searchResult.produce.cropType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Harvest Date:</span>
                                    <span>{searchResult.produce.harvestDate}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Certification Status:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        searchResult.produce.certified
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {searchResult.produce.certified ? 'Certified ✅' : 'Not Certified ⚠️'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Farmer Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Farmer Information</h4>
                            
                            {searchResult.farmer ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Farmer ID:</span>
                                        <span>{searchResult.farmer.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Name:</span>
                                        <span>{searchResult.farmer.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Location:</span>
                                        <span>{searchResult.farmer.location}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Verification Status:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            searchResult.farmer.verified
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {searchResult.farmer.verified ? 'Verified ✅' : 'Not Verified ❌'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Wallet Address:</span>
                                        <span className="text-xs font-mono break-all">
                                            {searchResult.farmer.wallet}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-red-600">
                                    <p>❌ Farmer information not available</p>
                                    <p className="text-sm text-gray-600">Farmer ID: {searchResult.produce.farmerId}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-6 p-4 bg-gray-50 rounded">
                        <h4 className="font-semibold mb-2">Trust Indicators</h4>
                        <div className="flex flex-wrap gap-2">
                            {searchResult.farmer?.verified && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                    👨‍🌾 Verified Farmer
                                </span>
                            )}
                            {searchResult.produce.certified && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                    🏆 Certified Produce
                                </span>
                            )}
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                📍 Traceable on Blockchain
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
                <div className="bg-white p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Recent Searches</h3>
                        <button
                            onClick={clearHistory}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Clear History
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {searchHistory.map((result, index) => (
                            <button
                                key={`${result.produce.id}-${index}`}
                                onClick={() => {
                                    setSearchId(result.produce.id.toString());
                                    setSearchResult(result);
                                }}
                                className="w-full text-left p-3 border rounded hover:bg-gray-50"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">Produce ID: {result.produce.id}</span>
                                        <span className="text-gray-600 ml-2">({result.produce.cropType})</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {result.produce.certified && (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Certified</span>
                                        )}
                                        {result.farmer?.verified && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Verified Farmer</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
import React, { useState } from "react";
import { useAgroSafeRead } from "../hooks/useAgroSafe";

export default function Trace() {
    const read = useAgroSafeRead();
    const [id, setId] = useState<number | "">("");
    const [result, setResult] = useState<any>(null);

    const onSearch = async () => {
        if (!id) return;
        try {
            const res = await read.getProduce(Number(id));
            setResult(res);
        } catch (e) {
            alert("Not found");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">Trace Produce</h2>
            <div className="mt-4 space-y-3">
                <input type="number" value={String(id)} onChange={e => setId(e.target.value === "" ? "" : Number(e.target.value))} className="input" placeholder="Produce ID" />
                <button onClick={onSearch} className="btn">Search</button>
                {result && (
                    <pre className="bg-slate-100 p-4 mt-3 rounded text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
                )}
            </div>
        </div>
    );
}
