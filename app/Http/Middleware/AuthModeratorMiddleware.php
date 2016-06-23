<?php

namespace App\Http\Middleware;

use Closure;

class AuthModeratorMiddleware
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
        if (!$request->session()->has('moderator')){
            return redirect()->action('Moderator\AuthController@login');
        }
        return $next($request);
    }
}
