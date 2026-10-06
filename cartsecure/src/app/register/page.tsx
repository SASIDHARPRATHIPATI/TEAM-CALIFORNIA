"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">🛡️ Create Account</h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Join CartSecure — protected marketplace
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Password (10+ chars, upper, lower, digit)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "CUSTOMER" | "SELLER")}
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
            >
              <option value="CUSTOMER">Customer — buy safely</option>
              <option value="SELLER">Seller — sell with trust score</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-950 border border-red-800 rounded text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}