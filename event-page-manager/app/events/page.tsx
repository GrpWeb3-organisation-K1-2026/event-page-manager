"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

/* ─────────────────────────── Types ─────────────────────────── */
interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  place: string;
  _count: { sessions: number };
}

/* ─────────────────────────── Helpers ────────────────────────── */
function isLive(start: string, end: string) {
  const now = new Date();
  return now >= new Date(start) && now <= new Date(end);
}
function isUpcoming(start: string) {
  return new Date() < new Date(start);
}
function isPast(end: string) {
  return new Date() > new Date(end);
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const year = s.getFullYear();
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.getDate()} ${s.toLocaleString("en-US", { month: "short" })} ${year}`;
  }
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

function daysUntil(start: string) {
  const diff = new Date(start).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

/* ─────────────────────────── Icons ─────────────────────────── */
function IconCalendar() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M5 1v4M11 1v4M2 7h12" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1.5 6L8 2.5 14.5 6 8 9.5z" />
      <path d="M1.5 10L8 13.5 14.5 10" />
      <path d="M1.5 8L8 11.5 14.5 8" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6.5" cy="6.5" r="4" />
      <path d="M11 11l3 3" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1.5 3.5h13M4 8h8M6.5 12.5h3" />
    </svg>
  );
}

/* ─────────────────────────── Logo ──────────────────────────── */
function EventSyncLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5b6ef5" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="lg2" x1="34" y1="0" x2="0" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3a0" />
          <stop offset="100%" stopColor="#5b6ef5" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="10" fill="#0c1120" />
      <path d="M6 17 Q6 8 17 8 Q23 8 27 14" stroke="url(#lg1)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M28 17 Q28 26 17 26 Q11 26 7 20" stroke="url(#lg2)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M23.5 11 L27 14 L23 16.5" stroke="url(#lg1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10.5 23 L7 20 L11 17.5" stroke="url(#lg2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="17" cy="17" r="2.8" fill="#22d3a0" />
    </svg>
  );
}

/* ─────────────────────────── Navbar ─────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#0c1120]/80 backdrop-blur-2xl border border-white/7 rounded-2xl px-4 py-2.5 w-[calc(100vw-32px)] md:w-[min(900px,calc(100vw-48px))]">
        <Link href="/" className="flex items-center gap-2.5 mr-auto no-underline">
          <EventSyncLogo size={32} />
          <span className="font-extrabold text-lg tracking-tight text-white hidden sm:block" style={{ letterSpacing: "-0.4px" }}>
            EventSync
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-1 list-none">
          {[
            { label: "Events", href: "/events" },
            { label: "Speakers", href: "/speakers" },
            { label: "Schedule", href: "/schedule" },
            { label: "Favorites", href: "/favorites" },
          ].map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`text-xs font-medium uppercase tracking-wider px-3 py-2 rounded-xl transition-all no-underline ${label === "Events" ? "text-white bg-white/8" : "text-[#6b7280] hover:text-white hover:bg-white/6"}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/admin" className="ml-3 bg-white/6 border border-white/7 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all no-underline">
          Admin
        </Link>
        <button className="ml-2 md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/6" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`w-4 h-0.5 bg-white/70 rounded transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-4 h-0.5 bg-white/70 rounded transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-4 h-0.5 bg-white/70 rounded transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className="fixed top-[72px] left-4 right-4 z-40 bg-[#0c1120]/95 backdrop-blur-2xl border border-white/7 rounded-2xl p-4 md:hidden">
          {[{ label: "Events", href: "/events" }, { label: "Speakers", href: "/speakers" }, { label: "Schedule", href: "/schedule" }, { label: "Favorites", href: "/favorites" }, { label: "Admin", href: "/admin" }].map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="flex items-center text-[#6b7280] hover:text-white text-sm font-medium py-3 border-b border-white/5 last:border-0 no-underline transition-colors">
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/* ─────────────────────────── Status Badge ──────────────────── */
function StatusBadge({ start, end }: { start: string; end: string }) {
  if (isLive(start, end)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        Live
      </span>
    );
  }
  if (isUpcoming(start)) {
    const d = daysUntil(start);
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
        {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d}d`}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6b7280] bg-white/4 border border-white/8 px-2.5 py-1 rounded-lg">
      Ended
    </span>
  );
}

/* ─────────────────────────── Cover gradient map ─────────────── */
const COVERS = [
  { from: "#1a1040", via: "#2d1b69", to: "#4c1d95" },
  { from: "#0c2340", via: "#1e3a5f", to: "#164e63" },
  { from: "#0d2718", via: "#14532d", to: "#064e3b" },
  { from: "#1f1035", via: "#3b0764", to: "#5b21b6" },
  { from: "#1c0a0a", via: "#450a0a", to: "#7f1d1d" },
  { from: "#0f172a", via: "#1e293b", to: "#0f172a" },
];

/* ─────────────────────────── Event Card ─────────────────────── */
function EventCard({ event, index, view }: { event: Event; index: number; view: "grid" | "list" }) {
  const c = COVERS[index % COVERS.length];
  const live = isLive(event.startDate, event.endDate);
  const past = isPast(event.endDate);

  if (view === "list") {
    return (
      <Link
        href={`/events/${event.id}`}
        className={`group flex items-center gap-4 md:gap-6 bg-[#0c1120] border rounded-2xl px-4 md:px-6 py-4 transition-all no-underline relative overflow-hidden ${
          live
            ? "border-emerald-400/20 hover:border-emerald-400/40"
            : "border-white/7 hover:border-indigo-500/30"
        } ${past ? "opacity-60" : ""}`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {live && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-400 rounded-r" />}
        {/* Mini cover */}
        <div
          className="w-14 h-14 flex-shrink-0 rounded-xl hidden sm:block"
          style={{ background: `linear-gradient(135deg, ${c.from}, ${c.via}, ${c.to})` }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-[15px] text-white leading-[1.3] truncate max-w-[300px] md:max-w-none">
              {event.title}
            </h3>
            <StatusBadge start={event.startDate} end={event.endDate} />
          </div>
          <p className="text-[#6b7280] text-xs line-clamp-1 mb-2">{event.description}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#6b7280] text-xs">
              <IconCalendar />
              {formatDateRange(event.startDate, event.endDate)}
            </span>
            <span className="flex items-center gap-1.5 text-[#6b7280] text-xs">
              <IconPin />
              {event.place}
            </span>
            <span className="flex items-center gap-1.5 text-[#6b7280] text-xs">
              <IconLayers />
              {event._count.sessions} sessions
            </span>
          </div>
        </div>
        <span className="text-[#6b7280] group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0">
          <IconArrow />
        </span>
      </Link>
    );
  }

  // Grid view
  return (
    <Link
      href={`/events/${event.id}`}
      className={`group bg-[#0c1120] border rounded-3xl overflow-hidden transition-all no-underline block hover:-translate-y-1 ${
        live
          ? "border-emerald-400/20 hover:border-emerald-400/40 hover:shadow-[0_20px_60px_rgba(34,211,160,0.08)]"
          : "border-white/7 hover:border-indigo-500/30 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
      } ${past ? "opacity-60" : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Cover */}
      <div
        className="relative h-44"
        style={{ background: `linear-gradient(135deg, ${c.from} 0%, ${c.via} 50%, ${c.to} 100%)` }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
        />
        <div className="absolute top-3.5 left-3.5">
          <StatusBadge start={event.startDate} end={event.endDate} />
        </div>
        <div className="absolute top-3.5 right-3.5 bg-[#0c1120]/70 backdrop-blur-sm border border-white/10 text-[#6b7280] text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded-lg">
          {event._count.sessions} sessions
        </div>
        {/* bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}
        />
      </div>

      {/* Body */}
      <div className="p-5 md:p-6">
        <h3 className="font-bold text-[17px] text-white leading-[1.25] mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
          {event.title}
        </h3>
        <p className="text-[#6b7280] text-sm leading-relaxed mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="flex flex-col gap-1.5 mb-5">
          <span className="flex items-center gap-1.5 text-[#6b7280] text-[13px]">
            <IconCalendar />
            {formatDateRange(event.startDate, event.endDate)}
          </span>
          <span className="flex items-center gap-1.5 text-[#6b7280] text-[13px]">
            <IconPin />
            {event.place}
          </span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/7">
          <span className="flex items-center gap-1.5 text-[#6b7280] text-[12px]">
            <IconLayers />
            {event._count.sessions} sessions
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400 text-[13px] font-semibold opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all">
            View <IconArrow />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────── Empty state ────────────────────── */
function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#0c1120] border border-white/7 flex items-center justify-center mb-4 text-[#6b7280]">
        <IconSearch />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">No events found</h3>
      <p className="text-[#6b7280] text-sm">
        {query ? `No results for "${query}".` : "No events available at the moment."}
      </p>
    </div>
  );
}

/* ─────────────────────────── Skeleton ───────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-[#0c1120] border border-white/7 rounded-3xl overflow-hidden animate-pulse">
      <div className="h-44 bg-white/4" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-white/6 rounded-lg w-3/4" />
        <div className="h-3.5 bg-white/4 rounded-lg w-full" />
        <div className="h-3.5 bg-white/4 rounded-lg w-5/6" />
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-white/4 rounded w-1/2" />
          <div className="h-3 bg-white/4 rounded w-2/5" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Page ──────────────────────────── */
type Filter = "all" | "live" | "upcoming" | "past";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const matchQ =
      query === "" ||
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.place.toLowerCase().includes(query.toLowerCase()) ||
      e.description.toLowerCase().includes(query.toLowerCase());

    const matchF =
      filter === "all" ||
      (filter === "live" && isLive(e.startDate, e.endDate)) ||
      (filter === "upcoming" && isUpcoming(e.startDate)) ||
      (filter === "past" && isPast(e.endDate));

    return matchQ && matchF;
  });

  const liveCount = events.filter((e) => isLive(e.startDate, e.endDate)).length;
  const upcomingCount = events.filter((e) => isUpcoming(e.startDate)).length;
  const pastCount = events.filter((e) => isPast(e.endDate)).length;

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: events.length },
    { key: "live", label: "Live", count: liveCount },
    { key: "upcoming", label: "Upcoming", count: upcomingCount },
    { key: "past", label: "Past", count: pastCount },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .card-enter { animation: fadeUp 0.45s ease both; }
      `}</style>

      <div className="min-h-screen bg-[#030711] text-white" style={{ fontFamily: "Inter, sans-serif" }}>
        {/* Ambient glows */}
        <div className="fixed pointer-events-none z-0 rounded-full" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(91,110,245,0.14) 0%, transparent 70%)", top: -200, left: -100, filter: "blur(100px)" }} />
        <div className="fixed pointer-events-none z-0 rounded-full" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)", top: "30%", right: -100, filter: "blur(100px)" }} />

        <Navbar />

        <main className="max-w-5xl mx-auto px-4 md:px-6 pt-28 md:pt-36 pb-20">

          {/* Header */}
          <div className="mb-10 md:mb-12 animate-[fadeUp_0.5s_ease_both]">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-[2px] uppercase mb-4">
              <span className="w-5 h-px bg-indigo-400/60" />
              All Events
            </div>
            <h1
              className="font-black leading-[1] text-white mb-4"
              style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-2.5px" }}
            >
              Discover
              <br />
              <span style={{
                background: "linear-gradient(90deg, #5b6ef5, #a78bfa, #22d3a0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                every event.
              </span>
            </h1>
            <p className="text-[#6b7280] text-base md:text-lg font-light leading-[1.7] max-w-xl">
              Browse conferences, workshops and talks — filter by status, search by keyword.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-7 animate-[fadeUp_0.5s_0.1s_ease_both]">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]">
                <IconSearch />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, places…"
                className="w-full bg-[#0c1120] border border-white/8 text-white placeholder-[#6b7280] text-[14px] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              />
              {query && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white text-xs px-1.5 py-0.5 rounded"
                  onClick={() => setQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-[#0c1120] border border-white/8 rounded-xl p-1 gap-1 self-start">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    view === v ? "bg-white/10 text-white" : "text-[#6b7280] hover:text-white"
                  }`}
                >
                  {v === "grid" ? (
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" />
                      <rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 4h12M2 8h12M2 12h12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-8 flex-wrap animate-[fadeUp_0.5s_0.15s_ease_both]">
            <span className="text-[#6b7280] mr-1">
              <IconFilter />
            </span>
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-xl border transition-all ${
                  filter === key
                    ? key === "live"
                      ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-400"
                      : "bg-indigo-500/12 border-indigo-500/25 text-indigo-400"
                    : "bg-transparent border-white/8 text-[#6b7280] hover:text-white hover:border-white/15"
                }`}
              >
                {label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                  filter === key
                    ? key === "live" ? "bg-emerald-400/15 text-emerald-400" : "bg-indigo-500/15 text-indigo-400"
                    : "bg-white/6 text-[#6b7280]"
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-[#6b7280] text-[13px] mb-6">
              {filtered.length === 0
                ? "No events"
                : `${filtered.length} event${filtered.length > 1 ? "s" : ""}${query ? ` for "${query}"` : ""}`}
            </p>
          )}

          {/* Grid / List */}
          {loading ? (
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-3"}>
              {Array.from({ length: 4 }).map((_, i) =>
                view === "grid" ? <SkeletonCard key={i} /> : (
                  <div key={i} className="bg-[#0c1120] border border-white/7 rounded-2xl h-20 animate-pulse" />
                )
              )}
            </div>
          ) : (
            <div className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                : "flex flex-col gap-3"
            }>
              {filtered.length === 0 ? (
                <EmptyState query={query} />
              ) : (
                filtered.map((event, i) => (
                  <div key={event.id} className="card-enter" style={{ animationDelay: `${i * 60}ms` }}>
                    <EventCard event={event} index={i} view={view} />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Back to home CTA */}
          {!loading && filtered.length > 0 && (
            <div className="mt-16 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-[#6b7280] text-sm hover:text-white transition-colors no-underline">
                ← Back to home
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}