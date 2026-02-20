import { useState } from "react";
import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { useClientProfileMutation } from "@/features/client/hooks/useClientProfileMutation";
import { User, Mail, Phone } from "lucide-react";

export default function ClientAccount() {
  const { profile, user } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
  });
  
  const { updateProfile, saving } = useClientProfileMutation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(form);
  };

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>

        <form onSubmit={handleSave} className="space-y-4 bg-card rounded-lg border border-border p-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2"><User className="w-3.5 h-3.5" />Full Name</label>
            <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2"><Mail className="w-3.5 h-3.5" />Email</label>
            <input value={user?.email ?? ""} disabled className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2"><Phone className="w-3.5 h-3.5" />Phone</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </ClientLayout>
  );
}
