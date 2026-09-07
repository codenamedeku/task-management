import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
    TASK_STATUSES,
    getTaskStatusLabel,
} from '@/constants/task-status';
import type { TaskForm as TaskFormData, TaskStatus } from '@/types/task';

type Props = {
    form: {
        data: TaskFormData;
        setData: (
            key: keyof TaskFormData,
            value: string,
        ) => void;
        errors: Partial<Record<keyof TaskFormData, string>>;
        processing: boolean;
    };
    onSubmit: () => void;
    submitLabel: string;
};

export default function TaskForm({
    form,
    onSubmit,
    submitLabel,
}: Props) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            className="space-y-4"
        >
            <div className="space-y-2">
                <Label htmlFor="title">
                    Title
                </Label>

                <Input
                    id="title"
                    value={form.data.title}
                    onChange={(event) =>
                        form.setData('title', event.target.value)
                    }
                    placeholder="Enter task title"
                />

                {form.errors.title && (
                    <p className="text-sm text-destructive">
                        {form.errors.title}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">
                    Description
                </Label>

                <Textarea
                    id="description"
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData(
                            'description',
                            event.target.value,
                        )
                    }
                    placeholder="Enter task description"
                />

                {form.errors.description && (
                    <p className="text-sm text-destructive">
                        {form.errors.description}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">
                    Status
                </Label>

                <Select
                    value={form.data.status}
                    onValueChange={(value) =>
                        form.setData(
                            'status',
                            value as TaskStatus,
                        )
                    }
                >
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent>
                        {TASK_STATUSES.map((status) => (
                            <SelectItem
                                key={status}
                                value={status}
                            >
                                {getTaskStatusLabel(status)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {form.errors.status && (
                    <p className="text-sm text-destructive">
                        {form.errors.status}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="due_date">
                    Due Date
                </Label>

                <Input
                    id="due_date"
                    type="date"
                    value={form.data.due_date}
                    onChange={(event) =>
                        form.setData(
                            'due_date',
                            event.target.value,
                        )
                    }
                />

                {form.errors.due_date && (
                    <p className="text-sm text-destructive">
                        {form.errors.due_date}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={form.processing}
            >
                {form.processing
                    ? 'Saving...'
                    : submitLabel}
            </Button>
        </form>
    );
}
