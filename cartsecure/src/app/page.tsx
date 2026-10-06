import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3">🛡️ CartSecure</h1>
          <p className="text-slate-400 text-lg">
            A trust-verified marketplace that protects buyers from online fraud.
          </p>
          <p className="text-sm text-emerald-400 mt-2">
            ● Live Demo · Built for BuildSecure 2026 · PS-02 E-Commerce
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Six Defense Layers</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            href="/check"
            className="p-6 bg-slate-900 border border-emerald-800 rounded-xl hover:border-emerald-500 transition"
          >
            <div className="text-3xl mb-2">🛡️</div>
            <div className="font-bold text-lg mb-1">SellerShield</div>
            <div className="text-sm text-slate-400 mb-3">
              Paste any seller URL → get a Trust Score before paying.
            </div>
            <div className="inline-block px-2 py-1 rounded text-xs bg-emerald-900 text-emerald-300">
              ● LIVE
            </div>
          </Link>

          <Link
            href="/priceguard"
            className="p-6 bg-slate-900 border border-emerald-800 rounded-xl hover:border-emerald-500 transition"
          >
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold text-lg mb-1">PriceGuard</div>
            <div className="text-sm text-slate-400 mb-3">
              Detects suspicious price anomalies (57% below market).
            </div>
            <div className="inline-block px-2 py-1 rounded text-xs bg-emerald-900 text-emerald-300">
              ● LIVE
            </div>
          </Link>

          <Link
            href="/escrow"
            className="p-6 bg-slate-900 border border-emerald-800 rounded-xl hover:border-emerald-500 transition"
          >
            <div className="text-3xl mb-2">💳</div>
            <div className="font-bold text-lg mb-1">PaymentShield</div>
            <div className="text-sm text-slate-400 mb-3">
              Escrow — money held until delivery is verified. Auto-refund on failure.
            </div>
            <div className="inline-block px-2 py-1 rounded text-xs bg-emerald-900 text-emerald-300">
              ● LIVE
            </div>
          </Link>

          <Link
            href="/shiptrack"
            className="p-6 bg-slate-900 border border-emerald-800 rounded-xl hover:border-emerald-500 transition"
          >
            <div className="text-3xl mb-2">📦</div>
            <div className="font-bold text-lg mb-1">ShipTrack</div>
            <div className="text-sm text-slate-400 mb-3">
              Verifies tracking IDs against courier APIs. Detects fakes.
            </div>
            <div className="inline-block px-2 py-1 rounded text-xs bg-emerald-900 text-emerald-300">
              ● LIVE
            </div>
          </Link>

          <Link
            href="/security"
            className="p-6 bg-slate-900 border border-emerald-800 rounded-xl hover:border-emerald-500 transition"
          >
            <div className="text-3xl mb-2">🔐</div>
            <div className="font-bold text-lg mb-1">Security Center</div>
            <div className="text-sm text-slate-400 mb-3">
              Live attack detection with incident IDs and audit trail.
            </div>
            <div className="inline-block px-2 py-1 rounded text-xs bg-emerald-900 text-emerald-300">
              ● LIVE
            </div>
          </Link>

          <Link
            href="/login"
            className="p-6 bg-slate-900 border border-emerald-800 rounded-xl hover:border-emerald-500 transition"
          >
            <div className="text-3xl mb-2">🔑</div>
            <div className="font-bold text-lg mb-1">Auth System</div>
            <div className="text-sm text-slate-400 mb-3">
              argon2id · JWT rotation · RBAC middleware
            </div>
            <div className="inline-block px-2 py-1 rounded text-xs bg-emerald-900 text-emerald-300">
              ● LIVE
            </div>
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h3 className="font-bold mb-3">How CartSecure Protects You</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-slate-300 font-semibold mb-1">1. Verify</div>
              <div className="text-slate-500">SellerShield scores the seller before payment</div>
            </div>
            <div>
              <div className="text-slate-300 font-semibold mb-1">2. Protect</div>
              <div className="text-slate-500">PaymentShield holds money in escrow</div>
            </div>
            <div>
              <div className="text-slate-300 font-semibold mb-1">3. Defend</div>
              <div className="text-slate-500">Every attack logged, every action audited</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold mb-2">Roadmap</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>📅 Phase 1 (Shipped): SellerShield · PriceGuard · PaymentShield Escrow · ShipTrack · Security Center · Auth</li>
            <li>📅 Phase 2: Live courier API integration (Delhivery, BlueDart)</li>
            <li>📅 Phase 3: ML-based trust scoring with historical fraud data</li>
            <li>📅 Phase 4: Razorpay/Cashfree for regulated live escrow</li>
          </ul>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <a
            href="https://github.com/SASIDHARPRATHIPATI/TEAM-CALIFORNIA"
            className="hover:text-white"
          >
            GitHub Repo
          </a>
          {" · "}
          <span>Live: team-california-nine.vercel.app</span>
        </div>
      </div>
    </div>
  );
}