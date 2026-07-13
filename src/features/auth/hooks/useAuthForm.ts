import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const toggleLogin = () => setIsLogin(!isLogin);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // stub: no real auth
      toast.info("Auth is not yet implemented.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    isLogin,
    showPassword,
    loading,
    form,
    toggleLogin,
    togglePasswordVisibility,
    updateForm,
    handleSubmit,
  };
}
