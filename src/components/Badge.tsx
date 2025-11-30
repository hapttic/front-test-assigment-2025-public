
function Badge({ count }: { count: number }) {
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {count} Active
        </span>
    );
}

export default Badge;