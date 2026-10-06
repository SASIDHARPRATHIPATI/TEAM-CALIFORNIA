"use client";

import { useState } from "react";

type State = "PENDING" | "HELD" | "SHIPPED" | "DELIVERED" | "RELEASED" | "REFUNDED";

const STATES: State[] = ["PENDING", "HELD", "SHIPPED", "DELIVERED", "RELEASED"];

export default function EscrowDemo() {
  const [state, setState] = useState<State>("PENDING");
  const [wallet, setWallet] = useState(15000);
  const [escrow, setEscrow] = useState(0);
  const [seller, setSeller] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const amount = 1999;

  const addLog = (msg: string) => {
    setLogs((l) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l]);
  };

  function pay() {
    if (wallet < amount) return;
    setWallet(wallet - amount);
    setEscrow(escrow + amount);
    setState("HELD");
    addLog(`💰 Buyer paid ₹${amount} → Escrow HELD`);
  }

  function ship() {
    setState("SHIPPED");
    addLog(`🚚 Seller provided tracking: TRK-${Date.now().toString(36).toUpperCase()}`);
  }

  function deliver() {
    setState("DELIVERED");
    addLog(`📦 Customer confirmed delivery`);
  }

  function release() {
    setEscrow(0);
    setSeller(seller + amount);
    setState("RELEASED");
    addLog(`✅ Escrow released ₹${amount} → Seller`);
  }

  function failNoShipment() {
    setEscrow(0);
    setWallet(wallet + amount);
    setState("REFUNDED");
    addLog(`🚨 No shipment in 72 hours → AUTO-REFUND ₹${amount} → Buyer`);
  }

  function failFakeTracking() {
    setState("REFUNDED");
    setEscrow(0);
    setWallet(wallet + amount);
    addLog(`🚨 Courier API rejected TRK-FAKE-123 → REFUND ₹${amount} → Buyer`);
  }

  function reset() {
    setState("PENDING");
    setWallet(15000);
    setEscrow(0);
    setSeller(0);
    setLogs([]);
  }

  const stateColor = (s: State) => {
    if (s === "RELEASED") return "#10b981";
    if (s === "REFUNDED") return "#ef4444";
    if (s === "PENDING") return "#64748b";
    return "#3b82f6";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">💰 PaymentShield — Escrow Flow</h1>
        <p className="text-slate-400 mb-6">
          Money is held safely until the seller delivers. No delivery = automatic refund.
        </p>

        {/* Wallet Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">YOUR WALLET</div>
            <div className="text-3xl font-bold">₹{wallet.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900 border border-blue-700 rounded-xl p-4">
            <div className="text-xs text-blue-400 mb-1">🔒 IN ESCROW</div>
            <div className="text-3xl font-bold text-blue-400">₹{escrow.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">SELLER BALANCE</div>
            <div className="text-3xl font-bold">₹{seller.toLocaleString()}</div>
          </div>
        </div>

        {/* State Tracker */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6">
          <div className="text-xs text-slate-400 mb-3">ESCROW STATE MACHINE</div>
          <div className="flex items-center gap-2">
            {STATES.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className="px-3 py-1 rounded text-xs font-mono whitespace-nowrap"
                  style={{
                    background: state === s ? stateColor(state) + "30" : "#1e293b",
                    color: state === s ? stateColor(state) : "#64748b",
                    border: `1px solid ${state === s ? stateColor(state) : "#334155"}`,
                  }}
                >
                  {s}
                </div>
                {i < STATES.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1"
                    style={{
                      background: STATES.indexOf(state) > i ? stateColor(state) : "#334155",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {state === "REFUNDED" && (
            <div className="mt-3 text-sm text-red-400">
              ⚠️ REFUNDED — money returned to buyer
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={pay}
            disabled={state !== "PENDING"}
            className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-left"
          >
            <div className="font-bold">1. Buyer Pays ₹1,999</div>
            <div className="text-xs text-indigo-200">Money moves → Escrow HELD</div>
          </button>

          <button
            onClick={ship}
            disabled={state !== "HELD"}
            className="p-4 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-left"
          >
            <div className="font-bold">2. Seller Ships</div>
            <div className="text-xs text-blue-200">Tracking provided + verified</div>
          </button>

          <button
            onClick={deliver}
            disabled={state !== "SHIPPED"}
            className="p-4 bg-cyan-600 hover:bg-cyan-500 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-left"
          >
            <div className="font-bold">3. Customer Confirms Receipt</div>
            <div className="text-xs text-cyan-200">OTP verified + delivery scan</div>
          </button>

          <button
            onClick={release}
            disabled={state !== "DELIVERED"}
            className="p-4 bg-green-600 hover:bg-green-500 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-left"
          >
            <div className="font-bold">4. Release ₹1,999 → Seller</div>
            <div className="text-xs text-green-200">All checks passed ✅</div>
          </button>

          <button
            onClick={failNoShipment}
            disabled={state !== "HELD"}
            className="p-4 bg-red-600 hover:bg-red-500 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-left"
          >
            <div className="font-bold">⚠️ Simulate: No Shipment</div>
            <div className="text-xs text-red-200">72h timeout → AUTO-REFUND</div>
          </button>

          <button
            onClick={failFakeTracking}
            disabled={state !== "HELD"}
            className="p-4 bg-red-600 hover:bg-red-500 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-left"
          >
            <div className="font-bold">⚠️ Simulate: Fake Tracking</div>
            <div className="text-xs text-red-200">Courier API rejects → REFUND</div>
          </button>

          <button
            onClick={reset}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg col-span-2 text-sm"
          >
            🔄 Reset Demo
          </button>
        </div>

        {/* Log */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-2">ESCROW EVENT LOG</div>
          {logs.length === 0 && (
            <div className="text-sm text-slate-500">Click &quot;Buyer Pays&quot; to start.</div>
          )}
          {logs.map((l, i) => (
            <div key={i} className="text-xs font-mono text-slate-300 py-1 border-b border-slate-800">
              {l}
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-slate-500 text-center">
          Simulated for demo · Production uses a regulated payment/escrow partner
        </div>
      </div>
    </div>
  );
}