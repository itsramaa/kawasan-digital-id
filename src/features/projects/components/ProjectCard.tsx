import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Calendar, Building2, ArrowRight } from "lucide-react";
import { Project } from "../types";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

interface ProjectCardProps {
  project: Project;
}

const statusVariantMap: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning",
  "In Progress": "info",
  "On Hold": "hold",
  Completed: "success",
  Cancelled: "neutral",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="group hover:shadow-md transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="w-3.5 h-3.5" />
              <span>{project.clients?.name || "No Client"}</span>
            </div>
          </div>
          <StatusBadge 
            status={project.status} 
            variant={statusVariantMap[project.status] ?? "neutral"} 
          />
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-mono font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
          <Calendar className="w-3.5 h-3.5" />
          <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
