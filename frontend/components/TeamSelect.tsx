"use client";

import { TEAM_NAMES } from "@/lib/teams";
import Flag from "./Flag";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label: string;
  exclude?: string;
  id?: string;
};

export default function TeamSelect({ value, onChange, label, exclude, id }: Props) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Flag team={value} size="md" />
        </span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input appearance-none pl-12 pr-9 font-medium"
        >
          {TEAM_NAMES.filter((t) => t !== exclude).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-faint">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
        </span>
      </div>
    </label>
  );
}
