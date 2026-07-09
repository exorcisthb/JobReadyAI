import { useEffect, useState, useCallback, useMemo } from "react";
import {
  FileText,
  Upload,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  File,
  Trash2,
  Sparkles,
  Eye,
  Pencil,
  X,
  MessageSquare,
  BarChart3,
  BookOpen,
  Newspaper,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import type { NavItem } from "@/components/dashboard-header";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTour } from "@/components/OnboardingTour";
import { useTranslation } from "react-i18next";

// Define CVTemplateColor interface for local use
interface CVTemplateColor {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  layout: string;
  tags: string[];
  colors: CVTemplateColor[];
}

interface SelectedCVTemplate extends CVTemplate {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

interface CVData {
  title?: string;
  fullName?: string;
  jobTitle?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  avatar?: string;
  objective?: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{ name: string; level: number }>;
  languages: string[];
  certifications: string[];
  hobbies: string[];
}

interface CVItem {
  id: string;
  title: string;
  file_name: string;
  file_url?: string;
  uploaded_at: string;
  type: "uploaded" | "created";
  content?: Record<string, unknown>;
  template_id?: string;
}

const hasVietnameseMojibake = (value: string) =>
  /[\u00c2\u00c3\u00c4\u00c6\u00e1]/.test(value);

const fixVietnameseMojibake = (value: string) => {
  if (!hasVietnameseMojibake(value)) return value;

  try {
    const decoded = decodeURIComponent(escape(value));
    return hasVietnameseMojibake(decoded) ? decodeURIComponent(escape(decoded)) : decoded;
  } catch {
    return value;
  }
};

// Preview Modal Component
function PreviewModal({
  cv,
  onClose,
  onEdit,
  onDelete,
}: {
  cv: CVItem;
  onClose: () => void;
  onEdit: (cv: CVItem) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(cv.id);
    setDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                cv.type === "created"
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "bg-primary/10 border border-primary/20"
              }`}
            >
              <FileText
                className={`h-6 w-6 ${cv.type === "created" ? "text-emerald-500" : "text-primary"}`}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold">{cv.title}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formatDate(cv.uploaded_at)}
                <Badge
                  variant="outline"
                  className={`text-xs ml-2 ${
                    cv.type === "created"
                      ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : "border-primary/30 bg-primary/5 text-primary"
                  }`}
                >
                  {cv.type === "created" ? t("cv.previewFromBuilder") : t("cv.previewFromUpload")}
                </Badge>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Preview Area - Fit to container */}
        <div className="flex-1 overflow-auto p-6 bg-muted/30 flex items-center justify-center">
          {cv.type === "uploaded" && cv.file_url ? (
            <embed
              src={`${cv.file_url}#toolbar=0&navpanes=0`}
              type="application/pdf"
              className="w-[800px] h-full rounded-xl shadow-lg border-0 bg-white"
            />
          ) : cv.type === "created" ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4">
                <FileText className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{cv.title}</h3>
              <p className="text-sm text-emerald-600 font-medium mb-6">
                {t("cv.previewHint")}
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("cv.deleteConfirm")}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg"
                >
                  {t("cv.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg gap-2"
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("cv.draftDelete")}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4" />
                {t("cv.draftDelete")}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {cv.type === "created" && (
              <Button
                onClick={() => onEdit(cv)}
                className="rounded-lg gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-white"
              >
                <Pencil className="h-4 w-4" />
                {t("cv.previewEdit")}
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="rounded-lg gap-2">
              {t("cv.previewBack")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Upload Modal Component
function UploadModal({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, title: string) => Promise<string | null>;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError(t("cv.uploadErrorType"));
      return false;
    }
    if (file.size > maxSize) {
      setError(t("cv.uploadErrorSize"));
      return false;
    }
    setError("");
    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setError(t("cv.uploadErrorNoFile"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const extractionWarning = await onUpload(selectedFile, title.trim());
      setSelectedFile(null);
      setTitle("");

      if (extractionWarning) {
        // Show warning inside modal — don't auto-close
        setWarning(extractionWarning);
      } else {
        setSuccess(t("cv.uploadSuccess"));
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cv.uploadFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("cv.uploadManage")}</h2>
              <p className="text-xs text-muted-foreground">{t("cv.uploadDesc")}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setWarning("");
              setError("");
              setSuccess("");
              setSelectedFile(null);
              setTitle("");
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onClick={() => document.getElementById("cv-file-input")?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-primary bg-primary/5"
                : selectedFile
                  ? "border-emerald-500 bg-emerald-500/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              id="cv-file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,application/pdf,image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <File className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setTitle("");
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mx-auto mb-3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">{t("cv.uploadDragDrop")}</p>
                <p className="text-xs text-muted-foreground">{t("cv.uploadFileTypes")}</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t("cv.uploadTitle")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-4 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder={t("cv.uploadPlaceholder")}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {warning && (
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive text-sm animate-shake">
              <div className="flex items-center">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {t("cv.parseError")}
                </div>
              </div>
              <div className="whitespace-pre-line text-xs leading-relaxed text-destructive/80">
                {warning}
              </div>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
              <CheckCircle className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !title.trim() || loading}
            className="w-full rounded-lg h-11 font-medium bg-primary hover:bg-primary/90 text-white transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("cv.uploadUploading")}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {t("cv.uploadButton")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// CV Row Component - Horizontal layout like user's sketch
function CVRow({
  cv,
  onView,
  onEdit,
  onDelete,
}: {
  cv: CVItem;
  onView: (cv: CVItem) => void;
  onEdit: (cv: CVItem) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const displayTitle = fixVietnameseMojibake(cv.title);
  const displayFileName = fixVietnameseMojibake(cv.file_name);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(cv.id);
    setDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border/40 rounded-xl hover:shadow-md hover:border-border/60 transition-all duration-200 group">
      {/* Icon */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          cv.type === "created"
            ? "bg-emerald-500/10 border border-emerald-500/20"
            : "bg-primary/10 border border-primary/20"
        }`}
      >
        <FileText
          className={`h-6 w-6 ${cv.type === "created" ? "text-emerald-500" : "text-primary"}`}
        />
      </div>

      {/* Title & Type */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold truncate">{displayTitle}</h3>
          <Badge
            variant="outline"
            className={`text-xs shrink-0 ${
              cv.type === "created"
                ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "border-primary/30 bg-primary/5 text-primary"
            }`}
          >
            {cv.type === "created" ? t("cv.builderLabel") : t("cv.uploadLabel")}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {cv.type === "uploaded" ? displayFileName : t("cv.fromTemplate")}
        </p>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground w-32 shrink-0">
        <Clock className="h-3.5 w-3.5" />
        <span>{formatDate(cv.uploaded_at)}</span>
      </div>

      {/* Actions - Order: Xem, Phỏng vấn, Xóa */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(cv)}
          className="rounded-lg gap-1.5 h-9 px-3"
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">{t("cv.view")}</span>
        </Button>


        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.assign(`/interview/persona?cv_id=${cv.id}`)}
          data-onboarding="interview-btn"
          className="rounded-lg gap-1.5 h-9 px-3"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">{t("cv.interview")}</span>
        </Button>



        {showDeleteConfirm ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg h-9 px-2"
            >
              {t("cv.cancel")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg h-9 px-3"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("cv.draftDelete")}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg gap-1.5 h-9 px-3 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t("cv.draftDelete")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function CVListPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [cvs, setCVs] = useState<CVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [cvQuota, setCvQuota] = useState<{
    used: number;
    limit: number;
    remaining: number;
    plan: string;
  } | null>(null);

  // Onboarding tour
  const { isTourActive, activeStepType, advanceTour, skipTour, currentStep, setHasCVs } = useOnboarding(
    user?.id || "anonymous"
  );

  // Update hasCVs state when CVs load
  useEffect(() => {
    if (cvs.length > 0) {
      setHasCVs(true);
    }
  }, [cvs.length, setHasCVs]);

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
  );

  const fetchCVs = useCallback(async () => {
    try {
      const response = await fetch("/api/cv", { headers });
      if (response.ok) {
        const data = await response.json();
        const allCVs = (data.cvs || []).map((cv: Record<string, unknown>) => ({
          ...cv,
          type: (cv.type as "uploaded" | "created") || "uploaded",
        }));
        setCVs(allCVs);
      }
    } catch (err) {
      console.error("Failed to fetch CVs:", err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const fetchCvQuota = useCallback(async () => {
    try {
      const response = await fetch("/api/cv/quota", { headers });
      if (response.ok) {
        const data = await response.json();
        setCvQuota(data);
      }
    } catch (err) {
      console.error("Failed to fetch CV quota:", err);
    }
  }, [headers]);

  const handleUpload = async (file: File, title: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const response = await fetch("/api/cv", {
      method: "POST",
      headers: {
        "x-user-id": user?.id || "",
        "x-user-role": user?.role || "",
      },
      body: formData,
    });

    const data = await response.json();

    // 422 = PDF has no text layer — show warning, do NOT refresh list
    if (response.status === 422 && data.extraction_warning) {
      return data.extraction_warning;
    }

    if (!response.ok) {
      throw new Error(data.error || t("cv.uploadFailed"));
    }

    // Only refresh CV list on real success
    await fetchCVs();
    await fetchCvQuota();
    return null;
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/cv/${id}`, {
      method: "DELETE",
      headers,
    });
    await fetchCVs();
    await fetchCvQuota();
  };

  const handleView = (cv: CVItem) => {
    // Navigate to dedicated preview page instead of modal
    window.location.href = `/cv/preview?cv_id=${cv.id}`;
  };

  const handleEdit = (cv: CVItem) => {
    window.location.assign(`/cv/create?id=${cv.id}`);
  };

  useEffect(() => {
    void fetchCVs();
    void fetchCvQuota();
  }, [fetchCVs, fetchCvQuota]);

  const handleCreateCVClick = () => {
    // Soft upsell when quota is full — still navigate to CV builder
    if (cvQuota && cvQuota.remaining <= 0) {
      const confirm = window.confirm(
        `Bạn đã dùng hết ${cvQuota.limit}/${cvQuota.limit} lượt tạo CV trong gói này.\n\nNâng cấp gói để tạo thêm CV không giới hạn. Bạn có muốn xem các gói không?`
      );
      if (confirm) {
        window.location.assign("/pricing?tab=cv");
        return;
      }
    }
    window.location.assign("/cv/create");
  };

  const handleUploadCVClick = () => {
    // Upload không bị giới hạn bởi quota tạo CV Builder
    setShowUploadModal(true);
  };

  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  const uploadedCount = cvs.filter((cv) => cv.type === "uploaded").length;
  const createdCount = cvs.filter((cv) => cv.type === "created").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Onboarding Tour for CV Page step */}
      {isTourActive && activeStepType === "cv_page" && currentStep === 1 && (
        <OnboardingTour
          userId={user?.id || "anonymous"}
          currentStep="cv_page"
          onAdvance={advanceTour}
          onSkip={skipTour}
        />
      )}

      {/* Onboarding Tour for CV Ready step */}
      {isTourActive && activeStepType === "cv_ready" && currentStep === 2 && (
        <OnboardingTour
          userId={user?.id || "anonymous"}
          currentStep="cv_ready"
          onAdvance={advanceTour}
          onSkip={skipTour}
        />
      )}

      <DashboardHeader navItems={useUserNavItems()} activePath="/cv" role="user" onLogout={handleLogout} />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-8 space-y-6"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t("cv.pageTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("cv.pageDesc")}
              </p>
            </div>

             <div className="flex items-center gap-3">
              <button
                onClick={handleUploadCVClick}
                data-onboarding="upload-cv"
                className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted transition-all duration-300 cursor-pointer"
              >
                <Upload className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t("cv.uploadCV")}</span>
              </button>

              <button
                onClick={handleCreateCVClick}
                data-onboarding="create-cv"
                className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">{t("cv.createNewCV")}</span>
              </button>
            </div>
          </div>

          {/* Quota Banner — chỉ hiện cho CV tạo bằng Builder */}
          {cvQuota && (
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              cvQuota.remaining === 0
                ? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
                : cvQuota.remaining <= 1
                ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">✏️</span>
                <span className="text-sm font-medium">
                  {cvQuota.remaining === 0
                    ? `Bạn đã dùng hết ${cvQuota.limit}/${cvQuota.limit} lượt tạo CV bằng Builder (gói hiện tại). Vui lòng nâng cấp để tạo thêm.`
                    : `Lượt tạo CV Builder: còn ${cvQuota.remaining}/${cvQuota.limit} lượt trong gói này.`}
                </span>
              </div>
              {cvQuota.remaining === 0 && (
                <button
                  onClick={() => window.location.assign("/pricing?tab=cv")}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-md transition-all self-start sm:self-auto"
                >
                  Nâng cấp gói CV
                </button>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-card border border-border/40 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{cvs.length}</p>
                <p className="text-xs text-muted-foreground">{t("cv.listTotal")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card border border-border/40 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Sparkles className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {createdCount}
                  {cvQuota && (
                    <span className="text-sm font-normal text-muted-foreground ml-1">/ {cvQuota.limit}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">CV tạo mới (Builder)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card border border-border/40 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Upload className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{uploadedCount}</p>
                <p className="text-xs text-muted-foreground">{t("cv.uploadNew")}</p>
              </div>
            </div>
          </div>

          {/* CV List - Horizontal Row Layout */}
          <div>
            <h2 className="text-lg font-semibold mb-4">{t("cv.listTitle")}</h2>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : cvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-card border border-border/40 rounded-xl">
                <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-base font-medium text-muted-foreground">{t("cv.listEmpty")}</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  {t("cv.listEmptyDesc")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Column Headers - hidden on mobile */}
                <div className="hidden md:flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="flex items-center gap-3 w-48 shrink-0">
                    <span>{t("cv.columnCV")}</span>
                  </div>
                  <div className="flex-1">{t("cv.title")}</div>
                  <div className="w-32 shrink-0">{t("cv.date")}</div>
                  <div className="w-72 shrink-0">{t("cv.actions")}</div>
                </div>

                {/* CV Rows */}
                {cvs.map((cv) => (
                  <CVRow key={cv.id} cv={cv} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
