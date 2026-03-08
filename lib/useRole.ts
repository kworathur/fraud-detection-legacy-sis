"use client";

import { useEffect, useState } from "react";

export interface RoleInfo {
  loaded: boolean;
  name: string | null;
  email: string | null;
  groups: string[];
  isStudent: boolean;
  isAdvisor: boolean;
  isAdmin: boolean;
}

export function useRole(): RoleInfo {
  const [groups, setGroups] = useState<string[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const response = await fetch("/api/me/role", { cache: "no-store" });
        const data = (await response.json()) as { groups?: string[]; name?: string | null; email?: string | null };
        setGroups(Array.isArray(data.groups) ? data.groups : []);
        setName(data.name ?? null);
        setEmail(data.email ?? null);
      } catch {
        setGroups([]);
      } finally {
        setLoaded(true);
      }
    };

    void loadRole();
  }, []);

  const isAdmin = groups.includes("advising-admin");
  const isAdvisor = groups.includes("advising-advisor");
  const isStudent = !isAdmin && !isAdvisor;

  return { loaded, name, email, groups, isStudent, isAdvisor, isAdmin };
}
