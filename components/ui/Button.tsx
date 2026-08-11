import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Minimal neutral button. Two variants only:
 * - primary: near-black solid (generic, non-brand primary action)
 * - secondary: quiet outline
 * Kept deliberately plain so nothing reads as a specific AI provider's styling.
 */
type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /**
   * Marks this as a MANDATORY-click control (Send, Verify & Proceed, final Submit).
   * Adds a `data-mandatory-click` attribute so telemetry can exclude these
   * clicks from Input & Editing Volatility at the event-capture level - uniformly,
   * with no per-control special-casing (volatility exclusion, PRD §5.2).
   */
  mandatory?: boolean;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-neutral-900 text-white hover:bg-neutral-800",
  secondary:
    "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50",
};

export function Button({
  variant = "primary",
  className = "",
  mandatory,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      data-mandatory-click={mandatory ? "true" : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
