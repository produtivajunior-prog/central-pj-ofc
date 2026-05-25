import { useEffect, useState, useCallback } from "react";

const KEY = "centralpj_admin";
const ADMIN_EMAIL = "produtivajunior@gmail.com";
const ADMIN_PASSWORD = "produtivajr12";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(typeof window !== "undefined" && localStorage.getItem(KEY) === "1");
    const onStorage = () =>
      setIsAdmin(localStorage.getItem(KEY) === "1");
    window.addEventListener("storage", onStorage);
    window.addEventListener("centralpj-admin", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("centralpj-admin", onStorage);
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("centralpj-admin"));
  }, []);

  return { isAdmin, logout };
}

export function tryLogin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(KEY, "1");
    window.dispatchEvent(new Event("centralpj-admin"));
    return true;
  }
  return false;
}
