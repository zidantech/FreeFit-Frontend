"use client";

import { useState, useEffect, useCallback } from "react";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  role: string;
  interest?: { id: number | string; name: string } | null;
  interests?: string[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authAPI.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        try {
          const storedUser = localStorage.getItem("user");
          let cachedUser: any = null;
          if (storedUser) {
            try {
              cachedUser = JSON.parse(storedUser);
              setUser(cachedUser);
            } catch {}
          }

          const data = await authAPI.getMe();
          if (data) {
            const email = (data.email || cachedUser?.email || "").toLowerCase().trim();
            const emailKey = email ? `user_fullname_${email}` : "";
            const storedFullName = (emailKey ? localStorage.getItem(emailKey) : null) ||
                                  localStorage.getItem("user_full_name") ||
                                  (cachedUser?.name && cachedUser.name !== "FreeFit Member" ? cachedUser.name : "");

            const backendFullName = [data.first_name, data.last_name].filter(Boolean).join(" ") || data.full_name || data.name || "";
            const fullName = backendFullName || storedFullName || (email ? email.split("@")[0] : "FreeFit Member");
            const nameParts = fullName.trim().split(/\s+/);
            const firstName = data.first_name || cachedUser?.first_name || (nameParts[0] || "FreeFit Member");
            const lastName = data.last_name || cachedUser?.last_name || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");

            const userData = {
              ...data,
              first_name: firstName,
              last_name: lastName,
              name: fullName,
              email: data.email || cachedUser?.email || "user@example.com",
              role: cachedUser?.role || "user",
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            if (fullName && fullName !== "FreeFit Member") {
              localStorage.setItem("user_full_name", fullName);
              if (email) localStorage.setItem(`user_fullname_${email}`, fullName);
            }
          } else if (!cachedUser) {
            setUser({
              id: "1",
              name: "FreeFit Member",
              first_name: "",
              last_name: "",
              email: localStorage.getItem("user_email") || "user@example.com",
              role: "user",
            });
          }
        } catch {
          setUser({
            id: "1",
            name: "FreeFit Member",
            first_name: "",
            last_name: "",
            email: localStorage.getItem("user_email") || "user@example.com",
            role: "user",
          });
        }
      }
      setLoading(false);
    };

    checkAuth();

    const handleStorage = () => {
      const authenticated = authAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (!authenticated) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, isAuthenticated, loading, logout };
}
