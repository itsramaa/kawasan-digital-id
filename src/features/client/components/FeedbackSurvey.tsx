import { useState } from "react";
import { Star, MessageSquare, CheckCircle } from "lucide-react";
import { useProjectFeedback, useSubmitFeedback } from "../hooks/useProjectFeedback";
import { cn } from "@/shared/utils/utils";

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-0.5" role="group" aria-label={`Rating ${label}`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(s)}
            className="p-0.5"
            aria-label={`${s} bintang`}
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                (hover || value) >= s
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function FeedbackSurvey({ projectId }: { projectId: string }) {
  const { data: existing, isLoading } = useProjectFeedback(projectId);
  const submit = useSubmitFeedback(projectId);

  const [overall, setOverall] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [quality, setQuality] = useState(0);
  const [timeliness, setTimeliness] = useState(0);
  const [comments, setComments] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);

  if (isLoading) return null;

  if (existing) {
    return (
      <div className="bg-card rounded-lg border border-border p-5 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" /> Feedback Terkirim
        </h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={cn("w-4 h-4", existing.overall_rating >= s ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
          ))}
          <span className="text-sm text-muted-foreground ml-2">
            Keseluruhan: {existing.overall_rating}/5
          </span>
        </div>
        {existing.comments && <p className="text-sm text-muted-foreground">{existing.comments}</p>}
        <p className="text-xs text-muted-foreground">Dikirim {new Date(existing.created_at).toLocaleDateString("id-ID")}</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (overall === 0) return;
    submit.mutate({
      overall_rating: overall,
      communication_rating: communication || undefined,
      quality_rating: quality || undefined,
      timeliness_rating: timeliness || undefined,
      comments: comments.trim() || undefined,
      would_recommend: recommend ?? undefined,
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" /> Bagaimana pengalaman Anda?
      </h3>

      <div className="space-y-3">
        <StarRating value={overall} onChange={setOverall} label="Keseluruhan *" />
        <StarRating value={communication} onChange={setCommunication} label="Komunikasi" />
        <StarRating value={quality} onChange={setQuality} label="Kualitas" />
        <StarRating value={timeliness} onChange={setTimeliness} label="Ketepatan Waktu" />
      </div>

      <div>
        <label className="text-sm text-muted-foreground">Apakah Anda akan merekomendasikan kami?</label>
        <div className="flex gap-2 mt-1">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setRecommend(val)}
              aria-pressed={recommend === val}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                recommend === val
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {val ? "Ya" : "Tidak"}
            </button>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Komentar tambahan..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
        maxLength={1000}
      />

      <button
        onClick={handleSubmit}
        disabled={overall === 0 || submit.isPending}
        className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submit.isPending ? "Mengirim..." : "Kirim Feedback"}
      </button>
    </div>
  );
}
