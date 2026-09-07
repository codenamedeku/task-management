import { Link } from '@inertiajs/react';
import { CalendarDays } from 'lucide-react';
import { route } from 'ziggy-js';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { getTaskStatusLabel } from '@/constants/task-status';

import type { Task } from '@/types/task';

import TaskActions from './task-actions';

type Props = {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
};

function getStatusVariant(
    status: Task['status'],
): 'default' | 'secondary' | 'outline' {
    if (status === 'completed') {
        return 'default';
    }

    if (status === 'in_progress') {
        return 'secondary';
    }

    return 'outline';
}

export default function TaskCard({
    task,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex min-w-0 flex-col gap-4">
                {/* Task Information */}
                <div className="min-w-0">
                    <Link
                        href={route(
                            'tasks.show',
                            task.id,
                        )}
                        className="block"
                    >
                        <h2 className="wrap-break-word font-medium leading-6 hover:underline">
                            {task.title}
                        </h2>
                    </Link>

                    {task.description && (
                        <p className="mt-1 line-clamp-2 wrap-break-word text-sm leading-5 text-muted-foreground">
                            {task.description}
                        </p>
                    )}
                </div>

                {/* Metadata + Actions */}
                <div className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Metadata */}
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <Badge
                            variant={getStatusVariant(
                                task.status,
                            )}
                        >
                            {getTaskStatusLabel(task.status)}
                        </Badge>

                        {task.due_date && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <CalendarDays className="size-4 shrink-0" />

                                <span>
                                    Due: {task.due_date}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <Link
                            href={route(
                                'tasks.show',
                                task.id,
                            )}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                            >
                                View
                            </Button>
                        </Link>

                        <TaskActions
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
