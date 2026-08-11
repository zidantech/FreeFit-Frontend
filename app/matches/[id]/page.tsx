// app/matches/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import LiveChat from "@/components/LiveChat";
import { matchesAPI } from "@/lib/api";

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;

  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const data = await matchesAPI.getDetails(matchId);
        setMatch(data);
      } catch (err) {
        console.log("Match details not available");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] text-white pt-16 sm:pt-20">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="h-96 bg-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-[#0a0e27] text-white pt-16 sm:pt-20">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Match not found.</p>
        </div>
      </div>
    );
  }

  const isLive = match.is_live;
  const team1 = match.team1 || match.home_team?.name;
  const team2 = match.team2 || match.away_team?.name;
  const team1Logo = match.team1_logo || match.home_team?.logo;
  const team2Logo = match.team2_logo || match.away_team?.logo;

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white pt-16 sm:pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/home" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">{match.league}</h1>
            <p className="text-xs text-gray-400">{match.sport}</p>
          </div>
          <button className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Share2 className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Video + Chat */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Video */}
          <div className="flex-1">
            {isLive && match.stream_url ? (
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                <VideoPlayer src={match.stream_url} className="h-full" />
              </div>
            ) : (
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">
                    {isLive ? "Stream starting soon..." : "Match ended"}
                  </p>
                  {match.highlight_url && (
                    <VideoPlayer src={match.highlight_url} className="h-full" />
                  )}
                </div>
              </div>
            )}

            {/* Match Info */}
            <div className="mt-4 bg-[#0f1535] border border-white/10 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {team1Logo ? (
                    <img src={team1Logo} alt={team1} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold">
                      {team1?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-lg">{team1}</p>
                    <p className="text-gray-400 text-xs">Home</p>
                  </div>
                </div>

                <div className="text-center px-6">
                  {match.is_live || match.is_past ? (
                    <p className="text-3xl font-bold text-cyan-400 font-mono">
                      {match.score1 ?? match.home_score} - {match.score2 ?? match.away_score}
                    </p>
                  ) : (
                    <p className="text-xl font-bold text-cyan-400">VS</p>
                  )}
                  {match.is_live && (
                    <span className="flex items-center justify-center gap-1 text-red-400 text-xs mt-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{team2}</p>
                    <p className="text-gray-400 text-xs">Away</p>
                  </div>
                  {team2Logo ? (
                    <img src={team2Logo} alt={team2} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold">
                      {team2?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat (only for live matches) */}
          {isLive && (
            <div className="lg:w-[320px] flex-shrink-0">
              <LiveChat streamId={matchId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}