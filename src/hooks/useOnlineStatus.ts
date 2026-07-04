"use client";

import { useState, useEffect, useRef } from "react";

export function useOnlineUsers() {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const [recentIds, setRecentIds] = useState<Set<string>>(new Set());
  const seenTimestamps = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let interval: number | undefined;

    const fetchOnline = async () => {
      try {
        const res = await fetch("/api/online/ids");
        if (!res.ok) return;
        const data = await res.json();
        const currentOnline = new Set<string>(data.onlineIds || []);
        const now = Date.now();

        for (const id of currentOnline) {
          seenTimestamps.current.set(id, now);
        }

        const recent = new Set<string>();
        for (const [id, ts] of seenTimestamps.current) {
          if (now - ts < 55_000) recent.add(id);
          else seenTimestamps.current.delete(id);
        }

        setOnlineIds(currentOnline);
        setRecentIds(recent);
      } catch {}
    };

    fetchOnline();
    interval = window.setInterval(fetchOnline, 20_000);
    return () => window.clearInterval(interval);
  }, []);

  return { onlineIds, recentIds };
}
