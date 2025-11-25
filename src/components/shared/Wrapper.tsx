interface props {
  children: React.ReactNode;
  className?: string;
}
export default function Wrapper({ children, className }: props) {
  return (
    <div className={`max-w-6xl mx-auto py-6 ${className}`}>{children}</div>
  );
}
