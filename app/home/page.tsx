"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, dashboardAPI, matchesAPI, streamsAPI, scheduleAPI, sportsAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import MatchCard from "@/components/MatchCard";
import {
  Play, Trophy, Calendar, Clock, ChevronRight,
  Flame, Loader2, Tv, History, Timer
} from "lucide-react";
import Link from "next/link";

const sportDisplayNames: Record<string, string> = {
  football: "Football",
  soccer: "Football",
  tennis: "Tennis",
  basketball: "Basketball",
  cricket: "Cricket",
  hockey: "Hockey",
  golf: "Golf",
  baseball: "Baseball",
  wrestling: "Wrestling",
  "formula-1": "Formula 1",
  boxing: "Boxing",
  rugby: "Rugby",
  athletics: "Athletics",
};

function getPrimaryInterest(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("primaryInterest") || "football";
  }
  return "football";
}

export default function HomePage() {
  const router = useRouter();
  const [primarySport, setPrimarySport] = useState<string>("football");
  const [sportName, setSportName] = useState<string>("Football");
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [pastMatches, setPastMatches] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [featuredStream, setFeaturedStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const interest = getPrimaryInterest();
    setPrimarySport(interest);
    setSportName(sportDisplayNames[interest] || interest.charAt(0).toUpperCase() + interest.slice(1));

    const fetchData = async () => {
      try {
        setLoading(true);
        // Call Dashboard API (/api/dashboard/)
        const dashboardData = await dashboardAPI.getDashboard();

        // Handle various response wrappers
        const data = dashboardData?.data || dashboardData || {};

        const live = data.live_matches || data.liveMatches || (Array.isArray(data) ? data.filter((m: any) => m.is_live) : []);
        const upcoming = data.upcoming_matches || data.upcomingMatches || (Array.isArray(data) ? data.filter((m: any) => !m.is_live && !m.is_finished) : []);
        const past = data.past_matches || data.previous_matches || data.pastMatches || (Array.isArray(data) ? data.filter((m: any) => m.is_finished) : []);

        setLiveMatches(Array.isArray(live) ? live : []);
        setUpcomingMatches(Array.isArray(upcoming) ? upcoming : []);
        setPastMatches(Array.isArray(past) ? past : []);

        // Pick featured stream if available from live matches or match endpoints
        if (Array.isArray(live) && live.length > 0) {
          setFeaturedStream(live[0]);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        // On error, clear matches gracefully - NO dummy fallback data
        setLiveMatches([]);
        setUpcomingMatches([]);
        setPastMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

          {/* Sport Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{sportName}</h1>
                <p className="text-gray-400 text-sm sm:text-base">Live Sports Dashboard</p>
              </div>
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-all text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              Change Sport
            </Link>
          </div>

          {/* Featured Live Stream */}
          {featuredStream && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-red-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Featured Live Stream</h2>
                <span className="flex items-center gap-1.5 ml-auto">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-xs font-bold uppercase">Live Now</span>
                </span>
              </div>
              <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
                <VideoPlayer
                  src={featuredStream.stream_url || featuredStream.streamUrl || ""}
                  poster={featuredStream.banner || featuredStream.thumbnail}
                  autoPlay={false}
                  className="h-full"
                />
              </div>
            </section>
          )}

          {/* Live Matches Section */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Live Matches</h2>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold ml-1">
                  {liveMatches.length}
                </span>
              </div>
              <Link
                href="/matches/live"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
              >
                See More
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {liveMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {liveMatches.slice(0, 6).map((match: any) => (
                  <MatchCard key={match.id} id={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#0f1535]/50 rounded-xl border border-cyan-500/10">
                <Tv className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">No matches currently streaming live</p>
                <p className="text-gray-500 text-sm mt-1">Browse upcoming matches below or check back shortly</p>
              </div>
            )}
          </section>

          {/* Upcoming Matches Section */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Upcoming Matches</h2>
              </div>
              <Link
                href="/matches/upcoming"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
              >
                See More
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {upcomingMatches.slice(0, 6).map((match: any) => (
                  <MatchCard key={match.id} id={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#0f1535]/50 rounded-xl border border-cyan-500/10 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50 text-cyan-400" />
                <p>No upcoming matches scheduled at the moment</p>
              </div>
            )}
          </section>

          {/* Past Matches Section */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Past Matches</h2>
              </div>
              <Link
                href="/matches/past"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
              >
                See More
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {pastMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {pastMatches.slice(0, 6).map((match: any) => (
                  <MatchCard key={match.id} id={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#0f1535]/50 rounded-xl border border-cyan-500/10 text-gray-400">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No past match results available</p>
              </div>
            )}
          </section>

          {/* Discover More */}
          <section className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Discover All Teams & Categories
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-4 max-w-lg mx-auto">
              Explore teams, match stats, and full sports coverage across all leagues.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-[#0a0e27] rounded-full font-semibold text-sm sm:text-base hover:bg-cyan-300 transition-colors"
              >
                Browse Categories
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/teams"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-full font-semibold text-sm sm:text-base hover:bg-cyan-500/30 border border-cyan-500/30 transition-colors"
              >
                View Teams
                <Trophy className="w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-cyan-500/20 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-xs sm:text-sm">
          <p>&copy; 2026 Freefit.com. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
