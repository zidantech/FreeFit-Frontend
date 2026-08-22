"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, sportsAPI, interestAPI } from "@/lib/api";
import SportSelector, { SportItem } from "@/components/SportSelector";
import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

const fallbackSports: SportItem[] = [
  { id: 1, name: "Football", slug: "football" },
  { id: 2, name: "Basketball", slug: "basketball" },
  { id: 3, name: "Cricket", slug: "cricket" },
  { id: 4, name: "Tennis", slug: "tennis" },
  { id: 5, name: "Hockey", slug: "hockey" },
  { id: 6, name: "Golf", slug: "golf" },
  { id: 7, name: "Baseball", slug: "baseball" },
  { id: 8, name: "Formula 1", slug: "formula-1" },
  { id: 9, name: "Boxing", slug: "boxing" },
  { id: 10, name: "Rugby", slug: "rugby" },
  { id: 11, name: "Wrestling", slug: "wrestling" },
  { id: 12, name: "Athletics", slug: "athletics" },
];

export default function InterestPage() {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState<SportItem | null>(null);
  const [sports, setSports] = useState<SportItem[]>(fallbackSports);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // 1. Check authentication
    if (!authAPI.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    // 2. Fetch current interest & sports list
    const initData = async () => {
      try {
        setLoading(true);

        // Check if user already has an interest selected
        try {
          const interestRes = await interestAPI.getInterest();
          if (interestRes && interestRes.sport) {
            setSelectedSport(interestRes.sport);
          }
        } catch (e) {
          console.warn("Could not retrieve current user interest:", e);
        }

        // Fetch sports from GET /api/sports/
        try {
          const sportsRes = await sportsAPI.getSports();
          const sportsList = Array.isArray(sportsRes)
            ? sportsRes
            : sportsRes?.data && Array.isArray(sportsRes.data)
            ? sportsRes.data
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
        } catch (e) {
          console.warn("Failed to fetch sports from API, using default list", e);
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [router]);

  const handleSelectSport = (sport: SportItem) => {
    setSelectedSport(sport);
    setError("");
  };

  const handleContinue = async () => {
    if (!selectedSport) {
      setError("Please choose your favorite sport to continue");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Call PUT /api/auth/interest/ with { "sport": SPORT_ID }
      const res = await interestAPI.updateInterest(selectedSport.id);
      const savedSport = res?.sport || selectedSport;
      const sportSlug = (savedSport.name || "").toLowerCase();

      let existingInterests: string[] = [];
      try {
        const parsed = JSON.parse(localStorage.getItem("interests") || "[]");
        if (Array.isArray(parsed)) existingInterests = parsed;
      } catch {}
      const updatedList = Array.from(new Set([...existingInterests, sportSlug]));

      // Sync local storage
      localStorage.setItem("currentInterest", JSON.stringify(savedSport));
      localStorage.setItem("primaryInterest", sportSlug);
      localStorage.setItem("interests", JSON.stringify(updatedList));

      router.push("/home");
    } catch (err: any) {
      console.error("Failed to save interest:", err);
      setError(err?.message || "Failed to save your interest. Please try again.");

      const fallbackSlug = (selectedSport.name || "").toLowerCase();
      let existingInterests: string[] = [];
      try {
        const parsed = JSON.parse(localStorage.getItem("interests") || "[]");
        if (Array.isArray(parsed)) existingInterests = parsed;
      } catch {}
      const updatedList = Array.from(new Set([...existingInterests, fallbackSlug]));

      // Graceful fallback for offline / mock testing
      localStorage.setItem("currentInterest", JSON.stringify(selectedSport));
      localStorage.setItem("primaryInterest", fallbackSlug);
      localStorage.setItem("interests", JSON.stringify(updatedList));
      router.push("/home");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    // If skipping, assign first sport as default or navigate directly
    const defaultSport = sports[0] || fallbackSports[0];
    localStorage.setItem("primaryInterest", defaultSport.name.toLowerCase());
    router.push("/home");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-wide">
            Freefit.com
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Step 1 of 1
          </span>
        </div>

        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
            Choose your sport
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
            Select your preferred sport to personalize your live streaming feed, upcoming match alerts, and community highlights.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        <SportSelector
          sports={sports}
          selectedId={selectedSport?.id}
          onSelect={handleSelectSport}
          multiSelect={false}
        />

        {selectedSport && (
          <div className="mt-6 flex items-center justify-center sm:justify-start gap-2 text-cyan-400 text-sm bg-cyan-500/10 border border-cyan-500/20 py-2.5 px-4 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Selected interest: <strong className="text-white font-semibold">{selectedSport.name}</strong>
            </span>
          </div>
        )}

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-cyan-500/15">
          <button
            type="button"
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base order-2 sm:order-1 cursor-pointer py-2 px-4"
          >
            Skip for now
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={saving || !selectedSport}
            className="flex items-center gap-2 px-8 py-3.5 bg-cyan-400 text-[#0a0e27] rounded-full font-bold text-sm sm:text-base hover:bg-cyan-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 w-full sm:w-auto justify-center shadow-lg shadow-cyan-400/20 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Interest...
              </>
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      <footer className="text-center text-gray-500 text-xs py-6 mt-12 border-t border-white/5">
        &copy; 2026 Freefit.com. All rights reserved.
      </footer>
    </main>
  );
}