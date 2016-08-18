<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use  App\UserMail;
use App\User;
use Mail;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class MailController extends Controller
{
    public function create(Request $request)
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

    public function index()
    {
        $mails = UserMail::select('user_mails.id as id','user_mails.name as name','user_mails.email as email','user_mails.text as text','user_mails.created_at as date', 'users.avatar_path as avatar', 'users.id as user_id')
            ->leftJoin('users','user_mails.user_id','=', 'users.id')
            ->where('user_mails.status','New')
            ->paginate(25);
        return view('admin.mail.index')->with('mails',$mails);
    }

    public function change_status_closed($id)
    {
        $mail = UserMail::find($id);

        if ($mail->status != 'Closed' ) {
            $mail->status = 'Closed';
            $mail->save();
            return redirect('/admin/mail/')->with('message', 'Статус сообщения изменен');
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "The user has this status",
                    'code' => '7'
                ]
            ];
            return redirect('/admin/mail/')->with('message', 'Ошибка!!! Статус сообщения не изменен');
        }
    }

    public function change_status_review($id)
    {
        $mail = UserMail::find($id);

        if ($mail->status != 'Review' ) {
            $mail->status = 'Review';
            $mail->save();
            return redirect('/admin/mail/')->with('message', 'Статус сообщения изменен');
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "The user has this status",
                    'code' => '7'
                ]
            ];
            return redirect('/admin/mail/')->with('message', 'Ошибка!!! Статус сообщения не изменен');
        }
    }

    public function destroy($id)
    {
        if (UserMail::find($id)->delete()) {
            return redirect('/admin/mail/')->with('message', 'Сообщение удаленнно');
        } else {
            return redirect('/admin/mail/')->with('message', 'Ошибка!!! Сообщение не удаленнно');
        }
    }

    public function get_closed()
    {
        $mails = UserMail::select('user_mails.id as id','user_mails.name as name','user_mails.email as email','user_mails.text as text','user_mails.created_at as date', 'users.avatar_path as avatar')
            ->leftJoin('users','user_mails.user_id','=', 'users.id')
            ->where('user_mails.status','Closed')
            ->paginate(25);
        return view('admin.mail.index')->with('mails',$mails);
    }

    public function get_review()
    {
        $mails = UserMail::select('user_mails.id as id','user_mails.name as name','user_mails.email as email','user_mails.text as text','user_mails.created_at as date', 'users.avatar_path as avatar')
            ->leftJoin('users','user_mails.user_id','=', 'users.id')
            ->where('user_mails.status','Review')
            ->paginate(25);
        return view('admin.mail.index')->with('mails',$mails);
    }

}
