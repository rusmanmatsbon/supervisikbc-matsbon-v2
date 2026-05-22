// User roles
export type UserRole = 'admin' | 'waka_kurikulum' | 'kepala_madrasah' | 'pengawas' | 'guru_mapel' | 'guru_bk';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nip?: string;
  avatar?: string;
  mata_pelajaran?: string;
  createdAt: Date;
}

// Supervision types
export type SupervisionType = 'guru_mapel' | 'guru_bk';

export interface SupervisionSession {
  id: string;
  guru_id: string;
  guru_name: string;
  supervisor_id: string;
  supervisor_name: string;
  type: SupervisionType;
  tanggal: Date;
  kelas: string;
  mata_pelajaran?: string;
  topik_materi: string;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  total_score?: number;
  grade?: string;
  catatan?: string;
  rekomendasi?: string;
}

// Instrument items for Guru Mapel
export interface InstrumentItem {
  id: string;
  no: number;
  aspek: string;
  indikator: string;
  kategori: string;
}

export interface AssessmentScore {
  instrument_id: string;
  score: number; // 1-4
  catatan?: string;
}

// Guru Mapel Instruments (Based on typical Indonesian supervision instruments)
export const GURU_MAPEL_INSTRUMENTS: InstrumentItem[] = [
  // Perencanaan Pembelajaran
  { id: 'gm1', no: 1, kategori: 'Perencanaan Pembelajaran', aspek: 'Kelengkapan Perangkat', indikator: 'Memiliki silabus yang sesuai dengan kurikulum' },
  { id: 'gm2', no: 2, kategori: 'Perencanaan Pembelajaran', aspek: 'Kelengkapan Perangkat', indikator: 'Memiliki RPP yang lengkap dan sistematis' },
  { id: 'gm3', no: 3, kategori: 'Perencanaan Pembelajaran', aspek: 'Kesesuaian Materi', indikator: 'Kesesuaian materi dengan kompetensi dasar' },
  { id: 'gm4', no: 4, kategori: 'Perencanaan Pembelajaran', aspek: 'Kesesuaian Materi', indikator: 'Kesesuaian materi dengan tujuan pembelajaran' },
  { id: 'gm5', no: 5, kategori: 'Perencanaan Pembelajaran', aspek: 'Media Pembelajaran', indikator: 'Kesiapan media dan alat pembelajaran' },
  
  // Pelaksanaan Pembelajaran
  { id: 'gm6', no: 6, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Pendahuluan', indikator: 'Melakukan apersepsi dan motivasi' },
  { id: 'gm7', no: 7, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Pendahuluan', indikator: 'Menyampaikan tujuan pembelajaran' },
  { id: 'gm8', no: 8, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Inti', indikator: 'Penguasaan materi pembelajaran' },
  { id: 'gm9', no: 9, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Inti', indikator: 'Penerapan strategi pembelajaran yang efektif' },
  { id: 'gm10', no: 10, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Inti', indikator: 'Pemanfaatan sumber dan media pembelajaran' },
  { id: 'gm11', no: 11, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Inti', indikator: 'Keterlibatan peserta didik dalam pembelajaran' },
  { id: 'gm12', no: 12, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Inti', indikator: 'Penggunaan bahasa yang benar dan tepat' },
  { id: 'gm13', no: 13, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Penutup', indikator: 'Melakukan refleksi dan rangkuman' },
  { id: 'gm14', no: 14, kategori: 'Pelaksanaan Pembelajaran', aspek: 'Kegiatan Penutup', indikator: 'Memberikan tindak lanjut pembelajaran' },
  
  // Penilaian Pembelajaran
  { id: 'gm15', no: 15, kategori: 'Penilaian Pembelajaran', aspek: 'Teknik Penilaian', indikator: 'Menggunakan teknik penilaian yang sesuai' },
  { id: 'gm16', no: 16, kategori: 'Penilaian Pembelajaran', aspek: 'Teknik Penilaian', indikator: 'Melaksanakan penilaian selama proses pembelajaran' },
  { id: 'gm17', no: 17, kategori: 'Penilaian Pembelajaran', aspek: 'Instrumen Penilaian', indikator: 'Memiliki instrumen penilaian yang valid' },
  { id: 'gm18', no: 18, kategori: 'Penilaian Pembelajaran', aspek: 'Tindak Lanjut', indikator: 'Melakukan analisis hasil penilaian' },
  { id: 'gm19', no: 19, kategori: 'Penilaian Pembelajaran', aspek: 'Tindak Lanjut', indikator: 'Merencanakan program remedial dan pengayaan' },
  { id: 'gm20', no: 20, kategori: 'Penilaian Pembelajaran', aspek: 'Dokumentasi', indikator: 'Mendokumentasikan hasil penilaian dengan baik' },
];

// Guru BK Instruments (Sheet BK dan BK.1)
export const GURU_BK_INSTRUMENTS: InstrumentItem[] = [
  // Program BK
  { id: 'bk1', no: 1, kategori: 'Program BK', aspek: 'Perencanaan', indikator: 'Memiliki program tahunan BK yang lengkap' },
  { id: 'bk2', no: 2, kategori: 'Program BK', aspek: 'Perencanaan', indikator: 'Memiliki program semester BK' },
  { id: 'bk3', no: 3, kategori: 'Program BK', aspek: 'Perencanaan', indikator: 'Memiliki program bulanan dan mingguan' },
  { id: 'bk4', no: 4, kategori: 'Program BK', aspek: 'Perencanaan', indikator: 'Memiliki RPL (Rencana Pelaksanaan Layanan)' },
  { id: 'bk5', no: 5, kategori: 'Program BK', aspek: 'Analisis Kebutuhan', indikator: 'Melakukan asesmen kebutuhan peserta didik' },
  
  // Layanan Dasar
  { id: 'bk6', no: 6, kategori: 'Layanan Dasar', aspek: 'Bimbingan Klasikal', indikator: 'Melaksanakan bimbingan klasikal secara terjadwal' },
  { id: 'bk7', no: 7, kategori: 'Layanan Dasar', aspek: 'Bimbingan Klasikal', indikator: 'Menggunakan metode yang bervariasi' },
  { id: 'bk8', no: 8, kategori: 'Layanan Dasar', aspek: 'Bimbingan Kelompok', indikator: 'Melaksanakan bimbingan kelompok' },
  { id: 'bk9', no: 9, kategori: 'Layanan Dasar', aspek: 'Layanan Orientasi', indikator: 'Memberikan layanan orientasi kepada peserta didik baru' },
  { id: 'bk10', no: 10, kategori: 'Layanan Dasar', aspek: 'Layanan Informasi', indikator: 'Memberikan layanan informasi yang relevan' },
  
  // Layanan Responsif
  { id: 'bk11', no: 11, kategori: 'Layanan Responsif', aspek: 'Konseling Individual', indikator: 'Melaksanakan konseling individual' },
  { id: 'bk12', no: 12, kategori: 'Layanan Responsif', aspek: 'Konseling Individual', indikator: 'Mendokumentasikan proses konseling' },
  { id: 'bk13', no: 13, kategori: 'Layanan Responsif', aspek: 'Konseling Kelompok', indikator: 'Melaksanakan konseling kelompok' },
  { id: 'bk14', no: 14, kategori: 'Layanan Responsif', aspek: 'Konsultasi', indikator: 'Melakukan konsultasi dengan guru dan orang tua' },
  { id: 'bk15', no: 15, kategori: 'Layanan Responsif', aspek: 'Kunjungan Rumah', indikator: 'Melakukan kunjungan rumah bila diperlukan' },
  
  // Perencanaan Individual
  { id: 'bk16', no: 16, kategori: 'Perencanaan Individual', aspek: 'Peminatan', indikator: 'Membantu peserta didik dalam peminatan' },
  { id: 'bk17', no: 17, kategori: 'Perencanaan Individual', aspek: 'Karir', indikator: 'Memberikan bimbingan karir' },
  { id: 'bk18', no: 18, kategori: 'Perencanaan Individual', aspek: 'Pengembangan Diri', indikator: 'Memfasilitasi pengembangan diri peserta didik' },
  
  // Dukungan Sistem
  { id: 'bk19', no: 19, kategori: 'Dukungan Sistem', aspek: 'Administrasi', indikator: 'Memiliki administrasi BK yang lengkap' },
  { id: 'bk20', no: 20, kategori: 'Dukungan Sistem', aspek: 'Evaluasi', indikator: 'Melakukan evaluasi program BK' },
];

// Score categories
export const SCORE_CATEGORIES = [
  { value: 1, label: 'Kurang', description: 'Tidak terpenuhi/tidak dilaksanakan' },
  { value: 2, label: 'Cukup', description: 'Terpenuhi sebagian kecil' },
  { value: 3, label: 'Baik', description: 'Terpenuhi sebagian besar' },
  { value: 4, label: 'Sangat Baik', description: 'Terpenuhi sepenuhnya' },
];

// Grade calculation
export function calculateGrade(totalScore: number, maxScore: number): string {
  const percentage = (totalScore / maxScore) * 100;
  if (percentage >= 91) return 'Amat Baik';
  if (percentage >= 76) return 'Baik';
  if (percentage >= 61) return 'Cukup';
  if (percentage >= 51) return 'Sedang';
  return 'Kurang';
}

// Role display names
export const ROLE_NAMES: Record<UserRole, string> = {
  admin: 'Administrator',
  waka_kurikulum: 'Wakil Kepala Kurikulum',
  kepala_madrasah: 'Kepala Madrasah',
  pengawas: 'Pengawas',
  guru_mapel: 'Guru Mata Pelajaran',
  guru_bk: 'Guru BK',
};

// Sample users for demo
export const SAMPLE_USERS: User[] = [
  { id: '1', name: 'Admin Sistem', email: 'admin@madrasah.sch.id', role: 'admin', createdAt: new Date() },
  { id: '2', name: 'H. Ahmad Fauzi, M.Pd', email: 'kepsek@madrasah.sch.id', role: 'kepala_madrasah', nip: '196805121992031002', createdAt: new Date() },
  { id: '3', name: 'Dra. Siti Aminah', email: 'waka@madrasah.sch.id', role: 'waka_kurikulum', nip: '197203151998032001', createdAt: new Date() },
  { id: '4', name: 'Drs. Muhammad Ridwan', email: 'pengawas@kemenag.go.id', role: 'pengawas', nip: '196512101990031001', createdAt: new Date() },
  { id: '5', name: 'Ahmad Hidayat, S.Pd', email: 'ahmad.h@madrasah.sch.id', role: 'guru_mapel', nip: '198507152010011012', mata_pelajaran: 'Matematika', createdAt: new Date() },
  { id: '6', name: 'Fatimah Zahra, S.Pd', email: 'fatimah@madrasah.sch.id', role: 'guru_mapel', nip: '199001202015032001', mata_pelajaran: 'Bahasa Indonesia', createdAt: new Date() },
  { id: '7', name: 'Nurul Hidayah, S.Pd', email: 'nurul@madrasah.sch.id', role: 'guru_bk', nip: '198808152012032002', createdAt: new Date() },
];
