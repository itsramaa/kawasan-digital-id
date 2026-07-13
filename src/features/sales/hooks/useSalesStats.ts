export function useSalesStats() {
  const recentInquiries: any[] = [];

  const pipelineSummary = [
    { stage: "New Inquiries", count: 0, color: "info" as const },
    { stage: "Qualified", count: 0, color: "warning" as const },
    { stage: "Proposal Sent", count: 0, color: "hold" as const },
    { stage: "Won", count: 0, color: "success" as const },
  ];

  return { recentInquiries, pipelineSummary };
}
