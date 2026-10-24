import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-secondary text-white hover:bg-secondary/90",
    secondary: "bg-primary text-white hover:bg-primary/90",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Section({
  children,
  className = "",
  ...props
}: ComponentProps<"section">) {
  return (
    <section className={`px-4 py-12 sm:py-16 lg:py-20 ${className}`} {...props}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-primary-dark/10 rounded-xl border bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
