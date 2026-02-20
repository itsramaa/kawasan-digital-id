import { useState } from "react";
import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { useClientProfileMutation } from "@/features/client/hooks/useClientProfileMutation";
import { ValidatedInput } from "@/shared/components/common/ValidatedInput";
import { profileSchema } from "@/shared/lib/validations";
import { User, Mail, Phone, Shield } from "lucide-react";

export default function ClientAccount() {
  const { profile, user, roles } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateProfile, saving } = useClientProfileMutation();

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

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile information</p>
        </div>

        {/* Profile Info */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "??"}
              </span>
            </div>
            <div>
              <h2 className="font-semibold">{profile?.full_name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary capitalize">{roles[0]?.replace(/_/g, " ") ?? "User"}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <ValidatedInput
              label="Full Name"
              icon={<User className="w-3.5 h-3.5" />}
              required
              value={form.full_name}
              onChange={e => setForm({...form, full_name: e.target.value})}
              error={errors.full_name}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2"><Mail className="w-3.5 h-3.5" />Email</label>
              <input value={user?.email ?? ""} disabled className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <ValidatedInput
              label="Phone"
              icon={<Phone className="w-3.5 h-3.5" />}
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              error={errors.phone}
              placeholder="+62 xxx xxxx xxxx"
            />
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
}
