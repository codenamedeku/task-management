import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Circle,
    ListTodo,
    LoaderCircle,
    Plus,
} from 'lucide-react';
import { route } from 'ziggy-js';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    getTaskStatusLabel,
} from '@/constants/task-status';

import type { Task } from '@/types/task';

type DashboardStats = {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
};

type Props = {
    stats: DashboardStats;
    recentTasks: Task[];
};

type StatCard = {
    title: string;
    value: number;
    description: string;
    icon: typeof ListTodo;
};

const statCards = (
    stats: DashboardStats,
): StatCard[] => [
    {
        title: 'Total Tasks',
        value: stats.total,
        description: 'All your tasks',
        icon: ListTodo,
    },
    {
        title: 'Pending',
        value: stats.pending,
        description: 'Tasks waiting to be started',
        icon: Circle,
    },
    {
        title: 'In Progress',
        value: stats.in_progress,
        description: 'Tasks currently in progress',
        icon: LoaderCircle,
    },
    {
        title: 'Completed',
        value: stats.completed,
        description: 'Completed tasks',
        icon: CheckCircle2,
    },
];

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

export default function Dashboard({
    stats,
    recentTasks,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Dashboard
                        </h1>

                        <p className="text-muted-foreground">
                            Here's an overview of your tasks.
                        </p>
                    </div>

                    <Link href={route('tasks.index')}>
                        <Button>
                            <Plus />
                            New Task
                        </Button>
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards(stats).map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>

                                    <Icon className="size-4 text-muted-foreground" />
                                </CardHeader>

                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stat.value}
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Tasks */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            Recent Tasks
                        </CardTitle>

                        {recentTasks.length > 0 && (
                            <Link
                                href={route('tasks.index')}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View All
                            </Link>
                        )}
                    </CardHeader>

                    <CardContent>
                        {recentTasks.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    You don't have any tasks yet.
                                </p>

                                <Link
                                    href={route('tasks.index')}
                                    className="mt-4 inline-flex"
                                >
                                    <Button>
                                        <Plus />
                                        Create Your First Task
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {recentTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                    >
                                        <div className="min-w-0">
                                            <Link
                                                href={route(
                                                    'tasks.show',
                                                    task.id,
                                                )}
                                                className="font-medium hover:underline"
                                            >
                                                {task.title}
                                            </Link>

                                            {task.description && (
                                                <p className="mt-1 truncate text-sm text-muted-foreground">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex shrink-0 items-center gap-3">
                                            <Badge
                                                variant={getStatusVariant(
                                                    task.status,
                                                )}
                                            >
                                                {getTaskStatusLabel(
                                                    task.status,
                                                )}
                                            </Badge>

                                            {task.due_date && (
                                                <span className="hidden text-sm text-muted-foreground sm:inline">
                                                    {task.due_date}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
    ],
};
