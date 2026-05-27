import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  full_name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
});

type CreateCMForm = z.infer<typeof schema>;

export default function CreateContentManager() {
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<CreateCMForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
    },
  });

  async function onSubmit(values: CreateCMForm) {
    setSubmitError(null);
    const response = await fetch("/api/admin/content-managers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": user?.role ?? "",
        "x-user-id": user?.id ?? "",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error ?? "Tạo tài khoản thất bại.");
    }

    window.alert("Tạo tài khoản thành công!");
    form.reset();
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Tạo tài khoản Content Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => {
                void onSubmit(values).catch((submitErrorValue: unknown) => {
                  const message =
                    submitErrorValue instanceof Error
                      ? submitErrorValue.message
                      : "Đã có lỗi xảy ra.";
                  setSubmitError(message);
                });
              })}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...form.register("email")} />
                <FormError message={form.formState.errors.email?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" {...form.register("password")} />
                <FormError message={form.formState.errors.password?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ tên</Label>
                <Input id="full_name" {...form.register("full_name")} />
                <FormError message={form.formState.errors.full_name?.message} />
              </div>

              {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.assign("/admin/dashboard")}
                >
                  Quay lại Dashboard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}
