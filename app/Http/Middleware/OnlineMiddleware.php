<?php

namespace App\Http\Middleware;

use App\Online;
use Carbon\Carbon;
use Closure;
use Illuminate\Support\Facades\Auth;

class OnlineMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            self::fixingAction($user);
        }
        return $next($request);
    }

    public static function fixingAction($user)
    {
        if (!$online = Online::where('user_id', '=', $user->id)->first()) {
            $online_data = [
                'last_action' => Carbon::now(),
                'user_id' => $user->id,
            ];
            $online = Online::create($online_data);
            $online->save();
        } else {
            $online->last_action = Carbon::now();
            $online->save();
        }
    }
}
