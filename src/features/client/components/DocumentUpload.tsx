import { useState, useRef } from "react";
import { Upload, FileText, Download, Loader2 } from "lucide-react";
import { useProjectDocuments, useUploadDocument } from "../hooks/useProjectDocuments";
import { supabase } from "@/integrations/supabase/client";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUpload({ projectId }: { projectId: string }) {
  const { data: documents, isLoading } = useProjectDocuments(projectId);
  const upload = useUploadDocument(projectId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    upload.mutate({ file, description: description.trim() || undefined }, {
      onSuccess: () => { setDescription(""); if (fileRef.current) fileRef.current.value = ""; }
    });
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from("project-documents")
      .download(filePath);
    if (error || !data) return;
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" /> Dokumen
      </h3>

      {/* Upload area */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Deskripsi (opsional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <label
          className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 hover:bg-muted/50 transition-colors"
          aria-label="Unggah file"
        >
          {upload.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">
            {upload.isPending ? "Mengunggah..." : "Klik untuk mengunggah file"}
          </span>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={upload.isPending}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.pptx,.xlsx"
          />
        </label>
      </div>

      {/* Document list */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-3">Memuat...</p>
      ) : !documents?.length ? (
        <p className="text-sm text-muted-foreground text-center py-3" role="status">Belum ada dokumen yang diunggah.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm truncate">{doc.file_name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatFileSize(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString("id-ID")}
                    {doc.description && ` · ${doc.description}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(doc.file_path, doc.file_name)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors flex-shrink-0"
                aria-label={`Unduh ${doc.file_name}`}
              >
                <Download className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
