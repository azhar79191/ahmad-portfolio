type PaginationProps = {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function Pagination({
  page, totalPages, totalCount, pageSize,
  hasNext, hasPrev, onPageChange, onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
        <span>Per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
        >
          {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <span>{totalCount} total</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-xs transition-colors"
        >
          ← Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
              page === p
                ? "bg-violet-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-xs transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
