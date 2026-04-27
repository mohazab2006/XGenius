import { isoOf } from "@/lib/teams";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_MAP: Record<Size, { box: string; px: number }> = {
  xs: { box: "h-3.5 w-5", px: 40 },
  sm: { box: "h-4 w-6", px: 40 },
  md: { box: "h-5 w-7", px: 80 },
  lg: { box: "h-7 w-10", px: 80 },
  xl: { box: "h-10 w-14", px: 160 },
  "2xl": { box: "h-14 w-20", px: 320 },
};

type Props = {
  team: string;
  size?: Size;
  className?: string;
  rounded?: boolean;
};

/**
 * Country flag rendered from flagcdn.com PNG (sharp, consistent across OSes).
 * Falls back to a neutral pill if the team is unknown.
 */
export default function Flag({ team, size = "md", className = "", rounded = true }: Props) {
  const iso = isoOf(team);
  const cfg = SIZE_MAP[size];

  if (!iso) {
    return (
      <span
        aria-hidden
        className={`inline-block ${cfg.box} bg-bg-soft ${rounded ? "rounded-md" : ""} ${className}`}
      />
    );
  }

  const src1x = `https://flagcdn.com/w${cfg.px}/${iso}.png`;
  const src2x = `https://flagcdn.com/w${cfg.px * 2}/${iso}.png`;

  return (
    <img
      src={src1x}
      srcSet={`${src1x} 1x, ${src2x} 2x`}
      alt={`${team} flag`}
      loading="lazy"
      decoding="async"
      className={`inline-block shrink-0 object-cover ring-1 ring-black/30 ${rounded ? "rounded-md" : ""} ${cfg.box} ${className}`}
    />
  );
}
