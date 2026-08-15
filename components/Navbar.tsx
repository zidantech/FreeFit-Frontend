"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, User, LogOut, Tv, Sparkles, LayoutGrid, UserCircle, MessageSquare, Shield } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const mainNavLinks = [
    { href: "/home", label: "Live", icon: Tv },
    { href: "/categories", label: "Categories", icon: LayoutGrid },
    { href: "/teams", label: "Teams", icon: Shield },
    { href: "/highlights", label: "Highlights", icon: Sparkles },
    { href: "/forum", label: "Forum", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e27]/95 backdrop-blur-sm border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wide shrink-0">
            Freefit.com
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-[#00d4ff] transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                    isActive("/profile")
                      ? "bg-cyan-500/30 text-cyan-400 border border-cyan-400/50"
                      : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                  }`}
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{user?.name || "Account"}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="px-5 py-2 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-[#0a0e27] transition-all font-medium text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-cyan-400 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-cyan-500/20 pt-4 space-y-2">
            {isAuthenticated && mainNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-300 hover:text-[#00d4ff] hover:bg-white/5 transition-colors">
                    {Icon && <Icon className="w-4 h-4" />}
                    {link.label}
                  </a>
                );
            })}
            <div className="pt-3 border-t border-cyan-500/20">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-cyan-400 font-medium py-2"
                  >
                    <UserCircle className="w-5 h-5" />
                    My Account
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-red-400 font-medium py-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-5 py-3 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-[#0a0e27] transition-all font-medium text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
