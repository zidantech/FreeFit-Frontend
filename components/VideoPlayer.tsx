"use client";

import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Send,
  ChevronRight,
  ChevronLeft,
  User,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  dislikes: number;
  timestamp: string;
  isMe?: boolean;
}

// ─── Demo Data ───────────────────────────────────────────────────────

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    user: "Paul",
    avatar: "https://i.pravatar.cc/150?img=11",
    text: "Ronaldo is the greatest",
    likes: 12,
    dislikes: 2,
    timestamp: "2m ago",
  },
  {
    id: "2",
    user: "Sarah",
    avatar: "https://i.pravatar.cc/150?img=5",
    text: "That goal was insane! 🔥",
    likes: 8,
    dislikes: 0,
    timestamp: "1m ago",
  },
  {
    id: "3",
    user: "Mike",
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "Best match of the season so far",
    likes: 15,
    dislikes: 1,
    timestamp: "now",
  },
];

// ─── Component ───────────────────────────────────────────────────────

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  className = "",
}: VideoPlayerProps) {
  // ── Video State ──────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // ── Chat State ───────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [inputText, setInputText] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // ── Chat Effects (Internal scroll only, never scrolls the window) ──
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, chatOpen]);

  // ── Video Handlers ───────────────────────────────────────────────
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && duration) {
      const time = (parseFloat(e.target.value) / 100) * duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ── Chat Handlers ────────────────────────────────────────────────
  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "ME",
      text: inputText.trim(),
      likes: 0,
      dislikes: 0,
      timestamp: "now",
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLike = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, likes: m.likes + 1 } : m))
    );
  };

  const handleDislike = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, dislikes: m.dislikes + 1 } : m
      )
    );
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className={`flex bg-[#0a0e27] rounded-2xl overflow-hidden border border-white/10 ${className}`}>
      {/* ═══ VIDEO SECTION ═══ */}
      <div className="flex-1 relative min-w-0">
        <div
          className="relative group bg-black w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay={autoPlay}
            className="w-full h-full object-cover"
            onClick={togglePlay}
            playsInline
          />

          {/* Center Play Button (when paused) */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-400/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-cyan-400/30">
                <Play
                  className="w-8 h-8 sm:w-10 sm:h-10 text-[#0a0e27] ml-1"
                  fill="currentColor"
                />
              </div>
            </button>
          )}

          {/* Controls Overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"
              }`}
          >
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 sm:h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer mb-3 accent-cyan-400"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-cyan-400 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime -= 10;
                  }}
                  className="text-white hover:text-cyan-400 transition-colors hidden sm:block"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime += 10;
                  }}
                  className="text-white hover:text-cyan-400 transition-colors hidden sm:block"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-cyan-400 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <span className="text-white text-xs sm:text-sm font-mono">
                  {formatTime(videoRef.current?.currentTime || 0)} /{" "}
                  {formatTime(duration)}
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="text-white hover:text-cyan-400 transition-colors"
              >
                <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ COLLAPSED CHAT TAB ═══ */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="flex flex-col items-center gap-2 bg-[#1a1f4a] hover:bg-[#252a5c] border-l border-white/10 rounded-l-2xl py-6 px-3 transition-all group self-center"
        >
          <ChevronLeft className="w-5 h-5 text-[#00d4ff] group-hover:-translate-x-0.5 transition-transform" />
          <span
            className="text-xs font-bold text-[#ff3333] tracking-wider uppercase whitespace-nowrap"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Live Chat
          </span>
          <MessageCircle className="w-4 h-4 text-gray-400" />
          <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
        </button>
      )}

      {/* ═══ LIVE CHAT SIDEBAR ═══ */}
      {chatOpen && (
        <div className="w-[300px] sm:w-[320px] flex-shrink-0 bg-[#0f1535] border-l border-white/10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0e27]">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#ff3333]" />
              <h3 className="text-sm font-bold text-[#ff3333] tracking-wider uppercase">
                Live Chat
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Collapse chat"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.isMe ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.avatar === "ME" ? (
                    <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#00d4ff]" />
                    </div>
                  ) : (
                    <img
                      src={msg.avatar}
                      alt={msg.user}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 min-w-0 ${msg.isMe ? "items-end" : "items-start"
                    } flex flex-col`}
                >
                  {/* Name + Time */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-xs font-semibold ${msg.isMe ? "text-[#00d4ff]" : "text-white"
                        }`}
                    >
                      {msg.user}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-3 py-2 rounded-xl text-sm leading-relaxed max-w-[220px] ${msg.isMe
                        ? "bg-[#00d4ff]/15 text-white rounded-br-sm border border-[#00d4ff]/20"
                        : "bg-[#1a1f4a] text-gray-200 rounded-bl-sm border border-white/5"
                      }`}
                  >
                    {msg.text}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-1.5">
                    <button
                      onClick={() => handleLike(msg.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#00d4ff] transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{msg.likes}</span>
                    </button>
                    <button
                      onClick={() => handleDislike(msg.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>{msg.dislikes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                      <Reply className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-[#0a0e27]">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add comment..."
                className="w-full bg-[#1a1f4a] border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-[#00d4ff] hover:bg-[#00d4ff]/90 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all"
              >
                <Send className="w-3.5 h-3.5 text-[#0a0e27]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}