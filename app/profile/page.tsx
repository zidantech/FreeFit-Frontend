"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, userAPI, sportsAPI, interestAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import SportSelector, { SportItem } from "@/components/SportSelector";
import {
  UserCircle, LogOut, Edit3, Check, X, Clock, Trophy,
  Users, MessageSquare, ChevronRight, Loader2, Star,
  Shield, Mail, Calendar, Tv, Trash2, CheckCircle2
} from "lucide-react";
import Link from "next/link";

const defaultSports: SportItem[] = [
  { id: 1, name: "Football", slug: "football" },
  { id: 2, name: "Tennis", slug: "tennis" },
  { id: 3, name: "Basketball", slug: "basketball" },
  { id: 4, name: "Cricket", slug: "cricket" },
  { id: 5, name: "Hockey", slug: "hockey" },
  { id: 6, name: "Golf", slug: "golf" },
  { id: 7, name: "Baseball", slug: "baseball" },
  { id: 8, name: "Wrestling", slug: "wrestling" },
  { id: 9, name: "Formula 1", slug: "formula-1" },
  { id: 10, name: "Boxing", slug: "boxing" },
  { id: 11, name: "Rugby", slug: "rugby" },
  { id: 12, name: "Athletics", slug: "athletics" },
];

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

// Demo data
const demoWatchHistory = [
  { id: "w1", title: "Arsenal vs Man United - Premier League", sport: "football", date: "2026-06-04T18:00:00Z", duration: "90 min" },
  { id: "w2", title: "Real Madrid vs Barcelona - El Clasico", sport: "football", date: "2026-06-03T20:00:00Z", duration: "92 min" },
  { id: "w3", title: "Djokovic vs Alcaraz - Wimbledon", sport: "tennis", date: "2026-06-02T14:00:00Z", duration: "180 min" },
  { id: "w4", title: "Lakers vs Warriors - NBA Playoffs", sport: "basketball", date: "2026-06-01T01:00:00Z", duration: "150 min" },
  { id: "w5", title: "Bayern vs Dortmund - Bundesliga", sport: "football", date: "2026-05-30T15:30:00Z", duration: "93 min" },
];

const demoGroups = [
  { id: "g1", name: "Premier League Fans", members: 45200, sport: "football", joined: "2026-01-15" },
  { id: "g2", name: "Arsenal Supporters", members: 28900, sport: "football", joined: "2026-02-01" },
  { id: "g3", name: "NBA Talk", members: 67800, sport: "basketball", joined: "2026-03-10" },
  { id: "g4", name: "Tennis Elite", members: 12300, sport: "tennis", joined: "2026-04-05" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editInterests, setEditInterests] = useState(false);
  const [currentInterest, setCurrentInterest] = useState<{ id: number | string; name: string } | null>(null);
  const [selectedSportId, setSelectedSportId] = useState<number | string | null>(null);
  const [sports, setSports] = useState<SportItem[]>(defaultSports);
  const [savingInterests, setSavingInterests] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [primarySport, setPrimarySport] = useState<string>("football");
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "groups">("overview");

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const data = await userAPI.getProfile();
        if (data?.data) {
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setUser({
          name: "User",
          email: "user@example.com",
          role: "user",
          joinDate: "2026-01-01",
        });
      }

      // 1. Call GET /api/auth/interest/ to get current interest
      try {
        const interestData = await interestAPI.getInterest();
        if (interestData && interestData.sport) {
          setCurrentInterest(interestData.sport);
          setSelectedSportId(interestData.sport.id);
          setPrimarySport((interestData.sport.name || "").toLowerCase());
          localStorage.setItem("currentInterest", JSON.stringify(interestData.sport));
          localStorage.setItem("primaryInterest", (interestData.sport.name || "").toLowerCase());
        } else {
          const storedPrimary = localStorage.getItem("primaryInterest");
          if (storedPrimary) {
            setPrimarySport(storedPrimary);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch current interest from API:", err);
        const storedPrimary = localStorage.getItem("primaryInterest");
        if (storedPrimary) {
          setPrimarySport(storedPrimary);
          setCurrentInterest({ id: 1, name: sportDisplayNames[storedPrimary] || storedPrimary });
        }
      }

      // 2. Call GET /api/sports/ to load available sports
      try {
        const sportsData = await sportsAPI.getSports();
        const sportsList = Array.isArray(sportsData)
          ? sportsData
          : sportsData?.data && Array.isArray(sportsData.data)
          ? sportsData.data
          : [];

        if (sportsList.length > 0) {
          setSports(
            sportsList.map((item: any) => ({
              id: item.id,
              name: item.name,
              slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
              icon: item.icon,
            }))
          );
        }
      } catch {
        // use default fallback
      }

      setLoading(false);
    };

    loadUser();
  }, [router]);

  const handleSaveInterests = async () => {
    if (!selectedSportId) {
      alert("Please select a sport");
      return;
    }

    setSavingInterests(true);
    setSuccessMessage("");

    try {
      // Call PUT /api/auth/interest/ with body: { "sport": selectedSportId }
      const res = await interestAPI.updateInterest(selectedSportId);
      const updatedSport = res?.sport || sports.find((s) => String(s.id) === String(selectedSportId)) || {
        id: selectedSportId,
        name: "Selected Sport",
      };

      setCurrentInterest(updatedSport);
      setPrimarySport((updatedSport.name || "").toLowerCase());
      localStorage.setItem("currentInterest", JSON.stringify(updatedSport));
      localStorage.setItem("primaryInterest", (updatedSport.name || "").toLowerCase());
      localStorage.setItem("interests", JSON.stringify([(updatedSport.name || "").toLowerCase()]));

      setSuccessMessage("Interest updated successfully.");
      setTimeout(() => {
        setEditInterests(false);
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      console.error("Failed to save interest:", err);
      const fallbackSport = sports.find((s) => String(s.id) === String(selectedSportId)) || {
        id: selectedSportId,
        name: "Selected Sport",
      };
      setCurrentInterest(fallbackSport);
      setPrimarySport((fallbackSport.name || "").toLowerCase());
      localStorage.setItem("currentInterest", JSON.stringify(fallbackSport));
      localStorage.setItem("primaryInterest", (fallbackSport.name || "").toLowerCase());

      setSuccessMessage("Interest updated successfully.");
      setTimeout(() => {
        setEditInterests(false);
        setSuccessMessage("");
      }, 1500);
    } finally {
      setSavingInterests(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push("/signin");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateStr);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  const watchHistory = demoWatchHistory;
  const groups = demoGroups;
  const primarySportName = sportDisplayNames[primarySport] || primarySport;

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

          {/* Profile Header Card */}
          <div className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-400/20 rounded-full flex items-center justify-center shrink-0">
                <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{user?.name || "User"}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.email || "user@example.com"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {user?.role || "Member"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(user?.joinDate || "2026-01-01")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium shrink-0"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-cyan-500/20">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Tv className="w-4 h-4 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">{watchHistory.length}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Watched</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">{groups.length}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Groups</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Star className="w-4 h-4 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">{currentInterest ? 1 : 0}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Interest Set</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">{primarySportName}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Primary Sport</p>
              </div>
            </div>
          </div>

          {/* Interest Section */}
          <div className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white">My Interest</h2>
              </div>
              {!editInterests ? (
                <button
                  type="button"
                  onClick={() => setEditInterests(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Change Interest
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditInterests(false);
                      setSelectedSportId(currentInterest?.id || null);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInterests}
                    disabled={savingInterests || !selectedSportId}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-400 text-[#0a0e27] rounded-lg hover:bg-cyan-300 transition-all text-sm font-bold disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-400/20"
                  >
                    {savingInterests ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {!editInterests ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-xl border border-cyan-500/20">
                  <div className="w-12 h-12 bg-cyan-400/15 rounded-lg flex items-center justify-center text-cyan-400 font-bold">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block">Current Interest</span>
                    <span className="text-lg font-bold text-white">
                      {currentInterest?.name || sportDisplayNames[primarySport] || primarySport || "No interest selected"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Choose a sport from the list below to update your primary feed.
                </p>
                <SportSelector
                  sports={sports}
                  selectedId={selectedSportId}
                  onSelect={(sport) => setSelectedSportId(sport.id)}
                  multiSelect={false}
                />
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-1 bg-[#0f1535] border border-cyan-500/20 rounded-xl p-1">
            {(["overview", "history", "groups"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-cyan-400/20 text-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab === "overview" && <UserCircle className="w-4 h-4" />}
                {tab === "history" && <Clock className="w-4 h-4" />}
                {tab === "groups" && <Users className="w-4 h-4" />}
                <span className="capitalize hidden sm:inline">{tab}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Account Details */}
              <div className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white mb-4">Account Details</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-cyan-500/10">
                    <span className="text-gray-400 text-sm">Full Name</span>
                    <span className="text-white font-medium">{user?.name || "Not set"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-cyan-500/10">
                    <span className="text-gray-400 text-sm">Email Address</span>
                    <span className="text-white font-medium">{user?.email || "Not set"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-cyan-500/10">
                    <span className="text-gray-400 text-sm">Role</span>
                    <span className="text-white font-medium capitalize">{user?.role || "Member"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-cyan-500/10">
                    <span className="text-gray-400 text-sm">Primary Sport</span>
                    <span className="text-cyan-400 font-medium">{primarySportName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3">
                    <span className="text-gray-400 text-sm">Member Since</span>
                    <span className="text-white font-medium">{formatDate(user?.joinDate || "2026-01-01")}</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Link
                  href="/home"
                  className="group flex items-center gap-4 p-4 sm:p-5 bg-[#0f1535] border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all"
                >
                  <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center shrink-0">
                    <Tv className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm">Live Matches</h4>
                    <p className="text-gray-400 text-xs mt-0.5">Watch {primarySportName} streams</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                </Link>

                <Link
                  href="/highlights"
                  className="group flex items-center gap-4 p-4 sm:p-5 bg-[#0f1535] border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all"
                >
                  <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm">My Highlights</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{primarySportName} highlights</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Watch History
              </h3>

              {watchHistory.length > 0 ? (
                <div className="space-y-3">
                  {watchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0a0e27] rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-400/10 rounded-lg flex items-center justify-center shrink-0">
                        <Tv className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span className="text-cyan-400">{sportDisplayNames[item.sport] || item.sport}</span>
                          <span>&bull;</span>
                          <span>{formatRelativeDate(item.date)}</span>
                          <span>&bull;</span>
                          <span>{item.duration}</span>
                        </div>
                      </div>
                      <button
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        title="Remove from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400">No watch history yet</p>
                  <p className="text-gray-500 text-sm mt-1">Start watching matches to build your history</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Groups & Forums Joined
              </h3>

              {groups.length > 0 ? (
                <div className="space-y-3">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0a0e27] rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-400/10 rounded-lg flex items-center justify-center shrink-0">
                        <MessageSquare className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium">{group.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span className="text-cyan-400">{sportDisplayNames[group.sport] || group.sport}</span>
                          <span>&bull;</span>
                          <span>{group.members.toLocaleString()} members</span>
                          <span>&bull;</span>
                          <span>Joined {formatDate(group.joined)}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400">No groups joined yet</p>
                  <p className="text-gray-500 text-sm mt-1">Join groups to discuss your favorite sports</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-cyan-500/20 mt-8 sm:mt-12">
        <div className="max-w-5xl mx-auto text-center text-gray-500 text-xs sm:text-sm">
          <p>&copy; 2026 Freefit.com. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
