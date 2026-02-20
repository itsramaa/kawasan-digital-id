import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { useProject } from "@/features/projects/hooks/useProject";
import { useTasks } from "@/features/projects/hooks/useTasks";
import { TaskBoard } from "@/features/projects/components/TaskBoard";
import { CreateTaskDialog } from "@/features/projects/components/CreateTaskDialog";
import { EditProjectDialog } from "@/features/projects/components/EditProjectDialog";
import { useDeleteProject } from "@/features/projects/hooks/useDeleteProject";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { ArrowLeft, Calendar, Building2, Clock, Trash2, FileText, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

const statusVariantMap: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning",
  "In Progress": "info",
  "On Hold": "hold",
  Completed: "success",
  Cancelled: "neutral",
};

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading: isProjectLoading } = useProject(id!);
  const { data: tasks, isLoading: isTasksLoading } = useTasks(id);
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  if (isProjectLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <Button 
            variant="ghost" 
            className="w-fit pl-0 hover:pl-2 transition-all" 
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                <StatusBadge 
                  status={project.status} 
                  variant={statusVariantMap[project.status] ?? "neutral"} 
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>{project.clients?.name || "No Client"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Due {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No date"}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex gap-3">
              <EditProjectDialog project={project} />
              <CreateTaskDialog projectId={id!} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description || "No description provided for this project."}
                  </p>
                </div>

                <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Project Progress</h3>
                    <span className="font-mono font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="font-medium text-sm">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="font-medium text-sm">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Tasks</p>
                      <p className="font-medium text-sm">{tasks?.length || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Team Members</p>
                      <p className="font-medium text-sm">—</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 text-sm">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                      <div>
                        <p className="font-medium">Project status updated</p>
                        <p className="text-muted-foreground text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <div className="mt-1 w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">New task added</p>
                        <p className="text-muted-foreground text-xs">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            {isTasksLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="h-[300px] bg-muted/20 animate-pulse rounded-lg border border-border" />
                 ))}
               </div>
            ) : (
              <TaskBoard tasks={tasks || []} />
            )}
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Project Files</CardTitle>
                    <CardDescription>Manage documents and assets for this project.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" /> Upload File
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <FileText className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No files uploaded yet</p>
                  <p className="text-sm">Upload requirements, contracts, or design assets here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions for this project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-destructive">Delete Project</h4>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete the project and all its associated tasks.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Project
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          project <strong>{project.name}</strong> and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => deleteProject(project.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function FolderKanban({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
}
