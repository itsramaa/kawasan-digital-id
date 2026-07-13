export function useFinanceStats() {
  return {
    totalRevenue: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    recentPayments: [] as any[],
    isLoading: false,
  };
}
