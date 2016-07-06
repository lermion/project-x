<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comment;
use App\ComplaintComment;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class ComplaintCommentController extends Controller
{
    public function create(Request $request)
    {
        try {
            $this->validate($request, [
                'comment_id' => 'required|exists:comments,id',
                'complaint_category_id' => 'required|exists:complaint_categories,id',
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
        $complaintData = $request->all();
        $userWhichIdSub = Auth::id();

        $userTo = Comment::find($request->input('comment_id'));

        $complaintData['user_to_id'] = $userTo->user_id;

        $complaintData['user_which_id'] = $userWhichIdSub;
        if ($userTo->user_id == $userWhichIdSub) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "You can not complain about the",
                    'code' => '14'
                ]
            ];
            return response()->json($result);
        }
        $complaint = ComplaintComment::create($complaintData);
        $resultData = [
            'status' => true
        ];
        return response()->json($resultData);
    }

}
