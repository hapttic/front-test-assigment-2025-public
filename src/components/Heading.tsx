
function Heading() {
    return (
        <div className="flex flex-col gap-4 items-center mb-6 lg:mb-0 lg:flex-row">
          <img src="/Logo.svg" alt="Logo" className="w-12 h-12 mr-4" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white tracking-tight text-center lg:text-left">Campaign Dashboard</h1>
            <h3 className="text-zinc-400 mt-1 text-center lg:text-left">Real-time insights into campaign metrics and revenue.</h3>
          </div>
        </div>
    );
}

export default Heading;