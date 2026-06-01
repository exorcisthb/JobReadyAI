import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, BookOpen, Sparkles, AlertCircle, FileText, CheckCircle, ImageOff, Share2, Check, Upload } from "lucide-react";

// FIX 1: Đổi thumbnail_url → image_url để khớp với BlogPage và API
const schema = z.object({
  title: z.string().min(5, "Tiêu đề bài viết tối thiểu 5 ký tự"),
  image_url: z
    .string()
    .refine(
      (val) => val === "" || /^https?:\/\/.+/.test(val) || val.startsWith("/") || val.startsWith("data:image/"),
      "Đường dẫn ảnh không hợp lệ (phải bắt đầu bằng http://, https://, hoặc /uploads/...)"
    )
    .optional()
    .or(z.literal("")),
  category: z.enum(["cv_tips", "interview_tips", "soft_skills", "career", "other"], {
    errorMap: () => ({ message: "Vui lòng chọn danh mục hợp lệ" }),
  }),
  status: z.enum(["draft", "published"]),
  content: z.string().optional().or(z.literal("")),
  source_url: z.string().optional().or(z.literal("")),
});

type CreateArticleForm = z.infer<typeof schema>;

const DEFAULT_BLOG_IMAGE = "https://placehold.co/1200x675/e2e8f0/94a3b8?text=Blog+Career";

export default function CreateArticle({ articleId }: { articleId?: string }) {
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  // FIX 2: State preview ảnh bìa
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isHtmlUrl, setIsHtmlUrl] = useState(false);
  const [isNewsType, setIsNewsType] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("type") === "news") {
      setIsNewsType(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateArticleForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      image_url: "",
      category: "career",
      status: "published",
      content: "",
      source_url: "",
    },
  });

  const currentStatus = watch("status");
  const currentCategory = watch("category");
  const watchedImageUrl = watch("image_url");
  const watchedSourceUrl = watch("source_url");

  // FIX 3: Cập nhật preview mỗi khi URL thay đổi (debounce 600ms tránh fetch liên tục)
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = watchedImageUrl?.trim();
      if (!url || !/^https?:\/\/.+/.test(url)) {
        setImagePreview(null);
        setImageError(false);
        setIsHtmlUrl(false);
        return;
      }
      // Phát hiện URL trỏ đến trang HTML thay vì file ảnh
      const looksLikeHtml =
        /\.(html|htm|php|asp|aspx|jsp)(\?.*)?$/i.test(url) ||
        (!url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?.*)?$/i) &&
          !url.includes("imgur.com") &&
          !url.includes("postimg") &&
          !url.includes("cloudinary") &&
          !url.includes("unsplash") &&
          !url.includes("pexels") &&
          !url.includes("githubusercontent") &&
          !url.includes("googleusercontent") &&
          !url.includes("placehold") &&
          !url.includes("picsum") &&
          !url.match(/\/(image|img|photo|media|upload|cdn)\//i));
      setIsHtmlUrl(looksLikeHtml);
      if (!looksLikeHtml) {
        setImagePreview(url);
        setImageError(false);
      } else {
        setImagePreview(null);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [watchedImageUrl]);

  useEffect(() => {
    if (articleId) {
      const loadArticle = async () => {
        try {
          const response = await fetch(`/api/dashboard/articles/${articleId}`, {
            headers: {
              "x-user-role": user?.role ?? "",
              "x-user-id": user?.id ?? "",
            },
          });
          if (!response.ok) throw new Error("Không thể tải thông tin bài viết.");
          const article = await response.json();

          // FIX 4: Đọc đúng field image_url (trước đây là thumbnail_url)
          reset({
            title: article.title,
            image_url: article.image_url || "",
            category: article.category,
            status: article.status,
            content: article.content,
            source_url: article.source_url || "",
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu.";
          setSubmitError(message);
        }
      };
      void loadArticle();
    }
  }, [articleId, reset, user?.id, user?.role]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size (10MB)
    if (!file.type.startsWith("image/")) {
      setSubmitError("Vui lòng chọn file hình ảnh hợp lệ");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSubmitError("Dung lượng ảnh vượt quá 10MB");
      return;
    }

    setIsUploading(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "x-user-role": user?.role ?? "",
          "x-user-id": user?.id ?? "",
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Lỗi tải ảnh lên");
      }

      setValue("image_url", data.url, { shouldValidate: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setSubmitError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleScrape = async () => {
    const url = watchedSourceUrl?.trim();
    if (!url) return;
    setIsScraping(true);
    try {
      const response = await fetch("/api/dashboard/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role ?? "",
          "x-user-id": user?.id ?? "",
        },
        body: JSON.stringify({ url }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.title && !watch("title")) setValue("title", data.title, { shouldValidate: true });
        if (data.image) {
          setValue("image_url", data.image, { shouldValidate: true });
        }
      }
    } catch (error) {
      console.error("Scrape error:", error);
    } finally {
      setIsScraping(false);
    }
  };

  async function onSubmit(values: CreateArticleForm) {
    setSubmitError(null);
    setSuccess(false);

    if (!isNewsType && (!values.content || values.content.length < 20)) {
      setSubmitError("Nội dung bài viết tối thiểu 20 ký tự");
      return;
    }
    if (isNewsType && !values.source_url) {
      setSubmitError("Vui lòng nhập đường dẫn bài báo nguồn");
      return;
    }

    try {
      const url = articleId ? `/api/dashboard/articles/${articleId}` : "/api/dashboard/articles";
      const method = articleId ? "PUT" : "POST";

      // FIX 5: Gửi đúng field image_url, không để undefined
      const payload = {
        ...values,
        image_url: values.image_url?.trim() || "",
        source_url: values.source_url?.trim() || "",
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role ?? "",
          "x-user-id": user?.id ?? "",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            "Dung lượng ảnh bìa (base64) quá lớn. Vui lòng sử dụng đường dẫn URL ảnh hoặc ảnh có dung lượng nhỏ hơn (dưới 10MB)."
          );
        }
        const errPayload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errPayload.error ?? "Không thể lưu bài viết.");
      }

      setSuccess(true);
      reset();
      window.setTimeout(() => {
        const redirectPath =
          user?.role === "admin" ? "/admin/dashboard" : "/content-manager/dashboard";
        window.location.assign(redirectPath);
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setSubmitError(message);
    }
  }

  const handleBack = () => {
    const redirectPath =
      user?.role === "admin" ? "/admin/dashboard" : "/content-manager/dashboard";
    window.location.assign(redirectPath);
  };

  const handleShare = async () => {
    if (!articleId) return;
    
    const url = `${window.location.origin}/blog/${articleId}`;
    const shareData = {
      title: watch("title") || "Bài viết",
      text: `Đọc bài viết "${watch("title") || "này"}" trên JobReadyAI - Nền tảng tuyển dụng thông minh.\n`,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Quay lại Dashboard
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            Trình soạn thảo bài viết
          </div>
        </div>

        <Card className="border border-border/40 bg-card/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-6 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  {articleId ? (isNewsType ? "Chỉnh sửa bài báo" : "Chỉnh sửa bài viết") : (isNewsType ? "Thêm bài báo mới" : "Viết bài viết mới")}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {isNewsType ? "Chia sẻ các bài báo hay từ nguồn bên ngoài." : "Chia sẻ kiến thức, mẹo phỏng vấn và kỹ năng nghề nghiệp."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce" />
                <h3 className="text-xl font-bold text-emerald-500">
                  {articleId ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!"}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Đang đồng bộ dữ liệu và quay trở về trang quản lý của bạn...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Tiêu đề */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold text-sm">
                    Tiêu đề bài viết *
                  </Label>
                  <Input
                    id="title"
                    placeholder="VD: 7 Câu Hỏi Phỏng Vấn Thường Gặp Và Cách Trả Lời Hay"
                    className="h-11 rounded-xl"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Danh mục */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-semibold text-sm">
                      Danh mục bài viết *
                    </Label>
                    <select
                      id="category"
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      value={currentCategory}
                      onChange={(e) => setValue("category", e.target.value as CreateArticleForm["category"])}
                    >
                      <option value="cv_tips">Tiêu chí chọn CV</option>
                      <option value="interview_tips">Mẹo phỏng vấn</option>
                      <option value="soft_skills">Kỹ năng nghề nghiệp</option>
                      <option value="career">Tiêu chí xin việc</option>
                      <option value="other">Xu hướng tuyển dụng</option>
                    </select>
                    {errors.category && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Trạng thái xuất bản */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">Trạng thái xuất bản *</Label>
                    <div className="flex bg-muted/30 rounded-xl p-1 border border-border/30 h-11 items-center">
                      <button
                        type="button"
                        onClick={() => setValue("status", "published")}
                        className={`flex-1 h-full rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          currentStatus === "published"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Công khai ngay
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue("status", "draft")}
                        className={`flex-1 h-full rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          currentStatus === "draft"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Lưu bản nháp
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ảnh bìa với preview và hướng dẫn rõ ràng */}
                <div className="space-y-2">
                  {!isNewsType && (
                    <>
                      <Label htmlFor="image_url" className="font-semibold text-sm">
                        Đường dẫn ảnh bìa (Image URL)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="image_url"
                          placeholder="https://example.com/hinh-anh.jpg hoặc .png, .webp..."
                          className="h-11 rounded-xl flex-1"
                          {...register("image_url")}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="h-11 px-4 rounded-xl shrink-0"
                        >
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                          {isUploading ? "Đang tải..." : "Tải ảnh lên"}
                        </Button>
                      </div>

                      {errors.image_url && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.image_url.message}
                        </p>
                      )}
                    </>
                  )}

                  {/* Preview ảnh bìa */}
                  {(imagePreview || !isNewsType) && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-border/40 bg-muted aspect-video relative">
                      {imagePreview && !imageError ? (
                        <img
                          src={imagePreview}
                          alt="Xem trước ảnh bìa"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : imageError ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                          <ImageOff className="h-8 w-8" />
                          <p className="text-xs font-medium">Không thể tải ảnh từ URL này</p>
                          <p className="text-xs text-center px-8">Ảnh có thể bị chặn do CORS. Hãy thử dùng CDN link trực tiếp từ imgur.com hoặc postimages.org.</p>
                        </div>
                      ) : (
                        <img
                          src={DEFAULT_BLOG_IMAGE}
                          alt="Ảnh bìa mặc định"
                          className="w-full h-full object-cover opacity-40"
                        />
                      )}
                      {!imagePreview && !imageError && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-xs text-muted-foreground">Xem trước ảnh bìa</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Nội dung chính hoặc Đường dẫn nguồn tùy loại */}
                {isNewsType ? (
                  <div className="space-y-2">
                    <Label htmlFor="source_url" className="font-semibold text-sm">
                      Đường dẫn bài báo nguồn (Link gốc) *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="source_url"
                        placeholder="https://vnexpress.net/..."
                        className="h-11 rounded-xl flex-1"
                        {...register("source_url")}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={!watchedSourceUrl || isScraping}
                        onClick={handleScrape}
                        className="h-11 px-4 rounded-xl shrink-0"
                      >
                        {isScraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        {isScraping ? "Đang lấy..." : "Lấy dữ liệu"}
                      </Button>
                    </div>
                    {errors.source_url && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.source_url.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label
                      htmlFor="content"
                      className="font-semibold text-sm flex justify-between"
                    >
                      <span>Nội dung bài viết *</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        Hỗ trợ định dạng văn bản thường
                      </span>
                    </Label>
                    <textarea
                      id="content"
                      rows={12}
                      placeholder="Hãy viết nội dung bài viết tại đây..."
                      className="flex min-h-[250px] w-full rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register("content")}
                    />
                    {errors.content && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.content.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Error */}
                {submitError && (
                  <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Nút hành động */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl h-11 px-6 bg-gradient-to-r from-primary to-accent-mint hover:opacity-90 text-white font-semibold transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : articleId ? (
                      <>
                        <FileText className="h-4 w-4" />
                        Cập nhật bài viết
                      </>
                    ) : currentStatus === "published" ? (
                      <>
                        <FileText className="h-4 w-4" />
                        Xuất bản bài viết
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Lưu bản nháp
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-xl h-11 px-6 text-sm font-semibold border-border/60 hover:bg-secondary transition-all"
                  >
                    Hủy bỏ
                  </Button>
                  
                  {articleId && currentStatus === "published" && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleShare}
                      className="rounded-xl h-11 px-6 text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/20 ml-auto flex items-center gap-2 transition-all"
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                      {isCopied ? "Đã sao chép link" : "Chia sẻ bài viết"}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}