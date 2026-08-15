"use client";

import { useState, useEffect } from "react";
import { teamsAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Loader2, Shield, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await teamsAPI.getTeams();
        const items = res?.data || (Array.isArray(res) ? res : []);
        setTeams(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((t) =>
    (t.name || t.team_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Teams</h1>
                <p className="text-gray-400 text-sm">Browse all featured sports teams</p>
              </div>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search team name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f1535] border border-cyan-500/20 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Teams Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredTeams.map((team) => {
                const teamId = team.id || team._id;
                const teamName = team.name || team.team_name || "Team";
                const logoUrl = team.logo || team.logo_url;

                return (
                  <Link
                    key={teamId}
                    href={`/teams/${teamId}`}
                    className="bg-[#0f1535] border border-cyan-500/20 hover:border-cyan-500/50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all hover:-translate-y-1 group"
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={teamName}
                        className="w-16 h-16 object-contain transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&background=0D8ABC&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-lg">
                        {teamName.substring(0, 3).toUpperCase()}
                      </div>
                    )}
                    <span className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors truncate w-full">
                      {teamName}
                    </span>
                    <span className="text-xs text-cyan-500/80 flex items-center gap-1 font-medium">
                      View Team <ChevronRight className="w-3 h-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0f1535]/60 rounded-xl border border-cyan-500/20 max-w-xl mx-auto">
              <Shield className="w-14 h-14 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-white mb-1">No Teams Found</h3>
              <p className="text-gray-400 text-sm">No teams match your current query.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
