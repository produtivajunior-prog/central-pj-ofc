import { useEffect, useState } from "react";

const KEY = "centralpj_visitor_id";

function generate() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "v-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useVisitorId(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let v = localStorage.getItem(KEY);
    if (!v) {
      v = generate();
      localStorage.setItem(KEY, v);
    }
    setId(v);
  }, []);
  return id;
}
