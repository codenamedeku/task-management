export type TaskStatus =
    | 'pending'
    | 'in_progress'
    | 'completed';

export type Task = {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    due_date: string | null;
    created_at: string;
    updated_at: string;
};

export type TaskForm = {
    title: string;
    description: string;
    status: TaskStatus;
    due_date: string;
};
