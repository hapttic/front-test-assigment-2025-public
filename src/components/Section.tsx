
function Section({ children} : { children: React.ReactNode }) {
    return <section className="bg-zinc-900/50 p-1 rounded-lg border border-white/5 py-5 px-6">{children}</section>;
}

export default Section;