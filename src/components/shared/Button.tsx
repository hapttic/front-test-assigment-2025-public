type Variant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

interface props {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: Variant;
}

export default function Button({
  children,
  disabled,
  onClick,
  className,
  variant = "primary",
}: props) {
  const defaultClass =
    "rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer";

  const variants: Record<Variant, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${defaultClass} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
