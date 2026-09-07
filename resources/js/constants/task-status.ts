import type { TaskStatus } from '@/types/task';

export const TASK_STATUSES: TaskStatus[] = [
    'pending',
    'in_progress',
    'completed',
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
};

export function getTaskStatusLabel(
    status: TaskStatus,
): string {
    return TASK_STATUS_LABELS[status];
}
