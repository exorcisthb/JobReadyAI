import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, Download, Edit, Loader2, FileDown, Image, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { getTemplateMetadata } from "@/data/cv-templates";
import { getDraftById } from "@/lib/draft-storage";
import { useTranslation } from "react-i18next";
import logoJr from "@/assets/logo-jr.png";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";


export default function CVPreviewPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const { user } = useAuth();
  const [cvData, setCvData] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [TemplateComponent, setTemplateComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>("");
  const [selectedTemplateColors, setSelectedTemplateColors] = useState<any>(null);
  const [cvPlan, setCvPlan] = useState<string>("free");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadCV = async () => {
      try {
        const cvId = searchParams.get("cv_id");
        const draftId = searchParams.get("draft");

        // Case 1: Load from localStorage (draft, scoped by user)
        if (draftId) {
          const draft = user?.id ? getDraftById(user.id, draftId) : undefined;
          if (draft) {
            setCvData(draft.data);
            setTemplate(draft.template);

            // Set color scheme
            const firstColorScheme = draft.template?.colors?.[0] || draft.template || {
              primaryColor: draft.template?.primaryColor || "#1e293b",
              secondaryColor: draft.template?.secondaryColor || "#334155",
              accentColor: draft.template?.accentColor || "#0ea5e9",
              textColor: draft.template?.textColor || "#FFFFFF"
            };

            setSelectedTemplateColors({
              ...draft.template,
              primaryColor: firstColorScheme.primaryColor,
              secondaryColor: firstColorScheme.secondaryColor,
              accentColor: firstColorScheme.accentColor,
              textColor: firstColorScheme.textColor
            });

            // Load template component
            if (draft.template?.layout) {
              try {
                const builderModule = await import("@/pages/User/CVBuilderPage");
                const component = builderModule.getTemplateComponent(draft.template.layout);
                if (component) {
                  setTemplateComponent(() => component);
                }
              } catch (error) {
                console.error("Failed to load template component:", error);
              }
            }
          }
        }
        // Case 2: Load from database API (saved CV)
        else if (cvId) {
          // Load CV from database via API
          const response = await fetch(`/api/cv/${cvId}`, {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user?.id || "",
              "x-user-role": user?.role || "user",
            },
          });

          if (response.ok) {
            const cvFromDb = await response.json();
            
            if (cvFromDb.type === "uploaded" && cvFromDb.file_url) {
              // For uploaded CV, show in iframe
              setCvData({ type: "uploaded", file_url: cvFromDb.file_url, title: cvFromDb.title });
              setTemplate({ type: "uploaded" } as any);
            } else if (cvFromDb.type === "created" && cvFromDb.content) {
              // For created CV, load template component and render
              const parsedContent = typeof cvFromDb.content === "string" 
                ? JSON.parse(cvFromDb.content) 
                : cvFromDb.content;
              
              setCvData(parsedContent);
              
              // Load template metadata and component
              if (cvFromDb.template_id) {
                const templateMeta = getTemplateMetadata(cvFromDb.template_id);
                if (templateMeta) {
                  setTemplate(templateMeta);
                  
                  // Use the first color scheme as default
                  const firstColorScheme = templateMeta.colors?.[0] || {
                    primaryColor: "#1e293b",
                    secondaryColor: "#334155",
                    accentColor: "#0ea5e9",
                    textColor: "#FFFFFF"
                  };
                  
                  setSelectedTemplateColors({
                    ...templateMeta,
                    ...firstColorScheme
                  });
                  
                  // Dynamically load template component from CVBuilderPage
                  try {
                    const builderModule = await import("@/pages/User/CVBuilderPage");
                    const component = builderModule.getTemplateComponent(templateMeta.layout);
                    if (component) {
                      setTemplateComponent(() => component);
                    }
                  } catch (error) {
                    console.error("Failed to load template component:", error);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading CV:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCV();
  }, [searchParams, user]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchPlan = async () => {
      try {
        const response = await fetch("/api/subscription/me", {
          headers: {
            "x-user-id": user.id || "",
            "x-user-role": user.role || "user",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCvPlan(data.planCv || "free");
        }
      } catch (err) {
        console.error("Error fetching CV plan:", err);
      }
    };
    void fetchPlan();
  }, [user?.id, user?.role]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    const cvElement = document.getElementById("cv-preview-container");
    if (!cvElement) {
      alert("Không tìm thấy nội dung CV để xuất.");
      return;
    }

    setDownloading(true);
    setExportProgress("Đang tạo CV...");

    try {
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      setExportProgress("Đang xuất PDF...");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const fileName = `CV_${cvData?.fullName || "Document"}.pdf`;
      pdf.save(fileName);

      console.log("✅ PDF downloaded successfully!");
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      alert(t("cv.previewDownloadError") || "Không thể tải CV. Vui lòng thử lại.");
    } finally {
      setDownloading(false);
      setExportProgress("");
    }
  };

  const handleDownloadPNG = async () => {
    const cvElement = document.getElementById("cv-preview-container");
    if (!cvElement) {
      alert("Không tìm thấy nội dung CV để xuất.");
      return;
    }

    setDownloading(true);
    try {
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `CV_${cvData?.fullName || "Document"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PNG:", error);
      alert("Không thể tải ảnh CV. Vui lòng thử lại.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownload = async () => {
    // This function is kept for backward compatibility but redirects to new PDF handler
    await handleDownloadPDF();
  };

  const handleEdit = () => {
    const draftId = searchParams.get("draft");
    const cvId = searchParams.get("cv_id");
    
    // Save current CV data and template to sessionStorage for CVBuilderPage to load
    if (cvData && template) {
      sessionStorage.setItem("resume-draft", JSON.stringify({
        data: cvData,
        template: selectedTemplateColors || template,
        draftId: draftId || undefined
      }));
    }
    
    // Redirect to CV Builder
    if (draftId) {
      window.location.assign("/user/cv-builder");
    } else if (cvId) {
      window.location.assign(`/user/cv-builder?cv_id=${cvId}`);
    } else {
      window.location.assign("/user/cv-builder");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/cv-preview-bg.png')] bg-cover bg-center bg-no-repeat"></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-900/80"></div>

        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          <p className="text-slate-300 text-lg">{t("cv.previewLoading")}</p>
        </div>
      </div>
    );
  }

  if (!template || !cvData) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/cv-preview-bg.png')] bg-cover bg-center bg-no-repeat"></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-900/80"></div>
        <div className="text-center relative z-10">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-slate-700/50">
              <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-slate-300 mb-6 text-lg">{t("cv.previewNotFound")}</p>
          <Button 
            onClick={() => window.location.assign("/cv")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {t("cv.previewBackToList")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/cv-preview-bg.png')] bg-cover bg-center bg-no-repeat"></div>

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-slate-900/40"></div>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-purple-500/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary rounded-full border-2 border-primary bg-transparent transition-all duration-300 ease-out hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("cv.previewBack")}
            </Button>

            <div className="flex items-center gap-3">
              {/* Download button for all CV types */}
              {template?.type === "uploaded" ? (
                // Uploaded CV: open file in new tab
                cvData?.file_url && (
                  <Button
                    onClick={() => window.open(cvData.file_url, "_blank")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t("cv.previewDownloadPdf")}
                  </Button>
                )
              ) : TemplateComponent && (
                <>
                  {/* Edit button — uses theme primary color (user's chosen theme) */}
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 ease-out transform hover:scale-102 hover:brightness-110 active:scale-95 font-medium"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t("cv.previewEdit")}
                  </Button>
                  
                  {/* Download button with dropdown menu */}
                  <div className="relative" ref={downloadMenuRef}>
                    <Button
                      onClick={() => !downloading && setShowDownloadMenu(!showDownloadMenu)}
                      disabled={downloading}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 hover:shadow-lg hover:shadow-purple-500/50 text-white border-0 transition-all duration-300 ease-out transform hover:scale-102 active:scale-95 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
                    >
                      {downloading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {exportProgress || t("cv.previewDownloading")}
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          {t("cv.previewDownloadPdf")}
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                    
                    {showDownloadMenu && !downloading && (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
                        <div className="p-1">
                          <button
                            onClick={() => {
                              setShowDownloadMenu(false);
                              handleDownloadPDF();
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          >
                            <FileDown className="h-4 w-4" />
                            <span>Tải xuống PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowDownloadMenu(false);
                              handleDownloadPNG();
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          >
                            <Image className="h-4 w-4" />
                            <span>Tải xuống ảnh (PNG)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview - Full A4 size, zoomable and scrollable */}
      <div className="relative container mx-auto px-4 py-8 flex justify-center">
        {template?.type === "uploaded" ? (
          <div className="flex flex-col items-center gap-4 relative z-10">
            {cvData?.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              // Hình ảnh
              <img
                src={cvData.file_url}
                alt={cvData.title || "CV"}
                className="w-[794px] shadow-2xl rounded-lg"
              />
            ) : cvData?.file_url ? (
              // PDF — dùng <embed> thay vì <object> vì Chrome bị lỗi màn hình trắng khi dùng <object> kèm hash (#toolbar=0)
              <embed
                src={`${cvData.file_url}#toolbar=0&navpanes=0`}
                type="application/pdf"
                className="w-[794px] h-[1123px] max-w-full rounded-lg shadow-2xl border-0 bg-white"
              />
            ) : (
              <div className="text-slate-400 text-center py-12">
                <p className="text-lg mb-4">⚠️ Không tìm thấy file CV đã upload.</p>
                <p className="text-sm">File có thể đã bị xóa hoặc liên kết hết hạn.</p>
              </div>
            )}
          </div>
        ) : TemplateComponent ? (
          // Created CV — scale to fit screen, maintain A4 ratio
          <div className="relative z-10 w-full" style={{ maxWidth: "min(680px, calc(90vh * 210 / 297))" }}>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-3xl -z-10 scale-110"></div>

            <div className="bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-slate-700/50">
              {/* CV Content — A4 aspect ratio */}
              <div
                id="cv-preview-container"
                className="w-full cv-template-container-bg relative"
                style={{
                  aspectRatio: "210/297",
                  "--cv-font-family": cvData?.fontFamily || "'Segoe UI', sans-serif",
                  "--cv-line-spacing": cvData?.lineHeight || 1.4,
                  "--cv-background": (!cvData?.background || cvData?.background === "none") ? "#ffffff" : cvData?.background,
                  background: (!cvData?.background || cvData?.background === "none") ? "#ffffff" : cvData?.background,
                } as React.CSSProperties}
              >
                <div className={`w-full h-full cv-template-container cv-size-${cvData?.fontSize || "medium"}`}>
                  <TemplateComponent
                    data={cvData}
                    onChange={() => {}}
                    template={selectedTemplateColors || template}
                  />
                </div>

                {cvPlan === "free" && (
                  <div className="absolute bottom-3 right-4 flex items-center justify-center opacity-60 pointer-events-none select-none z-50 bg-white/90 p-1.5 rounded-full border border-slate-200/80 shadow-sm">
                    <img src={logoJr} alt="JobReady AI" className="h-5 w-5 object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <p className="mb-4">{t("cv.previewLoadingTemplate")}</p>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
