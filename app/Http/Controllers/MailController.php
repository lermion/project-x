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
        $user_mail->mail = 'shishkin.artur@gmail.com';
        Mail::send('welcome', ['user_mail' => $user_mail], function ($message) use ($user_mail) {
            $message->from($user_mail->mail)
                ->to($user_mail->email, $user_mail->name)->subject($user_mail->text);
        });

        $result = [
            "status" => true];
        return response()->json($result);
    }
}
