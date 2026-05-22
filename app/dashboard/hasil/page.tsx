"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FileText,
  BookOpen,
  GraduationCap,
  Eye,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";

export default function HasilSupervisiPage() {
  const { currentUser, supervisions } = useAppStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const isTeacher = currentUser?.role === "guru_mapel" || currentUser?.role === "guru_bk";

  const filteredSupervisions = useMemo(() => {
    let filtered = supervisions;

    // Teachers can only see their own results
    if (isTeacher) {
      filtered = filtered.filter((s) => s.guru_id === currentUser?.id);
    }

    // Only show completed supervisions
    filtered = filtered.filter((s) => s.status === "completed" || s.status === "reviewed");

    // Apply filters
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.guru_name.toLowerCase().includes(search.toLowerCase()) ||
          s.topik_materi?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((s) => s.type === typeFilter);
    }

    return filtered;
  }, [supervisions, currentUser, isTeacher, search, typeFilter]);

  const getGradeBadgeColor = (grade: string) => {
    if (grade === "Amat Baik") return "bg-primary text-primary-foreground";
    if (grade === "Baik") return "bg-emerald-500 text-white";
    if (grade === "Cukup") return "bg-amber-500 text-white";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hasil Supervisi</h1>
        <p className="text-muted-foreground">
          {isTeacher
            ? "Lihat hasil penilaian supervisi Anda"
            : "Daftar hasil supervisi yang telah selesai"}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari guru atau materi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="guru_mapel">Guru Mapel</SelectItem>
                <SelectItem value="guru_bk">Guru BK</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredSupervisions.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Belum ada hasil supervisi</h2>
              <p className="text-muted-foreground">
                {isTeacher
                  ? "Hasil supervisi Anda akan muncul di sini setelah supervisor menyelesaikan penilaian"
                  : "Data hasil supervisi yang telah selesai akan ditampilkan di sini"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSupervisions.map((supervision) => (
            <Card key={supervision.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        supervision.type === "guru_bk"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {supervision.type === "guru_bk" ? (
                        <GraduationCap className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">{supervision.guru_name}</CardTitle>
                      <CardDescription className="text-xs">
                        {supervision.type === "guru_bk"
                          ? "Guru BK"
                          : supervision.mata_pelajaran || "Guru Mapel"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getGradeBadgeColor(supervision.grade || "")}>
                    {supervision.grade || "-"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(supervision.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Skor: {supervision.total_score || 0}
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Kelas: </span>
                  <span className="font-medium">{supervision.kelas}</span>
                </div>

                {supervision.topik_materi && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {supervision.topik_materi}
                  </p>
                )}

                <Link href={`/dashboard/supervisi/${supervision.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
