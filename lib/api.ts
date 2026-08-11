// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://free-fit-backend.onrender.com/api";

// ─── Debug logger ───────────────────────────────────────────────────

function log(method: string, url: string, body?: any) {
  console.log(`[API ${method}]`, url, body || "");
}

// ─── Extract Django/DRF error message ───────────────────────────────

async function getErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    console.error("[API ERROR BODY]", data);

    // DRF non-field errors: { non_field_errors: ["Unable to log in..."] }
    if (data.non_field_errors) {
      return data.non_field_errors.join(", ");
    }

    // DRF field errors: { email: ["This field is required."], password: ["..."] }
    const fields = Object.keys(data);
    if (fields.length > 0) {
      const msgs: string[] = [];
      for (const key of fields) {
        if (Array.isArray(data[key])) msgs.push(`${key}: ${data[key][0]}`);
        else if (typeof data[key] === "string") msgs.push(`${key}: ${data[key]}`);
      }
      if (msgs.length > 0) return msgs.join(" | ");
    }

    if (data.detail) return data.detail;
    if (data.message) return data.message;
    return JSON.stringify(data);
  } catch {
    const text = await res.text().catch(() => "");
    return text || `HTTP ${res.status}`;
  }
}

// ─── Fetch with auth (used for ALL requests including login) ────────

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Merge any custom headers from options
  if (options.headers) {
    const custom = options.headers as Record<string, string>;
    Object.assign(headers, custom);
  }

  // Log the exact body being sent
  let parsedBody: any;
  if (options.body) {
    try {
      parsedBody = JSON.parse(options.body as string);
    } catch {
      parsedBody = options.body;
    }
  }

  log(options.method || "GET", url, parsedBody);

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const msg = await getErrorMessage(res);
    throw new Error(msg);
  }

  return res.json();
}

// ─── Auth Module ────────────────────────────────────────────────────

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
// ─── User Module ────────────────────────────────────────────────────

export const userAPI = {
  getProfile: () => fetchWithAuth(`${API_URL}/users/me/`),
  updateProfile: (data: any) =>
    fetchWithAuth(`${API_URL}/users/me/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  updateInterests: (interests: string[]) =>
    fetchWithAuth(`${API_URL}/users/me/interests/`, {
      method: "POST",
      body: JSON.stringify({ interests }),
    }),
};

// ─── Dashboard Module ───────────────────────────────────────────────

export const dashboardAPI = {
  getDashboard: () => fetchWithAuth(`${API_URL}/dashboard/`),
};

// ─── Matches Module ─────────────────────────────────────────────────

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
  getLive: () => fetchWithAuth(`${API_URL}/matches/live/`),
  getUpcoming: () => fetchWithAuth(`${API_URL}/matches/upcoming/`),
  getPast: () => fetchWithAuth(`${API_URL}/matches/past/`),
  getDetails: (id: string) => fetchWithAuth(`${API_URL}/matches/${id}/`),
};

// ─── Teams Module ───────────────────────────────────────────────────

export const teamsAPI = {
  getTeams: () => fetchWithAuth(`${API_URL}/teams/`),
  getTeam: (id: string) => fetchWithAuth(`${API_URL}/teams/${id}/`),
};

// ─── Streams Module ─────────────────────────────────────────────────

export const streamsAPI = {
  getStreams: () => fetchWithAuth(`${API_URL}/streams/`),
  getStream: (id: string) => fetchWithAuth(`${API_URL}/streams/${id}/`),
  getFeatured: () => fetchWithAuth(`${API_URL}/streams/featured/`),
  getLive: () => fetchWithAuth(`${API_URL}/streams/?status=live`),
  recordView: (id: string) =>
    fetchWithAuth(`${API_URL}/streams/${id}/view/`, { method: "POST" }),
};

// ─── Sports Module ──────────────────────────────────────────────────

export const sportsAPI = {
  getSports: () => fetchWithAuth(`${API_URL}/sports/`),
};

// ─── Legacy export ──────────────────────────────────────────────────

export { fetchWithAuth };