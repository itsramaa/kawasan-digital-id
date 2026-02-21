import { useState } from "react";
import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { useClientProfileMutation } from "@/features/client/hooks/useClientProfileMutation";
import { ValidatedInput } from "@/shared/components/common/ValidatedInput";
import { profileSchema } from "@/shared/lib/validations";
import { RevealCard } from "@/shared/components/common/RevealCard";
import {
  User, Mail, Phone, Shield, Building2, Briefcase,
  Calendar, CheckCircle, Lock, ChevronRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export default function ClientAccount() {
  const { profile, user, roles } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateProfile, saving } = useClientProfileMutation();

  const { data: clientInfo } = useQuery({
    queryKey: ["client-company-info", profile?.client_id],
    queryFn: async () => {
      if (!profile?.client_id) return null;
      const { data } = await supabase.from("clients").select("company_name, industry, email, phone").eq("id", profile.client_id).single();
      return data;
    },
    enabled: !!profile?.client_id,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = profileSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => { fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await updateProfile({ full_name: result.data.full_name, phone: result.data.phone ?? "" });
  };

  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "??";
  const roleName = roles[0]?.replace(/_/g, " ") ?? "User";
  const joinDate = (profile as any)?.created_at ? format(new Date((profile as any).created_at), "dd MMMM yyyy", { locale: idLocale }) : "-";
  const lastLogin = user?.last_sign_in_at ? format(new Date(user.last_sign_in_at), "dd MMM yyyy, HH:mm", { locale: idLocale }) : "-";

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Dasbor</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Profil</span>
        </div>

        {/* Hero Banner */}
        <RevealCard>
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border">
            <div className="h-28 bg-gradient-to-r from-primary/15 via-primary/8 to-primary/3" />
            <div className="px-6 pb-5 -mt-10 flex items-end gap-5">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-card flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-2xl font-bold text-primary">{initials}</span>
              </div>
              <div className="pb-1 min-w-0">
                <h1 className="text-xl font-bold tracking-tight truncate">{profile?.full_name ?? "User"}</h1>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary capitalize bg-primary/10 px-2 py-0.5 rounded-full">{roleName}</span>
                </div>
              </div>
            </div>
          </div>
        </RevealCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <RevealCard delay={100}>
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-primary">{initials}</span>
                    </div>
                    <h2 className="font-semibold text-sm">{profile?.full_name}</h2>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="border-t border-border pt-3 space-y-3 text-sm">
                    <div className="flex items-center gap-2.5"><Shield className="w-4 h-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Peran</p><p className="font-medium capitalize">{roleName}</p></div></div>
                    <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Bergabung sejak</p><p className="font-medium">{joinDate}</p></div></div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${profile?.is_active ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${profile?.is_active ? "bg-primary" : "bg-destructive"}`} />
                          {profile?.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </RevealCard>
          </div>

          {/* Right Main */}
          <div className="lg:col-span-2 space-y-6">
            <RevealCard delay={150}>
              <Card>
                <CardHeader className="pb-4"><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4 text-primary" />Informasi Personal</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="space-y-4">
                    <ValidatedInput label="Nama Lengkap" icon={<User className="w-3.5 h-3.5" />} required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} error={errors.full_name} />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-2"><Mail className="w-3.5 h-3.5" />Email</label>
                      <input value={user?.email ?? ""} disabled className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                    </div>
                    <ValidatedInput label="Telepon" icon={<Phone className="w-3.5 h-3.5" />} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} placeholder="+62 xxx xxxx xxxx" />
                    <Button type="submit" disabled={saving} className="w-full sm:w-auto">{saving ? "Menyimpan..." : "Simpan Perubahan"}</Button>
                  </form>
                </CardContent>
              </Card>
            </RevealCard>

            {clientInfo && (
              <RevealCard delay={200}>
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" />Informasi Perusahaan</CardTitle>
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase tracking-wider">Hanya Baca</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {clientInfo.company_name && <div className="flex items-start gap-3"><Building2 className="w-4 h-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Nama Perusahaan</p><p className="text-sm font-medium">{clientInfo.company_name}</p></div></div>}
                      {clientInfo.industry && <div className="flex items-start gap-3"><Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Industri</p><p className="text-sm font-medium">{clientInfo.industry}</p></div></div>}
                      {clientInfo.email && <div className="flex items-start gap-3"><Mail className="w-4 h-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Email Perusahaan</p><p className="text-sm font-medium">{clientInfo.email}</p></div></div>}
                      {clientInfo.phone && <div className="flex items-start gap-3"><Phone className="w-4 h-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Telepon Perusahaan</p><p className="text-sm font-medium">{clientInfo.phone}</p></div></div>}
                    </div>
                  </CardContent>
                </Card>
              </RevealCard>
            )}

            <RevealCard delay={250}>
              <Card>
                <CardHeader className="pb-4"><CardTitle className="text-base flex items-center gap-2"><Lock className="w-4 h-4 text-primary" />Keamanan Akun</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-primary" /><div><p className="text-sm font-medium">Email terverifikasi</p><p className="text-xs text-muted-foreground">{user?.email}</p></div></div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-muted-foreground" /><div><p className="text-sm font-medium">Login terakhir</p><p className="text-xs text-muted-foreground">{lastLogin}</p></div></div>
                  <Button variant="outline" size="sm" className="mt-2" disabled><Lock className="w-3.5 h-3.5 mr-1.5" />Ubah Password</Button>
                </CardContent>
              </Card>
            </RevealCard>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
