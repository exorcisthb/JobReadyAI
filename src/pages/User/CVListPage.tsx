import { useEffect, useState, useCallback, memo, useMemo } from "react";
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
  Download,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";

interface CVItem {
  id: string;
  title: string;
  file_name: string;
  file_url?: string;
  uploaded_at: string;
  type: "uploaded" | "created";
  content?: Record<string, unknown>;
}

const cvNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/user/dashboard" },
  { label: "Phỏng vấn", icon: <FileText className="h-5 w-5" />, href: "/interview/config" },
  { label: "Xem CV", icon: <FileText className="h-5 w-5" />, href: "/cv" },
  { label: "Luyện tập", icon: <FileText className="h-5 w-5" />, href: "/practice" },
];

const CVCard = memo(
  ({
    cv,
    onDelete,
    onView,
  }: {
    cv: CVItem;
    onDelete: (id: string) => void;
    onView: (cv: CVItem) => void;
  }) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return (
      <Card className="border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
        <div
          className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl ${
            cv.type === "created"
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-primary to-violet-500"
          }`}
        />

        <CardHeader className="pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
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
              <div className="min-w-0">
                <CardTitle className="text-sm font-semibold truncate">{cv.title}</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {cv.type === "created" ? "CV tu template" : cv.file_name}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${
                cv.type === "created"
                  ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                  : "border-primary/30 bg-primary/5 text-primary"
              }`}
            >
              {cv.type === "created" ? "Tao" : "Upload"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(cv.uploaded_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 rounded-lg h-9 text-xs font-medium flex items-center gap-1.5 border border-border/50 hover:bg-secondary transition-all"
              onClick={() => onView(cv)}
            >
              <Eye className="h-3.5 w-3.5" />
              Xem
            </Button>
            {cv.file_url && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded-lg h-9 text-xs font-medium flex items-center gap-1.5 border border-border/50 hover:bg-secondary transition-all"
                onClick={() => window.open(cv.file_url, "_blank")}
              >
                <Download className="h-3.5 w-3.5" />
                Tải
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0 rounded-lg border border-border/50 hover:bg-red-50 hover:text-red-500 hover:border-red-500/30 dark:hover:bg-red-950/20 transition-all"
              onClick={() => onDelete(cv.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
);

function UploadModal({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, title: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    // Accept PDF and images for CV
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB for images

    if (!allowedTypes.includes(file.type)) {
      setError("Chi chap nhan file PDF hoac hinh anh (JPG, PNG, GIF, WEBP)");
      return false;
    }
    if (file.size > maxSize) {
      setError("File qua lon (toi da 10MB)");
      return false;
    }
    setError("");
    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setError("Vui lòng chọn file và nhập tiêu đề");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await onUpload(selectedFile, title.trim());
      setSuccess("Tải lên CV thành công!");
      setSelectedFile(null);
      setTitle("");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải lên thất bại");
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
              <h2 className="text-lg font-bold">Tải lên CV</h2>
              <p className="text-xs text-muted-foreground">Đăng tải CV từ máy tính</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            ✕
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
                <p className="text-sm font-medium mb-1">Keo tha file vao day hoac click de chon</p>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, PNG, GIF, WEBP (toi da 10MB)
                </p>
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Tiêu đề CV
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-4 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="VD: CV Fresher Frontend 2024"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
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
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Tải lên CV
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CVListPage() {
  const { user, logout } = useAuth();
  const [cvs, setCVs] = useState<CVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

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
        const uploadedCVs = (data.cvs || []).map((cv: Record<string, unknown>) => ({
          ...cv,
          type: "uploaded" as const,
        }));
        setCVs(uploadedCVs);
      }
    } catch (err) {
      console.error("Failed to fetch CVs:", err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const handleUpload = async (file: File, title: string) => {
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

    if (!response.ok) {
      throw new Error("Tải lên CV thất bại");
    }

    await fetchCVs();
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Xóa thất bại");
      await fetchCVs();
    } catch (err) {
      setError("Xóa CV thất bại");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleView = (cv: CVItem) => {
    if (cv.type === "uploaded" && cv.file_url) {
      window.open(cv.file_url, "_blank");
    } else if (cv.type === "created") {
      window.location.assign(`/cv/create?id=${cv.id}`);
    }
  };

  useEffect(() => {
    void fetchCVs();
  }, [fetchCVs]);

  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  const uploadedCount = cvs.filter((cv) => cv.type === "uploaded").length;
  const createdCount = cvs.filter((cv) => cv.type === "created").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader navItems={cvNavItems} activePath="/cv" role="user" onLogout={handleLogout} />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-8 space-y-6"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Header with Title and Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Hồ sơ CV của bạn</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Xem, tạo mới hoặc tải lên CV để sử dụng cho các buổi phỏng vấn.
              </p>
            </div>

            {/* Action Buttons - Top Right */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted transition-all duration-300 cursor-pointer"
              >
                <Upload className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Upload CV</span>
              </button>

              <button
                onClick={() => window.location.assign("/cv/create")}
                className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Tạo CV mới</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{cvs.length}</p>
                  <p className="text-xs text-muted-foreground">Tổng CV</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xl font-bold">{createdCount}</p>
                  <p className="text-xs text-muted-foreground">Đã tạo</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                  <Upload className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-xl font-bold">{uploadedCount}</p>
                  <p className="text-xs text-muted-foreground">Đã upload</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CV List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Danh sách CV của bạn</h2>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : cvs.length === 0 ? (
              <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-base font-medium text-muted-foreground">Chưa có CV nào</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    Tạo mới hoặc tải lên CV để bắt đầu
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cvs.map((cv) => (
                  <CVCard key={cv.id} cv={cv} onDelete={handleDelete} onView={handleView} />
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
