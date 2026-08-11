// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://free-fit-backend.onrender.com/api";

// ─── Token Helpers ──────────────────────────────────────────────────

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
};

const setTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
};

const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("interests");
  }
};

// ─── Response Handler ───────────────────────────────────────────────

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg =
      error.non_field_errors?.[0] ||
      error.detail ||
      error.message ||
      Object.entries(error)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
        .join(" | ") ||
      `HTTP ${response.status}`;
    throw new Error(msg);
  }
  return response.json();
}

// ─── Core Fetch ─────────────────────────────────────────────────────

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${getAccessToken()}`;
        const retryResponse = await fetch(url, { ...options, headers });
        return handleResponse(retryResponse);
      }
    }

    return handleResponse(response);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

async function refreshAccessToken() {
  try {
    const refresh = getRefreshToken();
    if (!refresh) return false;

    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.access, data.refresh);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ─── Auth ───────────────────────────────────────────────────────────

export const authAPI = {
  register: async (email: string, password: string, confirmPassword: string) => {
    return fetchAPI("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ email, password, confirm_password: confirmPassword }),
    });
  },

  login: async (email: string, password: string) => {
    const data = await fetchAPI("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.access && data.refresh) {
      setTokens(data.access, data.refresh);
    }
    return data;
  },

  logout: () => {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  },

  isAuthenticated: () => !!getAccessToken(),

  getTokens: () => ({
    access: getAccessToken(),
    refresh: getRefreshToken(),
  }),
};

// ─── User ───────────────────────────────────────────────────────────

export const userAPI = {
  getProfile: async () => fetchAPI("/users/me/"),
  updateProfile: async (profileData: { name?: string; avatar?: string; interests?: string[] }) => {
    return fetchAPI("/users/me/", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },
  updateInterests: async (interests: string[]) => {
    return fetchAPI("/users/me/interests/", {
      method: "POST",
      body: JSON.stringify({ interests }),
    });
  },
};

// ─── Dashboard (NEW) ────────────────────────────────────────────────

export const dashboardAPI = {
  getDashboard: async () => fetchAPI("/dashboard/"),
};

// ─── Matches (UPDATED) ──────────────────────────────────────────────

export interface Match {
  id: string;
  team1: string;
  team2: string;
  team1_logo?: string;
  team2_logo?: string;
  score1?: number;
  score2?: number;
  league: string;
  sport: string;
  start_time?: string;
  stream_url?: string;
  is_live: boolean;
  is_past: boolean;
}

export const matchesAPI = {
  getLive: async () => fetchAPI("/matches/live/"),
  getUpcoming: async () => fetchAPI("/matches/upcoming/"),
  getPast: async () => fetchAPI("/matches/past/"),
  getDetails: async (id: string) => fetchAPI(`/matches/${id}/`),

  // Legacy aliases
  getLiveMatches: async () => fetchAPI("/matches/live/"),
  getPreviousMatches: async (params?: { sport?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.sport) queryParams.append("sport", params.sport);
    if (params?.page) queryParams.append("page", String(params.page));
    return fetchAPI(`/matches/previous/?${queryParams.toString()}`);
  },
  getMatchDetails: async (id: string) => fetchAPI(`/matches/${id}/`),
};

// ─── Teams (NEW) ────────────────────────────────────────────────────

export const teamsAPI = {
  getTeams: async () => fetchAPI("/teams/"),
  getTeam: async (id: string) => fetchAPI(`/teams/${id}/`),
};

// ─── Streams ────────────────────────────────────────────────────────

export const streamsAPI = {
  getStreams: async (params?: { status?: string; sport?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.sport) queryParams.append("sport", params.sport);
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    return fetchAPI(`/streams/?${queryParams.toString()}`);
  },
  getStream: async (id: string) => fetchAPI(`/streams/${id}/`),
  getFeatured: async () => fetchAPI("/streams/featured/"),
  getLive: async () => fetchAPI("/streams/?status=live"),
  recordView: async (id: string, duration: number, quality: string) => {
    return fetchAPI(`/streams/${id}/view/`, {
      method: "POST",
      body: JSON.stringify({ duration, quality }),
    });
  },
};

// ─── Schedule ───────────────────────────────────────────────────────

export const scheduleAPI = {
  getSchedule: async (params?: { date?: string; sport?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append("date", params.date);
    if (params?.sport) queryParams.append("sport", params.sport);
    return fetchAPI(`/schedule/?${queryParams.toString()}`);
  },
  setReminder: async (eventId: string, notifyBefore: number = 15) => {
    return fetchAPI(`/schedule/${eventId}/reminder/`, {
      method: "POST",
      body: JSON.stringify({ notify_before: notifyBefore }),
    });
  },
  removeReminder: async (eventId: string) => {
    return fetchAPI(`/schedule/${eventId}/reminder/`, { method: "DELETE" });
  },
};

// ─── Highlights (RESTORED) ──────────────────────────────────────────

export const highlightsAPI = {
  getHighlights: async (params?: { sport?: string; type?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.sport) queryParams.append("sport", params.sport);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.page) queryParams.append("page", String(params.page));
    return fetchAPI(`/highlights/?${queryParams.toString()}`);
  },
  getHighlight: async (id: string) => fetchAPI(`/highlights/${id}/`),
};

// ─── News ───────────────────────────────────────────────────────────

export const newsAPI = {
  getNews: async (params?: { sport?: string; category?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.sport) queryParams.append("sport", params.sport);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.page) queryParams.append("page", String(params.page));
    return fetchAPI(`/news/?${queryParams.toString()}`);
  },
  getArticle: async (slug: string) => fetchAPI(`/news/${slug}/`),
};

// ─── Sports ─────────────────────────────────────────────────────────

export const sportsAPI = {
  getSports: async () => fetchAPI("/sports/"),
  getLeagues: async (sportSlug: string) => fetchAPI(`/sports/${sportSlug}/leagues/`),
  getTeams: async (leagueSlug: string) => fetchAPI(`/leagues/${leagueSlug}/teams/`),
};

// ─── Default export ─────────────────────────────────────────────────

export default {
  auth: authAPI,
  user: userAPI,
  streams: streamsAPI,
  schedule: scheduleAPI,
  highlights: highlightsAPI,
  news: newsAPI,
  sports: sportsAPI,
  matches: matchesAPI,
  teams: teamsAPI,
  dashboard: dashboardAPI,
};