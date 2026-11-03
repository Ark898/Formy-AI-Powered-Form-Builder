"use client";

import React from "react";
import Logo from "@/components/logo";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "AI features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Cookie settings", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo url="/" />
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              The intelligent form builder. Describe what you need, and Formy
              designs, publishes, and analyzes it for you.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-border/70 bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/70 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Formy.ai — crafted for builders.</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
