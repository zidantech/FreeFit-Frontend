"use client";

import Link from "next/link";
import {
  Play,
  ChevronRight,
  Trophy,
  Calendar,
  Newspaper,
  Bell,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import { authAPI, streamsAPI } from "@/lib/api";

// ─── Demo Data ───────────────────────────────────────────────────────

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1629977007371-0ba395424741?w=1920&q=80",
  "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1920&q=80",
  "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1920&q=80",
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=80",
  "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=1920&q=80",
];

const sportsImages = [
  { src: "https://images.unsplash.com/photo-1728116693268-125c5d6ad9e2?w=800&q=80", alt: "Formula 1 Racing", span: "col-span-2 row-span-1" },
  { src: "https://images.unsplash.com/photo-1629977007371-0ba395424741?w=800&q=80", alt: "Football Action", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1719518701287-72bb9b3366ee?w=800&q=80", alt: "American Football", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?w=800&q=80", alt: "Boxing Match", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1651179602825-a5cb093cd467?w=800&q=80", alt: "Baseball Game", span: "col-span-2 row-span-1" },
  { src: "https://plus.unsplash.com/premium_photo-1676634832558-6654a134e920?w=800&q=80", alt: "Basketball Game", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/flagged/photo-1576972405668-2d020a01cbfa?w=800&q=80", alt: "Tennis Player", span: "col-span-1 row-span-1" },
  { src: "https://plus.unsplash.com/premium_photo-1664910059954-9fba97bc5d6e?w=800&q=80", alt: "Boxing Training", span: "col-span-1 row-span-1" }
];

const videoHighlights = [
  {
    id: "1",
    title: "Premier League Best Goals - Matchweek 12",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1629977007371-0ba395424741?w=800&q=80",
    sport: "Football",
    duration: "3:45",
    views: "1.2M"
  },
  {
    id: "2",
    title: "F1 Monaco GP 2026 - Race Highlights",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1728116693268-125c5d6ad9e2?w=800&q=80",
    sport: "Formula 1",
    duration: "5:20",
    views: "890K"
  },
  {
    id: "3",
    title: "Champions League Final - Extended Highlights",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    sport: "Football",
    duration: "8:15",
    views: "2.5M"
  }
];

const liveSports = [
  {
    id: "1",
    sport: "Football",
    league: "UEFA Champions Leagues",
    team1: "Arsenal",
    team2: "PSG",
    score1: 2,
    score2: 1,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    isLive: true,
    span: "col-span-1 row-span-2",
  },
  {
    id: "2",
    sport: "Baseball",
    image: "https://images.unsplash.com/photo-1544298621-6e7a3f47e4a5?w=800&q=80",
    isLive: false,
    span: "col-span-1 row-span-1",
  },
  {
    id: "3",
    sport: "Basketball",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    isLive: false,
    span: "col-span-1 row-span-2",
  },
  {
    id: "4",
    sport: "Formula 1",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
    isLive: false,
    span: "col-span-1 row-span-1",
  },
];

const comingUpMatches = [
  {
    id: "1",
    sport: "Football",
    league: "Premier League",
    team1: "Chelsea",
    team2: "Arsenal",
    time: "Today",
    timeGMT: "20.00 GMT",
  },
  {
    id: "2",
    sport: "Basketball",
    league: "NBA Playoff",
    team1: "Spurs",
    team2: "Knicks",
    time: "Tomorrow",
    timeGMT: "02.00 GMT",
  },
  {
    id: "3",
    sport: "Baseball",
    league: "MLB",
    team1: "Yankees",
    team2: "Red Sox",
    time: "Sat, 14 Jun",
    timeGMT: "18.30 GMT",
  },
  {
    id: "4",
    sport: "Volleyball",
    league: "Women Nations League",
    team1: "Canada",
    team2: "Japan",
    time: "Sun, 15 Jun",
    timeGMT: "14.00 GMT",
  },
];

const allSportsCategories = [
  { name: "Cricket", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80" },
  { name: "Football", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80" },
  { name: "Basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80" },
  { name: "Volleyball", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80" },
  { name: "Hockey", image: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=400&q=80" },
  { name: "Tennis", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80" },
  { name: "Baseball", image: "https://images.unsplash.com/photo-1544298621-6e7a3f47e4a5?w=400&q=80" },
];

// ─── Component ─────────────────────────────────────────────────────

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [featuredStreams, setFeaturedStreams] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState(0);
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());

    const fetchStreams = async () => {
      try {
        const data = await streamsAPI.getFeatured();
        if (data?.data) setFeaturedStreams(data.data);
      } catch (err) {
        console.log("Featured streams not available yet");
      }
    };
    fetchStreams();
  }, []);

  // Auto-rotate hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextHero = useCallback(() => {
    setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  const prevHero = useCallback(() => {
    setCurrentHero((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: WATCH NOW (Hero)
          mt-16/mt-20 pushes it BELOW the fixed navbar — NO OVERLAP
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden mt-16 sm:mt-20">
        {/* Background Images */}
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHero ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${img}')` }}
            />
          </div>
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#0a0e27]/70" />

        {/* Navigation Arrows */}
        <button
          onClick={prevHero}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <button
          onClick={nextHero}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHero(index)}
              className={`transition-all rounded-full ${
                index === currentHero
                  ? "w-8 h-2 bg-cyan-400"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-cyan-400/30">
              <Play
                className="w-7 h-7 sm:w-8 sm:h-8 text-[#0a0e27] ml-1"
                fill="currentColor"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider">
              Watch Now
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Stream the biggest matches and events from across the continent in HD
            </p>

            {isAuthenticated ? (
              <Link
                href="/home"
                className="inline-block px-8 sm:px-12 py-2.5 sm:py-3 bg-cyan-400 text-[#0a0e27] rounded-full font-semibold text-base sm:text-lg hover:bg-cyan-300 transition-colors tracking-wide"
              >
                Watch Now
              </Link>
            ) : (
              <Link
                href="/signup"
                className="inline-block px-8 sm:px-12 py-2.5 sm:py-3 bg-[#5a5a5a] text-cyan-400 rounded-full font-semibold text-base sm:text-lg hover:bg-[#6a6a6a] transition-colors tracking-wide"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: MATCHES STREAMING NOW
          ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <span className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase mb-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Now
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Matches Streaming Now
              </h2>
            </div>
            <Link
              href="/home"
              className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 sm:mb-6">
            <VideoPlayer
              src={videoHighlights[activeVideo].videoUrl}
              poster={videoHighlights[activeVideo].poster}
              autoPlay={false}
              className="h-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {videoHighlights.map((video, index) => (
              <button
                key={video.id}
                onClick={() => setActiveVideo(index)}
                className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg border transition-all text-left ${
                  activeVideo === index
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-cyan-500/20 bg-[#0f1535] hover:border-cyan-500/40"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={video.poster}
                    alt={video.title}
                    className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[10px] sm:text-xs rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-white text-xs sm:text-sm font-medium truncate">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-cyan-400 text-[10px] sm:text-xs">
                      {video.sport}
                    </span>
                    <span className="text-gray-500 text-[10px] sm:text-xs">
                      {video.views} views
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: LIVE SPORTS GRID
          ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                Right Now
              </span>
            </div>
            <Link
              href="/home"
              className="text-white text-sm hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              see all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">
            Live Sports
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 auto-rows-[160px] sm:auto-rows-[200px]">
            {liveSports.map((sport) => (
              <div
                key={sport.id}
                className={`${sport.span} relative rounded-xl overflow-hidden group cursor-pointer`}
              >
                <img
                  src={sport.image}
                  alt={sport.sport}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#0a0e27]/30 group-hover:bg-[#0a0e27]/10 transition-colors" />

                {sport.isLive && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold uppercase rounded">
                        Live Now
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="font-bold text-lg sm:text-xl">
                        {sport.team1}
                      </span>
                      <span className="text-cyan-400 font-bold text-xl sm:text-2xl">
                        {sport.score1}-{sport.score2}
                      </span>
                      <span className="font-bold text-lg sm:text-xl">
                        {sport.team2}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs mt-0.5">
                      {sport.league}
                    </p>
                  </div>
                )}

                {!sport.isLive && (
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white font-semibold text-sm">
                      {sport.sport}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: COMING UP
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                Dont Miss
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                Coming Up
              </h2>
            </div>
            <Link
              href="/home#schedule"
              className="text-white text-sm hover:text-cyan-400 transition-colors uppercase tracking-wider"
            >
              Full Schedule
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {comingUpMatches.map((match) => (
              <div
                key={match.id}
                className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-4 sm:p-5 hover:border-cyan-400/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white text-xs font-medium uppercase">
                      {match.sport}
                    </p>
                    <p className="text-gray-500 text-[10px]">{match.league}</p>
                  </div>
                  <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                    <Bell className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                  </button>
                </div>

                <div className="text-center py-3">
                  <p className="text-white font-bold text-lg">{match.team1}</p>
                  <p className="text-cyan-400 font-bold text-xl my-1">VS</p>
                  <p className="text-white font-bold text-lg">{match.team2}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-gray-400 text-xs">{match.time}</p>
                  <p className="text-gray-500 text-xs">{match.timeGMT}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: ALL SPORTS
          ═══════════════════════════════════════════════════════════════ */}
      <section id="categories" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-cyan-400 text-sm mb-1">Browse by sports</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
              All Sports
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {allSportsCategories.map((sport) => (
              <div
                key={sport.name}
                className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[4/3]"
              >
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#0a0e27]/50 group-hover:bg-[#0a0e27]/30 transition-colors" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-white font-bold text-sm sm:text-base">
                    {sport.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: QUICK LINKS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Link
              href="/home"
              className="group flex items-center gap-4 p-4 sm:p-6 bg-[#0f1535] border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Live Matches
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Watch ongoing games now
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-cyan-400 transition-colors shrink-0" />
            </Link>

            <Link
              href="/home#schedule"
              className="group flex items-center gap-4 p-4 sm:p-6 bg-[#0f1535] border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Schedule
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Upcoming matches
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-cyan-400 transition-colors shrink-0" />
            </Link>

            <Link
              href="/home#highlights"
              className="group flex items-center gap-4 p-4 sm:p-6 bg-[#0f1535] border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center shrink-0">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Highlights
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Best moments replay
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-cyan-400 transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: SPORTS MASONRY GRID
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">
            Explore More
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[120px] sm:auto-rows-[200px]">
            {sportsImages.map((image, index) => (
              <div
                key={index}
                className={`${image.span} relative rounded-lg overflow-hidden group cursor-pointer`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#0a0e27]/40 group-hover:bg-[#0a0e27]/20 transition-colors" />
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {image.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-cyan-400 font-bold text-lg">Free-fit.com</p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 bg-white rounded flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 rounded flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}