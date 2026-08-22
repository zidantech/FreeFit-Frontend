"use client";

import Link from "next/link";
import { Play, Clock, ChevronRight } from "lucide-react";

export interface Team {
  id?: string | number;
  name?: string;
  logo?: string;
  logo_url?: string;
  score?: number;
}

export interface MatchCardProps {
  id: string | number;
  match?: any;
  teams?: Team[];
  homeTeam?: Team;
  awayTeam?: Team;
  status?: "live" | "upcoming" | "ended" | "past" | string;
  is_live?: boolean;
  is_finished?: boolean;
  league?: string;
  tournament?: string;
  startTime?: string;
  start_time?: string;
  date?: string;
  streamUrl?: string;
  stream_url?: string;
  className?: string;
}

export default function MatchCard(props: MatchCardProps) {
  const {
    id,
    match,
    className = "",
  } = props;

  // Extract properties from match object or fallback to direct props
  const matchId = id || match?.id || match?._id;
  const isLive = props.is_live ?? match?.is_live ?? (props.status === "live" || match?.status === "live");
  const isFinished = props.is_finished ?? match?.is_finished ?? (props.status === "ended" || props.status === "past" || match?.status === "ended" || match?.status === "past");

  // Teams parsing
  let home: Team = { name: "TBD", logo: "" };
  let away: Team = { name: "TBD", logo: "" };

  if (props.teams && props.teams.length >= 2) {
    home = props.teams[0];
    away = props.teams[1];
  } else if (props.homeTeam || props.awayTeam) {
    home = props.homeTeam || home;
    away = props.awayTeam || away;
  } else if (match?.teams && Array.isArray(match.teams) && match.teams.length >= 2) {
    home = match.teams[0];
    away = match.teams[1];
  } else if (match?.home_team || match?.away_team) {
    home = match.home_team || home;
    away = match.away_team || away;
  } else if (match?.team1 || match?.team2) {
    home = typeof match.team1 === "string" ? { name: match.team1 } : match.team1;
    away = typeof match.team2 === "string" ? { name: match.team2 } : match.team2;
  }

  const homeName = home.name || match?.home_team_name || "Team A";
  const awayName = away.name || match?.away_team_name || "Team B";
  const homeLogo = home.logo || home.logo_url || match?.home_team_logo || "";
  const awayLogo = away.logo || away.logo_url || match?.away_team_logo || "";

  const homeScore = home.score ?? match?.home_score ?? match?.score1 ?? (isLive || isFinished ? 0 : undefined);
  const awayScore = away.score ?? match?.away_score ?? match?.score2 ?? (isLive || isFinished ? 0 : undefined);

  const leagueName = props.league || props.tournament || match?.league || match?.tournament?.name || match?.sport?.name || "";
  const rawDate = match?.match_date || match?.date || props.date;
  const rawTime = match?.match_time || match?.time || props.startTime || props.start_time || match?.start_time || match?.startTime;
  let formattedDateTime = "";
  if (rawDate && rawTime) {
    formattedDateTime = `${rawDate} • ${rawTime.length > 5 ? rawTime.substring(0, 5) : rawTime}`;
  } else if (rawDate) {
    formattedDateTime = rawDate;
  } else if (rawTime) {
    formattedDateTime = !isNaN(new Date(rawTime).getTime())
      ? new Date(rawTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : rawTime;
  }

  return (
    <div className={`bg-[#0f1535] border border-cyan-500/20 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all ${className}`}>
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          ) : isFinished ? (
            <span className="text-gray-400 text-xs font-medium uppercase px-2 py-0.5 bg-gray-800 rounded">
              FT
            </span>
          ) : formattedDateTime ? (
            <span className="flex items-center gap-1 text-cyan-400 text-xs font-medium">
              <Clock className="w-3 h-3" />
              {formattedDateTime}
            </span>
          ) : (
            <span className="text-gray-400 text-xs font-medium uppercase">UPCOMING</span>
          )}
        </div>
        {leagueName && (
          <span className="text-gray-400 text-xs truncate max-w-[140px]">{leagueName}</span>
        )}
      </div>

      {/* Match Content Link */}
      <Link href={`/matches/${matchId}`} className="block p-3 sm:p-4 hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center justify-between gap-2">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            {homeLogo ? (
              <img
                src={homeLogo}
                alt={homeName}
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(homeName)}&background=0D8ABC&color=fff`;
                }}
              />
            ) : (
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xs sm:text-base">
                {homeName.substring(0, 3).toUpperCase()}
              </div>
            )}
            <span className="text-white text-xs sm:text-sm font-medium text-center truncate w-full">
              {homeName}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center px-2 sm:px-4 shrink-0">
            {isLive || isFinished ? (
              <span className="text-xl sm:text-3xl font-bold text-white font-mono tracking-wider">
                {homeScore ?? 0} - {awayScore ?? 0}
              </span>
            ) : (
              <span className="text-lg sm:text-2xl font-bold text-cyan-400">VS</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            {awayLogo ? (
              <img
                src={awayLogo}
                alt={awayName}
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(awayName)}&background=0D8ABC&color=fff`;
                }}
              />
            ) : (
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xs sm:text-base">
                {awayName.substring(0, 3).toUpperCase()}
              </div>
            )}
            <span className="text-white text-xs sm:text-sm font-medium text-center truncate w-full">
              {awayName}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Footer */}
      <div className="px-3 sm:px-4 pb-3">
        {isLive ? (
          <Link
            href={`/matches/${matchId}`}
            className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-400 transition-all text-xs sm:text-sm font-bold shadow-lg shadow-red-600/20"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch Live Stream
          </Link>
        ) : (
          <Link
            href={`/matches/${matchId}`}
            className="flex items-center justify-center gap-1 w-full py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all text-xs font-medium border border-cyan-500/20"
          >
            View Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}