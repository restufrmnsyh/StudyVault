import { useCallback, useEffect, useState } from "react";
import {
    getMaterialsByCourse,
    uploadMaterialFile,
    createMaterial,
    updateMaterial as updateMaterialService,
    replaceMaterialFile as replaceMaterialFileService,
    deleteMaterial as deleteMaterialService,
    type MaterialRecord,
    type UpdateMaterialInput,
} from "@/services/material.service";

export interface UseMaterialsResult {
    data: MaterialRecord[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    uploadMaterial: (title: string, description: string, file: File) => Promise<MaterialRecord>;
    updateMaterial: (id: string, updates: UpdateMaterialInput) => Promise<MaterialRecord>;
    replaceMaterialFile: (material: MaterialRecord, file: File) => Promise<MaterialRecord>;
    deleteMaterial: (material: MaterialRecord) => Promise<void>;
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
            const fileUrl = await uploadMaterialFile(courseId, file);
            const record = await createMaterial({
                courseId,
                title: title.trim(),
                description: description.trim(),
                fileName: file.name,
                fileUrl,
                mimeType: file.type || "application/octet-stream",
                fileSize: file.size,
            });
            setData((prev) => [record, ...prev]);
            return record;
        },
        [courseId],
    );

    const updateMaterial = useCallback(
        async (id: string, updates: UpdateMaterialInput): Promise<MaterialRecord> => {
            const updated = await updateMaterialService(id, updates);
            setData((prev) => prev.map((m) => (m.id === id ? updated : m)));
            return updated;
        },
        [],
    );

    const replaceMaterialFile = useCallback(
        async (material: MaterialRecord, file: File): Promise<MaterialRecord> => {
            const updated = await replaceMaterialFileService(material, file);
            setData((prev) => prev.map((m) => (m.id === material.id ? updated : m)));
            return updated;
        },
        [],
    );

    const deleteMaterial = useCallback(
        async (material: MaterialRecord): Promise<void> => {
            await deleteMaterialService(material);
            setData((prev) => prev.filter((m) => m.id !== material.id));
        },
        [],
    );

    return {
        data, loading, error, refresh,
        uploadMaterial, updateMaterial, replaceMaterialFile, deleteMaterial,
    };
}

