import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-ink text-parchment hover:bg-renewal-deep focus-visible:outline-ink",
  secondary:
    "bg-white text-ink border border-parchment-dim hover:bg-parchment-dim focus-visible:outline-mist",
  ghost: "bg-transparent text-ink/70 hover:bg-parchment-dim focus-visible:outline-mist",
  danger: "bg-transparent text-ember border border-ember/40 hover:bg-ember/10 focus-visible:outline-ember",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
