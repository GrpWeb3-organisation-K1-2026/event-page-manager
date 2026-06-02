"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  events: number;
  sessions: number;
  speakers: number;
  rooms: number;
  questions: number;
  liveSessions: number;
}

interface RecentSession {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  isLive: boolean;
  room: { name: string };
  event: { title: string };
  _count: { questions: number; speakers: number };
}

interface RecentQuestion {
  id: number;
  content: string;
  name: string | null;
  upvotes: number;
  createdAt: string;
  session: { title: string; id: number };
}

function isLive(start: string, end: string) {
  const now = new Date();
  return now >= new Date(start) && now <= new Date(end);
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatCard({
  label,
  value,
  icon,
  accent,
  href,
  badge,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative bg-[#0c1120] border border-white/7 rounded-2xl p-5 hover:border-white/15 hover:-translate-y-0.5 transition-all no-underline overflow-hidden`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity`} style={{ background: `radial-gradient(ellipse at top left, ${accent}08 0%, transparent 60%)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        {badge && (
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md" style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}20` }}>
            {badge}
          </span>
        )}
      </div>
      <div className="text-3xl font-black tracking-[-1.5px] text-white leading-none mb-1">
        {value}
      </div>
      <div className="text-[12px] text-[#6b7280] font-medium">{label}</div>
    </Link>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-md">
      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
      Live
    </span>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ events: 0, sessions: 0, speakers: 0, rooms: 0, questions: 0, liveSessions: 0 });
  const [sessions, setSessions] = useState<RecentSession[]>([]);
  const [questions, setQuestions] = useState<RecentQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [evRes, sessRes, spkRes, roomRes, qRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/sessions"),
          fetch("/api/speakers"),
          fetch("/api/rooms"),
          fetch("/api/questions?_sort=createdAt&_order=DESC&_end=5"),
        ]);
        const [ev, sess, spk, rooms, q] = await Promise.all([
          evRes.json(), sessRes.json(), spkRes.json(), roomRes.json(), qRes.json(),
        ]);

        const allSessions: RecentSession[] = sess.data ?? [];
        const live = allSessions.filter((s) => isLive(s.startDate, s.endDate));

        setStats({
          events: ev.meta?.total ?? (ev.data?.length ?? 0),
          sessions: sess.meta?.total ?? allSessions.length,
          speakers: spk.meta?.total ?? (spk.data?.length ?? 0),
          rooms: rooms.meta?.total ?? (rooms.data?.length ?? 0),
          questions: q.meta?.total ?? (q.data?.length ?? 0),
          liveSessions: live.length,
        });

        setSessions(allSessions.slice(0, 6));
        setQuestions((q.data ?? []).slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    {
      label: "Events",
      value: stats.events,
      href: "/admin/events",
      accent: "#5b6ef5",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="12" height="11" rx="1.5" />
          <path d="M5 1v4M11 1v4M2 7h12" />
        </svg>
      ),
    },
    {
      label: "Sessions",
      value: stats.sessions,
      href: "/admin/sessions",
      accent: "#a78bfa",
      badge: stats.liveSessions > 0 ? `${stats.liveSessions} live` : undefined,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 5v3l2 2" />
        </svg>
      ),
    },
    {
      label: "Speakers",
      value: stats.speakers,
      href: "/admin/speakers",
      accent: "#22d3a0",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="1" width="6" height="9" rx="3" />
          <path d="M2 8a6 6 0 0012 0M8 14v2M5 16h6" />
        </svg>
      ),
    },
    {
      label: "Rooms",
      value: stats.rooms,
      href: "/admin/rooms",
      accent: "#f59e0b",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="12" height="11" rx="1" />
          <path d="M5 14V9h6v5M5 3V1h6v2" />
        </svg>
      ),
    },
    {
      label: "Questions",
      value: stats.questions,
      href: "/admin/questions",
      accent: "#f87171",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1">Dashboard</h1>
        <p className="text-[#6b7280] text-sm">Overview of your event platform.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {statCards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sessions */}
        <div className="lg:col-span-3 bg-[#0c1120] border border-white/7 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/7">
            <h2 className="font-bold text-[15px] text-white">Upcoming Sessions</h2>
            <Link href="/admin/sessions" className="text-[12px] text-[#6b7280] hover:text-white transition-colors no-underline flex items-center gap-1">
              View all
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#6b7280] text-sm">
              <span>No sessions yet.</span>
              <Link href="/admin/sessions/create" className="mt-2 text-indigo-400 hover:text-indigo-300 no-underline text-xs">
                + Create one
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {sessions.map((s) => {
                const live = isLive(s.startDate, s.endDate);
                return (
                  <Link
                    key={s.id}
                    href={`/admin/sessions/${s.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/3 transition-colors no-underline group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-medium text-white truncate">{s.title}</span>
                        {live && <LiveBadge />}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#4b5563]">
                        <span>{s.event.title}</span>
                        <span>·</span>
                        <span>{s.room.name}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[12px] text-[#6b7280]">{formatDate(s.startDate)}</div>
                      <div className="text-[11px] text-[#374151]">{formatTime(s.startDate)} → {formatTime(s.endDate)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent questions */}
        <div className="lg:col-span-2 bg-[#0c1120] border border-white/7 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/7">
            <h2 className="font-bold text-[15px] text-white">Recent Questions</h2>
            <Link href="/admin/questions" className="text-[12px] text-[#6b7280] hover:text-white transition-colors no-underline flex items-center gap-1">
              View all
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : questions.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#6b7280] text-sm">
              No questions yet.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {questions.map((q) => (
                <div key={q.id} className="px-5 py-3.5">
                  <p className="text-[13px] text-white/80 leading-snug mb-1.5 line-clamp-2">{q.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-[#4b5563]">
                      <span className="text-[#6b7280]">{q.name ?? "Anonymous"}</span>
                      <span className="mx-1">·</span>
                      <span className="truncate max-w-[100px] inline-block align-bottom">{q.session.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#4b5563]">{timeAgo(q.createdAt)}</span>
                      {q.upvotes > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">
                          ↑ {q.upvotes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 bg-[#0c1120] border border-white/7 rounded-2xl p-5">
        <h2 className="font-bold text-[14px] text-[#6b7280] uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "+ New Event", href: "/admin/events/create", color: "#5b6ef5" },
            { label: "+ New Session", href: "/admin/sessions/create", color: "#a78bfa" },
            { label: "+ New Speaker", href: "/admin/speakers/create", color: "#22d3a0" },
            { label: "+ New Room", href: "/admin/rooms/create", color: "#f59e0b" },
          ].map(({ label, href, color }) => (
            <Link
              key={href}
              href={href}
              className="text-[13px] font-semibold px-4 py-2 rounded-xl border transition-all no-underline hover:-translate-y-0.5"
              style={{ color, borderColor: `${color}25`, background: `${color}10` }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}