"use client";

import { useState, useEffect, useCallback } from "react";
import { authAPI, userAPI } from "@/lib/api";

interface User {
  id: string;
  name: string;
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
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const data = await userAPI.getProfile();
            if (data?.data) {
              setUser(data.data);
              localStorage.setItem("user", JSON.stringify(data.data));
            }
          }
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
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
