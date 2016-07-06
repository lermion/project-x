<?php

namespace App\Http\Controllers;

use App\Image;
use App\Publication;
use App\User;
use App\Video;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $this->validate($request, [
                'offset' => 'required|numeric',
                'limit' => 'required|numeric'
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

        $Data = $request->all();
        $offset = $Data['offset'];
        $limit = $Data['limit'];

        return Publication::getMainPublication($offset,$limit);
    }

    public function topic(){
        $publication = Publication::with(['videos', 'group', 'images', 'comments' => function ($query) {
            $query->take(3);
            $query->orderBy('id', 'asc');
        }, 'comments.images', 'comments.videos', 'comments.user'])
            ->where('is_topic',true)
            ->first();
        if(!$publication)return null;
        $publication->like_count = $publication->likes()->count();
        $publication->user_like = $publication->likes()->where('user_id',Auth::id())->first()!=null;
        $publication->comment_count = $publication->comments()->count();
        if(!$publication->is_anonym){
            $publication->user;
        }
        foreach ($publication->comments as &$comment) {
            $comment->like_count = $comment->likes()->count();
        }

        return $publication;
    }

    public function userPublication($id)
    {
        //private profile
        $user = User::find($id);
        if ($user->is_private) {
            if((!$user->isRealSub(Auth::id())&&($id!=Auth::id()))){
                $data = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($data);
            }
        }
        $data = [
            'status' => true,
            'publications' => Publication::getUserPublication($id)
        ];
        return $data;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $this->validate($request, [
                'text' => 'min:1',
                'cover' => 'file',
                'is_anonym' => 'boolean',
                'is_main' => 'boolean',
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
        $publicationData = $request->all();
        if ($request->hasFile('cover')) {
            $cover = $request->file('cover');
            $path = Image::getImagePath($cover);
            $publicationData['cover'] = $path;
        }
        $publicationData['user_id'] = Auth::id();
        $publicationData['is_main'] = $publicationData['is_anonym'] ? true : $publicationData['is_main'];
        $publication = Publication::create($publicationData);
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if (!$image) {
                    continue;
                }
                $path = Image::getImagePath($image);
                $publication->images()->create([
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
                $publication->videos()->create([
                    'url' => $path,
                ]);
            }
        }
        $responseData = [
            "status" => true,
            "publication" => Publication::with('videos', 'images', 'user')->find($publication->id)
        ];
        return response()->json($responseData);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Publication::show($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if ($publication = Publication::find($id)) {
            if ($publication->user_id == Auth::id()) {
                try {
                    $this->validate($request, [
                        'text' => 'min:1',
                        'cover' => 'file',
                        'is_anonym' => 'boolean',
                        'is_main' => 'boolean',
                        'videos' => 'array',
                        'images' => 'array',
                        'delete_videos' => 'array',
                        'delete_images' => 'array'
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
                $publicationData = $request->all();
                if ($request->hasFile('cover')) {
                    $cover = $request->file('cover');
                    $path = Image::getImagePath($cover);
                    $publicationData['cover'] = $path;
                }
                $publication->update($publicationData);
                $deleteImages = $request->input('delete_images');
                if ($deleteImages) {
                    foreach ($deleteImages as $deleteImage) {
                        $image = Image::find($deleteImage);
                        if ($image) {
                            $image->delete();
                        }
                    }
                }
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        if (!$image) {
                            continue;
                        }
                        $path = Image::getImagePath($image);
                        $publication->images()->create([
                            'url' => $path,
                        ]);
                    }
                }
                $deleteVideos = $request->input('delete_videos');
                if ($deleteVideos) {
                    foreach ($deleteVideos as $deleteVideo) {
                        $video = Video::find($deleteVideo);
                        if ($video) {
                            $video->delete();
                        }
                    }
                }

                if ($request->hasFile('videos')) {
                    foreach ($request->file('videos') as $video) {
                        if (!$video) {
                            continue;
                        }
                        $path = Video::getVideoPath($video);
                        $publication->videos()->create([
                            'url' => $path,
                        ]);
                    }
                }
                $responseData = [
                    "status" => true,
                    "publication" => Publication::with('videos', 'images', 'user')->find($publication->id)
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if ($publication = Publication::find($id)) {
            if ($publication->user_id == Auth::id()) {
                $publication->delete();
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
        if ($publication = Publication::find($id)) {
            $userId = Auth::id();
            if ($like = $publication->likes()->where('user_id', $userId)->first()) {
                $like->delete();
            } else {
                $publication->likes()->create([
                    'user_id' => $userId
                ]);
            }
            return response()->json(['status' => true,
                'like_count' => $publication->likes()->count(),
                'user_like' => $publication->likes()->where('user_id', Auth::id())->first() != null
            ]);
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
