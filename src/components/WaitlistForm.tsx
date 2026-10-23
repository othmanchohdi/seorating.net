"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <label htmlFor="wl" style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-faintest)" }}>
        WordPress waitlist
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          id="wl"
          type="email"
          required
          placeholder="you@store.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSent(false);
          }}
          style={{ flex: 1, minWidth: 170, height: 42, padding: "0 12px", fontSize: 14.5 }}
        />
        <button type="submit" className="btn btn-primary btn-sm">
          Notify me
        </button>
      </div>
      <span style={{ fontSize: 12.5, color: sent ? "#3f8a5a" : "var(--color-text-faintest)" }}>
        {sent ? `Thanks — we’ll email ${email} when the WordPress version is ready.` : "No spam. One email when it launches."}
      </span>
    </form>
  );
}
