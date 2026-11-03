"use client";
import React from "react";
import Link from "next/link";
import {
  useKindeBrowserClient,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs";
import { useParams, usePathname } from "next/navigation";
import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Blocks, ChevronDown, Home, LayoutDashboard, LogOut, MessageSquare, Settings } from "lucide-react";

const Header = () => {
  const { user } = useKindeBrowserClient();

  const pathname = usePathname();
  const { formId } = useParams();

  const NAV_MENUS = [
    {
      name: "Home",
      pathname: "/",
      icon: Home,
      isDisabled: false,
    },
    {
      name: "Dashboard",
      pathname: "/dashboard",
      icon: LayoutDashboard,
      isDisabled: false,
    },
    {
      name: "Builder",
      pathname: `/dashboard/form/builder/${formId}`,
      icon: Blocks,
      isDisabled: !formId,
    },
    {
      name: "Responses",
      pathname: `/dashboard/form/responds/${formId}`,
      icon: MessageSquare,
      isDisabled: !formId,
    },
    {
      name: "Settings",
      pathname: `/dashboard/form/settings/${formId}`,
      icon: Settings,
      isDisabled: !formId,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo url="/" />
          <div className="hidden h-6 w-px bg-border lg:block" />
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-1">
              {NAV_MENUS.map((item) => {
                const isActive =
                  item.pathname === pathname ||
                  (item.name !== "Home" &&
                    item.name !== "Dashboard" &&
                    !!formId &&
                    pathname?.includes(`/dashboard/form/${item.name.toLowerCase()}`));
                return (
                  <li key={item.name}>
                    <Link
                      href={item.isDisabled ? "#" : item.pathname}
                      aria-disabled={item.isDisabled}
                      tabIndex={item.isDisabled ? -1 : 0}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        item.isDisabled && "pointer-events-none opacity-40"
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-full p-0.5 pr-2 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <Avatar className="h-8 w-8 shrink-0 border border-border ring-2 ring-primary/15">
                  <AvatarImage src={user?.picture || ""} alt={user?.given_name || ""} />
                  <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                    {user?.given_name?.charAt(0)}
                    {user?.family_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col text-left leading-tight sm:flex">
                  <span className="max-w-[140px] truncate text-[13px] font-semibold">
                    {user?.given_name} {user?.family_name}
                  </span>
                  <span className="max-w-[140px] truncate text-[11px] text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
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
                <Link href="/" className="flex cursor-pointer items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex cursor-pointer items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-600">
                <LogoutLink postLogoutRedirectURL="/" className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Log out
                </LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
