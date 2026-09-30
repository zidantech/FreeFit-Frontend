"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI, interestAPI, userAPI } from "@/lib/api";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Sparkles, CheckCircle2, ShieldCheck, Zap, AlertCircle, Loader2 } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authAPI.login(email, password);

      if (typeof window !== "undefined") {
        localStorage.setItem("remember_me", String(rememberMe));
      }

      // Fetch user profile optionally for user metadata
      try {
        const profile = await authAPI.getMe();
        if (profile) {
          const storedFullName = localStorage.getItem(`user_fullname_${email.toLowerCase().trim()}`) || localStorage.getItem("user_full_name") || "";
          const backendFullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.full_name || profile.name || "";
          const fullName = backendFullName || storedFullName || (profile.first_name ? profile.first_name : email.split("@")[0]);
          const nameParts = fullName.trim().split(/\s+/);
          const firstName = profile.first_name || (nameParts[0] || email.split("@")[0]);
          const lastName = profile.last_name || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");

          const userData = {
            ...profile,
            first_name: firstName,
            last_name: lastName,
            name: fullName,
            email: profile.email || email,
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch {
        // ignore profile error if auth succeeded
      }

      // Check current user's interest from GET /api/auth/interest/
      try {
        const interestData = await interestAPI.getInterest();
        if (interestData && interestData.sport) {
          localStorage.setItem("currentInterest", JSON.stringify(interestData.sport));
          localStorage.setItem("primaryInterest", (interestData.sport.name || "football").toLowerCase());
          localStorage.setItem("interests", JSON.stringify([(interestData.sport.name || "football").toLowerCase()]));
          router.push("/home");
        } else {
          router.push("/interest");
        }
      } catch (err) {
        console.warn("Could not check interest endpoint, falling back to /interest:", err);
        router.push("/interest");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070a1e] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden text-white">
      {/* Background Stadium Glow Elements */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none scale-105"
        style={{ backgroundImage: `url('/hero_stadium.jpg')` }}
      />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a1e] via-[#070a1e]/80 to-[#070a1e]/90 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Value Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4">
          <div>
            <Link href="/" className="inline-block group mb-8">
              <img
                src="/logo.png"
                alt="FreeFit"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Back
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
              Your Front-Row Seat To Every Game
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Log in to resume streaming live matches in crystal-clear 4K HD with real-time fan commentary.
            </p>
          </div>

          {/* Perks list */}
          <div className="space-y-3.5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Instant access to 120+ global sports leagues</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Ultra-low latency sub-second broadcasts</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Free streaming with personalized schedule</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Card */}
        <div className="lg:col-span-7 w-full max-w-md mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-6 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Mobile Logo Header */}
          <div className="lg:hidden mb-6 text-center">
            <Link href="/" className="inline-block group">
              <img
                src="/logo.png"
                alt="FreeFit"
                className="h-10 w-auto mx-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
          </div>

          <div className="bg-[#0b102e]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-9 border border-cyan-500/25 shadow-2xl shadow-cyan-950/60">
            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Sign In</h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Enter your credentials to access your FreeFit account
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#080d26] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-11 py-3 bg-[#080d26] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#080d26] border-white/20 accent-cyan-400 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black rounded-xl font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Or continue with
              </span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:text-white transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.92-2.84-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77.99.08 2.06-.53 2.68-1.28"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Switch to Signup */}
            <p className="mt-7 text-center text-gray-400 text-xs sm:text-sm">
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}