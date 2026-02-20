import { Link } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <StorefrontLayout>
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. Our team will review your request and get back to you shortly via email.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/store"
            className="px-5 py-2.5 rounded-lg border border-border font-medium hover:bg-muted transition-colors text-sm"
          >
            Back to Home
          </Link>
          <Link
            to="/store/templates"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            Browse More Templates
          </Link>
        </div>
      </div>
    </StorefrontLayout>
  );
}
