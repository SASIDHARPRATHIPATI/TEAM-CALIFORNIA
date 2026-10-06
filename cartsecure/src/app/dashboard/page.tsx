import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📊 Dashboard</h1>
        <p className="text-slate-400 mb-8">
          You are authenticated. This page is protected by middleware.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="text-xs text-slate-400 mb-1">WALLET BALANCE</div>
            <div className="text-3xl font-bold">₹15,000</div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="text-xs text-slate-400 mb-1">IN ESCROW</div>
            <div className="text-3xl font-bold">₹0</div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="text-xs text-slate-400 mb-1">AUDIT EVENTS</div>
            <div className="text-3xl font-bold">1</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="font-bold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/check"
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
            >
              🛡️ Check a seller
            </Link>
            <Link
              href="/escrow"
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
            >
              💳 Escrow demo
            </Link>
            <Link
              href="/priceguard"
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
            >
              💰 Price check
            </Link>
            <Link
              href="/security"
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
            >
              🔐 Security Center
            </Link>
          </div>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="px-6 py-2 bg-red-900 hover:bg-red-800 rounded-lg text-sm"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}