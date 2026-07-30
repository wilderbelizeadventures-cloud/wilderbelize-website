"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTripadvisor } from "react-icons/fa";
import { company } from "@/data/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/transfers", label: "Transfers" },
  { href: "/about", label: "About" },
  { href: "/travelers-info", label: "Travelers Info" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { href: "https://www.facebook.com/wilderbelizeadventures", label: "Facebook", Icon: FaFacebookF },
  { href: "https://www.instagram.com/wilderbelizeadventures", label: "Instagram", Icon: FaInstagram },
  { href: "https://api.whatsapp.com/send/?phone=5016501003&text&type=phone_number&app_absent=0", label: "WhatsApp", Icon: FaWhatsapp },
  { href: "https://www.tripadvisor.com/Attraction_Review-g291977-d25566275-Reviews-Wilder_Belize_Adventures-Placencia_Placencia_Peninsula_Stann_Creek.html", label: "TripAdvisor", Icon: FaTripadvisor },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled;

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", solid ? "py-2" : "py-3 md:py-4")}>
      <div className="container-page">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-3 transition-all duration-300 md:px-5",
            solid ? "glass py-2 shadow-soft" : "py-2",
          )}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-0">
            <motion.span
              initial={{ opacity: 0, scale: 0.92, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.07, rotate: -2, y: -2 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="relative -my-4 -mr-2 flex h-[4.5rem] w-[4.5rem] items-center justify-center md:h-20 md:w-20"
            >
              <Image
                src="/belize_new_logo.png"
                alt="Wilder Belize logo"
                fill
                sizes="(max-width: 768px) 72px, 80px"
                className="object-contain drop-shadow-[0_10px_18px_rgba(12,31,26,0.22)] transition-[filter] duration-300 group-hover:drop-shadow-[0_14px_26px_rgba(255,94,46,0.28)]"
                priority
              />
            </motion.span>
            <span className="leading-none">
              <span className={cn("block font-display text-base font-extrabold tracking-tight transition-colors", solid ? "text-ink" : "text-white")}>
                Wilder Belize
              </span>
              <span className={cn("block text-[0.62rem] font-bold uppercase tracking-[0.25em] transition-colors", solid ? "text-coral-600" : "text-coral-300")}>
                Adventures
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.82rem] font-semibold transition-colors 2xl:px-3.5 2xl:text-sm",
                      solid
                        ? active ? "text-jungle-700" : "text-ink-soft hover:text-jungle-700"
                        : active ? "text-white" : "text-white/80 hover:text-white",
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className={cn("absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full 2xl:inset-x-3.5", solid ? "bg-coral-500" : "bg-coral-300")}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${company.phones[0].replace(/\s/g, "")}`}
              className={cn(
                "hidden items-center gap-1.5 text-sm font-semibold transition-colors 2xl:flex",
                solid ? "text-ink-soft hover:text-jungle-700" : "text-white/85 hover:text-white",
              )}
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{company.phones[0]}</span>
            </a>
            <div className="hidden items-center gap-1 2xl:flex">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-110",
                    solid
                      ? "text-ink-soft hover:bg-jungle-100 hover:text-jungle-700"
                      : "text-white/85 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <Link href="/build-your-route" className="btn btn-primary hidden h-10 px-5 py-0 text-sm sm:inline-flex">
              Build a Route
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors xl:hidden",
                solid ? "bg-jungle-50 text-ink" : "bg-white/15 text-white backdrop-blur",
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] xl:hidden"
          >
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-sand-50 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-extrabold text-ink">Menu</span>
                <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-jungle-50 text-ink">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ul className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center rounded-xl px-4 py-3 text-lg font-bold transition-colors",
                          active ? "bg-jungle-600 text-white" : "text-ink hover:bg-jungle-50",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto space-y-3">
                <div className="flex justify-center gap-4 pb-2">
                  {SOCIALS.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-jungle-50 text-jungle-700 transition-transform hover:scale-110"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
                <Link href="/build-your-route" onClick={() => setOpen(false)} className="btn btn-primary w-full">Build a Route</Link>
                <a href={`tel:${company.phones[0].replace(/\s/g, "")}`} className="btn btn-ghost w-full">
                  <Phone className="h-4 w-4" /> {company.phones[0]}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
