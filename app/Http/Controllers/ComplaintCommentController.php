<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comment;
use App\ComplaintComment;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Validator;

class ComplaintCommentController extends Controller
{
    public function create(Request $request)
    {
        try {
            $this->validate($request, [
                'comment_id' => 'required|exists:comments,id',
                'complaint_category_id' => 'array',
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
        $validator = Validator::make($request->input('complaint_category_id'), [
            'required|exists:complaint_categories,id'
        ]);

        if ($validator->fails()) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => 'Bad category id',
                    'code' => '1'
                ]
            ];
            return response()->json($result);
        }
        $userWhichIdSub = Auth::id();
        $userTo = Comment::find($request->input('comment_id'));
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
        foreach($request->input('complaint_category_id') as $categoryId){
            $complaintData = $request->all();
            $complaintData['complaint_category_id'] = $categoryId;
            $complaintData['user_to_id'] = $userTo->user_id;
            $complaintData['user_which_id'] = $userWhichIdSub;
            $complaint = ComplaintComment::create($complaintData);
        }
        $resultData = [
            'status' => true
        ];
        return response()->json($resultData);
    }

}
