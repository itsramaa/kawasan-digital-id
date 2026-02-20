import { useState } from "react";
import { supabase } from "@/lib/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";

export const useClientProfileMutation = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const updateProfile = async (form: { full_name: string; phone: string }) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated");
    }
    setSaving(false);
  };

  return { updateProfile, saving };
};
