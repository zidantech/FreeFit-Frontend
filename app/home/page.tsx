"use client";

import { useState, useEffect } from "react";
import { Trophy, Calendar, History, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import MatchCard from "@/components/MatchCard";
import SportSelector from "@/components/SportSelector";
import { matchesAPI, streamsAPI } from "@/lib/api";

export default function HomeDashboard() {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "past">("live");
  const [matches, setMatches] = useState<any[]>([]);
  const [featuredStream, setFeaturedStream] = useState<any>(null);
  const [selectedSport, setSelectedSport] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch matches based on active tab
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        let data;
        if (activeTab === "live") data = await matchesAPI.getLive();
        else if (activeTab === "upcoming") data = await matchesAPI.getUpcoming();
        else data = await matchesAPI.getPast();

        setMatches(data.results || data.data || data || []);
      } catch (err) {
        console.log(`${activeTab} matches API not available`);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [activeTab]);

  // Fetch featured stream
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await streamsAPI.getFeatured();
        setFeaturedStream(data.results?.[0] || data.data?.[0] || data);
      } catch (err) {
        console.log("Featured stream not available");
      }
    };
    fetchFeatured();
  }, []);

  const normalizeMatch = (m: any) => ({
    id: m.id,
    team1: { name: m.team1 || m.home_team?.name, logo: m.team1_logo || m.home_team?.logo },
    team2: { name: m.team2 || m.away_team?.name, logo: m.team2_logo || m.away_team?.logo },
    score1: m.score1 ?? m.home_score,
    score2: m.score2 ?? m.away_score,
    status: m.is_live ? "live" : m.is_past ? "past" : "upcoming",
    league: m.league,
    sport: m.sport,
    startTime: m.start_time,
    streamUrl: m.stream_url,
  });

  const filteredMatches = selectedSport === "All"
    ? matches
    : matches.filter((m) => m.sport === selectedSport);

  const sports = ["All", ...Array.from(new Set(matches.map((m) => m.sport).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white pt-16 sm:pt-20">
      <Navbar />

      {/* Featured Stream */}
      {featuredStream && (
        <section className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
              <VideoPlayer
                src={featuredStream.video_url || featuredStream.stream_url}
                poster={featuredStream.thumbnail || featuredStream.poster}
                autoPlay={false}
                className="h-full"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-3">
              {featuredStream.title}
            </h2>
            <p className="text-sm text-gray-400">{featuredStream.description}</p>
          </div>
        </section>
      )}

      {/* Tabs */}
      <section className="px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-4 border-b border-white/10">
            {[
              { key: "live", label: "Live Matches", icon: Trophy },
              { key: "upcoming", label: "Upcoming", icon: Calendar },
              { key: "past", label: "Previous", icon: History },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sport Filter */}
      <section className="px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <SportSelector
            sports={sports.map((s) => ({ id: s, name: s, slug: s.toLowerCase(), icon: "Trophy" }))}
            selected={[selectedSport.toLowerCase()]}
            onChange={(sel) => setSelectedSport(sel[0] === "all" ? "All" : sel[0])}
            multiSelect={false}
          />
        </div>
      </section>

      {/* Matches Grid */}
      <section className="px-4 sm:px-6 py-6 sm:py-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No {activeTab} matches found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} {...normalizeMatch(match)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}