import { Head, Link } from '@inertiajs/react';

import { CalendarDays } from 'lucide-react';

import { route } from 'ziggy-js';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { getTaskStatusLabel } from '@/constants/task-status';

import type { Task } from '@/types/task';

import TaskManager from './components/task-manager';
import TaskActions from './components/task-actions';

type Props = {
    task: Task;
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

function formatDate(date: string | null): string {
    if (!date) {
        return 'No due date';
    }

    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
    }).format(new Date(date));
}

function formatDateTime(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

export default function TaskShow({ task }: Props) {
    return (
        <>
            <Head title={task.title} />

            <TaskManager>
                {({
                    openEditDialog,
                    openDeleteDialog,
                }) => (
                    <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <h1 className="wrap-break-word text-2xl font-semibold">
                                    {task.title}
                                </h1>

                                <p className="mt-1 text-muted-foreground">
                                    Task details.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <TaskActions
                                    task={task}
                                    onEdit={openEditDialog}
                                    onDelete={openDeleteDialog}
                                />

                                <Link
                                    href={route('tasks.index')}
                                >
                                    <Button variant="outline">
                                        Back to Tasks
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Task Card */}
                        <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
                            <div className="space-y-6">
                                {/* Description */}
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Description
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap wrap-break-word leading-6">
                                        {task.description ||
                                            'No description.'}
                                    </p>
                                </div>

                                {/* Metadata */}
                                <div className="border-t pt-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        {/* Status */}
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Status
                                            </p>

                                            <div className="mt-2">
                                                <Badge
                                                    variant={getStatusVariant(
                                                        task.status,
                                                    )}
                                                >
                                                    {getTaskStatusLabel(
                                                        task.status,
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Due Date */}
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Due Date
                                            </p>

                                            <div className="mt-2 flex items-center gap-1.5 text-sm">
                                                <CalendarDays className="size-4 shrink-0 text-muted-foreground" />

                                                <span>
                                                    {formatDate(
                                                        task.due_date,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Created At */}
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Created At
                                            </p>

                                            <p className="mt-2 text-sm">
                                                {formatDateTime(
                                                    task.created_at,
                                                )}
                                            </p>
                                        </div>

                                        {/* Updated At */}
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Updated At
                                            </p>

                                            <p className="mt-2 text-sm">
                                                {formatDateTime(
                                                    task.updated_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </TaskManager>
        </>
    );
}

TaskShow.layout = {
    breadcrumbs: [
        {
            title: 'Tasks',
            href: route('tasks.index'),
        },
        {
            title: 'View Task',
            href: route('tasks.index'),
        },
    ],
};
