"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  BookOpen,
  GraduationCap,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { AuthGuard } from "@/components/auth-guard";

const COLORS = ["#16a34a", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function LaporanPage() {
  const { supervisions, users } = useAppStore();

  // Calculate statistics
  const stats = useMemo(() => {
    const completedSupervisions = supervisions.filter(
      (s) => s.status === "completed" || s.status === "reviewed"
    );

    const guruMapelSupervisions = completedSupervisions.filter(
      (s) => s.type === "guru_mapel"
    );
    const guruBkSupervisions = completedSupervisions.filter((s) => s.type === "guru_bk");

    const totalGuru = users.filter(
      (u) => u.role === "guru_mapel" || u.role === "guru_bk"
    ).length;
    const guruMapelCount = users.filter((u) => u.role === "guru_mapel").length;
    const guruBkCount = users.filter((u) => u.role === "guru_bk").length;

    // Calculate average scores
    const avgScoreMapel =
      guruMapelSupervisions.length > 0
        ? guruMapelSupervisions.reduce((sum, s) => sum + (s.total_score || 0), 0) /
          guruMapelSupervisions.length
        : 0;

    const avgScoreBk =
      guruBkSupervisions.length > 0
        ? guruBkSupervisions.reduce((sum, s) => sum + (s.total_score || 0), 0) /
          guruBkSupervisions.length
        : 0;

    // Grade distribution
    const gradeDistribution = {
      "Amat Baik": 0,
      Baik: 0,
      Cukup: 0,
      Sedang: 0,
      Kurang: 0,
    };

    completedSupervisions.forEach((s) => {
      if (s.grade && gradeDistribution.hasOwnProperty(s.grade)) {
        gradeDistribution[s.grade as keyof typeof gradeDistribution]++;
      }
    });

    return {
      totalSupervisions: completedSupervisions.length,
      guruMapelSupervisions: guruMapelSupervisions.length,
      guruBkSupervisions: guruBkSupervisions.length,
      totalGuru,
      guruMapelCount,
      guruBkCount,
      avgScoreMapel,
      avgScoreBk,
      gradeDistribution,
    };
  }, [supervisions, users]);

  // Chart data
  const pieData = [
    { name: "Guru Mapel", value: stats.guruMapelSupervisions, color: "#16a34a" },
    { name: "Guru BK", value: stats.guruBkSupervisions, color: "#f59e0b" },
  ].filter((d) => d.value > 0);

  const gradeChartData = Object.entries(stats.gradeDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
      const monthSupervisions = supervisions.filter((s) => {
        const date = new Date(s.tanggal);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });

      return {
        name: month,
        "Guru Mapel": monthSupervisions.filter((s) => s.type === "guru_mapel").length,
        "Guru BK": monthSupervisions.filter((s) => s.type === "guru_bk").length,
      };
    });
  }, [supervisions]);

  // Teacher ranking by supervision score
  const teacherRanking = useMemo(() => {
    const teacherScores: Record<string, { name: string; scores: number[]; type: string }> = {};

    supervisions
      .filter((s) => s.status === "completed" || s.status === "reviewed")
      .forEach((s) => {
        if (!teacherScores[s.guru_id]) {
          teacherScores[s.guru_id] = {
            name: s.guru_name,
            scores: [],
            type: s.type,
          };
        }
        if (s.total_score) {
          teacherScores[s.guru_id].scores.push(s.total_score);
        }
      });

    return Object.entries(teacherScores)
      .map(([id, data]) => ({
        id,
        name: data.name,
        type: data.type,
        avgScore:
          data.scores.length > 0
            ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
            : 0,
        supervisionCount: data.scores.length,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);
  }, [supervisions]);

  return (
    <AuthGuard allowedRoles={["admin", "waka_kurikulum", "kepala_madrasah", "pengawas"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Laporan & Analitik</h1>
            <p className="text-muted-foreground">
              Statistik dan analisis hasil supervisi akademik
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Laporan
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Supervisi</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSupervisions}</div>
              <p className="text-xs text-muted-foreground">Supervisi selesai</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Guru Mapel</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.guruMapelSupervisions}</div>
              <p className="text-xs text-muted-foreground">
                Rata-rata: {stats.avgScoreMapel.toFixed(1)} poin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Guru BK</CardTitle>
              <GraduationCap className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.guruBkSupervisions}</div>
              <p className="text-xs text-muted-foreground">
                Rata-rata: {stats.avgScoreBk.toFixed(1)} poin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuru}</div>
              <p className="text-xs text-muted-foreground">
                {stats.guruMapelCount} Mapel, {stats.guruBkCount} BK
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Predikat</CardTitle>
              <CardDescription>Sebaran nilai supervisi berdasarkan predikat</CardDescription>
            </CardHeader>
            <CardContent>
              {gradeChartData.some((d) => d.value > 0) ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Belum ada data supervisi
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supervision Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Tipe Supervisi</CardTitle>
              <CardDescription>Jumlah supervisi Guru Mapel vs Guru BK</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Belum ada data supervisi
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Supervisi Bulanan</CardTitle>
            <CardDescription>Jumlah supervisi per bulan tahun ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Guru Mapel"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ fill: "#16a34a" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Guru BK"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Ranking */}
        <Card>
          <CardHeader>
            <CardTitle>Peringkat Guru</CardTitle>
            <CardDescription>
              Guru dengan rata-rata skor supervisi tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teacherRanking.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada data supervisi
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Peringkat</TableHead>
                    <TableHead>Nama Guru</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-center">Jumlah Supervisi</TableHead>
                    <TableHead className="text-right">Rata-rata Skor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherRanking.map((teacher, index) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <Badge
                          variant={index < 3 ? "default" : "outline"}
                          className={
                            index === 0
                              ? "bg-amber-500"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-amber-700"
                              : ""
                          }
                        >
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {teacher.type === "guru_bk" ? "Guru BK" : "Guru Mapel"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{teacher.supervisionCount}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {teacher.avgScore.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
