"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { matchesAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import LiveChat from "@/components/LiveChat";
import {
  Loader2, Tv, Clock, Trophy, ChevronLeft, AlertCircle, Play
} from "lucide-react";
import Link from "next/link";

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.id as string;

  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;

    const fetchMatch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await matchesAPI.getMatchDetails(matchId);
        const matchObj = data?.data || data;
        setMatch(matchObj);
      } catch (err: any) {
        console.error("Error fetching match details:", err);
        setError(err.message || "Failed to load match details");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  if (error || !match) {
    return (
      <main className="min-h-screen bg-[#0a0e27]">
        <Navbar />
        <div className="pt-24 px-4 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Match Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">{error || "Unable to fetch requested match data."}</p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 text-[#0a0e27] rounded-lg font-semibold text-sm hover:bg-cyan-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Parse status & stream condition
  const isLive = match.is_live ?? (match.status === "live");
  const isFinished = match.is_finished ?? (match.status === "ended" || match.status === "past");

  // Extract teams
  let homeTeam = match.teams?.[0] || match.home_team || match.team1 || { name: match.home_team_name || "Team A" };
  let awayTeam = match.teams?.[1] || match.away_team || match.team2 || { name: match.away_team_name || "Team B" };

  if (typeof homeTeam === "string") homeTeam = { name: homeTeam };
  if (typeof awayTeam === "string") awayTeam = { name: awayTeam };

  const homeName = homeTeam.name || "Team A";
  const awayName = awayTeam.name || "Team B";
  const homeLogo = homeTeam.logo || homeTeam.logo_url || match.home_team_logo || "";
  const awayLogo = awayTeam.logo || awayTeam.logo_url || match.away_team_logo || "";

  const streamUrl = match.stream_url || match.streamUrl || "";
  const leagueName = match.league || match.tournament?.name || match.sport?.name || "Sports Event";

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Navigation & Status Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-gray-400 text-sm font-medium">{leagueName}</span>
          </div>

          {/* Teams Header Scoreboard Banner */}
          <div className="bg-[#0f1535] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

              {/* Home Team */}
              <div className="flex flex-col items-center gap-3 flex-1">
                {homeLogo ? (
                  <img
                    src={homeLogo}
                    alt={homeName}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(homeName)}&background=0D8ABC&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xl">
                    {homeName.substring(0, 3).toUpperCase()}
                  </div>
                )}
                <span className="text-white text-lg font-bold text-center">{homeName}</span>
              </div>

              {/* Score / Status */}
              <div className="flex flex-col items-center justify-center px-4">
                <div className="mb-2">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Live Stream Active
                    </span>
                  ) : isFinished ? (
                    <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-bold uppercase">
                      Final Score (FT)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold uppercase">
                      Upcoming Match
                    </span>
                  )}
                </div>

                {isLive || isFinished ? (
                  <div className="text-3xl sm:text-5xl font-black text-white font-mono tracking-widest my-1">
                    {homeTeam.score ?? match.home_score ?? 0} - {awayTeam.score ?? match.away_score ?? 0}
                  </div>
                ) : (
                  <div className="text-2xl sm:text-4xl font-bold text-cyan-400 my-1">VS</div>
                )}

                {match.start_time && (
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(match.start_time).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center gap-3 flex-1">
                {awayLogo ? (
                  <img
                    src={awayLogo}
                    alt={awayName}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(awayName)}&background=0D8ABC&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xl">
                    {awayName.substring(0, 3).toUpperCase()}
                  </div>
                )}
                <span className="text-white text-lg font-bold text-center">{awayName}</span>
              </div>

            </div>
          </div>

          {/* Main Video & Live Chat Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Video Player Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#0f1535] border border-cyan-500/20 rounded-2xl overflow-hidden p-2 sm:p-4">
                {/* Guide Rule Enforcement: Play stream ONLY if is_live is true */}
                {isLive ? (
                  streamUrl ? (
                    <VideoPlayer
                      src={streamUrl}
                      poster={match.banner || match.thumbnail}
                      autoPlay={true}
                    />
                  ) : (
                    <div className="aspect-video bg-gray-900 flex flex-col items-center justify-center text-center p-6 rounded-xl">
                      <Tv className="w-12 h-12 text-cyan-400 mb-2" />
                      <p className="text-white font-medium">Match is Live</p>
                      <p className="text-gray-400 text-sm mt-1">Connecting to video feed...</p>
                    </div>
                  )
                ) : (
                  <div className="aspect-video bg-[#0a0e27] border border-cyan-500/10 flex flex-col items-center justify-center text-center p-6 rounded-xl">
                    <Tv className="w-12 h-12 text-gray-600 mb-3" />
                    <h4 className="text-lg font-bold text-white mb-1">
                      Stream Unavailable
                    </h4>
                    <p className="text-gray-400 text-sm max-w-md">
                      {isFinished
                        ? "This match has concluded. Live streaming is no longer active for finished events."
                        : "This match is not currently live. Streams open automatically when the broadcast begins."}
                    </p>
                  </div>
                )}
              </div>

              {/* Event Meta Details */}
              <div className="bg-[#0f1535] border border-cyan-500/20 rounded-2xl p-6 space-y-4 text-white">
                <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
                  <Trophy className="w-5 h-5" />
                  Match Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs">League / Sport</span>
                    <span className="font-semibold">{leagueName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Status</span>
                    <span className="font-semibold capitalize">{match.status || (isLive ? "Live" : isFinished ? "Ended" : "Upcoming")}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Broadcast Stream</span>
                    <span className="font-semibold">{isLive ? "Active HD Stream" : "Offline"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat Column (1 Col) */}
            <div className="lg:col-span-1 h-[500px] sm:h-[600px]">
              <LiveChat streamId={matchId} />
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
