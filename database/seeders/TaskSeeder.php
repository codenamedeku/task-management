<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where(
            'email',
            'demo@example.com',
        )->firstOrFail();

        Task::factory()
            ->count(20)
            ->for($user)
            ->create();
    }
}
