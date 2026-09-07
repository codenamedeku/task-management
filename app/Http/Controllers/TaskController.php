<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskFilterRequest;
use App\Http\Requests\TaskRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index(TaskFilterRequest $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $tasks = $user
            ->tasks()
            ->search($request->validated('search', ''))
            ->status($request->validated('status', ''))
            ->sortBy($request->validated('sort', 'newest'))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'filters' => [
                'search' => $request->validated('search', ''),
                'status' => $request->validated('status', ''),
                'sort' => $request->validated('sort', 'newest'),
            ],
        ]);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task): Response
    {
        return Inertia::render('tasks/show', [
            'task' => $task,
        ]);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(TaskRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $user->tasks()->create($request->validated());

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task berhasil dibuat.');
    }

    /**
     * Update the specified task.
     */
    public function update(
        TaskRequest $request,
        Task $task,
    ): RedirectResponse {
        $task->update($request->validated());

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task berhasil diperbarui.');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task berhasil dihapus.');
    }
}
