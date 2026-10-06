"use client";

import { useState } from "react";

export default function PriceGuard() {
  const [product, setProduct] = useState("iPhone 15");
  const [marketPrice, setMarketPrice] = useState(79999);
  const [sellerPrice, setSellerPrice] = useState(19999);
  const [result, setResult] = useState<null | {
    delta: number;
    verdict: string;
    color: string;
    message: string;
  }>(null);

  function analyze() {
    const delta = ((sellerPrice - marketPrice) / marketPrice) * 100;
    let verdict = "NORMAL";
    let color = "#10b981";
    let message = "Price is within normal range.";

    if (delta <= -50) {
      verdict = "HIGH RISK";
      color = "#ef4444";
      message = `Price is ${Math.abs(delta).toFixed(1)}% below market — classic bait pricing. Do NOT pay.`;
    } else if (delta <= -30) {
      verdict = "SUSPICIOUS";
      color = "#f59e0b";
      message = `Price is ${Math.abs(delta).toFixed(1)}% below market. Verify seller before paying.`;
    } else if (delta >= 50) {
      verdict = "OVERPRICED";
      color = "#f59e0b";
      message = `Price is ${delta.toFixed(1)}% above market. Likely a rip-off.`;
    }

    setResult({ delta, verdict, color, message });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">💰 PriceGuard</h1>
        <p className="text-slate-400 mb-6">
          Detects suspicious price anomalies before you buy.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="mb-4">
            <label className="text-xs text-slate-400 block mb-1">Product</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Market Price (₹)</label>
              <input
                type="number"
                value={marketPrice}
                onChange={(e) => setMarketPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Seller Price (₹)</label>
              <input
                type="number"
                value={sellerPrice}
                onChange={(e) => setSellerPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
              />
            </div>
          </div>

          <button
            onClick={analyze}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold"
          >
            Analyze Price
          </button>
        </div>

        {result && (
          <div
            className="rounded-xl p-6 border-2"
            style={{ background: result.color + "15", borderColor: result.color }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-400">
                {product} · Delta {result.delta.toFixed(1)}%
              </div>
              <div
                className="px-3 py-1 rounded text-sm font-bold"
                style={{ background: result.color + "25", color: result.color }}
              >
                {result.verdict === "HIGH RISK" ? "🔴 " : result.verdict === "NORMAL" ? "🟢 " : "🟡 "}
                {result.verdict}
              </div>
            </div>
            <div className="text-sm" style={{ color: result.color }}>
              {result.message}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-sm">
              <div>
                <div className="text-slate-500">Expected</div>
                <div className="font-mono">₹{marketPrice.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-slate-500">Offered</div>
                <div className="font-mono" style={{ color: result.color }}>
                  ₹{sellerPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}