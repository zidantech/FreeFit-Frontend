"use client";

import { useState, useEffect } from "react";
import { matchesAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Loader2, Calendar, RefreshCw } from "lucide-react";

export default function UpcomingMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingMatches = async () => {
    try {
      setLoading(true);
      const res = await matchesAPI.getUpcomingMatches();
      const items = res?.data || res?.upcoming_matches || (Array.isArray(res) ? res : []);
      setMatches(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Failed to load upcoming matches:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  Upcoming Matches
                  <span className="text-sm bg-cyan-500/20 text-cyan-400 font-bold px-2 py-0.5 rounded-full">
                    {matches.length}
                  </span>
                </h1>
                <p className="text-gray-400 text-sm">Scheduled upcoming sporting events</p>
              </div>
            </div>

            <button
              onClick={fetchUpcomingMatches}
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
              <Calendar className="w-14 h-14 mx-auto mb-4 text-cyan-400 opacity-60" />
              <h3 className="text-lg font-semibold text-white mb-1">No Upcoming Matches Scheduled</h3>
              <p className="text-gray-400 text-sm">Please check back later for new match schedules.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
