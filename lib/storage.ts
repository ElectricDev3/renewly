import type { Member } from "./types";

const KEY = "rnproject:members";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getMembers(): Member[] {
  return read<Member[]>(KEY, []);
}

export function saveMembers(members: Member[]): void {
  write(KEY, members);
}
