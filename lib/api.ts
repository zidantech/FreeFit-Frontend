const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://free-fit-backend.onrender.com/api";

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
    document.cookie = `access_token=${access}; path=/; max-age=604800; SameSite=Lax`;
  }
};

const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("interests");
    localStorage.removeItem("primaryInterest");
    localStorage.removeItem("currentInterest");
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
};

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
    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      if (getRefreshToken()) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          headers["Authorization"] = `Bearer ${getAccessToken()}`;
          const retryResponse = await fetch(url, { ...options, headers });
          return handleResponse(retryResponse);
        }
      }

      // If token is expired/invalid, retry once without Authorization header for public endpoints
      if (headers["Authorization"]) {
        delete headers["Authorization"];
        const retryPublicResponse = await fetch(url, { ...options, headers });
        if (retryPublicResponse.ok) {
          return handleResponse(retryPublicResponse);
        }
      }
    }

    return handleResponse(response);
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.detail || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

async function refreshAccessToken() {
  try {
    const refresh = getRefreshToken();
    if (!refresh) return false;

    let response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
    }

    if (response.ok) {
      const data = await response.json();
      if (data.access) {
        setTokens(data.access, data.refresh || refresh);
        return true;
      }
    }

    clearTokens();
    return false;
  } catch {
    clearTokens();
    return false;
  }
}

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

export const interestAPI = {
  getInterest: async (): Promise<{ sport: { id: number; name: string } | null }> => {
    return fetchAPI("/auth/interest/");
  },
  updateInterest: async (sportId: number | string): Promise<{ sport: { id: number; name: string } }> => {
    const id = typeof sportId === "string" && !isNaN(Number(sportId)) ? Number(sportId) : sportId;
    return fetchAPI("/auth/interest/", {
      method: "PUT",
      body: JSON.stringify({ sport: id }),
    });
  },
};

export const userAPI = {
  getProfile: async () => {
    try {
      return await fetchAPI("/users/me/");
    } catch {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            return { data: JSON.parse(stored) };
          } catch {}
        }
      }
      return {
        data: {
          name: "FreeFit User",
          email: "user@example.com",
          role: "user",
          joinDate: "2026-01-01",
        },
      };
    }
  },
  updateProfile: async (profileData: { name?: string; avatar?: string; interests?: string[] }) => {
    try {
      return await fetchAPI("/users/me/", {
        method: "PATCH",
        body: JSON.stringify(profileData),
      });
    } catch {
      return { data: profileData };
    }
  },
  updateInterests: async (interests: string[]) => {
    try {
      return await fetchAPI("/users/me/interests/", {
        method: "POST",
        body: JSON.stringify({ interests }),
      });
    } catch {
      return { data: { interests } };
    }
  },
};

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

export const sportsAPI = {
  getSports: async () => fetchAPI("/sports/"),
  getLeagues: async (sportSlug: string) => fetchAPI(`/sports/${sportSlug}/leagues/`),
  getTeams: async (leagueSlug: string) => fetchAPI(`/leagues/${leagueSlug}/teams/`),
};

export const dashboardAPI = {
  getDashboard: async () => {
    try {
      return await fetchAPI("/dashboard/");
    } catch {
      try {
        return await fetchAPI("/auth/dashboard/");
      } catch {
        // Automatically aggregate from matches endpoints
        const [liveRes, upcomingRes, pastRes] = await Promise.allSettled([
          matchesAPI.getLiveMatches(),
          matchesAPI.getUpcomingMatches(),
          matchesAPI.getPastMatches(),
        ]);
        return {
          live_matches: liveRes.status === "fulfilled" ? (Array.isArray(liveRes.value) ? liveRes.value : liveRes.value?.data || []) : [],
          upcoming_matches: upcomingRes.status === "fulfilled" ? (Array.isArray(upcomingRes.value) ? upcomingRes.value : upcomingRes.value?.data || []) : [],
          past_matches: pastRes.status === "fulfilled" ? (Array.isArray(pastRes.value) ? pastRes.value : pastRes.value?.data || []) : [],
        };
      }
    }
  },
};

export const matchesAPI = {
  getLiveMatches: async () => {
    try {
      return await fetchAPI("/auth/matches/live/");
    } catch {
      try {
        return await fetchAPI("/auth/matches/live");
      } catch {
        return await fetchAPI("/matches/live/");
      }
    }
  },
  getUpcomingMatches: async () => {
    try {
      return await fetchAPI("/auth/matches/upcoming/");
    } catch {
      try {
        return await fetchAPI("/auth/matches/upcoming");
      } catch {
        return await fetchAPI("/matches/upcoming/");
      }
    }
  },
  getPastMatches: async () => {
    try {
      return await fetchAPI("/auth/matches/past/");
    } catch {
      try {
        return await fetchAPI("/auth/matches/past");
      } catch {
        return await fetchAPI("/matches/past/");
      }
    }
  },
  getMatchDetails: async (id: string | number) => {
    try {
      return await fetchAPI(`/auth/matches/${id}/`);
    } catch {
      try {
        return await fetchAPI(`/auth/matches/${id}`);
      } catch {
        return await fetchAPI(`/matches/${id}/`);
      }
    }
  },
};

export const teamsAPI = {
  getTeams: async () => {
    try {
      return await fetchAPI("/auth/teams/");
    } catch {
      try {
        return await fetchAPI("/auth/teams");
      } catch {
        return await fetchAPI("/teams/");
      }
    }
  },
  getTeamDetails: async (id: string | number) => {
    try {
      return await fetchAPI(`/auth/teams/${id}/`);
    } catch {
      try {
        return await fetchAPI(`/auth/teams/${id}`);
      } catch {
        return await fetchAPI(`/teams/${id}/`);
      }
    }
  },
};

export default {
  auth: authAPI,
  interest: interestAPI,
  user: userAPI,
  dashboard: dashboardAPI,
  streams: streamsAPI,
  schedule: scheduleAPI,
  highlights: highlightsAPI,
  news: newsAPI,
  sports: sportsAPI,
  matches: matchesAPI,
  teams: teamsAPI,
};
