import {
    FileArchive,
    FileImage,
    FileSpreadsheet,
    FileText,
    FileType2,
    FileVideo,
    Presentation,
    type LucideIcon,
} from "lucide-react";
import type { MaterialType } from "@/types/courses";

export const materialIcon: Record<MaterialType, LucideIcon> = {
    pdf: FileText,
    ppt: Presentation,
    doc: FileType2,
    xls: FileSpreadsheet,
    zip: FileArchive,
    image: FileImage,
    video: FileVideo,
};

export const materialTypeLabel: Record<MaterialType, string> = {
    pdf: "PDF",
    ppt: "PowerPoint",
    doc: "Word",
    xls: "Excel",
    zip: "ZIP",
    image: "Image",
    video: "Video",
};
