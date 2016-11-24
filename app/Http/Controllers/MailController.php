<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\UserMail;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;


class MailController extends Controller
{
    public function index(Request $request)
    {
        try {
            $this->validate($request, [
                'name' => 'required|max:150',
                'email' => 'required|max:250|email',
                'text' => 'required'
            ]);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => $ex->validator->errors(),
                    'code' => '1'
                ]
            ];
            return response()->json($result);
        }
        $user_id = Auth::id();
        $user_mail = UserMail::create([
            'user_id' => $user_id,
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'text' => $request->input('text')
        ]);
        $data = [
            'user_name' => $request->input('name'),
            'user_email' => $request->input('email'),
            'user_comment' => $request->input('text')
        ];
        Mail::send('support', $data, function ($message) use ($data) {
            $message->from($data['user_email'], $data['user_name']);
            $message->to(config('mail.from')['address'], config('mail.from')['name'])
                ->subject('Support');
        });

        $result = [
            "status" => true];
        return response()->json($result);
    }
}
