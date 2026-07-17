import { supabase } from "@/lib/supabase";
import type { MaterialType } from "@/types/courses";

export interface MaterialRow {
    id: string;
    user_id: string;
    course_id: string;
    title: string;
    description: string | null;
    file_name: string;
    file_url: string;
    mime_type: string;
    file_size: number;
    created_at: string;
    updated_at: string;
}

export interface MaterialRecord {
    id: string;
    courseId: string;
    title: string;
    description: string | null;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMaterialInput {
    courseId: string;
    title: string;
    description: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
}

function mapMaterialRow(row: MaterialRow): MaterialRecord {
    return {
        id: row.id,
        courseId: row.course_id,
        title: row.title,
        description: row.description,
        fileName: row.file_name,
        fileUrl: row.file_url,
        mimeType: row.mime_type,
        fileSize: row.file_size,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function getMaterialType(mimeType: string, filename: string): MaterialType {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (mimeType.startsWith("image/") || ext === "jpg" || ext === "jpeg" || ext === "png") {
        return "image";
    }
    if (mimeType.startsWith("video/") || ext === "mp4" || ext === "mov" || ext === "avi") {
        return "video";
    }
    if (ext === "pdf" || mimeType === "application/pdf") {
        return "pdf";
    }
    if (ext === "ppt" || ext === "pptx" || mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
        return "ppt";
    }
    if (ext === "doc" || ext === "docx" || mimeType.includes("word") || mimeType.includes("document")) {
        return "doc";
    }
    if (ext === "xls" || ext === "xlsx" || mimeType.includes("excel") || mimeType.includes("sheet")) {
        return "xls";
    }
    if (ext === "zip" || ext === "rar" || mimeType.includes("zip") || mimeType.includes("compressed")) {
        return "zip";
    }
    return "pdf"; // default fallback
}

/**
 * Whether a material can be shown in the in-app fullscreen preview modal, or should
 * instead be offered as a direct download link.
 *
 * Sprint 6.3 scope: PDF and Image preview inline; DOC/DOCX/PPT/PPTX/XLS/XLSX/ZIP download
 * directly. Video is intentionally treated as download-only for now — a dedicated video
 * viewer is out of scope this sprint (tracked for a future one).
 */
export function canPreviewInBrowser(type: MaterialType): boolean {
    return type === "pdf" || type === "image";
}

export function formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export async function uploadMaterialFile(
    courseId: string,
    file: File
): Promise<string> {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You need to be signed in to upload materials.");
    }

    // Ambil ekstensi file
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";

    // Gunakan UUID agar tidak ada masalah nama file
    const storageFileName = `${crypto.randomUUID()}.${extension}`;

    // Path penyimpanan
    const path = `${user.id}/${courseId}/${storageFileName}`;

    // Upload ke Supabase Storage
    const { error } = await supabase.storage
        .from("materials")
        .upload(path, file);

    if (error) {
        throw new Error(error.message);
    }

    // Ambil public URL
    const { data } = supabase.storage
        .from("materials")
        .getPublicUrl(path);

    return data.publicUrl;
}

export async function createMaterial(
    input: CreateMaterialInput
): Promise<MaterialRecord> {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You need to be signed in to upload materials.");
    }

    const { data, error } = await supabase
        .from("materials")
        .insert({
            user_id: user.id,
            course_id: input.courseId,
            title: input.title,
            description: input.description || null,
            file_name: input.fileName, // nama asli untuk ditampilkan di UI
            file_url: input.fileUrl,
            mime_type: input.mimeType,
            file_size: input.fileSize,
        })
        .select()
        .single<MaterialRow>();

    if (error) {
        throw new Error(error.message);
    }

    return mapMaterialRow(data);
}

export async function getMaterialsByCourse(courseId: string): Promise<MaterialRecord[]> {
    const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .returns<MaterialRow[]>();

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map(mapMaterialRow);
}