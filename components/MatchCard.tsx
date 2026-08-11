// components/MatchCard.tsx
"use client";

import { Play, Clock } from "lucide-react";
import Link from "next/link";

interface Team {
  name: string;
  logo?: string;
}

interface MatchCardProps {
  id: string;
  team1?: Team;
  team2?: Team;
  teams?: Team[];           // ← backward compat: array of 2 teams
  score1?: number;
  score2?: number;
  status: "live" | "upcoming" | "past";
  league?: string;
  startTime?: string;
  streamUrl?: string;
  sport?: string;
}

export default function MatchCard({
  id,
  team1,
  team2,
  teams,
  score1,
  score2,
  status,
  league,
  startTime,
  streamUrl,
  sport,
}: MatchCardProps) {
  // Normalize: support both team1/team2 and teams[] props
  const t1 = team1 || teams?.[0] || { name: "Home" };
  const t2 = team2 || teams?.[1] || { name: "Away" };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div className="bg-[#0f1535] border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400/30 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">
          {league || sport}
        </span>
        {status === "live" && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-red-400 font-bold uppercase">Live</span>
          </span>
        )}
        {status === "past" && (
          <span className="px-2 py-0.5 bg-gray-500/20 rounded-full text-[10px] text-gray-400 font-bold uppercase">
            FT
          </span>
        )}
        {status === "upcoming" && (
          <span className="px-2 py-0.5 bg-cyan-400/10 rounded-full text-[10px] text-cyan-400 font-bold uppercase">
            Upcoming
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="px-4 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {t1.logo ? (
              <img src={t1.logo} alt={t1.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold text-gray-300">
                {t1.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-white text-xs sm:text-sm font-medium text-center">{t1.name}</span>
          </div>

          {/* Score / VS / Time */}
          <div className="flex flex-col items-center px-3 sm:px-6">
            {status === "live" && score1 !== undefined && score2 !== undefined ? (
              <span className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono">
                {score1} - {score2}
              </span>
            ) : status === "past" && score1 !== undefined && score2 !== undefined ? (
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                {score1} - {score2}
              </span>
            ) : (
              <span className="text-lg sm:text-xl font-bold text-cyan-400">VS</span>
            )}

            {status === "upcoming" && startTime && (
              <div className="flex items-center gap-1 mt-1 text-gray-400 text-[10px] sm:text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatDate(startTime)} {formatTime(startTime)}</span>
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {t2.logo ? (
              <img src={t2.logo} alt={t2.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold text-gray-300">
                {t2.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-white text-xs sm:text-sm font-medium text-center">{t2.name}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="px-4 pb-4">
        {status === "live" && streamUrl ? (
          <Link
            href={`/matches/${id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#0a0e27] rounded-lg font-semibold text-sm transition-colors"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Watch Live
          </Link>
        ) : status === "upcoming" ? (
          <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium text-sm transition-colors border border-white/10">
            <Clock className="w-4 h-4" />
            Set Reminder
          </button>
        ) : (
          <Link
            href={`/matches/${id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium text-sm transition-colors border border-white/10"
          >
            View Highlights
          </Link>
        )}
      </div>
    </div>
  );
}