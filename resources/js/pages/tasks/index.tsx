import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    TASK_STATUSES,
    getTaskStatusLabel,
} from '@/constants/task-status';

import type { AppPageProps } from '@/types';
import type {
    Task,
    TaskForm as TaskFormData,
} from '@/types/task';

import TaskCard from './components/task-card';
import TaskForm from './components/task-form';
import TaskManager from './components/task-manager';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedTasks = {
    data: Task[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type Props = {
    tasks: PaginatedTasks;
    filters: {
        search: string;
        status: string;
        sort: string;
    };
};

export default function TasksIndex({
    tasks,
    filters,
}: Props) {
    const { flash } = usePage<AppPageProps>().props;

    const [createOpen, setCreateOpen] = useState(false);

    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const [sort, setSort] = useState(
        filters.sort || 'newest',
    );

    const createForm = useForm<TaskFormData>({
        title: '',
        description: '',
        status: 'pending',
        due_date: '',
    });

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    function submitSearch(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        router.get(
            route('tasks.index'),
            {
                search: search || undefined,
                status: status || undefined,
                sort: sort || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function handleStatusChange(value: string) {
        const nextStatus =
            value === 'all' ? '' : value;

        setStatus(nextStatus);

        router.get(
            route('tasks.index'),
            {
                search: search || undefined,
                status: nextStatus || undefined,
                sort: sort || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function handleSortChange(value: string) {
        setSort(value);

        router.get(
            route('tasks.index'),
            {
                search: search || undefined,
                status: status || undefined,
                sort: value || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function clearFilters() {
        setSearch('');
        setStatus('');
        setSort('newest');

        router.get(
            route('tasks.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function submitCreate() {
        createForm.post(route('tasks.store'), {
            onSuccess: () => {
                createForm.reset();
                setCreateOpen(false);
            },
        });
    }

    const hasActiveFilters =
        Boolean(filters.search) ||
        Boolean(filters.status) ||
        filters.sort !== 'newest';

    return (
        <>
            <Head title="Tasks" />

            <TaskManager>
                {({
                    openEditDialog,
                    openDeleteDialog,
                }) => (
                    <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Tasks
                                </h1>

                                <p className="text-muted-foreground">
                                    Manage your tasks.
                                </p>
                            </div>

                            {/* Create Task */}
                            <Dialog
                                open={createOpen}
                                onOpenChange={setCreateOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button className="w-full sm:w-auto">
                                        Create Task
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Create Task
                                        </DialogTitle>

                                        <DialogDescription>
                                            Create a new task for your task list.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <TaskForm
                                        form={createForm}
                                        onSubmit={submitCreate}
                                        submitLabel="Create Task"
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Filters */}
                        <div className="rounded-xl border bg-card p-4">
                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto] lg:items-end">
                                {/* Search */}
                                <form
                                    onSubmit={submitSearch}
                                    className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
                                >
                                    <div className="grid gap-2">
                                        <Label htmlFor="search">
                                            Search
                                        </Label>

                                        <Input
                                            id="search"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Search tasks..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto"
                                    >
                                        Search
                                    </Button>
                                </form>

                                {/* Status */}
                                <div className="grid gap-2">
                                    <Label htmlFor="status-filter">
                                        Status
                                    </Label>

                                    <Select
                                        value={
                                            status || 'all'
                                        }
                                        onValueChange={
                                            handleStatusChange
                                        }
                                    >
                                        <SelectTrigger
                                            id="status-filter"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Statuses
                                            </SelectItem>

                                            {TASK_STATUSES.map(
                                                (taskStatus) => (
                                                    <SelectItem
                                                        key={
                                                            taskStatus
                                                        }
                                                        value={
                                                            taskStatus
                                                        }
                                                    >
                                                        {getTaskStatusLabel(
                                                            taskStatus,
                                                        )}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sort */}
                                <div className="grid gap-2">
                                    <Label htmlFor="sort">
                                        Sort
                                    </Label>

                                    <Select
                                        value={sort}
                                        onValueChange={
                                            handleSortChange
                                        }
                                    >
                                        <SelectTrigger
                                            id="sort"
                                            className="w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="newest">
                                                Newest
                                            </SelectItem>

                                            <SelectItem value="oldest">
                                                Oldest
                                            </SelectItem>

                                            <SelectItem value="due_asc">
                                                Due Date: Nearest
                                            </SelectItem>

                                            <SelectItem value="due_desc">
                                                Due Date: Furthest
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Clear */}
                                <div className="flex items-end">
                                    {hasActiveFilters && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={clearFilters}
                                            className="w-full lg:w-auto"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Task List */}
                        {tasks.data.length === 0 ? (
                            <div className="rounded-xl border p-6 text-center">
                                <p className="text-muted-foreground">
                                    {filters.search ||
                                    filters.status
                                        ? 'Tidak ada task yang sesuai dengan filter.'
                                        : 'Belum ada task.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    {tasks.data.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onEdit={
                                                openEditDialog
                                            }
                                            onDelete={
                                                openDeleteDialog
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    {/* Result Information */}
                                    <p className="text-sm text-muted-foreground">
                                        Showing{' '}
                                        <span className="font-medium text-foreground">
                                            {tasks.from ?? 0}
                                        </span>
                                        {'–'}
                                        <span className="font-medium text-foreground">
                                            {tasks.to ?? 0}
                                        </span>
                                        {' of '}
                                        <span className="font-medium text-foreground">
                                            {tasks.total}
                                        </span>
                                        {' tasks'}
                                    </p>

                                    {/* Pagination Controls */}
                                    <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                                        {/* Previous */}
                                        {tasks.links.length > 0 && (
                                            <Link
                                                href={
                                                    tasks.links[0]
                                                        .url ?? '#'
                                                }
                                                className={
                                                    tasks.links[0]
                                                        .url
                                                        ? 'shrink-0'
                                                        : 'pointer-events-none shrink-0'
                                                }
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={
                                                        !tasks.links[0]
                                                            .url
                                                    }
                                                    className="gap-1"
                                                >
                                                    <ChevronLeft className="size-4" />

                                                    <span className="hidden sm:inline">
                                                        Previous
                                                    </span>
                                                </Button>
                                            </Link>
                                        )}

                                        {/* Page Numbers */}
                                        <div className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto">
                                            {tasks.links
                                                .slice(
                                                    1,
                                                    -1,
                                                )
                                                .map(
                                                    (
                                                        link,
                                                        index,
                                                    ) => {
                                                        if (
                                                            !link.url
                                                        ) {
                                                            return (
                                                                <Button
                                                                    key={
                                                                        index
                                                                    }
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled
                                                                    className="size-8 shrink-0 p-0"
                                                                >
                                                                    <span
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                link.label,
                                                                        }}
                                                                    />
                                                                </Button>
                                                            );
                                                        }

                                                        return (
                                                            <Link
                                                                key={
                                                                    index
                                                                }
                                                                href={
                                                                    link.url
                                                                }
                                                                className="shrink-0"
                                                            >
                                                                <Button
                                                                    variant={
                                                                        link.active
                                                                            ? 'default'
                                                                            : 'outline'
                                                                    }
                                                                    size="sm"
                                                                    className="size-8 p-0"
                                                                >
                                                                    <span
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                link.label,
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </Link>
                                                        );
                                                    },
                                                )}
                                        </div>

                                        {/* Next */}
                                        {tasks.links.length > 1 && (
                                            <Link
                                                href={
                                                    tasks.links[
                                                        tasks
                                                            .links
                                                            .length -
                                                            1
                                                    ].url ??
                                                    '#'
                                                }
                                                className={
                                                    tasks.links[
                                                        tasks
                                                            .links
                                                            .length -
                                                            1
                                                    ].url
                                                        ? 'shrink-0'
                                                        : 'pointer-events-none shrink-0'
                                                }
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={
                                                        !tasks
                                                            .links[
                                                            tasks
                                                                .links
                                                                .length -
                                                                1
                                                        ].url
                                                    }
                                                    className="gap-1"
                                                >
                                                    <span className="hidden sm:inline">
                                                        Next
                                                    </span>

                                                    <ChevronRight className="size-4" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </TaskManager>
        </>
    );
}

TasksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Tasks',
            href: route('tasks.index'),
        },
    ],
};
