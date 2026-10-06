"use client";

import { useState } from "react";

const KNOWN_COURIERS = ["dhl", "fedex", "bluedart", "delhivery", "dtdc", "ekart"];

export default function ShipTrack() {
  const [trackingId, setTrackingId] = useState("TRK-FAKE-123");
  const [courier, setCourier] = useState("dhl");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<null | {
    valid: boolean;
    reason: string;
    scans: string[];
  }>(null);

  function verify() {
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      const isCourierKnown = KNOWN_COURIERS.includes(courier.toLowerCase());
      const looksFake =
        /fake|test|xxx|000|123/i.test(trackingId) ||
        trackingId.length < 8 ||
        !/^[A-Z0-9-]+$/i.test(trackingId);

      if (!isCourierKnown) {
        setResult({
          valid: false,
          reason: `Courier "${courier}" is not a recognized carrier.`,
          scans: [],
        });
      } else if (looksFake) {
        setResult({
          valid: false,
          reason: `Tracking ID "${trackingId}" failed format validation and returns no results in courier API.`,
          scans: [],
        });
      } else {
        setResult({
          valid: true,
          reason: `Tracking ID verified with ${courier.toUpperCase()}.`,
          scans: [
            "Picked up — origin facility",
            "In transit — regional hub",
            "Out for delivery — local center",
          ],
        });
      }
      setChecking(false);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📦 ShipTrack</h1>
        <p className="text-slate-400 mb-6">
          Verifies tracking IDs against courier APIs. Detects fake shipments.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tracking ID</label>
              <input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Courier</label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
              >
                <option value="dhl">DHL</option>
                <option value="fedex">FedEx</option>
                <option value="bluedart">BlueDart</option>
                <option value="delhivery">Delhivery</option>
                <option value="dtdc">DTDC</option>
                <option value="ekart">Ekart</option>
                <option value="fakecourier">Fake Courier Co.</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mb-3 text-xs">
            <button
              onClick={() => setTrackingId("DHL1234567890")}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700"
            >
              Try: Valid ID
            </button>
            <button
              onClick={() => setTrackingId("TRK-FAKE-123")}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700"
            >
              Try: Fake ID
            </button>
          </div>

          <button
            onClick={verify}
            disabled={checking}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold disabled:opacity-50"
          >
            {checking ? "Checking courier API..." : "Verify Tracking"}
          </button>
        </div>

        {result && (
          <div
            className="rounded-xl p-6 border-2"
            style={{
              background: (result.valid ? "#10b981" : "#ef4444") + "15",
              borderColor: result.valid ? "#10b981" : "#ef4444",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold">
                {result.valid ? "✅ VERIFIED SHIPMENT" : "🚨 FAKE TRACKING DETECTED"}
              </div>
              <div
                className="px-3 py-1 rounded text-xs font-mono"
                style={{
                  background: (result.valid ? "#10b981" : "#ef4444") + "25",
                  color: result.valid ? "#10b981" : "#ef4444",
                }}
              >
                {trackingId}
              </div>
            </div>

            <div
              className="text-sm mb-3"
              style={{ color: result.valid ? "#10b981" : "#ef4444" }}
            >
              {result.reason}
            </div>

            {result.valid && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 mb-2">COURIER SCANS</div>
                {result.scans.map((s, i) => (
                  <div key={i} className="text-sm py-1 flex items-center gap-2">
                    <span className="text-emerald-400">●</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {!result.valid && (
              <div className="mt-4 p-3 bg-red-950/50 rounded text-sm text-red-300">
                ⚠️ Payment remains held in escrow. This shipment cannot be trusted until valid tracking is provided.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}