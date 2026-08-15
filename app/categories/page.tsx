"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, matchesAPI, highlightsAPI, sportsAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { LayoutGrid, Play, Loader2, Trophy, Sparkles } from "lucide-react";

import { SportIcon } from "@/lib/sportsIcons";

interface Sport {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

const defaultSports: Sport[] = [
  { id: "1", name: "Football", slug: "football" },
  { id: "2", name: "Tennis", slug: "tennis" },
  { id: "3", name: "Basketball", slug: "basketball" },
  { id: "4", name: "Cricket", slug: "cricket" },
  { id: "5", name: "Hockey", slug: "hockey" },
  { id: "6", name: "Golf", slug: "golf" },
  { id: "7", name: "Baseball", slug: "baseball" },
  { id: "8", name: "Formula 1", slug: "formula-1" },
  { id: "9", name: "Boxing", slug: "boxing" },
  { id: "10", name: "Rugby", slug: "rugby" },
  { id: "11", name: "Wrestling", slug: "wrestling" },
  { id: "12", name: "Athletics", slug: "athletics" },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>(defaultSports);
  const [selectedSport, setSelectedSport] = useState<string>("football");
  const [matches, setMatches] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"matches" | "highlights">("matches");

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const fetchSports = async () => {
      try {
        const data = await sportsAPI.getSports();
        const items = data?.data || data;
        if (Array.isArray(items) && items.length > 0) {
          setSports(items);
        }
      } catch (err) {
        console.error("Using default sports categories:", err);
      }
    };

    fetchSports();
    loadSportData("football");
  }, [router]);

  const loadSportData = async (sportSlug: string) => {
    setLoading(true);
    setSelectedSport(sportSlug);

    try {
      const matchesData = await matchesAPI.getLiveMatches();
      const matchItems = matchesData?.data || matchesData?.live_matches || (Array.isArray(matchesData) ? matchesData : []);
      if (Array.isArray(matchItems) && matchItems.length > 0) {
        const filtered = matchItems.filter((m: any) =>
          m.sport?.slug === sportSlug || m.sport?.name?.toLowerCase() === sportSlug || m.teams?.some((t: any) => t.sport?.slug === sportSlug)
        );
        setMatches(filtered.length > 0 ? filtered : matchItems);
      } else {
        setMatches([]);
      }

      const highlightsData = await highlightsAPI.getHighlights({ sport: sportSlug });
      const highlightItems = highlightsData?.data || (Array.isArray(highlightsData) ? highlightsData : []);
      setHighlights(Array.isArray(highlightItems) ? highlightItems : []);
    } catch (err) {
      console.error("Error loading sport data from API:", err);
      setMatches([]);
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedSportName = sports.find(s => s.slug === selectedSport)?.name || selectedSport;

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Categories</h1>
              <p className="text-gray-400 text-sm sm:text-base">Browse all sports and their content</p>
            </div>
          </div>

          {/* Sports Grid */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">All Sports</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {sports.map((sport) => {
                const isSelected = selectedSport === sport.slug;
                return (
                  <button
                    key={sport.id}
                    onClick={() => loadSportData(sport.slug)}
                    className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 sm:gap-3 ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/10"
                        : "border-cyan-500/20 bg-[#0f1535]/50 hover:border-cyan-500/40 hover:bg-[#0f1535]"
                    }`}
                  >
                    <SportIcon slug={sport.slug} name={sport.name} iconUrl={sport.icon} className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                    <span className={`text-xs sm:text-sm font-semibold ${isSelected ? "text-cyan-400" : "text-white"}`}>
                      {sport.name}
                    </span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Content Tabs */}
          <section>
            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 border-b border-cyan-500/20">
              <button
                onClick={() => setActiveTab("matches")}
                className={`pb-3 sm:pb-4 text-sm sm:text-base font-semibold transition-colors relative flex items-center gap-2 ${
                  activeTab === "matches" ? "text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <Trophy className="w-4 h-4" />
                {selectedSportName} Matches
                {activeTab === "matches" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("highlights")}
                className={`pb-3 sm:pb-4 text-sm sm:text-base font-semibold transition-colors relative flex items-center gap-2 ${
                  activeTab === "highlights" ? "text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {selectedSportName} Highlights
                {activeTab === "highlights" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === "matches" ? (
                  matches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {matches.map((match) => (
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
                      <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-gray-400">No matches available for {selectedSportName}</p>
                    </div>
                  )
                ) : (
                  highlights.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {highlights.map((highlight) => (
                        <div
                          key={highlight.id}
                          className="group relative rounded-xl overflow-hidden bg-[#0f1535] border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer"
                        >
                          <div className="aspect-video relative">
                            <img
                              src={highlight.thumbnail}
                              alt={highlight.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="w-12 h-12 bg-cyan-400/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-6 h-6 text-[#0a0e27] ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                            <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                              {highlight.duration}
                            </span>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h3 className="text-white text-sm font-medium truncate group-hover:text-cyan-400 transition-colors">
                              {highlight.title}
                            </h3>
                            <p className="text-gray-400 text-xs mt-1">{selectedSportName} &bull; {highlight.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#0f1535]/50 rounded-xl border border-cyan-500/20">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-gray-400">No highlights available for {selectedSportName}</p>
                    </div>
                  )
                )}
              </>
            )}
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
