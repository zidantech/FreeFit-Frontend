"use client";

import { useState, useEffect } from "react";
import { matchesAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Loader2, Tv, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function LiveMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      const res = await matchesAPI.getLiveMatches();
      const items = res?.data || res?.live_matches || (Array.isArray(res) ? res : []);
      setMatches(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Failed to load live matches:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  Live Matches
                  <span className="text-sm bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full">
                    {matches.length}
                  </span>
                </h1>
                <p className="text-gray-400 text-sm">Real-time live streaming matches</p>
              </div>
            </div>

            <button
              onClick={fetchLiveMatches}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all text-sm font-medium border border-cyan-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {matches.map((match) => (
                <MatchCard key={match.id || match._id} id={match.id || match._id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0f1535]/60 rounded-xl border border-cyan-500/20 max-w-xl mx-auto">
              <Tv className="w-14 h-14 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-white mb-1">No Live Matches Streaming Right Now</h3>
              <p className="text-gray-400 text-sm mb-6">There are no live broadcasts scheduled at this precise moment.</p>
              <Link
                href="/matches/upcoming"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 text-[#0a0e27] rounded-lg font-semibold text-sm hover:bg-cyan-300 transition-colors"
              >
                Browse Upcoming Matches
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
