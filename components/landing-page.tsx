"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Target,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: ClipboardCheck,
    title: "Instrumen Supervisi Digital",
    description: "Instrumen penilaian lengkap untuk Guru Mapel dan Guru BK sesuai standar Kemenag",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Akses berbeda untuk Admin, Kepala Madrasah, Waka Kurikulum, Pengawas, dan Guru",
  },
  {
    icon: BarChart3,
    title: "Laporan & Analitik",
    description: "Visualisasi data dan laporan supervisi yang komprehensif dan real-time",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    description: "Data tersimpan dengan aman dan dapat diakses kapan saja dari mana saja",
  },
];

const stats = [
  { value: "100%", label: "Digital" },
  { value: "24/7", label: "Akses" },
  { value: "5", label: "Role Pengguna" },
  { value: "40+", label: "Indikator" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Logo Madrasah"
                width={48}
                height={48}
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
                loading="eager"
                priority
                unoptimized
              />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-foreground">
                  Supervisi Madrasah Tsanawiyah Bontonompo
                </h1>
                <p className="text-xs text-muted-foreground">Sistem Supervisi Online</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#fitur" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Fitur
              </a>
              <a href="#tentang" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Tentang
              </a>
              <Link href="/login">
                <Button variant="outline" className="mr-2">
                  Masuk
                </Button>
              </Link>
              <Link href="/login">
                <Button>
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <nav className="flex flex-col p-4 gap-4">
              <a
                href="#fitur"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fitur
              </a>
              <a
                href="#tentang"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tentang
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Masuk
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Mulai Sekarang
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Sistem Supervisi Modern untuk Madrasah
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Tingkatkan Kualitas
                <span className="block text-emerald-300">Pembelajaran</span>
                dengan Supervisi Digital
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                Platform supervisi online yang memudahkan pemantauan, penilaian, dan peningkatan kualitas pembelajaran di madrasah Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                    Masuk ke Aplikasi
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#fitur">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                  >
                    Pelajari Fitur
                  </Button>
                </a>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Dashboard Preview Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Dashboard Supervisi</h3>
                      <p className="text-white/60 text-sm">Real-time monitoring</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <BookOpen className="h-8 w-8 text-emerald-300 mb-2" />
                      <p className="text-white/80 text-sm">Guru Mapel</p>
                      <p className="text-2xl font-bold text-white">20</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <Target className="h-8 w-8 text-amber-300 mb-2" />
                      <p className="text-white/80 text-sm">Guru BK</p>
                      <p className="text-2xl font-bold text-white">5</p>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Supervisi</p>
                      <p className="text-xl font-bold text-foreground">156</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sistem supervisi yang lengkap dengan berbagai fitur untuk memudahkan proses supervisi di madrasah
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover bg-card border-border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-20 md:py-28 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Tentang Sistem Supervisi
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sistem Supervisi Madrasah Online adalah platform digital yang dirancang khusus untuk membantu proses supervisi akademik di lingkungan madrasah. Dengan instrumen penilaian yang komprehensif dan sesuai standar Kementerian Agama.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Instrumen Guru Mapel</h4>
                    <p className="text-sm text-muted-foreground">
                      20 indikator penilaian mencakup perencanaan, pelaksanaan, dan evaluasi pembelajaran
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Instrumen Guru BK</h4>
                    <p className="text-sm text-muted-foreground">
                      20 indikator khusus untuk menilai program dan layanan bimbingan konseling
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Laporan Otomatis</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate laporan supervisi secara otomatis dengan visualisasi data yang mudah dipahami
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-6">Role Pengguna</h3>
                <div className="space-y-4">
                  {[
                    { role: "Administrator", desc: "Kelola pengguna dan konfigurasi sistem" },
                    { role: "Kepala Madrasah", desc: "Supervisi dan monitoring seluruh guru" },
                    { role: "Waka Kurikulum", desc: "Supervisi dan analisis kurikulum" },
                    { role: "Pengawas", desc: "Supervisi dan evaluasi eksternal" },
                    { role: "Guru Mapel / BK", desc: "Akses hasil supervisi pribadi" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{item.role}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Meningkatkan Kualitas Supervisi?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Mulai gunakan sistem supervisi digital untuk madrasah Anda sekarang juga. Gratis dan mudah digunakan.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Mulai Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Logo Madrasah"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                unoptimized
              />
              <div>
                <h3 className="font-semibold text-card-foreground">Supervisi Madrasah Online</h3>
                <p className="text-sm text-muted-foreground">Sistem Supervisi Digital</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()}. Dikembangkan oleh Rusman Syarif. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
