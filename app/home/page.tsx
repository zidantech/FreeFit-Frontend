"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, streamsAPI, matchesAPI, scheduleAPI, sportsAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import MatchCard from "@/components/MatchCard";
import {
  Play, Trophy, Calendar, Clock, ChevronRight,
  Flame, TrendingUp, Loader2, Tv, History, Timer
} from "lucide-react";
import Link from "next/link";

// ---- Demo Data (fallback when API fails) ----

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

const demoLiveMatches: Record<string, any[]> = {
  football: [
    {
      id: "l1",
      teams: [
        { id: "t1", name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", score: 2 },
        { id: "t2", name: "Man United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg", score: 1 }
      ],
      status: "live" as const,
      league: "Premier League",
      streamUrl: "https://example.com/stream1"
    },
    {
      id: "l2",
      teams: [
        { id: "t3", name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", score: 3 },
        { id: "t4", name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", score: 2 }
      ],
      status: "live" as const,
      league: "La Liga",
      streamUrl: "https://example.com/stream2"
    },
    {
      id: "l3",
      teams: [
        { id: "t5", name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", score: 1 },
        { id: "t6", name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", score: 1 }
      ],
      status: "live" as const,
      league: "Premier League",
      streamUrl: "https://example.com/stream3"
    },
  ],
  tennis: [
    {
      id: "lt1",
      teams: [
        { id: "tt1", name: "Djokovic", logo: "https://via.placeholder.com/56?text=ND", score: 6 },
        { id: "tt2", name: "Alcaraz", logo: "https://via.placeholder.com/56?text=CA", score: 4 }
      ],
      status: "live" as const,
      league: "Wimbledon Final",
      streamUrl: "https://example.com/stream-tennis"
    },
  ],
  basketball: [
    {
      id: "lb1",
      teams: [
        { id: "bt1", name: "Lakers", logo: "https://via.placeholder.com/56?text=LAL", score: 98 },
        { id: "bt2", name: "Warriors", logo: "https://via.placeholder.com/56?text=GSW", score: 95 }
      ],
      status: "live" as const,
      league: "NBA",
      streamUrl: "https://example.com/stream-nba"
    },
  ],
};

const demoPreviousMatches: Record<string, any[]> = {
  football: [
    {
      id: "p1",
      teams: [
        { id: "t7", name: "Bayern Munich", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg", score: 4 },
        { id: "t8", name: "Dortmund", logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg", score: 2 }
      ],
      status: "ended" as const,
      league: "Bundesliga"
    },
    {
      id: "p2",
      teams: [
        { id: "t9", name: "Juventus", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Juventus_FC_-_pictogram_black_%28Italy%2C_2017%29.svg", score: 2 },
        { id: "t10", name: "AC Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/AC_Milan_logo.svg", score: 1 }
      ],
      status: "ended" as const,
      league: "Serie A"
    },
    {
      id: "p3",
      teams: [
        { id: "t11", name: "PSG", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", score: 3 },
        { id: "t12", name: "Marseille", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Olympique_de_Marseille_logo.svg", score: 0 }
      ],
      status: "ended" as const,
      league: "Ligue 1"
    },
    {
      id: "p4",
      teams: [
        { id: "t13", name: "Man City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", score: 2 },
        { id: "t14", name: "Tottenham", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", score: 2 }
      ],
      status: "ended" as const,
      league: "Premier League"
    },
  ],
  tennis: [
    {
      id: "pt1",
      teams: [
        { id: "tp1", name: "Sinner", logo: "https://via.placeholder.com/56?text=JS", score: 3 },
        { id: "tp2", name: "Medvedev", logo: "https://via.placeholder.com/56?text=DM", score: 1 }
      ],
      status: "ended" as const,
      league: "Australian Open Final"
    },
  ],
  basketball: [
    {
      id: "pb1",
      teams: [
        { id: "bp1", name: "Celtics", logo: "https://via.placeholder.com/56?text=BOS", score: 112 },
        { id: "bp2", name: "Heat", logo: "https://via.placeholder.com/56?text=MIA", score: 108 }
      ],
      status: "ended" as const,
      league: "NBA Playoffs"
    },
  ],
};

const demoUpcomingMatches: Record<string, any[]> = {
  football: [
    {
      id: "u1",
      teams: [
        { id: "ut1", name: "Inter Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg", score: 0 },
        { id: "ut2", name: "Roma", logo: "https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg", score: 0 }
      ],
      status: "upcoming" as const,
      league: "Serie A",
      startTime: new Date(Date.now() + 3600000 * 2).toISOString()
    },
    {
      id: "u2",
      teams: [
        { id: "ut3", name: "Newcastle", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg", score: 0 },
        { id: "ut4", name: "Aston Villa", logo: "https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg", score: 0 }
      ],
      status: "upcoming" as const,
      league: "Premier League",
      startTime: new Date(Date.now() + 3600000 * 5).toISOString()
    },
    {
      id: "u3",
      teams: [
        { id: "ut5", name: "Atletico", logo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg", score: 0 },
        { id: "ut6", name: "Sevilla", logo: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg", score: 0 }
      ],
      status: "upcoming" as const,
      league: "La Liga",
      startTime: new Date(Date.now() + 3600000 * 24).toISOString()
    },
  ],
  tennis: [
    {
      id: "ut1",
      teams: [
        { id: "utp1", name: "Federer", logo: "https://via.placeholder.com/56?text=RF", score: 0 },
        { id: "utp2", name: "Nadal", logo: "https://via.placeholder.com/56?text=RN", score: 0 }
      ],
      status: "upcoming" as const,
      league: "Exhibition Match",
      startTime: new Date(Date.now() + 3600000 * 8).toISOString()
    },
  ],
  basketball: [
    {
      id: "ub1",
      teams: [
        { id: "ubp1", name: "Bucks", logo: "https://via.placeholder.com/56?text=MIL", score: 0 },
        { id: "ubp2", name: "Suns", logo: "https://via.placeholder.com/56?text=PHX", score: 0 }
      ],
      status: "upcoming" as const,
      league: "NBA",
      startTime: new Date(Date.now() + 3600000 * 4).toISOString()
    },
  ],
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
  const [previousMatches, setPreviousMatches] = useState<any[]>([]);
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
        // Fetch live matches
        const liveData = await matchesAPI.getLiveMatches();
        if (liveData?.data?.length > 0) {
          const filtered = liveData.data.filter((m: any) =>
            m.sport?.slug === interest || m.teams?.some((t: any) => t.sport?.slug === interest)
          );
          setLiveMatches(filtered.length > 0 ? filtered : (demoLiveMatches[interest] || demoLiveMatches.football));
        } else {
          setLiveMatches(demoLiveMatches[interest] || demoLiveMatches.football);
        }

        // Fetch previous matches
        const prevData = await matchesAPI.getPreviousMatches();
        if (prevData?.data?.length > 0) {
          const filtered = prevData.data.filter((m: any) =>
            m.sport?.slug === interest || m.teams?.some((t: any) => t.sport?.slug === interest)
          );
          setPreviousMatches(filtered.length > 0 ? filtered : (demoPreviousMatches[interest] || demoPreviousMatches.football));
        } else {
          setPreviousMatches(demoPreviousMatches[interest] || demoPreviousMatches.football);
        }

        // Fetch featured stream
        const featured = await streamsAPI.getFeatured();
        if (featured?.data?.[0]) {
          setFeaturedStream(featured.data[0]);
        }

        // Fetch schedule (upcoming)
        const schedData = await scheduleAPI.getSchedule({ sport: interest });
        if (schedData?.data?.length > 0) {
          setUpcomingMatches(schedData.data);
        } else {
          setUpcomingMatches(demoUpcomingMatches[interest] || demoUpcomingMatches.football);
        }
      } catch (err) {
        console.log("Using demo data");
        setLiveMatches(demoLiveMatches[interest] || demoLiveMatches.football);
        setPreviousMatches(demoPreviousMatches[interest] || demoPreviousMatches.football);
        setUpcomingMatches(demoUpcomingMatches[interest] || demoUpcomingMatches.football);
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
                <p className="text-gray-400 text-sm sm:text-base">Your selected sport</p>
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
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-red-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">Featured Live Stream</h2>
              <span className="flex items-center gap-1.5 ml-auto">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-xs font-bold uppercase">Live</span>
              </span>
            </div>
            <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
              {featuredStream ? (
                <VideoPlayer
                  src={featuredStream.streamUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                  poster={featuredStream.thumbnail}
                  autoPlay={false}
                  className="h-full"
                />
              ) : (
                <VideoPlayer
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  poster="https://images.unsplash.com/photo-1629977007371-0ba395424741?w=1200&q=80"
                  autoPlay={false}
                  className="h-full"
                />
              )}
            </div>
          </section>

          {/* Live Matches */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">Matches Streaming Now</h2>
                </span>
              </div>
              <span className="text-gray-400 text-sm">{liveMatches.length} live</span>
            </div>

            {liveMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {liveMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    teams={match.teams}
                    status={match.status}
                    league={match.league}
                    streamUrl={match.streamUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#0f1535]/50 rounded-xl border border-cyan-500/20">
                <Tv className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">No live {sportName.toLowerCase()} matches right now</p>
                <p className="text-gray-500 text-sm mt-1">Check back later or browse upcoming matches below</p>
              </div>
            )}
          </section>

          {/* Previous Matches */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Previous Matches</h2>
              </div>
            </div>

            {previousMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {previousMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    teams={match.teams}
                    status={match.status}
                    league={match.league}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No previous matches to show</p>
              </div>
            )}
          </section>

          {/* Upcoming / Scheduled Matches */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Upcoming Matches</h2>
              </div>
            </div>

            {upcomingMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {upcomingMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    teams={match.teams}
                    status={match.status}
                    league={match.league}
                    startTime={match.startTime}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming matches scheduled</p>
              </div>
            )}
          </section>

          {/* Discover More */}
          <section className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Discover Other Sports
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-4 max-w-lg mx-auto">
              Want to explore highlights and matches from other sports? Visit the Categories page.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-[#0a0e27] rounded-full font-semibold text-sm sm:text-base hover:bg-cyan-300 transition-colors"
            >
              Browse All Sports
              <ChevronRight className="w-5 h-5" />
            </Link>
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
