import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft, Loader2, User, Mail, Lock, CheckCircle, Star, Zap, Eye, EyeOff } from "lucide-react";

const schema = z.object({
  full_name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  confirm_password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirm_password"],
});

type CreateCMForm = z.infer<typeof schema>;

// Floating particle component
function FloatingParticle({ delay, duration, left, size, color }: {
  delay: number;
  duration: number;
  left: number;
  size: number;
  color: string;
}) {
  return (
    <div
      className="absolute rounded-full animate-float-particle pointer-events-none"
      style={{
        left: `${left}%`,
        bottom: "-20px",
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        opacity: 0.6,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
    />
  );
}

// Sparkle effect component
function SparkleEffect({ active }: { active: boolean }) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (active) {
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setSparkles(newSparkles);
      const timer = setTimeout(() => setSparkles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || sparkles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        </div>
      ))}
    </div>
  );
}

export default function CreateContentManager() {
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    delay: number;
    duration: number;
    left: number;
    size: number;
    color: string;
  }>>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const form = useForm<CreateCMForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // Generate floating particles
  useEffect(() => {
    const colors = [
      "rgba(99, 102, 241, 0.6)",
      "rgba(168, 85, 247, 0.6)",
      "rgba(59, 130, 246, 0.6)",
      "rgba(34, 197, 94, 0.6)",
      "rgba(249, 115, 22, 0.6)",
    ];
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 8,
      left: Math.random() * 100,
      size: 6 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  async function onSubmit(values: CreateCMForm) {
    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    const { confirm_password, ...submitData } = values;
    try {
      const response = await fetch("/api/admin/content-managers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role ?? "",
          "x-user-id": user?.id ?? "",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Tạo tài khoản thất bại.");
      }

      setSubmitSuccess(true);
      form.reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10" 
        style={{ 
          background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #e0c3fc 100%)",
        }} 
      />
      
      {/* Animated mesh overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(168,85,247,0.2) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(59,130,246,0.2) 0%, transparent 50%)`,
        }}
      />

      {/* Floating particles */}
      <div ref={canvasRef} className="absolute inset-0 -z-5 overflow-hidden">
        {particles.map((p) => (
          <FloatingParticle key={p.id} {...p} />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-purple-300/30 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-300/30 blur-3xl animate-pulse-slow-delayed" />

      {/* Header */}
      <header className="relative mx-auto flex h-16 max-w-7xl items-center px-6">
        <a href="/" className="flex items-center gap-2 group">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", boxShadow: "0 4px 20px rgba(102, 126, 234, 0.5)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-black">
            JobReady AI
          </span>
        </a>
      </header>

      {/* Content */}
      <div className="relative mx-auto max-w-lg px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 transition-transform duration-500 hover:scale-110 hover:rotate-6"
            style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
            }}
          >
            <User className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black animate-text-shimmer">
            Tạo Content Manager
          </h1>
          <p className="text-gray-600 mt-2 animate-pulse">Thêm tài khoản mới cho đội ngũ nội dung</p>
          
          {/* Decorative stars */}
          <div className="flex justify-center gap-4 mt-4">
            <Star className="h-5 w-5 text-yellow-500 animate-twinkle fill-yellow-400" />
            <Zap className="h-5 w-5 text-yellow-500 animate-twinkle-delayed fill-yellow-400" />
            <Star className="h-5 w-5 text-yellow-500 animate-twinkle fill-yellow-400" />
          </div>
        </div>

        {/* Form Card */}
        <Card 
          className="border border-gray-200 shadow-2xl"
          style={{ 
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <CardContent className="p-6">
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit((values) => {
                void onSubmit(values);
              })}
            >
              {/* Sparkle effect on success */}
              <SparkleEffect active={submitSuccess} />

              {/* Full Name */}
              <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
                <label htmlFor="full_name" className="text-sm font-semibold text-black">
                  Họ tên
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-transform duration-300 group-focus-within:scale-125 group-focus-within:text-purple-500" />
                  <Input
                    id="full_name"
                    placeholder="Nhập họ tên đầy đủ"
                    className="pl-10 h-12 bg-white text-black border-gray-300 placeholder:text-gray-400 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 font-medium"
                    {...form.register("full_name")}
                  />
                </div>
                {form.formState.errors.full_name && (
                  <p className="text-sm text-red-500 animate-shake">{form.formState.errors.full_name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
                <label htmlFor="email" className="text-sm font-semibold text-black">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-transform duration-300 group-focus-within:scale-125 group-focus-within:text-blue-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10 h-12 bg-white text-black border-gray-300 placeholder:text-gray-400 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 font-medium"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 animate-shake">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
                <label htmlFor="password" className="text-sm font-semibold text-black">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-transform duration-300 group-focus-within:scale-125 group-focus-within:text-green-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 8 ký tự"
                    className="pl-10 pr-10 h-12 bg-white text-black border-gray-300 placeholder:text-gray-400 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-green-400/50 focus:border-green-400 font-medium"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 animate-shake">{form.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: "0.4s" }}>
                <label htmlFor="confirm_password" className="text-sm font-semibold text-black">
                  Xác nhận mật khẩu
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-transform duration-300 group-focus-within:scale-125 group-focus-within:text-orange-500" />
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    className="pl-10 pr-10 h-12 bg-white text-black border-gray-300 placeholder:text-gray-400 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 font-medium"
                    {...form.register("confirm_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.confirm_password && (
                  <p className="text-sm text-red-500 animate-shake">{form.formState.errors.confirm_password.message}</p>
                )}
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-600 text-sm animate-shake">
                  {submitError}
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="p-3 rounded-lg bg-green-100 border border-green-300 text-green-600 text-sm flex items-center gap-2 animate-bounce-in">
                  <CheckCircle className="h-5 w-5 animate-pulse" />
                  Tạo tài khoản thành công!
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
                style={{ 
                  background: isLoading 
                    ? "rgba(255,255,255,0.2)" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                    Tạo tài khoản
                  </>
                )}
              </Button>

              {/* Back Button */}
              <div className="flex justify-center pt-2">
                <a
                  href="/admin/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black transition-all duration-300 hover:gap-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại Dashboard
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Note */}
        <p className="text-center text-xs text-black/50 mt-6">
          Tài khoản Content Manager có thể quản lý bài viết và nội dung trên hệ thống.
        </p>
      </div>

      {/* Custom CSS animations */}
      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        
        @keyframes pulse-slow-delayed {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.15);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes twinkle-delayed {
          0%, 100% {
            opacity: 1;
            transform: scale(1.2);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }
        
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-twinkle-delayed {
          animation: twinkle-delayed 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
          animation-fill-mode: both;
        }
        
        .animate-sparkle {
          animation: sparkle 1s ease-out forwards;
        }
        
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </main>
  );
}
