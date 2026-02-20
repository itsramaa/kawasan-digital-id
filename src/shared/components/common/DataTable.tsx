import { ReactNode, useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | Date;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  searchPlaceholder?: string;
  searchField?: (row: T) => string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  pageSize?: number;
  pageSizeOptions?: number[];
  actions?: ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data found.",
  emptyIcon,
  searchPlaceholder = "Search...",
  searchField,
  onRowClick,
  rowClassName,
  pageSize: defaultPageSize = 25,
  pageSizeOptions = [25, 50, 100],
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filtered = useMemo(() => {
    let result = data;
    if (searchField && search) {
      const lower = search.toLowerCase();
      result = result.filter((row) => searchField(row).toLowerCase().includes(lower));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        result = [...result].sort((a, b) => {
          const va = col.sortValue!(a);
          const vb = col.sortValue!(b);
          const cmp = va < vb ? -1 : va > vb ? 1 : 0;
          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }
    return result;
  }, [data, search, searchField, sortKey, sortDir, columns]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, filtered.length);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "desc") { setSortKey(null); setSortDir("asc"); }
      else setSortDir("desc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        {searchField && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
        {actions}
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "text-left px-4 py-3 font-medium text-muted-foreground",
                      col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors",
                      col.className
                    )}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="ml-0.5">
                          {sortKey === col.key ? (
                            sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="h-4 bg-muted/40 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                    {emptyIcon && <div className="flex justify-center mb-3">{emptyIcon}</div>}
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      onRowClick && "cursor-pointer",
                      rowClassName?.(row)
                    )}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3", col.className)}>
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Showing {from}–{to} of {filtered.length}</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                className="bg-card border border-border rounded px-1.5 py-0.5 text-xs"
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>{n} rows</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-7 h-7 rounded text-xs font-medium",
                      p === page ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    {p + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}