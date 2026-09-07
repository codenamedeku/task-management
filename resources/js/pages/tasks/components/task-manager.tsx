import { useForm } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { route } from 'ziggy-js';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import TaskDeleteDialog from './task-delete-dialog';
import TaskForm from './task-form';

import type {
    Task,
    TaskForm as TaskFormData,
} from '@/types/task';

export type TaskManagerActions = {
    openEditDialog: (task: Task) => void;
    openDeleteDialog: (task: Task) => void;
};

type Props = {
    children: (actions: TaskManagerActions) => ReactNode;
};

export default function TaskManager({
    children,
}: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [editingTask, setEditingTask] = useState<Task | null>(
        null,
    );

    const [deletingTask, setDeletingTask] = useState<Task | null>(
        null,
    );

    const editForm = useForm<TaskFormData>({
        title: '',
        description: '',
        status: 'pending',
        due_date: '',
    });

    const deleteForm = useForm({});

    function openEditDialog(task: Task) {
        setEditingTask(task);

        editForm.setData({
            title: task.title,
            description: task.description ?? '',
            status: task.status,
            due_date: task.due_date ?? '',
        });

        setEditOpen(true);
    }

    function submitEdit() {
        if (!editingTask) {
            return;
        }

        editForm.put(
            route('tasks.update', editingTask.id),
            {
                onSuccess: () => {
                    setEditOpen(false);
                    setEditingTask(null);
                    editForm.reset();
                },
            },
        );
    }

    function openDeleteDialog(task: Task) {
        setDeletingTask(task);
        setDeleteOpen(true);
    }

    function deleteTask() {
        if (!deletingTask) {
            return;
        }

        deleteForm.delete(
            route('tasks.destroy', deletingTask.id),
            {
                onSuccess: () => {
                    setDeleteOpen(false);
                    setDeletingTask(null);
                },
            },
        );
    }

    return (
        <>
            {children({
                openEditDialog,
                openDeleteDialog,
            })}

            {/* Edit Task */}
            <Dialog
                open={editOpen}
                onOpenChange={setEditOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Edit Task
                        </DialogTitle>

                        <DialogDescription>
                            Update the information for this task.
                        </DialogDescription>
                    </DialogHeader>

                    <TaskForm
                        form={editForm}
                        onSubmit={submitEdit}
                        submitLabel="Save Changes"
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <TaskDeleteDialog
                open={deleteOpen}
                taskTitle={deletingTask?.title ?? null}
                processing={deleteForm.processing}
                onOpenChange={setDeleteOpen}
                onConfirm={deleteTask}
            />
        </>
    );
}
