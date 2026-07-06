export interface AdminPaginationProps {
  onReload: () => void;
  onNext: () => void;
  canReload: boolean;
  canGoNext: boolean;
  reloadLabel: string;
  nextLabel: string;
}

/**
 * Shared cursor-pagination footer — replaces the identical button pair
 * copy-pasted across admin subscriptions/usage pages.
 */
export function AdminPagination({ onReload, onNext, canReload, canGoNext, reloadLabel, nextLabel }: AdminPaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded border border-border px-3 py-2 text-sm text-foreground/90 transition-colors hover:bg-muted/40 disabled:opacity-50"
        onClick={onReload}
        disabled={!canReload}
      >
        {reloadLabel}
      </button>
      <button
        type="button"
        className="rounded border border-border px-3 py-2 text-sm text-foreground/90 transition-colors hover:bg-muted/40 disabled:opacity-50"
        onClick={onNext}
        disabled={!canGoNext}
      >
        {nextLabel}
      </button>
    </div>
  );
}
