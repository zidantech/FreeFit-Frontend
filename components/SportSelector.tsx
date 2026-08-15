import { SportIcon } from "@/lib/sportsIcons";

interface Sport {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface SportSelectorProps {
  sports: Sport[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

export default function SportSelector({
  sports,
  selected,
  onChange,
  multiSelect = true,
  className = "",
}: SportSelectorProps) {
  const toggleSport = (slug: string) => {
    if (multiSelect) {
      if (selected.includes(slug)) {
        onChange(selected.filter((s) => s !== slug));
      } else {
        onChange([...selected, slug]);
      }
    } else {
      onChange([slug]);
    }
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {sports.map((sport) => {
        const isSelected = selected.includes(sport.slug);
        return (
          <button
            key={sport.id}
            onClick={() => toggleSport(sport.slug)}
            className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 ${
              isSelected
                ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20"
                : "border-cyan-500/30 bg-[#0f1535]/50 hover:border-cyan-500/50 hover:bg-[#0f1535]"
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <SportIcon
                slug={sport.slug}
                name={sport.name}
                iconUrl={sport.icon}
                className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400"
              />
            </div>
            <span
              className={`text-sm sm:text-base font-semibold ${
                isSelected ? "text-cyan-400" : "text-white"
              }`}
            >
              {sport.name}
            </span>
            {isSelected && (
              <span className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0a0e27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}