import React, { useState } from "react";
import { useAgroSafeWrite } from "../hooks/useAgroSafe";

export default function FarmerRegister() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const write = useAgroSafeWrite();

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
            console.error(err);
            alert("Registration failed: " + (err as any).message);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Register as Farmer</h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="input" required />
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="input" required />
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
}
