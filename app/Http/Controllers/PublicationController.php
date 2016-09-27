<?php

namespace App\Http\Controllers;

use App\ComplaintPublication;
use App\Image;
use App\Publication;
use App\PublicationVideo;
use App\Scope;
use App\ScopePublication;
use App\User;
use App\Video;
use Illuminate\Http\Request;
use App\PublicationImage;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
        $userId = Auth::id();

        return Publication::getMainPublication($offset,$limit,$userId);
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

    public function userPublication(Request $request, $id)
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
            'publications' => Publication::getUserPublication($offset,$limit,$id)
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
                'in_profile' => 'boolean',
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
                'image|max:2500'
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
                'mimes:mp4,3gp,WMV,avi,mkv,mov,wma,flv,wmv'
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
        $publicationData['is_main'] = $publicationData['is_anonym'] ? true : $publicationData['is_main'];
        $publication = Publication::create($publicationData);
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
                    $new_fname = 'upload/publication/videos/'.uniqid();
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
            "publication" => Publication::with('videos', 'images', 'user', 'scopes')->find($publication->id)
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
                        'in_profile' => 'boolean',
                        'videos' => 'array',
                        'images' => 'array|max:20',
                        'original_images' => 'array|max:20',
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
                if ($request->hasFile('original_images')) {
                    $validator = Validator::make($request->file('original_images'), [
                        'image|max:2500'
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
                $publicationData = $request->all();
                if ($publication->is_main == true or $publicationData['is_main'] == true){
                    $publicationData['is_moderate'] = false;
                } else {
                    $publicationData['is_moderate'] = $publication->is_moderate;
                }
                $publication->update($publicationData);
                ScopePublication::where('publication_id',$publication->id)->delete();
                $scopes = $request->input('scopes');
                $publication->scopes()->attach($scopes);
                if ($request->input('cover_image_id')){
                    $cover_id = $request->input('cover_image_id');
                    $image = PublicationImage::where(['is_cover'=>true,'publication_id'=>$id])->first();
                    if ($image) {
                        $image->is_cover = false;
                        $image->save();
                    }
                    $video = PublicationVideo::where(['is_cover'=>true,'publication_id'=>$id])->first();
                    if ($video) {
                        $video->is_cover = false;
                        $video->save();
                    }
                    $image_cover = PublicationImage::where(['image_id'=>$cover_id,'publication_id'=>$id])->first();
                    $image_cover->is_cover = true;
                    $image_cover->save();
                    //$url = Image::find($cover_id);
                    $url = Image::getUpdateCoverPath($request->file('cover'));
                    $public = Publication::where('id',$id)->first();
                    $public->cover = $url;
                    $public->save();
                }
                if ($request->input('cover_video_id')){
                    $cover_id = $request->input('cover_video_id');
                    $image = PublicationImage::where(['is_cover'=>true,'publication_id'=>$id])->first();
                    if ($image) {
                        $image->is_cover = false;
                        $image->save();
                    }
                    $video = PublicationVideo::where(['is_cover'=>true,'publication_id'=>$id])->first();
                    if ($video) {
                        $video->is_cover = false;
                        $video->save();
                    }
                    $video_cover = PublicationVideo::where(['video_id'=>$cover_id,'publication_id'=>$id])->first();
                    $video_cover->is_cover = true;
                    $video_cover->save();
                    $url = Video::find($cover_id);
                    $public = Publication::where('id',$id)->first();
                    $public->cover = $url['img_url'];
                    $public->save();
                }
                if ($request->hasFile('images')) {
                    $cover = $request->file('cover');
                    foreach ($request->file('images') as $image) {
                        $image_name = $image->getClientOriginalName();
                        foreach ($request->file('original_images') as $original_image) {
                            $original_image_name = $original_image->getClientOriginalName();
                            if ($image_name == $original_image_name){
                                $original_path = Image::getOriginalImagePath($original_image);
                            }
                        }
                        $path = Image::getImagePath($image);
                        if($cover) {
                            $cover_name = $cover->getClientOriginalName();
                            if ($image_name == $cover_name) {
                                $image = PublicationImage::where(['is_cover' => true, 'publication_id' => $id])->first();
                                if ($image) {
                                    $image->is_cover = false;
                                    $image->save();
                                }
                                $video = PublicationVideo::where(['is_cover' => true, 'publication_id' => $id])->first();
                                if ($video) {
                                    $video->is_cover = false;
                                    $video->save();
                                }
                                $publication->images()->create(['url' => $path,'original_img_url' => $original_path], ['is_cover' => true]);
                                $path_cover = Image::getCoverPath($cover);
                                $publication->cover = $path_cover;
                                $publication->save();
                            } else {
                                $publication->images()->create(['url' => $path,'original_img_url' => $original_path]);
                            }
                        }else {
                            $publication->images()->create(['url' => $path,'original_img_url' => $original_path]);
                        }
                    }
                }
                if ($request->hasFile('videos')) {
                    $cover = $request->file('cover');
                    foreach ($request->file('videos') as $video) {
                        $video_name = $video->getClientOriginalName();
                        if($cover) {
                            $cover_name = $cover->getClientOriginalName();
                            if ($video_name == $cover_name) {
                                $image = PublicationImage::where(['is_cover' => true, 'publication_id' => $id])->first();
                                if ($image) {
                                    $image->is_cover = false;
                                    $image->save();
                                }
                                $video_avatar = PublicationVideo::where(['is_cover' => true, 'publication_id' => $id])->first();
                                if ($video_avatar) {
                                    $video_avatar->is_cover = false;
                                    $video_avatar->save();
                                }
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
                $deleteImages = $request->input('delete_images');
                if ($deleteImages) {
                    foreach ($deleteImages as $deleteImage) {
                        $image = Image::find($deleteImage);
                        if ($image) {
                            $image->delete();
                        }
                    }
                }
                $deleteVideos = $request->input('delete_videos');
                if ($deleteVideos) {
                    foreach ($deleteVideos as $deleteVideo) {
                        $video = Video::find($deleteVideo);
                        if ($video) {
                            Storage::disk('video')->delete($video->url);
                            Storage::disk('video')->delete($video->img_url);
                            $video->delete();
                        }
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
                foreach ($publication->videos->toArray() as $p){
                    $arr[] = $p['url'];
                    Storage::disk('public_path')->delete($p['url']);
                    Storage::disk('public_path')->delete($p['img_url']);

                }


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

    public function getScopes($id)
    {
        $publication = Publication::find($id);
        $scopes_publications = $publication->scopes()->pluck('scopes.id');
        $scopes = Scope::orderBy('order')->get();
        $data_scope = [];
        foreach ($scopes as $scope) {
            foreach ($scopes_publications as $scopes_publication) {
                if ($scope['id'] == $scopes_publication) {
                    $scope['signed'] = true;
                }
            }
            $data_scope[] = $scope;
        }
        return $data_scope;
    }

    public function complaint(Request $request)
    {
        try {
            $this->validate($request, [
                'publication_id' => 'required|exists:publications,id',
                'complaint_category_id' => 'array',
            ]);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => 'error validate',
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
        $userTo = Publication::find($request->input('publication_id'));
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
            $complaint = ComplaintPublication::create($complaintData);
        }
        $resultData = [
            'status' => true
        ];
        return response()->json($resultData);
    }
}
