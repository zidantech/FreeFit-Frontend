import { SportIcon } from "@/lib/sportsIcons";

export interface SportItem {
  id: number | string;
  name: string;
  slug?: string;
  icon?: string;
}

interface SportSelectorProps {
  sports: SportItem[];
  selected?: (string | number)[] | string | number | null;
  selectedId?: number | string | null;
  onChange?: (selected: any) => void;
  onSelect?: (sport: SportItem) => void;
  multiSelect?: boolean;
  className?: string;
}

export default function SportSelector({
  sports = [],
  selected,
  selectedId,
  onChange,
  onSelect,
  multiSelect = false,
  className = "",
}: SportSelectorProps) {
  const isSportSelected = (sport: SportItem): boolean => {
    const sportIdStr = String(sport.id);
    const sportSlug = (sport.slug || sport.name || "").toLowerCase().replace(/[^a-z0-9]/g, "-");

    if (selectedId !== undefined && selectedId !== null) {
      return String(selectedId) === sportIdStr;
    }

    if (Array.isArray(selected)) {
      return selected.some((s) => String(s) === sportIdStr || String(s).toLowerCase() === sportSlug);
    }

    if (selected !== undefined && selected !== null) {
      return String(selected) === sportIdStr || String(selected).toLowerCase() === sportSlug;
    }

    return false;
  };

  const handleSelect = (sport: SportItem) => {
    if (onSelect) {
      onSelect(sport);
    }

    if (onChange) {
      if (multiSelect) {
        const currentSelected = Array.isArray(selected) ? [...selected] : [];
        const exists = currentSelected.some(
          (s) => String(s) === String(sport.id) || String(s).toLowerCase() === (sport.slug || "").toLowerCase()
        );
        if (exists) {
          onChange(
            currentSelected.filter(
              (s) => String(s) !== String(sport.id) && String(s).toLowerCase() !== (sport.slug || "").toLowerCase()
            )
          );
        } else {
          onChange([...currentSelected, sport.id]);
        }
      } else {
        onChange(sport.id);
      }
    }
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {sports.map((sport) => {
        const isSelected = isSportSelected(sport);
        const slug = sport.slug || sport.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

        return (
          <button
            key={String(sport.id)}
            type="button"
            onClick={() => handleSelect(sport)}
            className={`group relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 cursor-pointer ${
              isSelected
                ? "border-cyan-400 bg-cyan-400/15 shadow-lg shadow-cyan-400/20 ring-1 ring-cyan-400"
                : "border-cyan-500/30 bg-[#0f1535]/60 hover:border-cyan-400/50 hover:bg-[#0f1535]"
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform group-hover:scale-110">
              <SportIcon
                slug={slug}
                name={sport.name}
                iconUrl={sport.icon}
                className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400"
              />
            </div>
            <span
              className={`text-sm sm:text-base font-semibold text-center transition-colors ${
                isSelected ? "text-cyan-300 font-bold" : "text-white group-hover:text-cyan-300"
              }`}
            >
              {sport.name}
            </span>
            {isSelected && (
              <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center shadow-md shadow-cyan-400/40">
                <svg
                  className="w-3 h-3 text-[#0a0e27]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3.5}
                >
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