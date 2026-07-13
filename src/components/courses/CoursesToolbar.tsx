import { ChevronDown } from "lucide-react";
import { SearchInput } from "@/components/common";
import { semesters } from "@/data/courses";

interface CoursesToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    selectedSemester: string;
    onSemesterChange: (value: string) => void;
}

export function CoursesToolbar({
    searchValue,
    onSearchChange,
    selectedSemester,
    onSemesterChange,
}: CoursesToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search courses or lecturers..."
                ariaLabel="Search courses"
            />

            <div className="relative">
                <select
                    value={selectedSemester}
                    onChange={(e) => onSemesterChange(e.target.value)}
                    aria-label="Filter by semester"
                    className="w-full appearance-none rounded-lg border border-white/[0.06] bg-white/[0.02] py-2 pr-9 pl-3 text-[13px] text-text-secondary outline-none transition-colors duration-200 hover:border-white/[0.1] focus:border-violet-500/30 sm:w-48"
                >
                    {semesters.map((s) => (
                        <option key={s} value={s} className="bg-[#0a0a0d] text-text-secondary">
                            {s}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            </div>
        </div>
    );
}