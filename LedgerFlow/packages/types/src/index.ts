// =============================================================
// CA-MANAGE SHARED TYPES
// =============================================================

export type UserRole =
  | 'SUPER_ADMIN'
  | 'FIRM_OWNER'
  | 'PARTNER'
  | 'MANAGER'
  | 'ACCOUNTANT'
  | 'EXECUTIVE'
  | 'INTERN'
  | 'CLIENT';

export type ClientType =
  | 'INDIVIDUAL'
  | 'PROPRIETORSHIP'
  | 'PARTNERSHIP'
  | 'LLP'
  | 'PRIVATE_LIMITED'
  | 'PUBLIC_LIMITED'
  | 'TRUST'
  | 'NGO'
  | 'HUF';

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'PROSPECT';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplianceType =
  | 'GST_MONTHLY' | 'GST_QUARTERLY' | 'GST_ANNUAL'
  | 'TDS_QUARTERLY' | 'TDS_ANNUAL' | 'INCOME_TAX'
  | 'ADVANCE_TAX' | 'AUDIT' | 'ROC_ANNUAL' | 'ROC_EVENT'
  | 'PROFESSIONAL_TAX' | 'PF_MONTHLY' | 'ESI_MONTHLY'
  | 'DSC_RENEWAL' | 'CUSTOM';

export type DocumentCategory =
  | 'KYC' | 'GST' | 'INCOME_TAX' | 'AUDIT' | 'BANK_STATEMENTS'
  | 'AGREEMENTS' | 'LICENSES' | 'ROC' | 'DSC' | 'TDS'
  | 'FINANCIAL_STATEMENTS' | 'INSURANCE' | 'PROPERTY' | 'OTHER';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  tenantId: string;
  firmId?: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: string;
  createdAt: string;
}

export interface Client {
  id: string;
  tenantId: string;
  firmId: string;
  clientCode?: string;
  fileNumber?: string;
  clientType: ClientType;
  displayName: string;
  firstName?: string;
  lastName?: string;
  tradeName?: string;
  businessName?: string;
  primaryMobile?: string;
  primaryEmail?: string;
  pan?: string;
  gstin?: string;
  tan?: string;
  cin?: string;
  status: ClientStatus;
  createdAt: string;
  _count?: {
    documents: number;
    tasks: number;
    compliances: number;
  };
}

export interface Document {
  id: string;
  tenantId: string;
  clientId: string;
  folderId?: string;
  name: string;
  originalName: string;
  category: DocumentCategory;
  mimeType: string;
  size: number;
  extension: string;
  version: number;
  expiryDate?: string;
  tags: string[];
  createdAt: string;
  uploadedBy?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
}

export interface Task {
  id: string;
  tenantId: string;
  clientId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  assignee?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
}

export interface Compliance {
  id: string;
  tenantId: string;
  clientId: string;
  type: ComplianceType;
  title: string;
  status: string;
  priority: TaskPriority;
  dueDate: string;
  period?: string;
  financialYear?: string;
  createdAt: string;
  client?: Pick<Client, 'id' | 'displayName' | 'clientCode'>;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  overview: {
    totalClients: number;
    activeClients: number;
    pendingTasks: number;
    overdueTasks: number;
    dueSoonCompliances: number;
    expiringDocuments: number;
    clientsAddedThisMonth: number;
  };
  storage: { usedBytes: string; fileCount: number };
  tasks: { status: TaskStatus; count: number }[];
  recentActivities: any[];
}

// Permission matrix
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'],
  FIRM_OWNER: [
    'client:*', 'document:*', 'task:*', 'compliance:*',
    'staff:*', 'firm:*', 'reports:*', 'audit:read',
    'physical_file:*', 'reminder:*',
  ],
  PARTNER: [
    'client:*', 'document:*', 'task:*', 'compliance:*',
    'staff:read', 'firm:read', 'reports:read',
    'physical_file:*', 'reminder:*',
  ],
  MANAGER: [
    'client:read', 'client:update', 'document:*', 'task:*',
    'compliance:*', 'staff:read', 'physical_file:*', 'reminder:*',
  ],
  ACCOUNTANT: [
    'client:read', 'document:upload', 'document:read', 'document:download',
    'task:read', 'task:update', 'compliance:read', 'compliance:update',
    'physical_file:read',
  ],
  EXECUTIVE: [
    'client:read', 'document:upload', 'document:read',
    'task:read', 'compliance:read', 'physical_file:read',
  ],
  INTERN: ['client:read', 'document:read', 'task:read'],
  CLIENT: ['document:read', 'document:upload'],
};
