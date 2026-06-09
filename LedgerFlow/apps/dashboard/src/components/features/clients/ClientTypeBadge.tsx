export function ClientTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    INDIVIDUAL: 'Individual',
    PROPRIETORSHIP: 'Proprietorship',
    PARTNERSHIP: 'Partnership',
    LLP: 'LLP',
    PRIVATE_LIMITED: 'Pvt Ltd',
    PUBLIC_LIMITED: 'Ltd',
    TRUST: 'Trust',
    NGO: 'NGO',
    HUF: 'HUF',
  };
  return <span className="badge-default">{labels[type] || type}</span>;
}
