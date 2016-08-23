<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\UserMail;
use Mail;

use Illuminate\Support\Facades\Auth;


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
        $user_mail->mail = ['artur@gmail.com','shishkin.artur@gmail.com'];
        Mail::send('welcome', ['user_mail' => '$user_mail->text'], function ($message) use ($user_mail) {
            $message->subject($user_mail->email)
                ->from($user_mail->email)
                ->to($user_mail->mail);
        });
        $result = [
            "status" => true];
        return response()->json($result);
    }
}
