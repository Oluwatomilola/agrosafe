import React, { useState } from "react";
import { useAgroSafeRead } from "../hooks/useAgroSafe";

interface TraceRecord {
    produceId: number;
    cropType: string;
    harvestDate: string;
    farmerId: number;
    farmerName: string;
    farmerLocation: string;
    isFarmerVerified: boolean;
    isProduceCertified: boolean;
    certificationDate?: string;
    certificationAuthority?: string;
    qualityGrade?: string;
    processingSteps: string[];
    currentLocation: string;
    transportHistory: TransportStep[];
}

interface TransportStep {
    step: number;
    location: string;
    timestamp: string;
    handler: string;
    status: string;
}

export default function Trace() {
    const [searchQuery, setSearchQuery] = useState("");
    const [traceResult, setTraceResult] = useState<TraceRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState<'id' | 'qr'>('id');
    const read = useAgroSafeRead();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            // Simulate blockchain trace lookup
            // In a real app, this would query the smart contract
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            const mockTraceData: TraceRecord = {
                produceId: parseInt(searchQuery),
                cropType: "Organic Wheat",
                harvestDate: "2024-06-15",
                farmerId: 1,
                farmerName: "John Doe",
                farmerLocation: "California Valley Farm, USA",
                isFarmerVerified: true,
                isProduceCertified: true,
                certificationDate: "2024-06-20",
                certificationAuthority: "USDA Organic",
                qualityGrade: "Grade A",
                processingSteps: [
                    "Harvested on 2024-06-15",
                    "Cleaned and sorted on 2024-06-16", 
                    "Quality inspection passed on 2024-06-17",
                    "Packaged on 2024-06-18",
                    "Certified organic on 2024-06-20"
                ],
                currentLocation: "Distribution Center, Texas",
                transportHistory: [
                    {
                        step: 1,
                        location: "California Valley Farm",
                        timestamp: "2024-06-15 08:00",
                        handler: "John Doe (Farmer)",
                        status: "Harvested"
                    },
                    {
                        step: 2,
                        location: "Processing Facility, California",
                        timestamp: "2024-06-16 14:30",
                        handler: "Quality Control Team",
                        status: "Processed"
                    },
                    {
                        step: 3,
                        location: "Distribution Center, Texas",
                        timestamp: "2024-06-19 10:15",
                        handler: "Logistics Corp",
                        status: "In Transit"
                    },
                    {
                        step: 4,
                        location: "Retail Store, New York",
                        timestamp: "2024-06-21 16:45",
                        handler: "Local Distributor",
                        status: "Delivered"
                    }
                ]
            };

            setTraceResult(mockTraceData);
        } catch (err) {
            console.error(err);
            alert("Trace lookup failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setTraceResult(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Product Traceability</h2>
            
            {/* Search Form */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Trace Product Origin</h3>
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="flex space-x-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="id"
                                    checked={searchType === 'id'}
                                    onChange={(e) => setSearchType(e.target.value as 'id')}
                                    className="mr-2"
                                />
                                Product ID
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="qr"
                                    checked={searchType === 'qr'}
                                    onChange={(e) => setSearchType(e.target.value as 'qr')}
                                    className="mr-2"
                                />
                                QR Code
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={searchType === 'id' ? "Enter Product ID" : "Scan or enter QR Code"}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Searching..." : "Trace"}
                        </button>
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>

            {/* Trace Results */}
            {traceResult && (
                <div className="space-y-6">
                    {/* Product Overview */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold mb-4">Product Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-2">Basic Details</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Product ID:</span> {traceResult.produceId}</p>
                                    <p><span className="font-medium">Crop Type:</span> {traceResult.cropType}</p>
                                    <p><span className="font-medium">Harvest Date:</span> {traceResult.harvestDate}</p>
                                    <p><span className="font-medium">Quality Grade:</span> {traceResult.qualityGrade}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Certification Status</h4>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="font-medium">Farmer Verified:</span>{" "}
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            traceResult.isFarmerVerified 
                                                ? "bg-green-100 text-green-800" 
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {traceResult.isFarmerVerified ? "Yes" : "No"}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium">Product Certified:</span>{" "}
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            traceResult.isProduceCertified 
                                                ? "bg-green-100 text-green-800" 
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {traceResult.isProduceCertified ? "Yes" : "Pending"}
                                        </span>
                                    </p>
                                    {traceResult.certificationDate && (
                                        <p><span className="font-medium">Certified:</span> {traceResult.certificationDate}</p>
                                    )}
                                    {traceResult.certificationAuthority && (
                                        <p><span className="font-medium">Authority:</span> {traceResult.certificationAuthority}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Farmer Information */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold mb-4">Farmer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p><span className="font-medium">Name:</span> {traceResult.farmerName}</p>
                                <p><span className="font-medium">Location:</span> {traceResult.farmerLocation}</p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">Verification Status:</span>{" "}
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        traceResult.isFarmerVerified 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-red-100 text-red-800"
                                    }`}>
                                        {traceResult.isFarmerVerified ? "Verified Farmer" : "Unverified"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Supply Chain Journey */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold mb-4">Supply Chain Journey</h3>
                        <div className="space-y-4">
                            {traceResult.transportHistory.map((step, index) => (
                                <div key={step.step} className="flex items-start space-x-4 p-4 border border-gray-200 rounded">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {step.step}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{step.location}</h4>
                                                <p className="text-sm text-gray-600">{step.handler}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm">{step.timestamp}</p>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    step.status === 'Delivered' 
                                                        ? "bg-green-100 text-green-800"
                                                        : step.status === 'In Transit'
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}>
                                                    {step.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Processing Steps */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold mb-4">Processing & Quality Steps</h3>
                        <div className="space-y-3">
                            {traceResult.processingSteps.map((step, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                                        ✓
                                    </div>
                                    <p className="text-sm">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current Status */}
                    <div className="bg-blue-50 p-6 rounded border border-blue-200">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">Current Status</h3>
                        <p className="text-blue-800">
                            This product is currently at: <span className="font-medium">{traceResult.currentLocation}</span>
                        </p>
                        <p className="text-sm text-blue-700 mt-2">
                            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}