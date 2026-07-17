import { useCallback, useEffect, useState } from "react";
import {
    getMaterialsByCourse,
    uploadMaterialFile,
    createMaterial,
    type MaterialRecord,
} from "@/services/material.service";

export interface UseMaterialsResult {
    data: MaterialRecord[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    uploadMaterial: (title: string, description: string, file: File) => Promise<MaterialRecord>;
}

export function useMaterials(courseId: string): UseMaterialsResult {
    const [data, setData] = useState<MaterialRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setData(await getMaterialsByCourse(courseId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load materials.");
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        if (!courseId) return;
        let active = true;

        getMaterialsByCourse(courseId)
            .then((result) => {
                if (active) setData(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load materials.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [courseId]);

    const uploadMaterial = useCallback(
        async (title: string, description: string, file: File): Promise<MaterialRecord> => {
            // 1. Upload file to Supabase storage
            const fileUrl = await uploadMaterialFile(courseId, file);
            // 2. Insert metadata row to materials table
            const record = await createMaterial({
                courseId,
                title: title.trim(),
                description: description.trim(),
                fileName: file.name,
                fileUrl,
                mimeType: file.type || "application/octet-stream",
                fileSize: file.size,
            });
            // 3. Append to state
            setData((prev) => [record, ...prev]);
            return record;
        },
        [courseId],
    );

    return { data, loading, error, refresh, uploadMaterial };
}
