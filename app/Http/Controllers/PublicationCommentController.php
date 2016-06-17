<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Image;
use App\Publication;
use App\Video;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class PublicationCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $publication = Publication::with('comments.images','comments.videos','comments.user')->find($id);
        $comments = $publication->comments;
        foreach ($comments as &$comment){
            $comment->like_count = $comment->likes()->count();
        }
        return $comments;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request,$id)
    {
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
        $commentData = $request->all();
        $commentData['user_id'] = Auth::id();
        $publication = Publication::find($id);
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
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if ($comment = Comment::find($id)) {
            if ($comment->user_id == Auth::id()) {
                $comment->delete();
                return response()->json(['status' => true]);
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

    public function like($id)
    {
        if ($comment = Comment::find($id)) {
            $userId = Auth::id();
            if ($like = $comment->likes()->where('user_id', $userId)->first()) {
                $like->delete();
            } else {
                $comment->likes()->create([
                    'user_id' => $userId
                ]);
            }
            return response()->json(['status' => true,
                'like_count' => $comment->likes()->count()]);
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
