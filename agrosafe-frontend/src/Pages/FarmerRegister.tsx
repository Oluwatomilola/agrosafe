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

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            
            <form onSubmit={onSubmit} className="space-y-4">
                <input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Name" 
                    className="input"
                    disabled={loading}
                />
                <input 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    placeholder="Location" 
                    className="input"
                    disabled={loading}
                />
                <LoadingButton 
                    type="submit" 
                    className="btn"
                    loading={loading}
                    loadingText="Registering..."
                >
                    Register
                </LoadingButton>
            </form>
        </div>
    );
}
