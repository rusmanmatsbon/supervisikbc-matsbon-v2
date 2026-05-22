"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Mail,
  Shield,
  GraduationCap,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import { ROLE_NAMES, type UserRole } from "@/lib/types";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useAppStore();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "guru_mapel" as UserRole,
    nip: "",
    mata_pelajaran: "",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      ROLE_NAMES[user.role].toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeVariant = (role: UserRole) => {
    const variants: Record<UserRole, "default" | "secondary" | "outline" | "destructive"> = {
      admin: "destructive",
      kepala_madrasah: "default",
      waka_kurikulum: "default",
      pengawas: "secondary",
      guru_mapel: "outline",
      guru_bk: "outline",
    };
    return variants[role];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAdd = () => {
    if (!formData.name || !formData.email) {
      toast.error("Nama dan email wajib diisi");
      return;
    }

    addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      nip: formData.nip || undefined,
      mata_pelajaran: formData.role === "guru_mapel" ? formData.mata_pelajaran : undefined,
    });

    toast.success("Pengguna berhasil ditambahkan");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedUser) return;

    updateUser(selectedUser, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      nip: formData.nip || undefined,
      mata_pelajaran: formData.role === "guru_mapel" ? formData.mata_pelajaran : undefined,
    });

    toast.success("Pengguna berhasil diperbarui");
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    toast.success("Pengguna berhasil dihapus");
  };

  const openEditDialog = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        nip: user.nip || "",
        mata_pelajaran: user.mata_pelajaran || "",
      });
      setSelectedUser(userId);
      setIsEditDialogOpen(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "guru_mapel",
      nip: "",
      mata_pelajaran: "",
    });
    setSelectedUser(null);
  };

  const UserForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Masukkan nama lengkap"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@madrasah.sch.id"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih role" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_NAMES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nip">NIP (Opsional)</Label>
        <Input
          id="nip"
          value={formData.nip}
          onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
          placeholder="Masukkan NIP"
        />
      </div>
      {formData.role === "guru_mapel" && (
        <div className="space-y-2">
          <Label htmlFor="mata_pelajaran">Mata Pelajaran</Label>
          <Input
            id="mata_pelajaran"
            value={formData.mata_pelajaran}
            onChange={(e) => setFormData({ ...formData, mata_pelajaran: e.target.value })}
            placeholder="Contoh: Matematika"
          />
        </div>
      )}
    </div>
  );

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kelola Pengguna</h1>
            <p className="text-muted-foreground">
              Tambah, edit, dan kelola akun pengguna sistem supervisi
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengguna
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi pengguna baru untuk sistem supervisi
                </DialogDescription>
              </DialogHeader>
              <UserForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAdd}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Daftar Pengguna</CardTitle>
                <CardDescription>{filteredUsers.length} pengguna terdaftar</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pengguna..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pengguna</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>NIP</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {user.mata_pelajaran && (
                              <p className="text-xs text-muted-foreground">
                                {user.mata_pelajaran}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {ROLE_NAMES[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.nip || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(user.id)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
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
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Pengguna</DialogTitle>
              <DialogDescription>Perbarui informasi pengguna</DialogDescription>
            </DialogHeader>
            <UserForm isEdit />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEdit}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
