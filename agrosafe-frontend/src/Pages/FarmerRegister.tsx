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
        if (!name.trim() || !location.trim()) {
            alert("Please fill in all fields");
            return;
        }
        try {
            const tx = await write.registerFarmer(name, location);
            console.log("tx", tx);
            alert("Registration transaction sent");
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
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="input" required />
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="input" required />
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
}
