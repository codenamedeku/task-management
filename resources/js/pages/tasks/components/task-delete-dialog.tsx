import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Props = {
    open: boolean;
    taskTitle: string | null;
    processing: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

export default function TaskDeleteDialog({
    open,
    taskTitle,
    processing,
    onOpenChange,
    onConfirm,
}: Props) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete Task?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <strong>
                            {taskTitle}
                        </strong>
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {processing
                            ? 'Deleting...'
                            : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
