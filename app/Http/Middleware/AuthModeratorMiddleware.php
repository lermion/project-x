<?php

namespace App\Http\Middleware;

use App\Moderator;
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
            return redirect()->action('Admin\AuthController@login');
        }
        view()->share('moderator', Moderator::find($request->session()->get('moderator')->id));
        return $next($request);
    }
}
