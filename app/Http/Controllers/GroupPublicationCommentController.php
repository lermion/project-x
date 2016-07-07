<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Group;
use App\GroupUser;
use App\Image;
use App\Publication;
use App\Video;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GroupPublicationCommentController extends Controller
{
    public function store(Request $request, $groupId, $publicationId)
    {
        if (($publication = Publication::find($publicationId)) && ($group = Group::find($groupId))) {
            if ($groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $groupId])->first()
                && $group->publications()->where('publications.id', $publicationId)->first()
            ) {
                try {
                    $this->validate($request, [
                        'text' => 'required|min:1',
                        'videos' => 'array',
                        'images' => 'array'
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
                if ($request->hasFile('images')) {
                    $validator = Validator::make($request->file('images'), [
                        'image'
                    ]);

                    if ($validator->fails()) {
                        $result = [
                            "status" => false,
                            "error" => [
                                'message' => 'Bad image',
                                'code' => '1'
                            ]
                        ];
                        return response()->json($result);
                    }
                }
                if ($request->hasFile('videos')) {
                    $validator = Validator::make($request->file('videos'), [
                        'mimes:mp4,3gp,WMV,avi,mkv,mov,wma,flv'
                    ]);

                    if ($validator->fails()) {
                        $result = [
                            "status" => false,
                            "error" => [
                                'message' => 'Bad video',
                                'code' => '1'
                            ]
                        ];
                        return response()->json($result);
                    }
                }
                $commentData = $request->all();
                $commentData['user_id'] = Auth::id();
                $comment = $publication->comments()->create($commentData);
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        if (!$image) {
                            continue;
                        }
                        $path = Image::getImagePath($image);
                        $comment->images()->create([
                            'url' => $path,
                        ]);
                    }
                }
                if ($request->hasFile('videos')) {
                    foreach ($request->file('videos') as $video) {
                        if (!$video) {
                            continue;
                        }
                        $path = Video::getVideoPath($video);
                        $comment->videos()->create([
                            'url' => $path,
                        ]);
                    }
                }
                $responseData = [
                    "status" => true,
                    "comment" => Comment::with('videos', 'images', 'user')->find($comment->id)
                ];
                return response()->json($responseData);
            } else {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
        } else {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => 'Incorrect id',
                    'code' => '1'
                ]
            ];
            return response()->json($responseData);
        }
    }
}
