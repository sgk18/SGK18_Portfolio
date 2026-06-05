"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer || "direct",
      }),
    }).catch(() => {});
  }, []);

  return null;
}
