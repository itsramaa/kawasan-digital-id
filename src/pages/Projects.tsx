import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search, Plus, Filter, MoreHorizontal, Calendar, Users } from "lucide-react";

const projects = [
  { id: "PRJ-001", name: "E-Commerce Revamp", client: "PT Maju Jaya", pm: "Diana", status: "In Progress", statusVariant: "info" as const, progress: 65, deadline: "2026-03-15", team: 4 },
  { id: "PRJ-002", name: "SaaS Dashboard", client: "CV Mandiri Tech", pm: "Diana", status: "In Progress", statusVariant: "info" as const, progress: 40, deadline: "2026-04-01", team: 3 },
  { id: "PRJ-003", name: "Corporate Portal", client: "PT Sentosa Group", pm: "Eko", status: "Planning", statusVariant: "warning" as const, progress: 10, deadline: "2026-05-10", team: 2 },
  { id: "PRJ-004", name: "Mobile Landing Page", client: "CV Digital Nusantara", pm: "Diana", status: "On Hold", statusVariant: "hold" as const, progress: 30, deadline: "2026-03-20", team: 2 },
  { id: "PRJ-005", name: "Booking System", client: "PT Indo Digital", pm: "Eko", status: "In Progress", statusVariant: "info" as const, progress: 82, deadline: "2026-02-28", team: 5 },
  { id: "PRJ-006", name: "Blog & Portfolio", client: "CV Kreatif Media", pm: "Diana", status: "Completed", statusVariant: "success" as const, progress: 100, deadline: "2026-02-10", team: 2 },
  { id: "PRJ-007", name: "Inventory System", client: "PT Abadi Sejahtera", pm: "Eko", status: "In Progress", statusVariant: "info" as const, progress: 55, deadline: "2026-03-30", team: 4 },
];

export default function Projects() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Track project delivery and milestones</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-card rounded-lg border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-[11px] text-muted-foreground">{project.id}</p>
                  <h3 className="font-semibold text-card-foreground mt-0.5 group-hover:text-primary transition-colors">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <StatusBadge status={project.status} variant={project.statusVariant} />
              </div>

              {/* Progress */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-mono font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.deadline}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{project.team} members</span>
                </div>
                <span>PM: {project.pm}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
