import { Button } from '@/components/ui/button';

import type { Task } from '@/types/task';

type Props = {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
};

export default function TaskActions({
    task,
    onEdit,
    onDelete,
}: Props) {
    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(task)}
                className="flex-1 sm:flex-none"
            >
                Edit
            </Button>

            <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(task)}
                className="flex-1 sm:flex-none"
            >
                Delete
            </Button>
        </>
    );
}
