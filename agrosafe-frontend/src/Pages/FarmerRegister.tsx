import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";
import { LoadingButton } from "../components/Loading";

export default function FarmerRegister() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const write = useAgroSafeWrite();

    const validateForm = () => {
        if (!name.trim()) {
            setError("Name is required");
            return false;
        }
        if (name.trim().length < 2) {
            setError("Name must be at least 2 characters long");
            return false;
        }
        if (!location.trim()) {
            setError("Location is required");
            return false;
        }
        if (location.trim().length < 2) {
            setError("Location must be at least 2 characters long");
            return false;
        }
        return true;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSuccess(false);
        
        try {
            const tx = await write.registerFarmer(name.trim(), location.trim());
            console.log("Transaction sent:", tx);
            setSuccess(true);
            setName("");
            setLocation("");
            
            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Registration failed";
            setError(errorMessage);
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const tx = await write.registerFarmer(name, location);
            console.log("tx", tx);
            setSuccess(true);
            setName("");
            setLocation("");
        } catch (err) {
            console.error(err);
            setError("Registration failed: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Register as Farmer</h2>
            
            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Registration successful! Your transaction has been submitted.
                </div>
            )}
            
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800">{error}</p>
                </div>
            )}
            
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input 
                        type="text"
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Enter your full name"
                        className="input"
                        disabled={loading}
                        maxLength={100}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input 
                        type="text"
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        placeholder="Enter your farm location"
                        className="input"
                        disabled={loading}
                        maxLength={100}
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn w-full"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register as Farmer"}
                </button>
            </form>
            
            <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Connect your wallet before registering</li>
                    <li>• Only verified farmers can record produce</li>
                    <li>• All information will be stored on the blockchain</li>
                    <li>• You may need admin approval to become active</li>
                </ul>
            </div>
        </div>
    );
}
