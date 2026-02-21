import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface DetailBreadcrumbProps {
  category: string | null;
  templateName: string;
}

export function DetailBreadcrumb({ category, templateName }: DetailBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
      <Link to="/store" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
      <Link to="/store/templates" className="hover:text-foreground transition-colors">
        Templates
      </Link>
      {category && (
        <>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            to={`/store/templates?category=${encodeURIComponent(category)}`}
            className="hover:text-foreground transition-colors"
          >
            {category}
          </Link>
        </>
      )}
      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
      <span className="text-foreground font-medium truncate max-w-[200px]">{templateName}</span>
    </nav>
  );
}
