export function ClientStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'badge-success',
    INACTIVE: 'badge-warning',
    CLOSED: 'badge-danger',
    PROSPECT: 'badge-info',
  };
  return <span className={map[status] || 'badge-default'}>{status}</span>;
}
