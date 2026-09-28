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
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const data = await authAPI.getMe();
            if (data) {
              const firstName = data.first_name || "";
              const lastName = data.last_name || "";
              const fullName = [firstName, lastName].filter(Boolean).join(" ") || "FreeFit Member";
              const userData = {
                ...data,
                first_name: firstName,
                last_name: lastName,
                name: fullName,
                email: data.email || localStorage.getItem("user_email") || "user@example.com",
                role: "user",
              };
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            } else {
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
