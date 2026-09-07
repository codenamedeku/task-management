<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $taskCounts = $user
            ->tasks()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $recentTasks = $user
            ->tasks()
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total' => $taskCounts->sum(),
                'pending' => $taskCounts->get(
                    TaskStatus::PENDING->value,
                    0,
                ),
                'in_progress' => $taskCounts->get(
                    TaskStatus::IN_PROGRESS->value,
                    0,
                ),
                'completed' => $taskCounts->get(
                    TaskStatus::COMPLETED->value,
                    0,
                ),
            ],
            'recentTasks' => $recentTasks,
        ]);
    }
}
