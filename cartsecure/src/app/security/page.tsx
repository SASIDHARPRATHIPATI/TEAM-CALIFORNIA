"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  action: string;
  severity: string;
  ip: string | null;
  metadata: any;
  createdAt: string;
};

export default function SecurityCenter() {
  const [events, setEvents] = useState<Event[]>([]);
  const [running, setRunning] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  async function fetchEvents() {
    try {
      const r = await fetch("/api/security/events");
      const d = await r.json();
      setEvents(d.events || []);
    } catch {}
  }

  useEffect(() => {
    fetchEvents();
    const id = setInterval(fetchEvents, 2000);
    return () => clearInterval(id);
  }, []);

  async function runAttack(attack: string) {
    setRunning(attack);
    setLastResult(null);
    try {
      const r = await fetch("/api/security/demo-attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attack }),
      });
      const d = await r.json();
      setLastResult(d);
      setTimeout(fetchEvents, 300);
    } finally {
      setRunning(null);
    }
  }

  const sevColor = (s: string) =>
    s === "HIGH" ? "#ef4444" : s === "MEDIUM" ? "#f59e0b" : "#10b981";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🛡️ Security Center</h1>
        <p className="text-slate-400 mb-6">
          Live attack detection. Every blocked attempt is logged with an incident ID.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => runAttack("sqli")}
            disabled={!!running}
            className="p-4 bg-red-950 hover:bg-red-900 border border-red-800 rounded-lg text-left disabled:opacity-50"
          >
            <div className="font-bold mb-1">🔴 SQL Injection Attack</div>
            <div className="text-xs text-red-300">Trigger simulated SQLi → watch it get blocked</div>
          </button>

          <button
            onClick={() => runAttack("idor")}
            disabled={!!running}
            className="p-4 bg-red-950 hover:bg-red-900 border border-red-800 rounded-lg text-left disabled:opacity-50"
          >
            <div className="font-bold mb-1">🔴 IDOR Attack</div>
            <div className="text-xs text-red-300">Try to access another user's order → 403</div>
          </button>

          <button
            onClick={() => runAttack("prompt_injection")}
            disabled={!!running}
            className="p-4 bg-orange-950 hover:bg-orange-900 border border-orange-800 rounded-lg text-left disabled:opacity-50"
          >
            <div className="font-bold mb-1">🟠 Prompt Injection</div>
            <div className="text-xs text-orange-300">Send malicious AI prompt → blocked</div>
          </button>

          <button
            onClick={() => runAttack("rate_limit")}
            disabled={!!running}
            className="p-4 bg-yellow-950 hover:bg-yellow-900 border border-yellow-800 rounded-lg text-left disabled:opacity-50"
          >
            <div className="font-bold mb-1">🟡 Rate Limit Flood</div>
            <div className="text-xs text-yellow-300">Flood endpoint → 429 triggered</div>
          </button>
        </div>

        {lastResult?.blocked && (
          <div className="mb-6 p-4 bg-green-950 border border-green-800 rounded-lg">
            <div className="text-green-400 font-bold mb-1">
              ✅ ATTACK BLOCKED — {lastResult.attack}
            </div>
            <div className="text-sm text-green-300">
              Incident ID: <span className="font-mono">{lastResult.incidentId}</span>
            </div>
            <div className="text-xs text-green-400 mt-1">{lastResult.detail}</div>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <div className="font-bold">📡 Live Audit Stream</div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              LIVE
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {events.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">
                No events yet. Trigger an attack above to see them appear.
              </div>
            )}
            {events.map((e) => (
              <div key={e.id} className="px-4 py-2 border-b border-slate-800 flex items-center gap-3 text-sm">
                <span
                  className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{ background: sevColor(e.severity) + "20", color: sevColor(e.severity) }}
                >
                  {e.severity}
                </span>
                <span className="font-mono text-slate-300">{e.action}</span>
                <span className="text-xs text-slate-500 ml-auto">
                  {new Date(e.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}