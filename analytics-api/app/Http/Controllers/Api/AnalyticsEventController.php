<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnalyticsEventController extends Controller
{
    //
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'event_name' => 'required|string|max:100',
            'visitor_id' => 'required|string|max:100',
            'session_id' => 'required|string|max:100',
            'page_url' => 'nullable|string|max:2048',
            'properties' => 'nullable|array',
            'occurred_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $event = AnalyticsEvent::create([
            'event_name' => $request->event_name,
            'visitor_id' => $request->visitor_id,
            'session_id' => $request->session_id,
            'page_url' => $request->page_url,
            'properties' => $request->properties ?? [],
            'occurred_at' => $request->occurred_at,
        ]);

        return response()->json([
            'message' => 'Analytics event saved successfully',
            'data' => $event,
        ], 201);
    }
}
