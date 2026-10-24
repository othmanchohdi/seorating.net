"use client";

import { useSyncExternalStore } from "react";

// Three 8-hour shifts cover the full day, in UTC.
const SHIFTS = [
  { name: "Shift 1", start: 6, end: 14 },
  { name: "Shift 2", start: 14, end: 22 },
  { name: "Shift 3", start: 22, end: 6 },
];

const fmt = (d: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(d);

const pad = (h: number) => `${String(h).padStart(2, "0")}:00`;

function isOn(shift: (typeof SHIFTS)[number], utcHour: number) {
  return shift.start < shift.end ? utcHour >= shift.start && utcHour < shift.end : utcHour >= shift.start || utcHour < shift.end;
}

function atUtcHour(now: Date, h: number) {
  const d = new Date(now);
  d.setUTCHours(h, 0, 0, 0);
  return d;
}

// A 30-second clock as an external store. The server snapshot is null, so
// the static HTML never disagrees with the visitor's actual time.
const TICK = 30_000;
const subscribe = (onChange: () => void) => {
  const t = setInterval(onChange, TICK);
  return () => clearInterval(t);
};
const getSnapshot = () => Math.floor(Date.now() / TICK) * TICK;
const getServerSnapshot = () => null;

function useNow() {
  const ts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return ts === null ? null : new Date(ts);
}

export function OnShiftBadge() {
  const now = useNow();
  const current = now ? SHIFTS.find((s) => isOn(s, now.getUTCHours())) : null;
  return (
    <span style={{ fontSize: 13.5, color: "var(--color-text-softer)" }}>· {current ? `${current.name} on duty` : "Support on duty"}</span>
  );
}

export function ShiftTable() {
  const now = useNow();
  const utcHour = now?.getUTCHours() ?? -1;
  return (
    <>
      <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", gap: 3, marginBottom: 18 }} aria-hidden="true">
        {SHIFTS.map((s) => (
          <div key={s.name} style={{ flex: 1, background: isOn(s, utcHour) ? "var(--color-primary)" : "var(--color-primary-soft-border)" }} />
        ))}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {SHIFTS.map((s) => {
          const on = isOn(s, utcHour);
          return (
            <li
              key={s.name}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) auto",
                gap: "4px 12px",
                alignItems: "center",
                padding: "11px 12px",
                borderRadius: 10,
                background: on ? "var(--color-primary-soft)" : "transparent",
              }}
            >
              <span style={{ fontSize: 14.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                {s.name}
                {on && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 999, background: "var(--color-primary)", color: "#fff" }}>
                    Now
                  </span>
                )}
              </span>
              <span className="mono" style={{ fontSize: 12.5, color: "var(--color-ink-soft)" }}>
                {pad(s.start)}–{pad(s.end)} UTC
              </span>
              {now && (
                <span className="mono" style={{ fontSize: 11.5, color: "var(--color-text-faintest)", gridColumn: "1 / -1" }}>
                  Chicago {fmt(atUtcHour(now, s.start), "America/Chicago")}–{fmt(atUtcHour(now, s.end), "America/Chicago")} · Monastir{" "}
                  {fmt(atUtcHour(now, s.start), "Africa/Tunis")}–{fmt(atUtcHour(now, s.end), "Africa/Tunis")}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function LocalTime({ timeZone }: { timeZone: string }) {
  const now = useNow();
  return <span className="mono">{now ? fmt(now, timeZone) : "--:--"}</span>;
}
