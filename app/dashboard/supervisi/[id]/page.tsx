"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Calendar,
  User,
  FileText,
  Download,
  Printer,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import {
  GURU_MAPEL_INSTRUMENTS,
  GURU_BK_INSTRUMENTS,
  SCORE_CATEGORIES,
  calculateGrade,
} from "@/lib/types";

export default function SupervisiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { supervisions, assessmentScores } = useAppStore();

  const supervision = supervisions.find((s) => s.id === params.id);
  const scores = assessmentScores[params.id as string] || [];

  if (!supervision) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Data tidak ditemukan</h2>
        <p className="text-muted-foreground mb-4">Supervisi yang Anda cari tidak tersedia</p>
        <Link href="/dashboard/supervisi">
          <Button>Kembali ke Daftar Supervisi</Button>
        </Link>
      </div>
    );
  }

  const instruments =
    supervision.type === "guru_bk" ? GURU_BK_INSTRUMENTS : GURU_MAPEL_INSTRUMENTS;
  const scoreMap = new Map(scores.map((s) => [s.instrument_id, s.score]));

  // Group instruments by category
  const groupedInstruments = useMemo(() => {
    const groups: Record<string, typeof instruments> = {};
    instruments.forEach((item) => {
      if (!groups[item.kategori]) {
        groups[item.kategori] = [];
      }
      groups[item.kategori].push(item);
    });
    return groups;
  }, [instruments]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const maxScore = instruments.length * 4;
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const grade = totalScore > 0 ? calculateGrade(totalScore, maxScore) : "-";
    return { totalScore, maxScore, percentage, grade };
  }, [scores, instruments]);

  const getScoreLabel = (score: number) => {
    return SCORE_CATEGORIES.find((c) => c.value === score)?.label || "-";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "outline" | "destructive"; label: string }
    > = {
      draft: { variant: "outline", label: "Draft" },
      in_progress: { variant: "secondary", label: "Berlangsung" },
      completed: { variant: "default", label: "Selesai" },
      reviewed: { variant: "default", label: "Direview" },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/dashboard/supervisi">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Detail Supervisi</h1>
            {getStatusBadge(supervision.status)}
          </div>
          <p className="text-muted-foreground">
            {supervision.type === "guru_bk" ? "Instrumen Guru BK" : "Instrumen Guru Mapel"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  supervision.type === "guru_bk"
                    ? "bg-accent/10 text-accent"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {supervision.type === "guru_bk" ? (
                  <GraduationCap className="h-6 w-6" />
                ) : (
                  <BookOpen className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Guru</p>
                <p className="font-semibold">{supervision.guru_name}</p>
                {supervision.mata_pelajaran && (
                  <p className="text-xs text-muted-foreground">{supervision.mata_pelajaran}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal</p>
                <p className="font-semibold">
                  {new Date(supervision.tanggal).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supervisor</p>
                <p className="font-semibold">{supervision.supervisor_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm opacity-80">Total Skor</p>
              <p className="text-4xl font-bold">{stats.totalScore}</p>
              <p className="text-sm opacity-80">dari {stats.maxScore}</p>
              <Badge variant="secondary" className="mt-2">
                {stats.grade}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Capaian Nilai</span>
              <span className="text-sm text-muted-foreground">
                {stats.percentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={stats.percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Detail Information */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informasi Supervisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Kelas</p>
              <p className="font-medium">{supervision.kelas}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">
                {supervision.type === "guru_bk" ? "Topik Layanan" : "Topik/Materi"}
              </p>
              <p className="font-medium">{supervision.topik_materi || "-"}</p>
            </div>
            <Separator />
            {supervision.catatan && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Catatan Supervisor</p>
                  <p className="text-sm mt-1">{supervision.catatan}</p>
                </div>
                <Separator />
              </>
            )}
            {supervision.rekomendasi && (
              <div>
                <p className="text-sm text-muted-foreground">Rekomendasi</p>
                <p className="text-sm mt-1">{supervision.rekomendasi}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rincian Penilaian</CardTitle>
            <CardDescription>Skor untuk setiap indikator instrumen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedInstruments).map(([kategori, items]) => {
                const categoryScore = items.reduce(
                  (sum, item) => sum + (scoreMap.get(item.id) || 0),
                  0
                );
                const categoryMax = items.length * 4;

                return (
                  <div key={kategori}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{kategori}</h3>
                      <Badge variant="outline">
                        {categoryScore} / {categoryMax}
                      </Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">No</TableHead>
                            <TableHead>Indikator</TableHead>
                            <TableHead className="w-24 text-center">Skor</TableHead>
                            <TableHead className="w-24 text-center">Keterangan</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item) => {
                            const score = scoreMap.get(item.id);
                            return (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.no}</TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-sm">{item.aspek}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.indikator}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    variant={
                                      score === 4
                                        ? "default"
                                        : score === 3
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {score || "-"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center text-sm text-muted-foreground">
                                  {score ? getScoreLabel(score) : "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
