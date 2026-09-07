<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Tests\TestCase;

class TaskTest extends TestCase
{
    public function test_guests_are_redirected_to_the_login_page_when_visiting_tasks(): void
    {
        $response = $this->get(route('tasks.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_their_tasks(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('tasks.index'));

        $response->assertSuccessful();

        $response->assertInertia(
            fn($page) => $page
                ->component('tasks/index')
                ->has('tasks')
                ->has('filters'),
        );
    }

    public function test_authenticated_users_can_create_a_task(): void
    {
        $user = User::factory()->create();

        $taskData = [
            'title' => 'Learn Laravel Testing',
            'description' => 'Practice feature testing with Laravel.',
            'status' => 'pending',
            'due_date' => '2026-09-30',
        ];

        $response = $this
            ->actingAs($user)
            ->post(route('tasks.store'), $taskData);

        $response->assertRedirect(route('tasks.index'));

        $this->assertDatabaseHas('tasks', [
            'user_id' => $user->id,
            'title' => $taskData['title'],
            'description' => $taskData['description'],
            'status' => $taskData['status'],
            'due_date' => $taskData['due_date'],
        ]);
    }

    public function test_users_cannot_view_another_users_task(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $task = $otherUser->tasks()->create([
            'title' => 'Another User Task',
            'description' => 'This task belongs to another user.',
            'status' => 'pending',
            'due_date' => '2026-09-30',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('tasks.show', $task));

        $response->assertForbidden();
    }

    public function test_users_can_view_their_own_task(): void
    {
        $user = User::factory()->create();

        $task = $user->tasks()->create([
            'title' => 'My Task',
            'description' => 'My task description.',
            'status' => 'pending',
            'due_date' => '2026-09-30',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('tasks.show', $task));

        $response->assertSuccessful();

        $response->assertInertia(
            fn($page) => $page
                ->component('tasks/show')
                ->where('task.id', $task->id)
                ->where('task.title', 'My Task'),
        );
    }

    public function test_users_can_update_their_own_task(): void
    {
        $user = User::factory()->create();

        $task = $user->tasks()->create([
            'title' => 'Old Task Title',
            'description' => 'Old description.',
            'status' => 'pending',
            'due_date' => '2026-09-30',
        ]);

        $taskData = [
            'title' => 'Updated Task Title',
            'description' => 'Updated description.',
            'status' => 'in_progress',
            'due_date' => '2026-10-15',
        ];

        $response = $this
            ->actingAs($user)
            ->put(route('tasks.update', $task), $taskData);

        $response->assertRedirect(route('tasks.index'));

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'user_id' => $user->id,
            'title' => $taskData['title'],
            'description' => $taskData['description'],
            'status' => $taskData['status'],
            'due_date' => $taskData['due_date'],
        ]);
    }

    public function test_users_cannot_update_another_users_task(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $task = $otherUser->tasks()->create([
            'title' => 'Original Title',
            'description' => 'Original description.',
            'status' => 'pending',
            'due_date' => '2026-09-30',
        ]);

        $response = $this
            ->actingAs($user)
            ->put(route('tasks.update', $task), [
                'title' => 'Unauthorized Update',
                'description' => 'This should not be saved.',
                'status' => 'completed',
                'due_date' => '2026-10-15',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Original Title',
            'status' => 'pending',
        ]);
    }

    public function test_users_can_delete_their_own_task(): void
    {
        $user = User::factory()->create();

        $task = $user->tasks()->create([
            'title' => 'Task To Delete',
            'description' => 'This task will be deleted.',
            'status' => 'pending',
            'due_date' => '2026-09-30',
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('tasks.destroy', $task));

        $response->assertRedirect(route('tasks.index'));

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_users_cannot_delete_another_users_task(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $task = $otherUser->tasks()->create([
            'title' => 'Protected Task',
            'description' => 'This task must not be deleted.',
            'status' => 'pending',
            'due_date' => '2026-09-30',
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('tasks.destroy', $task));

        $response->assertForbidden();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_task_creation_requires_a_title(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('tasks.store'), [
                'description' => 'Task without a title.',
                'status' => 'pending',
                'due_date' => '2026-09-30',
            ]);

        $response->assertSessionHasErrors('title');

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_task_creation_requires_a_valid_status(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('tasks.store'), [
                'title' => 'Invalid Status Task',
                'description' => 'This should fail validation.',
                'status' => 'invalid_status',
                'due_date' => '2026-09-30',
            ]);

        $response->assertSessionHasErrors('status');

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_task_creation_rejects_an_invalid_due_date(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('tasks.store'), [
                'title' => 'Invalid Date Task',
                'description' => 'This should fail validation.',
                'status' => 'pending',
                'due_date' => 'not-a-date',
            ]);

        $response->assertSessionHasErrors('due_date');

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_tasks_can_be_searched_by_title(): void
    {
        $user = User::factory()->create();

        $matchingTask = $user->tasks()->create([
            'title' => 'Learn Laravel',
            'description' => 'Study Laravel fundamentals.',
            'status' => 'pending',
        ]);

        $otherTask = $user->tasks()->create([
            'title' => 'Learn React',
            'description' => 'Study React fundamentals.',
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('tasks.index', [
                'search' => 'Laravel',
            ]));

        $response->assertSuccessful();

        $response->assertInertia(
            fn($page) => $page
                ->component('tasks/index')
                ->has('tasks.data', 1)
                ->where(
                    'tasks.data.0.id',
                    $matchingTask->id,
                ),
        );

        $this->assertDatabaseHas('tasks', [
            'id' => $otherTask->id,
        ]);
    }

    public function test_tasks_can_be_filtered_by_status(): void
    {
        $user = User::factory()->create();

        $pendingTask = $user->tasks()->create([
            'title' => 'Pending Task',
            'description' => null,
            'status' => 'pending',
        ]);

        $user->tasks()->create([
            'title' => 'Completed Task',
            'description' => null,
            'status' => 'completed',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('tasks.index', [
                'status' => 'pending',
            ]));

        $response->assertSuccessful();

        $response->assertInertia(
            fn($page) => $page
                ->component('tasks/index')
                ->has('tasks.data', 1)
                ->where(
                    'tasks.data.0.id',
                    $pendingTask->id,
                ),
        );
    }

    public function test_tasks_can_be_sorted_by_oldest(): void
    {
        $user = User::factory()->create();

        $oldestTask = $user->tasks()->create([
            'title' => 'Oldest Task',
            'description' => null,
            'status' => 'pending',
        ]);

        $newestTask = $user->tasks()->create([
            'title' => 'Newest Task',
            'description' => null,
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('tasks.index', [
                'sort' => 'oldest',
            ]));

        $response->assertSuccessful();

        $response->assertInertia(
            fn($page) => $page
                ->component('tasks/index')
                ->where(
                    'tasks.data.0.id',
                    $oldestTask->id,
                )
                ->where(
                    'tasks.data.1.id',
                    $newestTask->id,
                ),
        );
    }

    public function test_tasks_from_other_users_are_not_visible(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $userTask = $user->tasks()->create([
            'title' => 'My Task',
            'description' => null,
            'status' => 'pending',
        ]);

        $otherUser->tasks()->create([
            'title' => 'Other User Task',
            'description' => null,
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('tasks.index'));

        $response->assertSuccessful();

        $response->assertInertia(
            fn($page) => $page
                ->component('tasks/index')
                ->has('tasks.data', 1)
                ->where(
                    'tasks.data.0.id',
                    $userTask->id,
                ),
        );
    }
}
