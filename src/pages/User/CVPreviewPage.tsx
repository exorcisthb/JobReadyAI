import { useEffect, useState } from "react";
import { ArrowLeft, Download, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { getTemplateMetadata } from "@/data/cv-templates";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function CVPreviewPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const { user } = useAuth();
  const [cvData, setCvData] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [TemplateComponent, setTemplateComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplateColors, setSelectedTemplateColors] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(1);

  useEffect(() => {
    const loadCV = async () => {
      try {
        const cvId = searchParams.get("cv_id");
        const draftId = searchParams.get("draft");

        // Case 1: Load from localStorage (draft)
        if (draftId) {
          const saved = localStorage.getItem("cv-drafts");
          if (saved) {
            try {
              const drafts = JSON.parse(saved);
              const draft = drafts.find((d: any) => d.id === draftId);
              
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
            } catch (err) {
              console.error("Error parsing draft:", err);
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

  const handleDownload = async () => {
    const cvElement = document.getElementById("cv-preview-container");
    if (!cvElement) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV_${cvData?.fullName || "Document"}.pdf`);
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Có lỗi xảy ra khi tải CV. Vui lòng thử lại.");
    } finally {
      setDownloading(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
          <p className="text-slate-300 text-lg">Đang tải CV...</p>
        </div>
      </div>
    );
  }

  if (!template || !cvData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-slate-700/50">
              <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-slate-300 mb-6 text-lg">Không tìm thấy CV</p>
          <Button 
            onClick={() => window.location.assign("/cv")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Quay lại danh sách CV
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>

            <div className="flex items-center gap-3">
              {template?.type !== "uploaded" && TemplateComponent && (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống PDF
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview - Full A4 size, scrollable */}
      <div className="relative container mx-auto px-4 py-12 flex justify-center">
        {template?.type === "uploaded" ? (
          <div className="flex flex-col items-center gap-4 relative z-10">
            {cvData?.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              // Nếu là ảnh thì dùng img tag
              <img
                src={cvData.file_url}
                alt={cvData.title || "CV"}
                className="w-[794px] shadow-2xl rounded-lg"
              />
            ) : (
              // Nếu là PDF thì dùng react-pdf
              <Document
                file={cvData?.file_url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Page
                    key={index + 1}
                    pageNumber={index + 1}
                    width={794}
                    className="mb-4 shadow-2xl"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            )}
          </div>
        ) : TemplateComponent ? (
          // Created CV - render with template
          <div className="relative z-10">
            {/* Glow effect behind CV */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-3xl -z-10 scale-110"></div>
            
            <div
              id="cv-preview-container"
              className="w-[595px] h-[842px] bg-white shadow-2xl rounded-lg overflow-hidden ring-1 ring-slate-700/50"
              style={{ minHeight: "842px" }}
            >
              <TemplateComponent
                data={cvData}
                onChange={() => {}}
                template={selectedTemplateColors || template}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <p className="mb-4">Đang tải template...</p>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
