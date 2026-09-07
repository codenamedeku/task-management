<?php

namespace Database\Factories;

use App\Enums\TaskStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),

            'title' => fake()->sentence(4),

            'description' => fake()->optional()->paragraph(),

            'status' => fake()->randomElement(
                TaskStatus::cases(),
            ),

            'due_date' => fake()->optional(
                0.7,
            )?->dateTimeBetween(
                'now',
                '+30 days',
            )?->format('Y-m-d'),
        ];
    }
}
