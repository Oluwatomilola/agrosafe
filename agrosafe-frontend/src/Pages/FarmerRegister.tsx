import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";
import { getErrorMessage } from "../utils/getErrorMessage";
import { logger } from "../utils/logger";

export default function FarmerRegister() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { registerFarmer } = useAgroSafeWrite();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        // Validation
        if (!name.trim()) {
            setError("Name is required");
            return;
        }
        
        if (!location.trim()) {
            setError("Location is required");
            return;
        }
        
        if (name.trim().length > 100) {
            setError("Name must be less than 100 characters");
            return;
        }
        
        if (location.trim().length > 200) {
            setError("Location must be less than 200 characters");
            return;
        }

        try {
            setIsLoading(true);
            const tx = await registerFarmer(name.trim(), location.trim());
            logger.info("Transaction hash:", tx);
            setSuccess("Registration successful! Transaction: " + tx);
            setName("");
            setLocation("");
        } catch (err) {
            logger.error("Registration error:", err);
            const errorMessage = getErrorMessage(err);
            setError("Registration failed: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Register as Farmer</h2>
            
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
            
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input 
                        type="text"
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Enter your name" 
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        required
                    />
                    <small className="text-gray-500">Max 100 characters</small>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Location *</label>
                    <input 
                        type="text"
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        placeholder="Enter your farm location" 
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        required
                    />
                    <small className="text-gray-500">Max 200 characters</small>
                </div>
                
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
