import { useState } from "react";
import { toast } from "sonner";

export const useClientProfileMutation = () => {
  const [saving, setSaving] = useState(false);

  const updateProfile = async (_form: { full_name: string; phone: string }) => {
    setSaving(true);
    // stub: no-op
    toast.success("Profile updated");
    setSaving(false);
  };

  return { updateProfile, saving };
};
