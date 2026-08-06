import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { User, Palette, LogOut, Info, Loader2, Save, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SectionCard } from "@/components/common";
import { useProfile } from "@/hooks/queries/useProfile";
import { updateProfile, type UpdateProfileInput } from "@/services/profile.service";
import { useAuth } from "@/auth/useAuth";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

type EditMode = "view" | "edit";

interface ProfileForm {
    fullName: string;
    major: string;
    semester: string;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const fieldClassName =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px] text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4";

export function SettingsPage() {
    const { data: profile, loading, refresh } = useProfile();
    const { user, signOut } = useAuth();
    const { showToast } = useToast();

    const [mode, setMode] = useState<EditMode>("view");
    const [form, setForm] = useState<ProfileForm | null>(null);
    const [saving, setSaving] = useState(false);

    // Derive display information
    const displayName = profile?.fullName || user?.email?.split("@")[0] || "Student";
    const initials = (() => {
        if (!profile?.fullName) return displayName[0]?.toUpperCase() || "?";
        const parts = profile.fullName.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "?";
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    })();

    const accountCreated = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
          })
        : "Unknown";

    function startEdit() {
        setForm({
            fullName: profile?.fullName || "",
            major: profile?.major || "",
            semester: profile?.semester?.toString() || "",
        });
        setMode("edit");
    }

    function cancelEdit() {
        setForm(null);
        setMode("view");
    }

    async function handleSave(e: FormEvent) {
        e.preventDefault();
        if (!form || saving) return;

        setSaving(true);
        try {
            const input: UpdateProfileInput = {
                fullName: form.fullName.trim() || null,
                major: form.major.trim() || null,
                semester: form.semester.trim() ? parseInt(form.semester, 10) : null,
            };

            await updateProfile(input);
            await refresh();
            setMode("view");
            setForm(null);
            showToast("Profile updated successfully", "success");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    }

    async function handleSignOut() {
        try {
            await signOut();
            window.location.hash = "";
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to sign out", "error");
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                </div>
            </DashboardLayout>
        );
    }

    const isEditing = mode === "edit" && form !== null;

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Header */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                        Settings
                    </h1>
                    <p className="mt-1.5 text-[15px] text-text-muted">
                        Manage your account settings and preferences.
                    </p>
                </motion.div>

                <motion.div
                    className="space-y-6"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Profile Section */}
                    <motion.div variants={fadeInUp}>
                        <SectionCard icon={User} title="Profile">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xl font-bold text-white">
                                        {initials}
                                    </div>

                                    {/* Profile Info */}
                                    <div className="min-w-0 flex-1">
                                        {isEditing ? (
                                            <form onSubmit={handleSave} className="space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="profile-fullname"
                                                        className="mb-1.5 block text-[11px] font-medium text-text-muted"
                                                    >
                                                        Full Name
                                                    </label>
                                                    <input
                                                        id="profile-fullname"
                                                        type="text"
                                                        value={form.fullName}
                                                        onChange={(e) =>
                                                            setForm({ ...form, fullName: e.target.value })
                                                        }
                                                        placeholder="Enter your full name"
                                                        className={fieldClassName}
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="profile-major"
                                                        className="mb-1.5 block text-[11px] font-medium text-text-muted"
                                                    >
                                                        Major
                                                    </label>
                                                    <input
                                                        id="profile-major"
                                                        type="text"
                                                        value={form.major}
                                                        onChange={(e) =>
                                                            setForm({ ...form, major: e.target.value })
                                                        }
                                                        placeholder="e.g., Computer Science"
                                                        className={fieldClassName}
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="profile-semester"
                                                        className="mb-1.5 block text-[11px] font-medium text-text-muted"
                                                    >
                                                        Semester
                                                    </label>
                                                    <input
                                                        id="profile-semester"
                                                        type="number"
                                                        min="1"
                                                        max="12"
                                                        value={form.semester}
                                                        onChange={(e) =>
                                                            setForm({ ...form, semester: e.target.value })
                                                        }
                                                        placeholder="e.g., 5"
                                                        className={fieldClassName}
                                                    />
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={saving}
                                                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-4 py-2 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {saving ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Save className="h-3.5 w-3.5" />
                                                        )}
                                                        {saving ? "Saving..." : "Save Changes"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        disabled={saving}
                                                        className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <h3 className="text-lg font-semibold text-text-primary">
                                                    {displayName}
                                                </h3>
                                                <p className="mt-1 text-[13px] text-text-muted">{user?.email}</p>

                                                <div className="mt-4 space-y-2">
                                                    {profile?.major && (
                                                        <div className="flex items-center gap-2 text-[13px]">
                                                            <span className="text-text-muted">Major:</span>
                                                            <span className="font-medium text-text-primary">
                                                                {profile.major}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {profile?.semester && (
                                                        <div className="flex items-center gap-2 text-[13px]">
                                                            <span className="text-text-muted">Semester:</span>
                                                            <span className="font-medium text-text-primary">
                                                                {profile.semester}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={startEdit}
                                                    className="mt-4 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-[13px] font-medium text-violet-400 transition-colors hover:bg-violet-500/20"
                                                >
                                                    Edit Profile
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                    </motion.div>

                    {/* Appearance Section */}
                    <motion.div variants={fadeInUp}>
                        <SectionCard icon={Palette} title="Appearance">
                            <div className="p-5 sm:p-6">
                                <p className="mb-4 text-[13px] text-text-muted">
                                    Choose how StudyVault looks to you.
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {["Light", "Dark", "System"].map((theme) => (
                                        <button
                                            key={theme}
                                            type="button"
                                            disabled={theme !== "Dark"}
                                            className={cn(
                                                "rounded-lg border px-4 py-3 text-[13px] font-medium transition-colors",
                                                theme === "Dark"
                                                    ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                                                    : "cursor-not-allowed border-white/[0.06] bg-white/[0.02] text-text-muted opacity-50",
                                            )}
                                        >
                                            {theme}
                                            {theme === "Dark" && (
                                                <span className="ml-1.5 text-[10px]">(Active)</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-3 text-[11px] text-text-muted">
                                    Light and System themes coming soon.
                                </p>
                            </div>
                        </SectionCard>
                    </motion.div>

                    {/* Account Section */}
                    <motion.div variants={fadeInUp}>
                        <SectionCard icon={LogOut} title="Account">
                            <div className="p-5 sm:p-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[11px] font-medium text-text-muted">Email Address</p>
                                        <p className="mt-1 text-[13px] text-text-primary">{user?.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium text-text-muted">
                                            Account Created
                                        </p>
                                        <p className="mt-1 text-[13px] text-text-primary">{accountCreated}</p>
                                    </div>

                                    <div className="border-t border-white/[0.06] pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[0.03] px-4 py-2 text-[13px] font-semibold text-rose-400 transition-colors hover:bg-rose-500/[0.08]"
                                        >
                                            <LogOut className="h-3.5 w-3.5" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                    </motion.div>

                    {/* About Section */}
                    <motion.div variants={fadeInUp}>
                        <SectionCard icon={Info} title="About">
                            <div className="p-5 sm:p-6">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[11px] font-medium text-text-muted">Application</p>
                                        <p className="mt-1 text-[13px] font-semibold text-text-primary">
                                            StudyVault
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium text-text-muted">Version</p>
                                        <p className="mt-1 text-[13px] text-text-primary">0.0.0 (Beta)</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium text-text-muted">Repository</p>
                                        <a
                                            href="https://github.com/yourusername/studyvault"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block text-[13px] text-violet-400 transition-colors hover:text-violet-300"
                                        >
                                            View on GitHub →
                                        </a>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium text-text-muted">Description</p>
                                        <p className="mt-1 text-[13px] text-text-secondary">
                                            Academic Knowledge Hub for university students. Organize notes, manage
                                            courses, and collaborate — all in one place.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                    </motion.div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
