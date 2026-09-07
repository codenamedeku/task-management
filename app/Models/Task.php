<?php

namespace App\Models;

use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'due_date',
    ];

    /**
     * Get the user that owns the task.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'due_date' => 'date:Y-m-d',
        ];
    }

    /**
     * Scope the query to search tasks.
     */
    public function scopeSearch(
        Builder $query,
        string $search,
    ): Builder {
        if ($search === '') {
            return $query;
        }

        return $query->where(function (Builder $query) use ($search) {
            $query
                ->where('title', 'like', "%{$search}%")
                ->orWhere(
                    'description',
                    'like',
                    "%{$search}%",
                );
        });
    }

    /**
     * Scope the query to a specific status.
     */
    public function scopeStatus(
        Builder $query,
        string $status,
    ): Builder {
        if ($status === '') {
            return $query;
        }

        return $query->where('status', $status);
    }

    /**
     * Scope the query to a specific sorting option.
     */
    public function scopeSortBy(
        Builder $query,
        string $sort,
    ): Builder {
        return match ($sort) {
            'oldest' => $query->oldest(),
            'due_asc' => $query->orderBy('due_date', 'asc'),
            'due_desc' => $query->orderBy('due_date', 'desc'),
            default => $query->latest(),
        };
    }
}
