"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = login(email, password);
    
    if (success) {
      toast.success("Login berhasil!", {
        description: "Selamat datang di Sistem Supervisi Madrasah",
      });
      router.push("/dashboard");
    } else {
      toast.error("Login gagal", {
        description: "Email atau password tidak valid. Gunakan password: demo123",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col hero-gradient">
      {/* Back to Home */}
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4">
              <Image
                src="/images/logo.png"
                alt="Logo Madrasah"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
                loading="eager"
                priority
                unoptimized
              />
            </div>
            <CardTitle className="text-2xl font-bold">Masuk ke Aplikasi</CardTitle>
            <CardDescription>
              Sistem Supervisi Madrasah Online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@madrasah.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Akun Demo (Password: <code className="bg-muted px-1 rounded">demo123</code>)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-muted rounded-lg">
                  <p className="font-medium">Admin</p>
                  <p className="text-muted-foreground truncate">admin@madrasah.sch.id</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="font-medium">Kepala Madrasah</p>
                  <p className="text-muted-foreground truncate">kepsek@madrasah.sch.id</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="font-medium">Waka Kurikulum</p>
                  <p className="text-muted-foreground truncate">waka@madrasah.sch.id</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="font-medium">Pengawas</p>
                  <p className="text-muted-foreground truncate">pengawas@kemenag.go.id</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="font-medium">Guru Mapel</p>
                  <p className="text-muted-foreground truncate">ahmad.h@madrasah.sch.id</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="font-medium">Guru BK</p>
                  <p className="text-muted-foreground truncate">nurul@madrasah.sch.id</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
