import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInquiries } from '@/app/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
  const inquiries = await getInquiries();

  const stageCounts = {
    Leads: inquiries.filter((i) => ['New', 'Qualified'].includes(i.status)).length,
    Proposals: inquiries.filter((i) => i.status === 'Proposal_Sent').length,
    Closed: inquiries.filter((i) => ['Won', 'Lost', 'Rejected'].includes(i.status)).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">Sales pipeline and CRM overview.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(Object.entries(stageCounts) as [string, number][]).map(([stage, count]) => (
          <Card key={stage}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stage}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {inquiries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {/* TODO: replace with InquiryTable client component */}
            {(inquiries as any[]).slice(0, 10).map((inq) => (
              <div key={inq.id} className="flex items-center justify-between py-2 text-sm">
                <span>{inq.title}</span>
                <span className="text-muted-foreground">{inq.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
