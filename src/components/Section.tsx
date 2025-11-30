
function Section({ children, className} : { children: React.ReactNode, className?: string }) {
    return <section className={`bg-zinc-900/50 rounded-lg border border-white/5 ${className}`}>{children}</section>;
}

export default Section;