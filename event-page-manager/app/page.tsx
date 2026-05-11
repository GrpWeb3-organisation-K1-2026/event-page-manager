"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Session {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  room: { name: string };
  speakers: { speaker: { fullName: string } }[];
  isLive: boolean;
}

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  place: string;
  _count: { sessions: number };
}

function isLive(startDate: string, endDate: string) {
  const now = new Date();
  return now >= new Date(startDate) && now <= new Date(endDate);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-500",
  "from-emerald-400 to-cyan-500",
  "from-orange-400 to-red-500",
];

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md">
      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
      Live
    </span>
  );
}

function Avatar({ name, index }: { name: string; index: number }) {
  return (
    <div
      className={`w-7 h-7 rounded-full border-2 border-[#0c1120] bg-gradient-to-br ${AVATAR_COLORS[index % 3]} flex items-center justify-center text-[10px] font-bold text-white -ml-1.5 first:ml-0`}
    >
      {initials(name)}
    </div>
  );
}

// SVG Icon components
function IconCalendar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M5 1v4M11 1v4M2 7h12" />
    </svg>
  );
}

function IconLocation({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}

function IconPlay({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5,3 13,8 5,13" />
    </svg>
  );
}

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2 2" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function IconPlus({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="12" rx="2" />
      <path d="M8 5v6M5 8h6" />
    </svg>
  );
}

function IconGrid({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function IconBolt({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 1L4 9h5l-2 6 7-8H9l2-6z" />
    </svg>
  );
}

function IconChat({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z" />
    </svg>
  );
}

function IconMic({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="1" width="6" height="9" rx="3" />
      <path d="M2 8a6 6 0 0012 0M8 14v2M5 16h6" />
    </svg>
  );
}

function IconBuilding({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="11" rx="1" />
      <path d="M5 14V9h6v5M5 6h2M9 6h2M5 3V1h6v2" />
    </svg>
  );
}

function IconBookmark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 2h10v13l-5-3-5 3V2z" />
    </svg>
  );
}

function Navbar() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Event Page Manager
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            API disponible sur <code>/api/events</code> et <code>/api/sessions</code>.
          </p>
        </div>
      </main>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    { Icon: IconGrid, title: "Multi-track schedule", desc: "Grid view with parallel sessions by room, all at a glance.", color: "indigo" },
    { Icon: IconBolt, title: "Live detection", desc: "Sessions automatically marked as live based on the current time.", color: "green" },
    { Icon: IconChat, title: "Interactive Q&A", desc: "Ask questions, vote, and watch the best ones rise to the top in real time.", color: "purple" },
    { Icon: IconMic, title: "Speaker profiles", desc: "Public pages for each speaker with bio, social links, and sessions.", color: "orange" },
    { Icon: IconBuilding, title: "Room view", desc: "Filter the schedule by room. See what's happening where.", color: "cyan" },
    { Icon: IconBookmark, title: "Personal itinerary", desc: "Bookmark sessions. Your schedule saved locally.", color: "rose" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/12 border-indigo-500/20 text-indigo-400",
    green: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
    purple: "bg-violet-400/10 border-violet-400/20 text-violet-400",
    orange: "bg-orange-400/10 border-orange-400/20 text-orange-400",
    cyan: "bg-cyan-400/10 border-cyan-400/20 text-cyan-400",
    rose: "bg-rose-400/10 border-rose-400/20 text-rose-400",
  };

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <h2
        className="font-black tracking-[-1.5px] leading-[1.1] text-white mb-12"
        style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 4vw, 48px)" }}
      >
        Everything you need,<br />in real time.
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {features.map(({ Icon, title, desc, color }) => (
          <div
            key={title}
            className="bg-[#0c1120] border border-white/7 rounded-2xl p-7 relative overflow-hidden hover:border-indigo-500/25 hover:-translate-y-0.5 transition-all group"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`w-11 h-11 rounded-xl border ${colorMap[color]} flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[17px] text-white mb-2 tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h3>
            <p className="text-[#6b7280] text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 max-w-2xl mx-auto text-center">
      <h2
        className="font-black tracking-[-2px] leading-[1.1] text-white mb-5"
        style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(36px, 5vw, 56px)" }}
      >
        Ready to transform your event?
      </h2>
      <p className="text-[#6b7280] text-lg font-light leading-[1.7] mb-10">
        Replace static programs with a live, interactive experience.
      </p>
      <div className="flex items-center justify-center gap-3.5 flex-wrap">
        <Link
          href="/admin"
          className="bg-transparent text-[#6b7280] text-base font-medium px-6 py-4 rounded-2xl border border-white/7 hover:text-white hover:border-white/15 hover:bg-white/4 transition-all no-underline"
        >
          Admin Console
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/7 py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-[2fr_1fr_1fr_1fr] gap-12">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center font-black text-white text-base" style={{ fontFamily: "Syne, sans-serif" }}>
              E
            </div>
            <h3 className="font-black text-xl tracking-tight text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              EventSync
            </h3>
          </div>
          <p className="text-[#6b7280] text-sm leading-relaxed max-w-[220px]">
            The live event platform for organizers and attendees.
          </p>
        </div>
        {[
          {
            title: "Navigation",
            links: [
              { label: "Events", href: "/events" },
              { label: "Schedule", href: "/schedule" },
              { label: "Speakers", href: "/speakers" },
              { label: "Rooms", href: "/rooms" },
              { label: "Favorites", href: "/favorites" },
            ],
          },
          {
            title: "Admin",
            links: [
              { label: "Console", href: "/admin" },
              { label: "Manage events", href: "/admin/events" },
              { label: "Manage sessions", href: "/admin/sessions" },
            ],
          },
          {
            title: "Platform",
            links: [
              { label: "About", href: "#" },
              { label: "Security", href: "#" },
              { label: "Privacy", href: "#" },
            ],
          },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#6b7280] mb-4">{title}</h4>
            <ul className="list-none flex flex-col gap-2.5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 text-sm hover:text-white transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto mt-9 pt-6 border-t border-white/7 flex items-center justify-between">
        <p className="text-[#6b7280] text-[13px]">© 2026 EventSync. Built for live moments.</p>
        <p className="text-[#6b7280]/50 text-xs">WEB3 Final Project</p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [liveSessions, setLiveSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, sessionsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/sessions"),
        ]);
        const eventsData = await eventsRes.json();
        const sessionsData = await sessionsRes.json();

        const allEvents: Event[] = eventsData.data ?? [];
        const allSessions: Session[] = sessionsData.data ?? [];

        setEvents(allEvents);
        setLiveSessions(
          allSessions.filter((s) => isLive(s.startDate, s.endDate))
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalSpeakers = events.reduce((acc, e) => acc + (e._count?.sessions ?? 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0%; }
          100% { background-position: 200%; }
        }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,160,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(34,211,160,0); }
        }

        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-[#030711] text-white relative overflow-x-hidden">
        <div className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(91,110,245,0.18) 0%, transparent 70%)", top: "-200px", left: "-100px", filter: "blur(120px)" }} />
        <div className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", top: "40%", right: "-150px", filter: "blur(120px)" }} />
        <div className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(34,211,160,0.1) 0%, transparent 70%)", bottom: "10%", left: "30%", filter: "blur(120px)" }} />
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        <Navbar />
        <Hero />
        <StatsBar events={events.length} sessions={events.reduce((a, e) => a + (e._count?.sessions ?? 0), 0)} speakers={totalSpeakers} />
        {!loading && <LiveSection sessions={liveSessions} />}
        {!loading && <EventsSection events={events} />}
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}