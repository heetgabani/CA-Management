import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { toast } from 'sonner';

// ── Generic helpers ──────────────────────────────────────────────────────────

export function useList<T>(key: (string | object)[], url: string, params?: object) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiClient.get(url, { params }).then(r => r.data),
    staleTime: 30_000,
  });
}

export function useDetail<T>(key: (string | object)[], url: string, enabled = true) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiClient.get(url).then(r => r.data.data),
    enabled,
    staleTime: 60_000,
  });
}

export function useCreate<T>(url: string, invalidate: string[], successMsg?: string) {
  const qc = useQueryClient();
  return useMutation<T, any, any>({
    mutationFn: (data) => apiClient.post(url, data).then(r => r.data.data),
    onSuccess: () => {
      invalidate.forEach(k => qc.invalidateQueries({ queryKey: [k] }));
      if (successMsg) toast.success(successMsg);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Something went wrong'),
  });
}

export function useUpdate<T>(url: string, invalidate: string[], successMsg?: string) {
  const qc = useQueryClient();
  return useMutation<T, any, any>({
    mutationFn: ({ id, ...data }) => apiClient.patch(`${url}/${id}`, data).then(r => r.data.data),
    onSuccess: () => {
      invalidate.forEach(k => qc.invalidateQueries({ queryKey: [k] }));
      if (successMsg) toast.success(successMsg);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Something went wrong'),
  });
}

export function useDelete(url: string, invalidate: string[], successMsg?: string) {
  const qc = useQueryClient();
  return useMutation<void, any, string>({
    mutationFn: (id) => apiClient.delete(`${url}/${id}`).then(r => r.data),
    onSuccess: () => {
      invalidate.forEach(k => qc.invalidateQueries({ queryKey: [k] }));
      if (successMsg) toast.success(successMsg);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Something went wrong'),
  });
}

// ── Domain hooks ─────────────────────────────────────────────────────────────

export const useClients = (params?: object) =>
  useList(['clients', params ?? {}], '/clients', params);

export const useClient = (id: string) =>
  useDetail(['client', id], `/clients/${id}`, !!id);

export const useCreateClient = () =>
  useCreate('/clients', ['clients'], 'Client created');

export const useUpdateClient = () =>
  useUpdate('/clients', ['clients'], 'Client updated');

export const useDeleteClient = () =>
  useDelete('/clients', ['clients'], 'Client deleted');

// Tasks
export const useTasks = (params?: object) =>
  useList(['tasks', params ?? {}], '/tasks', params);

export const useTask = (id: string) =>
  useDetail(['task', id], `/tasks/${id}`, !!id);

export const useCreateTask = () =>
  useCreate('/tasks', ['tasks'], 'Task created');

export const useUpdateTask = () =>
  useUpdate('/tasks', ['tasks'], 'Task updated');

export const useDeleteTask = () =>
  useDelete('/tasks', ['tasks'], 'Task deleted');

// Compliance
export const useCompliances = (params?: object) =>
  useList(['compliance', params ?? {}], '/compliance', params);

export const useCompliance = (id: string) =>
  useDetail(['compliance-detail', id], `/compliance/${id}`, !!id);

export const useCreateCompliance = () =>
  useCreate('/compliance', ['compliance'], 'Compliance record created');

export const useUpdateCompliance = () =>
  useUpdate('/compliance', ['compliance'], 'Compliance updated');

// Physical Files
export const usePhysicalFiles = (params?: object) =>
  useList(['physical-files', params ?? {}], '/physical-files', params);

export const usePhysicalFile = (id: string) =>
  useDetail(['physical-file', id], `/physical-files/${id}`, !!id);

// Staff
export const useStaff = (params?: object) =>
  useList(['staff', params ?? {}], '/users', params);

// Notifications
export const useNotifications = (params?: object) =>
  useList(['notifications', params ?? {}], '/notifications', params);

// Audit Logs
export const useAuditLogs = (params?: object) =>
  useList(['audit-logs', params ?? {}], '/audit', params);

// Dashboard
export const useDashboardStats = () =>
  useDetail(['dashboard-stats'], '/dashboard/stats');

export const useComplianceOverview = () =>
  useDetail(['compliance-overview'], '/dashboard/compliance-overview');
