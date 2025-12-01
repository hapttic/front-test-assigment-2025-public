import haptticLogo from "@/assets/hapttic-logo.png";

export const Navigation = () => {
  return (
    <div className="w-full border-b border-gray-300 mb-4 sticky top-0 bg-white z-10">
      <nav className="w-full container mx-auto py-4 flex items-center justify-between">
        <img src={haptticLogo} alt="Hapttic Logo" className="md:h-10 h-8" />

        <h1 className="md:text-lg! text-base! font-bold">
          Campaign Analytics Dashboard
        </h1>
      </nav>
    </div>
  );
};
