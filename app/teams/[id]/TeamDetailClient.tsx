"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { teamsAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Loader2, Shield, ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TeamDetailClient() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id as string;

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await teamsAPI.getTeamDetails(teamId);
        const teamObj = res?.data || res;
        setTeam(teamObj);
      } catch (err: any) {
        console.error("Failed to load team details:", err);
        setError(err.message || "Unable to fetch team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  if (error || !team) {
    return (
      <main className="min-h-screen bg-[#0a0e27]">
        <Navbar />
        <div className="pt-24 px-4 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Team Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">{error || "The requested team details could not be found."}</p>
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 text-[#0a0e27] rounded-lg font-semibold text-sm hover:bg-cyan-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Teams
          </Link>
        </div>
      </main>
    );
  }

  const teamName = team.name || team.team_name || "Team Profile";
  const logoUrl = team.logo || team.logo_url;
  const matches = team.matches || team.recent_matches || [];

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Team Profile Banner */}
          <div className="bg-[#0f1535] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={teamName}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&background=0D8ABC&color=fff`;
                }}
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-3xl">
                {teamName.substring(0, 3).toUpperCase()}
              </div>
            )}

            <div className="text-center sm:text-left space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{teamName}</h1>
              {team.country && (
                <p className="text-gray-400 text-sm font-medium">{team.country}</p>
              )}
              {team.sport && (
                <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                  {typeof team.sport === "string" ? team.sport : team.sport.name}
                </span>
              )}
            </div>
          </div>

          {/* Recent / Upcoming Matches for Team */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Team Matches
            </h2>

            {matches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((m: any) => (
                  <MatchCard key={m.id || m._id} id={m.id || m._id} match={m} />
                ))}
              </div>
            ) : (
              <div className="bg-[#0f1535]/50 border border-cyan-500/10 rounded-xl p-8 text-center text-gray-400">
                <p>No recent match history found for {teamName}.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
