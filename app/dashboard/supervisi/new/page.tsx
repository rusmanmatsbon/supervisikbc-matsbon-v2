"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  BookOpen,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import {
  GURU_MAPEL_INSTRUMENTS,
  GURU_BK_INSTRUMENTS,
  SCORE_CATEGORIES,
  calculateGrade,
  type AssessmentScore,
  type SupervisionType,
} from "@/lib/types";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";

export default function NewSupervisiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGurubk = searchParams.get("type") === "bk";

  const { users, currentUser, addSupervision, saveAssessmentScores, updateSupervision } =
    useAppStore();

  const supervisionType: SupervisionType = isGurubk ? "guru_bk" : "guru_mapel";
  const instruments = isGurubk ? GURU_BK_INSTRUMENTS : GURU_MAPEL_INSTRUMENTS;

  // Form states
  const [guruId, setGuruId] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [kelas, setKelas] = useState("");
  const [topikMateri, setTopikMateri] = useState("");
  const [catatan, setCatatan] = useState("");
  const [rekomendasi, setRekomendasi] = useState("");

  // Scores state - initialize with empty scores
  const [scores, setScores] = useState<Record<string, number>>({});

  // Get available teachers based on type
  const availableTeachers = users.filter((u) =>
    isGurubk ? u.role === "guru_bk" : u.role === "guru_mapel"
  );

  const selectedTeacher = users.find((u) => u.id === guruId);

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

  // Calculate progress and scores
  const { progress, totalScore, maxScore, grade } = useMemo(() => {
    const answeredCount = Object.keys(scores).length;
    const totalItems = instruments.length;
    const progress = (answeredCount / totalItems) * 100;

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const maxScore = totalItems * 4;
    const grade = totalScore > 0 ? calculateGrade(totalScore, maxScore) : "-";

    return { progress, totalScore, maxScore, grade };
  }, [scores, instruments]);

  const handleScoreChange = (instrumentId: string, score: number) => {
    setScores((prev) => ({ ...prev, [instrumentId]: score }));
  };

  const handleSaveDraft = () => {
    if (!guruId || !tanggal || !kelas) {
      toast.error("Mohon lengkapi data guru, tanggal, dan kelas");
      return;
    }

    const supervisionId = addSupervision({
      guru_id: guruId,
      guru_name: selectedTeacher?.name || "",
      supervisor_id: currentUser?.id || "",
      supervisor_name: currentUser?.name || "",
      type: supervisionType,
      tanggal: new Date(tanggal),
      kelas,
      mata_pelajaran: selectedTeacher?.mata_pelajaran,
      topik_materi: topikMateri,
      status: "draft",
      catatan,
      rekomendasi,
    });

    // Save scores
    const assessmentScores: AssessmentScore[] = Object.entries(scores).map(
      ([instrument_id, score]) => ({
        instrument_id,
        score,
      })
    );
    saveAssessmentScores(supervisionId, assessmentScores);

    toast.success("Draft berhasil disimpan");
    router.push("/dashboard/supervisi");
  };

  const handleSubmit = () => {
    if (!guruId || !tanggal || !kelas) {
      toast.error("Mohon lengkapi data guru, tanggal, dan kelas");
      return;
    }

    if (Object.keys(scores).length < instruments.length) {
      toast.error("Mohon lengkapi semua penilaian instrumen");
      return;
    }

    const supervisionId = addSupervision({
      guru_id: guruId,
      guru_name: selectedTeacher?.name || "",
      supervisor_id: currentUser?.id || "",
      supervisor_name: currentUser?.name || "",
      type: supervisionType,
      tanggal: new Date(tanggal),
      kelas,
      mata_pelajaran: selectedTeacher?.mata_pelajaran,
      topik_materi: topikMateri,
      status: "completed",
      total_score: totalScore,
      grade,
      catatan,
      rekomendasi,
    });

    // Save scores
    const assessmentScores: AssessmentScore[] = Object.entries(scores).map(
      ([instrument_id, score]) => ({
        instrument_id,
        score,
      })
    );
    saveAssessmentScores(supervisionId, assessmentScores);

    toast.success("Supervisi berhasil disimpan!");
    router.push("/dashboard/supervisi");
  };

  return (
    <AuthGuard allowedRoles={["admin", "waka_kurikulum", "kepala_madrasah", "pengawas"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/supervisi">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              {isGurubk ? (
                <>
                  <GraduationCap className="h-6 w-6 text-accent" />
                  Supervisi Guru BK
                </>
              ) : (
                <>
                  <BookOpen className="h-6 w-6 text-primary" />
                  Supervisi Guru Mapel
                </>
              )}
            </h1>
            <p className="text-muted-foreground">
              {isGurubk
                ? "Instrumen penilaian program dan layanan BK"
                : "Instrumen penilaian perencanaan, pelaksanaan, dan evaluasi pembelajaran"}
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress Penilaian</span>
                  <span className="text-sm text-muted-foreground">
                    {Object.keys(scores).length} / {instruments.length} indikator
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Separator orientation="vertical" className="hidden md:block h-12" />
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{totalScore}</p>
                  <p className="text-xs text-muted-foreground">Skor Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{maxScore}</p>
                  <p className="text-xs text-muted-foreground">Skor Maks</p>
                </div>
                <div className="text-center">
                  <Badge variant={grade === "-" ? "outline" : "default"} className="text-lg px-3">
                    {grade}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Predikat</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Supervisi</CardTitle>
                <CardDescription>Data guru dan jadwal supervisi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guru">
                    Pilih {isGurubk ? "Guru BK" : "Guru Mapel"} <span className="text-destructive">*</span>
                  </Label>
                  <Select value={guruId} onValueChange={setGuruId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih guru..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                          {teacher.mata_pelajaran && ` - ${teacher.mata_pelajaran}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal">
                    Tanggal Supervisi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kelas">
                    Kelas <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="kelas"
                    placeholder="Contoh: X IPA 1"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topik">{isGurubk ? "Topik Layanan" : "Topik/Materi"}</Label>
                  <Input
                    id="topik"
                    placeholder={isGurubk ? "Contoh: Bimbingan Karir" : "Contoh: Persamaan Kuadrat"}
                    value={topikMateri}
                    onChange={(e) => setTopikMateri(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Score Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Keterangan Skor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SCORE_CATEGORIES.map((cat) => (
                  <div key={cat.value} className="flex items-start gap-3">
                    <Badge variant="outline" className="w-8 justify-center">
                      {cat.value}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{cat.label}</p>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Instruments */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Instrumen Penilaian</CardTitle>
                <CardDescription>
                  Berikan penilaian untuk setiap indikator (1-4)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-4" defaultValue={Object.keys(groupedInstruments)}>
                  {Object.entries(groupedInstruments).map(([kategori, items]) => (
                    <AccordionItem key={kategori} value={kategori} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{kategori}</span>
                          <Badge variant="secondary">
                            {items.filter((i) => scores[i.id]).length} / {items.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6 pt-4">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className={`p-4 rounded-lg border ${
                                scores[item.id]
                                  ? "border-primary/30 bg-primary/5"
                                  : "border-border bg-muted/30"
                              }`}
                            >
                              <div className="flex items-start gap-3 mb-4">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                                  {item.no}
                                </span>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {item.aspek}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.indikator}
                                  </p>
                                </div>
                              </div>
                              <RadioGroup
                                value={scores[item.id]?.toString() || ""}
                                onValueChange={(value) =>
                                  handleScoreChange(item.id, parseInt(value))
                                }
                                className="flex flex-wrap gap-4"
                              >
                                {SCORE_CATEGORIES.map((cat) => (
                                  <div key={cat.value} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value={cat.value.toString()}
                                      id={`${item.id}-${cat.value}`}
                                    />
                                    <Label
                                      htmlFor={`${item.id}-${cat.value}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {cat.value} - {cat.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Notes and Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Catatan dan Rekomendasi</CardTitle>
                <CardDescription>
                  Berikan catatan dan rekomendasi perbaikan untuk guru
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan Supervisor</Label>
                  <Textarea
                    id="catatan"
                    placeholder="Tuliskan catatan observasi selama supervisi..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rekomendasi">Rekomendasi Perbaikan</Label>
                  <Textarea
                    id="rekomendasi"
                    placeholder="Tuliskan rekomendasi untuk perbaikan..."
                    value={rekomendasi}
                    onChange={(e) => setRekomendasi(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Draft
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                Selesaikan Supervisi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
