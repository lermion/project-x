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

class PublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Publication::getMainPublication();
    }

    public function userPublication($id)
    {
        //private profile
        $user = User::find($id);
        if($user->is_private){
            $user->isRealSub(Auth::id());
        }
        return Publication::getUserPublication($id);
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
                'text' => 'required|min:1',
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
        $publicationData = $request->all();
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
                        'text' => 'required|min:1',
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
                'user_like' => $publication->likes()->where('user_id',Auth::id())->first()!=null
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
