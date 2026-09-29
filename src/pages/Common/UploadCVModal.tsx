import { useState, useRef, memo, useCallback } from "react";
import { X, FileText, Upload, CheckCircle, AlertCircle, File, Trash2 } from "lucide-react";
import { OrbitalLoader } from "@/components/ui/orbital-loader";
import { useTranslation } from "react-i18next";
import { AnimatedDeleteButton } from "@/components/AnimatedDeleteButton";

interface UploadCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, title: string) => Promise<void>;
  existingCVs?: Array<{ id: string; title: string; file_name: string; uploaded_at: string }>;
  onDelete?: (id: string) => Promise<void>;
}

function UploadCVModal({
  isOpen,
  onClose,
  onUpload,
  existingCVs = [],
  onDelete,
}: UploadCVModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
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
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024;

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
      await onUpload(selectedFile, title.trim());
      setSuccess(t("cv.uploadSuccess"));
      setSelectedFile(null);
      setTitle("");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cv.uploadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const isProcessing = loading && !success;

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    try {
      await onDelete(id);
    } catch {
      setError(t("cv.uploadDeleteFailed"));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <FileText className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{t("cv.uploadManage")}</h2>
              <p className="text-xs text-slate-400">{t("cv.uploadDesc")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto p-6 space-y-6">
          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 rounded-b-2xl">
              <OrbitalLoader
                message={t("cv.uploadProcessing")}
                messagePlacement="bottom"
              />
            </div>
          )}

          {/* Upload Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">{t("cv.uploadNew")}</h3>

            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isProcessing ? "pointer-events-none opacity-50" : ""
              } ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/5"
                  : selectedFile
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <File className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-200">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setTitle("");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 mx-auto mb-3">
                    <Upload className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-300 mb-1">
                    {t("cv.uploadDragDrop")}
                  </p>
                  <p className="text-xs text-slate-500">{t("cv.uploadFileTypes")}</p>
                </>
              )}
            </div>

            {/* Title Input */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{t("cv.uploadTitle")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full h-10 px-4 rounded-lg bg-slate-800 border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${
                  isProcessing ? "pointer-events-none opacity-50" : "border-slate-700"
                }`}
                placeholder={t("cv.uploadPlaceholder")}
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !title.trim() || loading}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("cv.uploadUploading")}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {t("cv.uploadButton")}
                </>
              )}
            </button>

            {/* Error/Success Messages */}
            {error && !isProcessing && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {success}
              </div>
            )}
          </div>

          {/* Existing CVs */}
          {existingCVs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-3">
                {t("cv.uploadExisting", { count: existingCVs.length })}
              </h3>
              <div className="space-y-2">
                {existingCVs.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                        <FileText className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{cv.title}</p>
                        <p className="text-xs text-slate-500 truncate">{cv.file_name}</p>
                        <p className="text-xs text-slate-600">
                          {t("cv.uploadUploadedAt")} {formatDate(cv.uploaded_at)}
                        </p>
                      </div>
                    </div>
                    <AnimatedDeleteButton
                      size="sm"
                      text="Xóa"
                      onDelete={() => handleDelete(cv.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(UploadCVModal);
