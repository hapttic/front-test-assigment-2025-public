interface props {
  children: React.ReactNode;
  className?: string;
}
export default function Wrapper({ children, className }: props) {
  return (
    <div className={`max-w-[1400px] mx-auto px-4 py-6 ${className}`}>
      {children}
    </div>
  );
}
