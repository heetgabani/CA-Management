import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  firmName: z.string().min(2).max(100),
  firmEmail: z.string().email(),
  firmPhone: z.string().optional(),
  gstNumber: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const createClientSchema = z.object({
  clientType: z.enum(['INDIVIDUAL','PROPRIETORSHIP','PARTNERSHIP','LLP','PRIVATE_LIMITED','PUBLIC_LIMITED','TRUST','NGO','HUF']),
  displayName: z.string().min(2).max(200),
  clientCode: z.string().optional(),
  fileNumber: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  tradeName: z.string().optional(),
  businessName: z.string().optional(),
  primaryMobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number').optional().or(z.literal('')),
  primaryEmail: z.string().email().optional().or(z.literal('')),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN').optional().or(z.literal('')),
  aadhaar: z.string().length(12).optional().or(z.literal('')),
  gstin: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Invalid GSTIN').optional().or(z.literal('')),
  tan: z.string().optional(),
  cin: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(2).max(500),
  description: z.string().optional(),
  status: z.enum(['PENDING','IN_PROGRESS','UNDER_REVIEW','COMPLETED','CANCELLED','ON_HOLD']).default('PENDING'),
  priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']).default('MEDIUM'),
  clientId: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
});

export const createComplianceSchema = z.object({
  type: z.string(),
  title: z.string().min(2).max(500),
  clientId: z.string(),
  dueDate: z.string().datetime(),
  period: z.string().optional(),
  financialYear: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']).default('MEDIUM'),
});

export * from 'zod';
