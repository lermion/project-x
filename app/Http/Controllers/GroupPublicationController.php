<?php

namespace App\Http\Controllers;

use App\Group;
use App\GroupUser;
use App\Image;
use App\Publication;
use App\PublicationImage;
use App\ScopePublication;
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
                'images' => 'array|max:20',
                'original_images' => 'array|max:20',
                'scopes' => 'required|array|max:3'
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

        if ($request->hasFile('original_images')) {
            $validator = Validator::make($request->file('original_images'), [
                'image|max:4000'
            ]);

            if ($validator->fails()) {
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => 'Bad image or big size',
                        'code' => '2'
                    ]
                ];
                return response()->json($result);
            }
        }

        if ($request->hasFile('videos')) {
            $validator = Validator::make($request->file('videos'), [
                'mimes:mp4,3gp,WMV,avi,mkv,mov,wma,flv,wmv,asf'
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
        $publicationData['user_id'] = Auth::id();
        $group = Group::find($id);
        $publication = $group->publications()->create($publicationData);
        $scopes = $request->input('scopes');
        $publication->scopes()->attach($scopes);
        if ($request->hasFile('images')) {
            $cover = $request->file('cover');
            $cover_name = $cover->getClientOriginalName();
            foreach ($request->file('images') as $image) {
                $image_name = $image->getClientOriginalName();
                foreach ($request->file('original_images') as $original_image) {
                    $original_image_name = $original_image->getClientOriginalName();
                    if ($image_name == $original_image_name){
                        $original_path = Image::getOriginalImagePath($original_image);
                    }
                }
                $path = Image::getImagePath($image);
                if ($image_name == $cover_name)
                {
                    $publication->images()->create(['url' => $path,'original_img_url' => $original_path],['is_cover' => true]);
                    $path_cover = Image::getCoverPath($cover);
                    $publication->cover = $path_cover;
                    $publication->save();
                } else
                {
                    $publication->images()->create(['url' => $path,'original_img_url' => $original_path]);
                }

            }
        }
        if ($request->hasFile('videos')) {
            $cover = $request->file('cover');
            $cover_name = $cover->getClientOriginalName();

            foreach ($request->file('videos') as $video) {
                $video_name = $video->getClientOriginalName();
                if ($video_name == $cover_name) {
                    $f_name = uniqid();
                    $f_path = storage_path('tmp/video/');
                    $video->move($f_path, $f_name);
                    $new_fname = 'upload/publication/videos/' . uniqid();
                    Video::makeFrame($f_name, $f_path, $new_fname);
                    //Video::makeVideo($f_name, $f_path, $new_fname);
                    $cmd = 'php ' . base_path() . '/artisan video:make "' . $f_name . '" ' . $f_path . ' ' . $new_fname;
                    if (substr(php_uname(), 0, 7) == "Windows") {
                        pclose(popen("start /B " . $cmd, "r"));
                    } else {
                        exec($cmd . " > /dev/null &");
                    }
                    $publication->cover = $new_fname . '.jpg';
                    $publication->save();
                    $publication->videos()->create([
                        'url' => $new_fname . '.mp4',
                        'img_url' => $new_fname . '.jpg',
                    ], ['is_cover' => true]);
                } else {
                    $f_name = uniqid();
                    $f_path = storage_path('tmp/video/');
                    $video->move($f_path, $f_name);
                    $new_fname = 'upload/publication/videos/' . uniqid();
                    Video::makeFrame($f_name, $f_path, $new_fname);
                    //Video::makeVideo($f_name, $f_path, $new_fname);
                    $cmd = 'php ' . base_path() . '/artisan video:make "' . $f_name . '" ' . $f_path . ' ' . $new_fname;
                    if (substr(php_uname(), 0, 7) == "Windows") {
                        pclose(popen("start /B " . $cmd, "r"));
                    } else {
                        exec($cmd . " > /dev/null &");
                    }
                    $publication->videos()->create([
                        'url' => $new_fname . '.mp4',
                        'img_url' => $new_fname . '.jpg',
                    ]);
                }
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
                        'delete_images' => 'array',
                        'scopes' => 'required|array|max:3'
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
                ScopePublication::where('publication_id',$publication->id)->delete();
                $scopes = $request->input('scopes');
                $publication->scopes()->attach($scopes);
                $deleteImages = $request->input('delete_images');
                if ($deleteImages) {
                    foreach ($deleteImages as $deleteImage) {
                        $image = Image::find($deleteImage);
                        if ($image) {
                            $image->delete();
                        }
                    }
                }
                if ($request->input('cover_id')){
                    $cover_id = $request->input('cover_id');

                    $image = PublicationImage::where(['is_cover'=>true,'publication_id'=>$id])->first();
                    $image->is_cover = false;
                    $image->save();

                    $image_cover = PublicationImage::where(['image_id'=>$cover_id,'publication_id'=>$id])->first();
                    $image_cover->is_cover = true;
                    $image_cover->save();
                    $url = Image::find($cover_id);
                    $public = Publication::where('id',$id)->first();
                    $public->cover = $url['url'];
                    $public->save();

                }
                if ($request->hasFile('images')) {
                    $cover = $request->file('cover');
                    $cover_name = $cover->getClientOriginalName();
                    foreach ($request->file('images') as $image) {
                        if (!$image) {
                            continue;
                        }
                        $path = Image::getImagePath($image);
                        if ($cover_name == $image->getClientOriginalName())
                        {
                            $image = PublicationImage::where(['is_cover'=>true,'publication_id'=>$id])->first();
                            $image->is_cover = false;
                            $image->save();
                            $publication->images()->create(['url' => $path],['is_cover' => true]);
                        } else
                        {
                            $publication->images()->create(['url' => $path]);
                        }

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
