// components/LiveChat.tsx
"use client";

import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  User,
  Wifi,
  WifiOff,
  Loader2,
  RefreshCw,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { authAPI, chatAPI } from "@/lib/api";

export interface ChatMessage {
  id: string | number;
  user: string;
  userId?: string | number;
  text: string;
  createdAt: string;
  isMe?: boolean;
}

interface LiveChatProps {
  matchId: string | number;
  isLive?: boolean;
}

/**
 * Safely normalizes incoming message objects from either
 * REST chat history (7.1) or WebSocket broadcast (7.2).
 */
function parseMessage(
  value: any,
  currentUser?: { id?: any; username?: string; name?: string; email?: string } | null
): ChatMessage | null {
  if (!value) return null;
  const msgObj = value.data || value;
  const text = msgObj.message || msgObj.text || msgObj.content;
  if (!text || typeof text !== "string") return null;

  const rawUser =
    msgObj.username ||
    msgObj.user_name ||
    (typeof msgObj.user === "string" ? msgObj.user : null) ||
    msgObj.user?.username ||
    msgObj.sender ||
    "Fan";

  const userId =
    msgObj.user_id ??
    msgObj.userId ??
    (typeof msgObj.user === "number" || typeof msgObj.user === "string"
      ? msgObj.user
      : msgObj.user?.id);

  const createdAt = msgObj.created_at || msgObj.timestamp || new Date().toISOString();
  const id = msgObj.id ?? `${userId ?? rawUser}-${createdAt}-${text}`;

  const currentId = currentUser?.id != null ? String(currentUser.id) : null;
  const currentUsername = currentUser?.username ? String(currentUser.username).toLowerCase() : null;
  const currentName = currentUser?.name ? String(currentUser.name).toLowerCase() : null;
  const currentEmailUser = currentUser?.email ? currentUser.email.split("@")[0].toLowerCase() : null;

  const msgUserLower = String(rawUser).toLowerCase();
  const msgUserIdStr = userId != null ? String(userId) : null;

  const isMe = Boolean(
    (currentId && msgUserIdStr && currentId === msgUserIdStr) ||
    (currentUsername && msgUserLower === currentUsername) ||
    (currentName && msgUserLower === currentName) ||
    (currentEmailUser && msgUserLower === currentEmailUser)
  );

  return {
    id,
    user: rawUser,
    userId,
    text,
    createdAt,
    isMe,
  };
}

/**
 * Converts array of history items from Section 7.1.
 * Section 7.1 specifies: "The endpoint returns up to 50 latest messages, ordered newest first."
 * We reverse the array to present them in natural chronological order (oldest -> newest).
 */
function getMessages(
  payload: any,
  currentUser?: { id?: any; username?: string; name?: string; email?: string } | null
): ChatMessage[] {
  const items = Array.isArray(payload)
    ? payload
    : payload?.results || payload?.data || payload?.messages || [];

  if (!Array.isArray(items)) return [];

  const parsed = items
    .map((item) => parseMessage(item, currentUser))
    .filter((message): message is ChatMessage => message !== null);

  return parsed.reverse();
}

function formatMessageTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function LiveChat({ matchId, isLive = true }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [connection, setConnection] = useState<
    "connecting" | "connected" | "disconnected" | "unauthenticated"
  >("connecting");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Load current user profile for message alignment & identity
  useEffect(() => {
    isMountedRef.current = true;
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {}

    if (authAPI.isAuthenticated()) {
      authAPI
        .getMe()
        .then((data) => {
          if (data && isMountedRef.current) {
            setCurrentUser((prev: any) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {});
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch REST history (Section 7.1)
  const fetchHistory = useCallback(async () => {
    try {
      const history = await chatAPI.getMessages(matchId);
      if (!isMountedRef.current) return;
      const parsed = getMessages(history, currentUser);
      setMessages((prev) => {
        // Merge or replace with new parsed history
        if (parsed.length === 0) return prev;
        const idMap = new Map<string | number, ChatMessage>();
        parsed.forEach((msg) => idMap.set(msg.id, msg));
        // Keep any unsaved optimistic messages
        prev.forEach((msg) => {
          if (String(msg.id).startsWith("temp-") && !idMap.has(msg.id)) {
            idMap.set(msg.id, msg);
          }
        });
        return Array.from(idMap.values());
      });
      setHistoryError("");
    } catch (err: any) {
      if (!isMountedRef.current) return;
      // If 401, token might be missing or expired
      if (err?.message?.includes("401") || err?.message?.includes("credentials")) {
        setConnection("unauthenticated");
      } else {
        setHistoryError(err?.message || "Could not load chat history.");
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [matchId, currentUser]);

  // WebSocket Connection (Section 7.2)
  const connectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const token = authAPI.getTokens().access;
    if (!token) {
      setConnection("unauthenticated");
      setLoading(false);
      return;
    }

    // Close any previous socket
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
      socketRef.current = null;
    }

    setConnection("connecting");

    try {
      const wsUrl = chatAPI.getWebSocketUrl(matchId, token);
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        if (!isMountedRef.current) return;
        setConnection("connected");
      };

      socket.onmessage = (event) => {
        if (!isMountedRef.current) return;
        try {
          const raw = JSON.parse(event.data);
          const incoming = parseMessage(raw, currentUser);
          if (incoming) {
            setMessages((prev) => {
              // Deduplicate and remove temporary optimistic messages that match incoming
              const filtered = prev.filter(
                (m) => !(String(m.id).startsWith("temp-") && m.text === incoming.text)
              );
              if (filtered.some((m) => String(m.id) === String(incoming.id))) {
                return filtered;
              }
              return [...filtered, incoming];
            });
          }
        } catch {
          // Ignore invalid frames
        }
      };

      socket.onerror = () => {
        if (!isMountedRef.current) return;
        setConnection("disconnected");
      };

      socket.onclose = () => {
        if (!isMountedRef.current) return;
        setConnection("disconnected");
        // Reconnection attempt with 5s delay
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && authAPI.isAuthenticated()) {
            connectWebSocket();
          }
        }, 5000);
      };
    } catch {
      setConnection("disconnected");
    }
  }, [matchId, currentUser]);

  // Setup connection & fetch history on mount or matchId change
  useEffect(() => {
    setMessages([]);
    setLoading(true);
    setHistoryError("");
    setSendError(null);

    const token = authAPI.getTokens().access;
    if (!token) {
      setConnection("unauthenticated");
      setLoading(false);
      return;
    }

    fetchHistory();
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [matchId, fetchHistory, connectWebSocket]);

  // Periodic polling fallback when WebSocket is not connected (Section 7 Note)
  useEffect(() => {
    if (connection === "connected" || connection === "unauthenticated") return;

    const interval = setInterval(() => {
      if (isMountedRef.current && authAPI.isAuthenticated()) {
        fetchHistory();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [connection, fetchHistory]);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send via WebSocket only (Section 7.2 format: { "message": "..." })
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    if (!authAPI.isAuthenticated()) {
      setConnection("unauthenticated");
      return;
    }

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setSendError("Chat is reconnecting — please wait a moment and try again.");
      return;
    }

    setSendError(null);
    setSending(true);

    // Optimistic UI update
    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: optimisticId,
      user: currentUser?.username || currentUser?.name || "You",
      userId: currentUser?.id,
      text,
      createdAt: new Date().toISOString(),
      isMe: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText("");

    try {
      socket.send(JSON.stringify({ message: text }));
    } catch {
      setSendError("Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    }

    setSending(false);
  };

  const connectionLabel = {
    connecting: "Connecting",
    connected: "Live",
    disconnected: "Offline",
    unauthenticated: "Sign in required",
  }[connection];

  return (
    <section
      className="min-w-0 bg-[#0f1535] border border-cyan-500/20 rounded-2xl flex flex-col h-[580px] overflow-hidden shadow-xl shadow-cyan-950/20"
      aria-label="Match live chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-[#0a0e27]">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
            {isLive ? "Live Chat" : "Match Chat"}
            {isLive && connection === "connected" && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {connection === "disconnected" && (
            <button
              onClick={connectWebSocket}
              title="Retry connection"
              className="p-1 hover:bg-white/10 rounded-md text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              connection === "connected"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : connection === "connecting"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : connection === "unauthenticated"
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                : "bg-gray-800 text-gray-400 border border-white/10"
            }`}
          >
            {connection === "connecting" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : connection === "connected" ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            {connectionLabel}
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {historyError && (
          <div
            role="status"
            className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{historyError}</span>
          </div>
        )}

        {sendError && (
          <div
            role="alert"
            className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{sendError}</span>
          </div>
        )}

        {loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-2">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            <p className="text-xs">Loading chat history...</p>
          </div>
        )}

        {!loading && messages.length === 0 && !historyError && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <MessageCircle className="w-10 h-10 text-gray-600 mb-2" />
            <p className="text-sm font-semibold text-white">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Be the first to share your thoughts on the match with other fans!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold uppercase ${
                msg.isMe
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              {msg.user ? msg.user.charAt(0) : <User className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble Content */}
            <div
              className={`flex-1 min-w-0 flex flex-col ${
                msg.isMe ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-0.5">
                <span
                  className={`text-xs font-semibold ${
                    msg.isMe ? "text-cyan-400" : "text-gray-300"
                  }`}
                >
                  {msg.isMe ? "You" : msg.user}
                </span>
                {msg.createdAt && (
                  <span className="text-[10px] text-gray-500">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                )}
              </div>

              <div
                className={`px-3 py-2 rounded-2xl text-sm leading-relaxed max-w-[85%] break-words ${
                  msg.isMe
                    ? "bg-cyan-500/15 text-white rounded-tr-sm border border-cyan-500/30"
                    : "bg-[#1a1f4a] text-gray-200 rounded-tl-sm border border-white/5"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / Auth Bar */}
      <div className="p-3 border-t border-white/10 bg-[#0a0e27]">
        {connection === "unauthenticated" ? (
          <div className="flex items-center justify-between gap-3 p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs">
            <span className="text-gray-300">Sign in to participate in the live chat.</span>
            <Link
              href={`/signin?redirect=/matches/${matchId}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-400 text-[#0a0e27] rounded-lg font-bold hover:bg-cyan-300 transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                connection === "connected"
                  ? "Say something to other fans..."
                  : connection === "connecting"
                  ? "Connecting to chat..."
                  : "Type a message..."
              }
              disabled={sending}
              maxLength={500}
              aria-label="Chat message"
              className="w-full bg-[#1a1f4a] border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              aria-label="Send message"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all text-[#0a0e27]"
            >
              {sending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
