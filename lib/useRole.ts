"use client";

import { useEffect, useState } from "react";

export interface RoleInfo {
  loaded: boolean;
  groups: string[];
  isStudent: boolean;
  isAdvisor: boolean;
  isAdmin: boolean;
}

export function useRole(): RoleInfo {
  const [groups, setGroups] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const response = await fetch("/api/me/role", { cache: "no-store" });
        const data = (await response.json()) as { groups?: string[] };
        setGroups(Array.isArray(data.groups) ? data.groups : []);
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

  return { loaded, groups, isStudent, isAdvisor, isAdmin };
}
