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
