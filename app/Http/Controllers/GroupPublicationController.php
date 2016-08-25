<?php

namespace App\Http\Controllers;

use App\Group;
use App\GroupUser;
use App\Image;
use App\Publication;
use App\Video;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GroupPublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $group = Group::with(['publications', 'publications.group', 'publications.user', 'publications.videos', 'publications.images', 'publications.comments' => function ($query) {
            $query->take(3);
        }, 'publications.comments.images', 'publications.comments.videos', 'publications.comments.user'])
            ->find($id);
        $publications = $group->publications;
        foreach ($publications as &$publication) {
            $publication->like_count = $publication->likes()->count();
            $publication->user_like = $publication->likes()->where('user_id',Auth::id())->first()!=null;
            $publication->comment_count = $publication->comments()->count();
            if (!$publication->is_anonym) {
                $publication->user;
            }
            foreach ($publication->comments as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }
        }
        return $publications;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $id)
    {
        try {
            $this->validate($request, [
                'text' => 'min:1',
                'is_anonym' => 'boolean',
                'is_main' => 'boolean',
                'cover' => 'file',
                'original_cover' => 'file',
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

        if (!$groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $id, 'is_admin' => true])->first()) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        $publicationData = $request->all();
        if ($request->hasFile('cover')) {
            $cover = $request->file('cover');
            $path = Image::getCoverPath($cover);
            $publicationData['cover'] = $path;
        }
        if ($request->hasFile('original_cover')) {
            $cover = $request->file('original_cover');
            $path = Image::getOriginalCoverPath($cover);
            $publicationData['original_cover'] = $path;
        }
        $publicationData['user_id'] = Auth::id();
//        $publicationData['is_main'] = $publicationData['is_anonym'] ? true : $publicationData['is_main'];
        $group = Group::find($id);
        $publication = $group->publications()->create($publicationData);
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $groupId, $publicationId)
    {
        if (($publication = Publication::find($publicationId)) && ($group = Group::find($groupId))) {
            if ($groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $groupId, 'is_admin' => true])->first()
            &&$group->publications()->where('publications.id', $publicationId)->first()) {
                try {
                    $this->validate($request, [
                        'text' => 'required|min:1',
                        'is_anonym' => 'boolean',
                        'is_main' => 'boolean',
                        'cover' => 'file',
                        'original_cover' => 'file',
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
                    $path = Image::getCoverPath($cover);
                    $publicationData['cover'] = $path;
                }
                if ($request->hasFile('original_cover')) {
                    $cover = $request->file('original_cover');
                    $path = Image::getOriginalCoverPath($cover);
                    $publicationData['original_cover'] = $path;
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
                    "publication" => Publication::with('videos','group', 'images', 'user')->find($publication->id)
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
    public function destroy($groupId,$publicationId)
    {
        if (($publication = Publication::find($publicationId)) && ($group = Group::find($groupId))) {
            if ($groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $groupId, 'is_admin' => true])->first()
                &&$group->publications()->where('publications.id', $publicationId)->first()) {
                $publication->delete();
                $responseData = [
                    "status" => true
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
