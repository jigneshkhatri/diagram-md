import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Square padding for a button that only contains an icon. */
  iconOnly?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "border border-black/15 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10",
  ghost: "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white",
};

export default function Button({ variant = "secondary", iconOnly, type = "button", className = "", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        iconOnly ? "p-2" : "px-3 py-1.5"
      } ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
