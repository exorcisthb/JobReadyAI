import { useState, useEffect } from "react";
import { FileText, Trash2, Clock, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { userNavItems } from "@/pages/User/user-nav-items";
import { useAuth } from "@/components/auth-provider";

interface DraftCV {
  id: string;
  title: string;
  templateName: string;
  lastModified: string;
  data: any;
  template: any;
}

export default function DraftCVPage() {
  const [drafts, setDrafts] = useState<DraftCV[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    const saved = localStorage.getItem("cv-drafts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDrafts(parsed);
      } catch (err) {
        console.error("Lỗi load CV nháp:", err);
      }
    }
  };

  const handleEdit = (draft: DraftCV) => {
    // Save draft to sessionStorage for CVBuilderPage to pick up
    sessionStorage.setItem("resume-draft", JSON.stringify({
      data: draft.data,
      template: draft.template,
      draftId: draft.id
    }));
    window.location.href = "/user/cv-builder";
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa CV nháp này?")) return;
    
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("cv-drafts", JSON.stringify(updated));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Vừa xong";
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        navItems={userNavItems} 
        role={(user?.role as "admin" | "content_manager" | "user") || "user"}
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => window.location.href = "/user/dashboard"}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">CV Nháp</h1>
            <p className="text-sm text-gray-600 mt-1">
              Các CV chưa hoàn thành sẽ được tự động lưu vào đây
            </p>
          </div>
          <Button
            onClick={() => window.location.href = "/user/cv-builder"}
            className="gap-2"
            style={{ background: "var(--gradient-hero)" }}
          >
            <FileText className="h-4 w-4" />
            Tạo CV mới
          </Button>
        </div>

        {drafts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có CV nháp nào
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Khi bạn bắt đầu tạo CV, nó sẽ tự động được lưu vào đây
            </p>
            <Button
              onClick={() => window.location.href = "/user/cv-builder"}
              style={{ background: "var(--gradient-hero)" }}
            >
              Tạo CV đầu tiên
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center"
                        style={{ background: draft.template?.primaryColor || "#6366f1" }}
                      >
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {draft.title || "CV chưa có tiêu đề"}
                        </h3>
                        <p className="text-xs text-gray-500">{draft.templateName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(draft.lastModified)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        const params = new URLSearchParams({
                          draft: draft.id
                        });
                        window.location.href = `/cv/preview?${params.toString()}`;
                      }}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Xem trước
                    </Button>
                    <Button
                      onClick={() => handleEdit(draft)}
                      size="sm"
                      className="flex-1 gap-2"
                      style={{ background: "var(--gradient-hero)" }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      onClick={() => handleDelete(draft.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
