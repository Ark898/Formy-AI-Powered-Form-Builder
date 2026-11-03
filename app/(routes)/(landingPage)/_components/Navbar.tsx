"use client";

import React, { useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const NavBar = () => {
  const { user, isAuthenticated } = useKindeBrowserClient();
  const isAuth = isAuthenticated;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo url="/" />

        <nav className="hidden lg:flex">
          <ul className="flex items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 shadow-sm backdrop-blur">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          {isAuth ? (
            <>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full p-0.5 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/60"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-9 w-9 border border-border ring-2 ring-primary/20">
                      <AvatarImage src={user?.picture || ""} alt={user?.given_name || ""} />
                      <AvatarFallback className="bg-primary text-sm font-semibold text-white">
                        {user?.given_name?.charAt(0)}
                        {user?.family_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="end" sideOffset={10}>
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">
                      {user?.given_name} {user?.family_name}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex cursor-pointer items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-600">
                    <LogoutLink postLogoutRedirectURL="/" className="flex w-full items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </LogoutLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <LoginLink>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign in
                </Button>
              </LoginLink>
              <RegisterLink>
                <Button size="sm" className="hidden sm:inline-flex">
                  Get started
                </Button>
              </RegisterLink>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:hidden",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {!isAuth && (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-4">
              <LoginLink>
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
              </LoginLink>
              <RegisterLink>
                <Button className="w-full">Get started</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
