"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Users,
  ClipboardCheck,
  FileText,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore, canSupervise, canViewAllReports, canManageUsers } from "@/lib/store";
import { ROLE_NAMES } from "@/lib/types";

export default function DashboardPage() {
  const { currentUser, users, supervisions } = useAppStore();

  const stats = useMemo(() => {
    const totalGuru = users.filter(
      (u) => u.role === "guru_mapel" || u.role === "guru_bk"
    ).length;
    const totalSupervisi = supervisions.length;
    const completedSupervisi = supervisions.filter(
      (s) => s.status === "completed" || s.status === "reviewed"
    ).length;
    const pendingSupervisi = supervisions.filter(
      (s) => s.status === "draft" || s.status === "in_progress"
    ).length;

    return { totalGuru, totalSupervisi, completedSupervisi, pendingSupervisi };
  }, [users, supervisions]);

  const recentSupervisions = useMemo(() => {
    let filtered = supervisions;
    
    // If user is a teacher, only show their supervisions
    if (currentUser?.role === "guru_mapel" || currentUser?.role === "guru_bk") {
      filtered = supervisions.filter((s) => s.guru_id === currentUser.id);
    }

    return filtered.slice(0, 5);
  }, [supervisions, currentUser]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      draft: { variant: "outline", label: "Draft" },
      in_progress: { variant: "secondary", label: "Berlangsung" },
      completed: { variant: "default", label: "Selesai" },
      reviewed: { variant: "default", label: "Direview" },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isAdmin = currentUser?.role === "admin";
  const isSupervisor = currentUser ? canSupervise(currentUser.role) : false;
  const isTeacher = currentUser?.role === "guru_mapel" || currentUser?.role === "guru_bk";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-primary/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Selamat Datang, {currentUser?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentUser ? ROLE_NAMES[currentUser.role] : ""} - Sistem Supervisi Madrasah Online
            </p>
          </div>
          {isSupervisor && (
            <Link href="/dashboard/supervisi/new">
              <Button>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Mulai Supervisi Baru
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {(isAdmin || isSupervisor) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuru}</div>
              <p className="text-xs text-muted-foreground">
                Guru Mapel & Guru BK
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Supervisi</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSupervisi}</div>
              <p className="text-xs text-muted-foreground">
                Sesi supervisi tercatat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.completedSupervisi}</div>
              <p className="text-xs text-muted-foreground">
                Supervisi telah selesai
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Proses</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{stats.pendingSupervisi}</div>
              <p className="text-xs text-muted-foreground">
                Masih dalam proses
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teacher Stats */}
      {isTeacher && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Supervisi Saya</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {supervisions.filter((s) => s.guru_id === currentUser?.id).length}
              </div>
              <p className="text-xs text-muted-foreground">Total sesi supervisi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">-</div>
              <p className="text-xs text-muted-foreground">Belum ada data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Aktif</div>
              <p className="text-xs text-muted-foreground">
                {currentUser?.role === "guru_bk" ? "Guru BK" : currentUser?.mata_pelajaran || "Guru Mapel"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Supervisions */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Supervisi Terbaru</CardTitle>
              <CardDescription>Daftar supervisi yang baru dilakukan</CardDescription>
            </div>
            <Link href="/dashboard/hasil">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentSupervisions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada data supervisi</p>
                {isSupervisor && (
                  <Link href="/dashboard/supervisi/new" className="mt-4 inline-block">
                    <Button variant="outline" size="sm">
                      Mulai Supervisi Pertama
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recentSupervisions.map((supervision) => (
                  <div
                    key={supervision.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {supervision.type === "guru_bk" ? (
                          <GraduationCap className="h-5 w-5 text-primary" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{supervision.guru_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {supervision.type === "guru_bk" ? "Guru BK" : supervision.mata_pelajaran}
                          {" - "}
                          {new Date(supervision.tanggal).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(supervision.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Menu pintasan untuk akses cepat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isSupervisor && (
              <>
                <Link href="/dashboard/supervisi/new" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ClipboardCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Supervisi Guru Mapel</p>
                      <p className="text-sm text-muted-foreground">
                        Mulai penilaian untuk guru mata pelajaran
                      </p>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/supervisi/new?type=bk" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Supervisi Guru BK</p>
                      <p className="text-sm text-muted-foreground">
                        Mulai penilaian untuk guru bimbingan konseling
                      </p>
                    </div>
                  </div>
                </Link>
              </>
            )}

            <Link href="/dashboard/hasil" className="block">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                  <FileText className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Lihat Hasil Supervisi</p>
                  <p className="text-sm text-muted-foreground">
                    {isTeacher ? "Lihat hasil supervisi Anda" : "Lihat semua hasil supervisi"}
                  </p>
                </div>
              </div>
            </Link>

            {isAdmin && (
              <Link href="/dashboard/users" className="block">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Kelola Pengguna</p>
                    <p className="text-sm text-muted-foreground">
                      Tambah, edit, atau hapus pengguna
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
