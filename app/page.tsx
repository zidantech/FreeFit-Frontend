"use client";

import Link from "next/link";
import {
  Play,
  ChevronRight,
  Trophy,
  Calendar,
  Sparkles,
  Bell,
  Check,
  Flame,
  Radio,
  Zap,
  Shield,
  Smartphone,
  Users,
  Eye,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import { authAPI } from "@/lib/api";

// ─── Data Constants ───────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    image: "/hero_stadium.jpg",
    sport: "Football",
    badge: "Matchday Live",
    title: "Feel Every Goal In Real-Time",
    subtitle: "Stream Premier League, Champions League, La Liga & Serie A in crisp 4K with zero lag.",
    accent: "from-cyan-400 via-teal-400 to-blue-500",
    glowColor: "rgba(6, 182, 212, 0.4)",
    dot: "bg-cyan-400",
  },
  {
    image: "/hero_f1.jpg",
    sport: "Formula 1",
    badge: "Grand Prix Weekend",
    title: "Pure Speed. Maximum Adrenaline.",
    subtitle: "Every turn, every pit stop, every overtake — live onboard camera feeds and team radios.",
    accent: "from-orange-400 via-amber-500 to-red-500",
    glowColor: "rgba(249, 115, 22, 0.4)",
    dot: "bg-orange-400",
  },
  {
    image: "/hero_basketball.jpg",
    sport: "Basketball",
    badge: "NBA Playoffs",
    title: "Rise Above The Rim",
    subtitle: "Unfiltered courtside energy — watch every slam dunk and buzzer beater live.",
    accent: "from-purple-400 via-violet-500 to-indigo-500",
    glowColor: "rgba(168, 85, 247, 0.4)",
    dot: "bg-purple-400",
  },
  {
    image: "/hero_boxing.jpg",
    sport: "Combat Sports",
    badge: "Championship Fight",
    title: "World Title Main Event",
    subtitle: "Uncut ring-walks, heavy punches and post-fight interviews broadcast direct to your screen.",
    accent: "from-rose-500 via-red-500 to-amber-500",
    glowColor: "rgba(244, 63, 94, 0.4)",
    dot: "bg-rose-400",
  },
  {
    image: "/hero_tennis.jpg",
    sport: "Tennis",
    badge: "Grand Slam Centre Court",
    title: "Championship Point Glory",
    subtitle: "Follow every ace and tiebreak from Wimbledon, Roland Garros, US Open and Australian Open.",
    accent: "from-emerald-400 via-green-500 to-cyan-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    dot: "bg-emerald-400",
  },
];

const METRICS_BAR = [
  { icon: Radio, text: "24/7 Live HD & 4K Streams", color: "text-red-400" },
  { icon: Zap, text: "Ultra-Low Latency Broadcasts", color: "text-cyan-400" },
  { icon: Trophy, text: "120+ International Leagues", color: "text-amber-400" },
  { icon: Shield, text: "100% Free & No Hidden Paywalls", color: "text-emerald-400" },
  { icon: Users, text: "Over 500K Active Sports Fans", color: "text-blue-400" },
];

const videoHighlights = [
  {
    id: "1",
    title: "Real Madrid vs PSG - Champions League Epic Clash",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/action_champions_league.jpg",
    sport: "Football",
    duration: "10:45",
    views: "1.8M",
    tag: "Trending",
  },
  {
    id: "2",
    title: "Premier League Goal of the Season Contenders",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "/action_football_goal.jpg",
    sport: "Football",
    duration: "06:12",
    views: "940K",
    tag: "Highlights",
  },
  {
    id: "3",
    title: "F1 Monaco Grand Prix 2026 - Dramatic Overtakes",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "/hero_f1.jpg",
    sport: "Formula 1",
    duration: "08:30",
    views: "1.2M",
    tag: "Replay",
  },
];

const liveSports = [
  {
    id: "1",
    sport: "Football",
    league: "UEFA Champions League",
    team1: "Real Madrid",
    team2: "Paris Saint-Germain",
    score1: 2,
    score2: 1,
    minute: "74'",
    image: "/action_champions_league.jpg",
    isLive: true,
    viewers: "128.4K",
  },
  {
    id: "2",
    sport: "Basketball",
    league: "NBA Playoffs",
    team1: "L.A. Lakers",
    team2: "Golden State",
    score1: 98,
    score2: 95,
    minute: "Q4 3:12",
    image: "/hero_basketball.jpg",
    isLive: true,
    viewers: "84.2K",
  },
  {
    id: "3",
    sport: "Formula 1",
    league: "Monaco Grand Prix",
    team1: "Norris (McLaren)",
    team2: "Verstappen (Red Bull)",
    score1: "P1",
    score2: "P2",
    minute: "Lap 54/78",
    image: "/hero_f1.jpg",
    isLive: true,
    viewers: "210.6K",
  },
  {
    id: "4",
    sport: "Tennis",
    league: "Wimbledon Men's Final",
    team1: "Alcaraz",
    team2: "Djokovic",
    score1: 3,
    score2: 2,
    minute: "Final Set",
    image: "/hero_tennis.jpg",
    isLive: true,
    viewers: "95.1K",
  },
];

const comingUpMatches = [
  {
    id: "1",
    sport: "Football",
    league: "Premier League",
    team1: "Chelsea F.C.",
    team2: "Manchester United",
    date: "Today",
    time: "20:00 GMT",
    status: "Upcoming",
    badge: "Big 6 Derby",
  },
  {
    id: "2",
    sport: "Basketball",
    league: "NBA Championship",
    team1: "Boston Celtics",
    team2: "Dallas Mavericks",
    date: "Tonight",
    time: "01:30 GMT",
    status: "Upcoming",
    badge: "Game 7",
  },
  {
    id: "3",
    sport: "Boxing",
    league: "WBC Heavyweight Title",
    team1: "Tyson Fury",
    team2: "Oleksandr Usyk",
    date: "Tomorrow",
    time: "22:00 GMT",
    status: "Main Card",
    badge: "Undisputed",
  },
  {
    id: "4",
    sport: "Football",
    league: "La Liga",
    team1: "Barcelona",
    team2: "Real Madrid",
    date: "Sunday",
    time: "19:45 GMT",
    status: "Upcoming",
    badge: "El Clásico",
  },
];

const platformFeatures = [
  {
    icon: Zap,
    title: "Sub-Second Latency",
    desc: "Experience live sports faster than cable TV with adaptive bitrate streaming.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Trophy,
    title: "Global Sports Hub",
    desc: "From European football to NBA, combat sports, and motorsport — all under one roof.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Smartphone,
    title: "Stream On Any Device",
    desc: "Seamless responsive playback on desktop, mobile, tablet, and smart screens.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Users,
    title: "Fan Forum & Live Chat",
    desc: "Connect with thousands of fans globally, share banter, and discuss real-time tactics.",
    color: "from-emerald-500 to-teal-500",
  },
];

const allSportsCategories = [
  { name: "Football", image: "/action_football_goal.jpg", count: "34 Live Matches", icon: "⚽" },
  { name: "Formula 1", image: "/hero_f1.jpg", count: "Practice & Race", icon: "🏎️" },
  { name: "Basketball", image: "/hero_basketball.jpg", count: "12 Live Games", icon: "🏀" },
  { name: "Boxing / UFC", image: "/hero_boxing.jpg", count: "Fight Night Cards", icon: "🥊" },
  { name: "Tennis", image: "/hero_tennis.jpg", count: "Centre Court Streams", icon: "🎾" },
  { name: "Stadium Live", image: "/hero_stadium.jpg", count: "Multi-View Broadcast", icon: "🏟️" },
];

// ─── Component ────────────────────────────────────────────────────────

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const [currentHero, setCurrentHero] = useState(0);
  const [remindedMatches, setRemindedMatches] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());
  }, []);

  // Auto-rotate hero slides every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const nextHero = useCallback(() => {
    setCurrentHero((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevHero = useCallback(() => {
    setCurrentHero((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const toggleReminder = (id: string) => {
    setRemindedMatches((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const activeSlide = HERO_SLIDES[currentHero];

  return (
    <main className="min-h-screen bg-[#070a1e] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO CAROUSEL (Edge-to-Edge Stadium Atmosphere)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[620px] sm:min-h-[700px] lg:min-h-[780px] flex items-center overflow-hidden mt-14 sm:mt-16">
        {/* Background Image Carousel with Smooth Fade & Scale */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentHero
                ? "opacity-100 scale-100 z-0"
                : "opacity-0 scale-105 pointer-events-none -z-10"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070a1e] via-[#070a1e]/75 to-[#070a1e]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a1e] via-transparent to-[#070a1e]/40" />
          </div>
        ))}

        {/* Ambient Glow matching active sport accent */}
        <div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 opacity-30"
          style={{ backgroundColor: activeSlide.glowColor }}
        />

        {/* Navigation Arrows */}
        <button
          onClick={prevHero}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-xl group"
        >
          <ChevronRight className="w-6 h-6 rotate-180 text-gray-300 group-hover:text-cyan-300 transition-colors" />
        </button>
        <button
          onClick={nextHero}
          aria-label="Next slide"
          className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-xl group"
        >
          <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-cyan-300 transition-colors" />
        </button>

        {/* Main Hero Content */}
        <div className="relative z-10 w-full px-5 sm:px-10 md:px-14 lg:px-20 py-12 sm:py-16">
          <div className="max-w-3xl">
            {/* Live Indicator Pill */}
            <div
              key={`badge-${currentHero}`}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-5 bg-[#0a1133]/80 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/10 animate-fadeIn"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-cyan-300">{activeSlide.sport}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">{activeSlide.badge}</span>
            </div>

            {/* Title with Gradient Text */}
            <h1
              key={`title-${currentHero}`}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-5 leading-[1.1] tracking-tight animate-slideUp"
            >
              {activeSlide.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className={`bg-gradient-to-r ${activeSlide.accent} bg-clip-text text-transparent`}>
                {activeSlide.title.split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${currentHero}`}
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed font-normal animate-slideUp"
            >
              {activeSlide.subtitle}
            </p>

            {/* CTAs & Stats */}
            <div
              key={`cta-${currentHero}`}
              className="flex flex-wrap items-center gap-4 animate-slideUp"
            >
              {isAuthenticated ? (
                <Link
                  href="/home"
                  className={`inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r ${activeSlide.accent} text-black font-extrabold text-base rounded-full hover:shadow-cyan-400/30 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Live Stream
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className={`inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r ${activeSlide.accent} text-black font-extrabold text-base rounded-full hover:shadow-cyan-400/30 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Start Streaming Free
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-base rounded-full transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}

              {/* Instant Status Pill */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs text-gray-300">
                <Flame className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">480K+</strong> streaming right now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators & Thumbnails (Bottom Bar) */}
        <div className="absolute bottom-6 sm:bottom-8 left-5 sm:left-10 md:left-14 lg:left-20 right-5 sm:right-10 md:right-14 lg:right-20 z-20 flex items-center justify-between">
          {/* Dots Indicator */}
          <div className="flex items-center gap-2.5">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentHero(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  index === currentHero
                    ? `w-10 h-2.5 ${slide.dot} shadow-lg shadow-cyan-400/50`
                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
            <span className="text-gray-400 text-xs font-mono ml-2">
              0{currentHero + 1} / 0{HERO_SLIDES.length}
            </span>
          </div>

          {/* Quick Sport Selector Strip (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-3">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentHero(index)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all backdrop-blur-md border ${
                  index === currentHero
                    ? "bg-cyan-500/30 text-cyan-300 border-cyan-400/80 shadow-md shadow-cyan-500/20"
                    : "bg-black/40 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                {slide.sport}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: LIVE METRICS & VALUE RIBBON
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0b102e] border-y border-cyan-500/20 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-around flex-wrap gap-4 text-xs sm:text-sm">
          {METRICS_BAR.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2 font-semibold text-gray-300">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: FEATURED LIVE THEATER & HIGHLIGHTS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-14">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Featured Broadcast
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Matches Streaming Now
              </h2>
            </div>
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors group"
            >
              Explore All Live Streams
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Theater View: Video Player + Interactive Playlist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Player Container (8 cols) */}
            <div className="lg:col-span-8 bg-[#0a0f30] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
              <div className="relative aspect-video w-full bg-black">
                <VideoPlayer
                  src={videoHighlights[activeVideo].videoUrl}
                  poster={videoHighlights[activeVideo].poster}
                  autoPlay={false}
                  className="w-full h-full"
                />
              </div>

              {/* Player Metadata Bar */}
              <div className="p-4 sm:p-6 flex items-center justify-between flex-wrap gap-3 bg-gradient-to-b from-[#0a0f30] to-[#080c26]">
                <div>
                  <span className="px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-md mr-2">
                    {videoHighlights[activeVideo].sport}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                    {videoHighlights[activeVideo].title}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    {videoHighlights[activeVideo].views} watching
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded border border-emerald-500/30">
                    4K Ultra HD
                  </span>
                </div>
              </div>
            </div>

            {/* Playlist Sidebar (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1 mb-1">
                Select Stream Channel
              </h4>
              {videoHighlights.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideo(index)}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-200 group ${
                    activeVideo === index
                      ? "bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/15"
                      : "bg-[#0b102e]/80 border-white/10 hover:border-cyan-500/40 hover:bg-[#0e1640]"
                  }`}
                >
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={video.poster}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                    <span className="absolute bottom-1 right-1 px-1 bg-black/80 text-[10px] font-mono text-white rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-cyan-400">
                        {video.sport}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                        {video.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {video.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {video.views} views
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: REAL-TIME LIVE MATCHES GRID
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-14 bg-[#050818]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                Action On The Field
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Live Scoreboards
              </h2>
            </div>
            <Link
              href="/home"
              className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              See All Live <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {liveSports.map((match) => (
              <div
                key={match.id}
                className="group relative rounded-2xl overflow-hidden bg-[#090e29] border border-cyan-500/20 hover:border-cyan-400/80 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-cyan-500/20 flex flex-col justify-between"
              >
                {/* Background Sport Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={match.image}
                    alt={match.sport}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090e29] via-[#090e29]/60 to-black/40" />

                  {/* Header Pill */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-500 text-white shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Live {match.minute}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-gray-300 border border-white/15">
                      {match.sport}
                    </span>
                  </div>
                </div>

                {/* Score & Teams Card Body */}
                <div className="p-4 sm:p-5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {match.league}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-white font-bold text-sm">
                      <span className="truncate max-w-[150px]">{match.team1}</span>
                      <span className="text-cyan-400 font-mono text-base">{match.score1}</span>
                    </div>
                    <div className="flex items-center justify-between text-white font-bold text-sm">
                      <span className="truncate max-w-[150px]">{match.team2}</span>
                      <span className="text-cyan-400 font-mono text-base">{match.score2}</span>
                    </div>
                  </div>

                  {/* Watch CTA */}
                  <Link
                    href="/home"
                    className="w-full py-2.5 bg-cyan-500/10 group-hover:bg-cyan-500 text-cyan-400 group-hover:text-black rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-cyan-500/30 group-hover:border-cyan-400"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Watch Match Live
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: UPCOMING MATCHDAY FIXTURES
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                Don't Miss Out
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Upcoming Fixtures
              </h2>
            </div>
            <Link
              href="/home"
              className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Full Calendar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {comingUpMatches.map((fixture) => (
              <div
                key={fixture.id}
                className="bg-[#0a0f30] border border-cyan-500/20 hover:border-cyan-400/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 bg-white/5 text-cyan-300 text-[10px] font-bold uppercase rounded-md border border-white/10">
                      {fixture.league}
                    </span>
                    <button
                      onClick={() => toggleReminder(fixture.id)}
                      className={`p-2 rounded-full transition-all ${
                        remindedMatches[fixture.id]
                          ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                          : "bg-white/5 text-gray-400 hover:text-cyan-400 hover:bg-white/10"
                      }`}
                      title="Set Match Reminder"
                    >
                      {remindedMatches[fixture.id] ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Bell className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="text-center py-3">
                    <p className="text-white font-extrabold text-base truncate">{fixture.team1}</p>
                    <span className="inline-block my-1 px-2.5 py-0.5 text-[11px] font-black text-cyan-400 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                      VS
                    </span>
                    <p className="text-white font-extrabold text-base truncate">{fixture.team2}</p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-white font-semibold">{fixture.date}</p>
                    <p className="text-gray-400 font-mono text-[11px]">{fixture.time}</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                    {fixture.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: WHY FREEFIT (PLATFORM ADVANTAGES)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-14 bg-[#050818] border-y border-cyan-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
              The Next Evolution of Sports
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Engineered For True Sports Lovers
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-3">
              FreeFit delivers instant, crystal-clear broadcasts with community chat, multi-angle viewports, and zero subscription barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-[#090e29] border border-cyan-500/20 hover:border-cyan-400/80 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-950/50 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: ALL SPORTS CATEGORIES CARDS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
              Explore Every Arena
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Browse By Sport
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {allSportsCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/home?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/10 hover:border-cyan-400/80 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/20"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a1e] via-[#070a1e]/40 to-transparent group-hover:via-[#070a1e]/20 transition-colors" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-lg mb-1 block">{cat.icon}</span>
                  <p className="text-white font-extrabold text-sm sm:text-base leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-cyan-300 text-[11px] font-medium mt-0.5">
                    {cat.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8: PRE-FOOTER CALL TO ACTION BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-14">
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1645] via-[#0a1236] to-[#0d1645] border border-cyan-400/40 p-8 sm:p-14 text-center shadow-2xl shadow-cyan-950/60">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-400/30">
              <Sparkles className="w-8 h-8 text-cyan-300" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Never Miss A Match Again
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mb-8 leading-relaxed">
              Join over half a million sports fans enjoying uninterrupted high-definition live streaming, commentary, and match highlights.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-9 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-base rounded-full shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all duration-200"
              >
                Create Free Account
              </Link>
              <Link
                href="/home"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base rounded-full backdrop-blur-md transition-all duration-200"
              >
                Browse Live Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER (Screen-Wide Edge Padding Aligned With Navbar)
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 py-8 sm:py-10 border-t border-cyan-500/20 bg-[#050818]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="FreeFit" className="h-8 sm:h-9 w-auto object-contain" />
            <span className="text-xs text-gray-400">
              © {new Date().getFullYear()} FreeFit. All sports reserved.
            </span>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/home" className="hover:text-cyan-400 transition-colors">Live Streams</Link>
            <Link href="/categories" className="hover:text-cyan-400 transition-colors">Categories</Link>
            <Link href="/teams" className="hover:text-cyan-400 transition-colors">Teams</Link>
            <Link href="/forum" className="hover:text-cyan-400 transition-colors">Fan Forum</Link>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Streams Operational
          </div>
        </div>
      </footer>

      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </main>
  );
}