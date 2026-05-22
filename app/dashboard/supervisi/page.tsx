"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  BookOpen,
  GraduationCap,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ClipboardCheck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";

export default function SupervisiPage() {
  const router = useRouter();
  const { supervisions, deleteSupervision, currentUser } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSupervisions = useMemo(() => {
    return supervisions.filter((s) => {
      const matchesSearch =
        s.guru_name.toLowerCase().includes(search.toLowerCase()) ||
        s.topik_materi?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [supervisions, search, statusFilter]);

  const guruMapelSupervisions = filteredSupervisions.filter((s) => s.type === "guru_mapel");
  const guruBkSupervisions = filteredSupervisions.filter((s) => s.type === "guru_bk");

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

  const handleDelete = (id: string) => {
    deleteSupervision(id);
    toast.success("Data supervisi berhasil dihapus");
  };

  const SupervisionTable = ({ data, type }: { data: typeof supervisions; type: string }) => (
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Belum ada data supervisi {type}</p>
          <Link href={`/dashboard/supervisi/new${type === "Guru BK" ? "?type=bk" : ""}`}>
            <Button variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Supervisi Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guru</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>{type === "Guru BK" ? "Topik" : "Materi"}</TableHead>
              <TableHead>Nilai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((supervision) => (
              <TableRow key={supervision.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center ${
                        supervision.type === "guru_bk"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {supervision.type === "guru_bk" ? (
                        <GraduationCap className="h-4 w-4" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{supervision.guru_name}</p>
                      {supervision.mata_pelajaran && (
                        <p className="text-xs text-muted-foreground">
                          {supervision.mata_pelajaran}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(supervision.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{supervision.kelas}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {supervision.topik_materi}
                </TableCell>
                <TableCell>
                  {supervision.total_score ? (
                    <div>
                      <span className="font-semibold">{supervision.total_score}</span>
                      <span className="text-muted-foreground text-xs ml-1">
                        ({supervision.grade})
                      </span>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(supervision.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/supervisi/${supervision.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      {(supervision.status === "draft" ||
                        supervision.status === "in_progress") && (
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/supervisi/${supervision.id}/edit`)
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Lanjutkan Penilaian
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(supervision.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  return (
    <AuthGuard allowedRoles={["admin", "waka_kurikulum", "kepala_madrasah", "pengawas"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Supervisi Akademik</h1>
            <p className="text-muted-foreground">
              Kelola dan lakukan supervisi untuk Guru Mapel dan Guru BK
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/supervisi/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Supervisi Guru Mapel
              </Button>
            </Link>
            <Link href="/dashboard/supervisi/new?type=bk">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Supervisi Guru BK
              </Button>
            </Link>
          </div>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_progress">Berlangsung</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="reviewed">Direview</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Guru Mapel and Guru BK */}
        <Tabs defaultValue="mapel" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="mapel" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Guru Mapel ({guruMapelSupervisions.length})
            </TabsTrigger>
            <TabsTrigger value="bk" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Guru BK ({guruBkSupervisions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mapel">
            <Card>
              <CardHeader>
                <CardTitle>Supervisi Guru Mata Pelajaran</CardTitle>
                <CardDescription>
                  Penilaian perencanaan, pelaksanaan, dan evaluasi pembelajaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupervisionTable data={guruMapelSupervisions} type="Guru Mapel" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bk">
            <Card>
              <CardHeader>
                <CardTitle>Supervisi Guru BK</CardTitle>
                <CardDescription>
                  Penilaian program dan layanan bimbingan konseling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupervisionTable data={guruBkSupervisions} type="Guru BK" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}
