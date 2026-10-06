"use client";

import { useState } from "react";

type Signal = { label: string; ok: boolean; weight: number; detail: string };

export default function CheckPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    domain: string;
    trustScore: number;
    riskLevel: string;
    signals: Signal[];
  } | null>(null);

  async function scan() {
    if (!domain) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch("/api/seller/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await r.json();
      setResult(data);
    } catch {
      alert("Scan failed");
    } finally {
      setLoading(false);
    }
  }

  const color =
    result?.riskLevel === "LOW"
      ? "#10b981"
      : result?.riskLevel === "CAUTION"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🛡️ SellerShield</h1>
        <p className="text-slate-400 mb-6">Paste any shopping URL to check the seller's trust score before you pay.</p>

        <div className="flex gap-2 mb-6">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example-store.com"
            className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
          />
          <button
            onClick={scan}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Check Seller"}
          </button>
        </div>

        {result && (
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-slate-400">Trust Score</div>
                <div className="text-5xl font-bold" style={{ color }}>
                  {result.trustScore}/100
                </div>
              </div>
              <div
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: color + "20", color }}
              >
                {result.riskLevel === "LOW" ? "🟢 LOW RISK" : result.riskLevel === "CAUTION" ? "🟡 CAUTION" : "🔴 HIGH RISK"}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {result.signals.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <span>{s.ok ? "✓" : "✗"}</span>
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <span className="text-xs text-slate-400">{s.detail}</span>
                </div>
              ))}
            </div>

            {result.riskLevel === "HIGH" && (
              <div className="mt-4 p-3 bg-red-950 border border-red-800 rounded-lg text-red-300 text-sm">
                ⚠️ Do NOT pay directly. This seller shows multiple fraud indicators.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}