<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsDashboardController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query(
            'start_date',
            Carbon::today()->subDays(6)->toDateString()
        );

        $endDate = $request->query(
            'end_date',
            Carbon::today()->toDateString()
        );

        $baseQuery = AnalyticsEvent::query()
            ->whereBetween('occurred_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);

        $totalEvents = (clone $baseQuery)->count();

        $pageViews = (clone $baseQuery)
            ->where('event_name', 'page_view')
            ->count();

        $uniqueVisitors = (clone $baseQuery)
            ->distinct('visitor_id')
            ->count('visitor_id');

        $popularPages = (clone $baseQuery)
            ->where('event_name', 'page_view')
            ->select('page_url', DB::raw('COUNT(*) as views'))
            ->groupBy('page_url')
            ->orderByDesc('views')
            ->limit(5)
            ->get();

        $traffic = (clone $baseQuery)
            ->where('event_name', 'page_view')
            ->select(
                DB::raw('DATE(occurred_at) as date'),
                DB::raw('COUNT(*) as page_views')
            )
            ->groupBy(DB::raw('DATE(occurred_at)'))
            ->orderBy('date')
            ->get();

        return response()->json([
            'summary' => [
                'total_events' => $totalEvents,
                'page_views' => $pageViews,
                'unique_visitors' => $uniqueVisitors,
            ],
            'popular_pages' => $popularPages,
            'traffic' => $traffic,
        ]);
    }
}
