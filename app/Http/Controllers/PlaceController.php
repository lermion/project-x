<?php

namespace App\Http\Controllers;

use App\Area;
use App\ChatRoom;
use App\Place;
use App\NewPlace;
use App\Region;
use App\Scope;
use App\ScopePlace;
use App\TypePlace;
use App\PlaceUser;
use App\PlaceInvite;
use App\Image;
use App\City;
use App\Country;
use App\User;
use App\Online;
use App\UserRoomsMessage;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class PlaceController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::id());
        $scopes = $user->scopes()->pluck('scopes.id');
        $all_scope = false;
        foreach ($scopes as $scope) {
            if ($scope == 1)$all_scope = true;
        }
        if ($all_scope == true) {
            $places = Place::all();
            foreach ($places as &$place) {
                $place->count_chat_message = UserRoomsMessage::where('room_id', $place->room_id)->count();
                $place->count_user = $place->users()->count();
                $place->publications = $place->publications()->count();
                if (PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
                    $place->is_sub = true;
                } else {
                    $place->is_sub = false;
                }
                if (PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id(), 'is_admin' => true])->first()) {
                    $place->is_admin = true;
                } else {
                    $place->is_admin = false;
                }
                if (NewPlace::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
                    $place->is_new_place = true;
                } else {
                    $place->is_new_place = false;
                }
                $place->city_name = City::where(['id' => $place->city_id])->pluck('name');
            }
            return $places;
        } else {
                $places = Place::has('creator')->with(['creator','scopes'])
                    ->whereHas('creator',function($query){
                        $query->where('users.id',Auth::id());
                    })
                    ->orWhereHas('scopes',function($query) use ($scopes){
                        $query->whereIn('scopes.id',$scopes);
                    })
                    ->orWhereHas('scopes',function($query) {
                        $query->where('scopes.id',1);
                    })
                    ->groupBy('id')
                    ->get();
                foreach ($places as &$place) {
                    $place->count_chat_message = UserRoomsMessage::where('room_id', $place->room_id)->count();
                    $place->count_user = $place->users()->count();
                    $place->publications = $place->publications()->count();
                    if (PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
                        $place->is_sub = true;
                    } else {
                        $place->is_sub = false;
                    }
                    if (PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id(), 'is_admin' => true])->first()) {
                        $place->is_admin = true;
                    } else {
                        $place->is_admin = false;
                    }
                    if (NewPlace::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
                        $place->is_new_place = true;
                    } else {
                        $place->is_new_place = false;
                    }
                    $place->city_name = City::where(['id' => $place->city_id])->pluck('name');
                }
            return $places;
        }
    }

    public function adminPlace()
    {
        return Place::join('place_users','place_users.place_id','=','places.id')->where(['place_users.user_id'=>Auth::id(),'is_admin'=>true])->get();
    }

    public function create(Request $request)
    {
        try {
            $this->validate($request, [
//                'name' => 'required|unique:places',
                'description' => 'required',
                'city_id' =>'required',
                'address' => 'required',
                'coordinates_x'=> 'required|numeric',
                'coordinates_y'=> 'required|numeric',
                'avatar' => 'image',
                'original_avatar' => 'image',
                'cover' => 'image',
                'original_cover' => 'image',
                'type_place_id' => 'required',
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
        $room = ChatRoom::create(['name' => $request->name]);
        $placeData = $request->all();
        $placeData['room_id'] = $room->id;
        if (TypePlace::where('id', $placeData['type_place_id'])->value('is_dynamic')) {
            try {
                $this->validate($request, [
                    'expired_date' => 'required'
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
        }


        $placeData['url_name'] = $this->transliterate($request->input('name'));
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPlacePath($avatar);
            $placeData['avatar'] = $path;
        }
        if ($request->hasFile('original_avatar')) {
            $avatar = $request->file('original_avatar');
            $path = Image::getOriginalAvatarPlacePath($avatar);
            $placeData['original_avatar'] = $path;
        }
        if ($request->hasFile('cover')) {
            $cover = $request->file('cover');
            $path = Image::getCoverPlacePath($cover);
            $placeData['cover'] = $path;
        }
        if ($request->hasFile('original_cover')) {
            $cover = $request->file('original_cover');
            $path = Image::getOriginalCoverPlacePath($cover);
            $placeData['original_cover'] = $path;
        }
        $place = Place::create($placeData);
        $scopes = $request->input('scopes');
        $place->scopes()->attach($scopes);
        NewPlace::create(['user_id' => Auth::id(), 'place_id' => $place->id,]);
        PlaceUser::create(['user_id' => Auth::id(), 'place_id' => $place->id, 'is_admin' => true, 'is_creator' => true]);
        return response()->json(["status" => true, 'place' => $place]);
    }

    public function show($name)
    {
        $place = Place::where('url_name', $name)->first();
        NewPlace::where(['user_id' => Auth::id(), 'place_id' => $place->id,])->delete();
        if ($place) {
//            if (!PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
//                return null;
//            }
            $place->count_chat_message = UserRoomsMessage::where('room_id',$place->room_id)->count();
            $place->count_users = $place->users()->count();
            $place->count_chat_files = $place->count_chat_files($place->room_id);
            $place->count_publications = $place->publications()->count();
            $place->users = User::join('place_users','place_users.user_id','=','users.id')->select('users.id', 'users.first_name', 'users.last_name', 'users.avatar_path', 'users.user_quote', 'users.login', 'place_users.is_admin')
                ->where('place_users.place_id',$place->id)->get();

            foreach ($place->users as $user) {
                $user->is_online = Online::isOnline($user->id);
            }

            if (PlaceUser::where(['place_id' =>$place->id,'user_id' => Auth::id()])->first()){
                $place->is_sub = true;
            } else {$place->is_sub = false;}
            if(PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id(), 'is_admin' => true])->first()){
                $place->is_admin = true;
            } else {$place->is_admin = false;}
            if(PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id(), 'is_admin' => true, 'is_creator' => true])->first()){
                $place->is_creator = true;
            } else {$place->is_creator = false;}
            if(TypePlace::where(['id' => $place->type_place_id, 'is_dynamic' => true])->first()){
                $place->is_dynamic = true;
            } else {$place->is_dynamic = false;}

            $place->type_place = TypePlace::where(['id' => $place->type_place_id])->first();

            $city = City::where(['id' => $place->city_id])->first();
            $place->city = City::where(['id' => $place->city_id])->first();
            $place->country = Country::where(['id' => $city->country_id])->first();
//            $place->cities = City::where(['country_id' => $city->country_id])->get();
        }
        return $place;
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
        try {
            $this->validate($request, [
                'name' => 'unique:places',
                'description' => 'required',
                'city_id' =>'required',
                'address' => 'required',
                'coordinates_x'=> 'required|numeric',
                'coordinates_y'=> 'required|numeric',
                'avatar' => 'image',
                'cover' => 'image',
                'original_avatar' => 'image',
                'original_cover' => 'image',
                'type_place_id' => 'required',
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
        if (!PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $id, 'is_admin' => true])->first()) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        $placeData = $request->all();
        if ($request->input('name')){
            $placeData['url_name'] = $this->transliterate($request->input('name'));
        }
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPlacePath($avatar);
            $placeData['avatar'] = $path;
        }
        if ($request->hasFile('original_avatar')) {
            $avatar = $request->file('original_avatar');
            $path = Image::getOriginalAvatarPlacePath($avatar);
            $placeData['original_avatar'] = $path;
        }
        if ($request->hasFile('cover')) {
            $cover = $request->file('cover');
            $path = Image::getCoverPlacePath($cover);
            $placeData['cover'] = $path;
        }
        if ($request->hasFile('original_cover')) {
            $cover = $request->file('original_cover');
            $path = Image::getOriginalCoverPlacePath($cover);
            $placeData['original_cover'] = $path;
        }
        $place = Place::find($id);
        ScopePlace::where('place_id',$place->id)->delete();
        $scopes = $request->input('scopes');
        $place->scopes()->attach($scopes);
        $place->update($placeData);
        return response()->json(["status" => true, "placeData" => $placeData]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id)
    {
        if (!$placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $id, 'is_admin' => true, 'is_creator' => true])->first()) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        if ($place = Place::find($id)) {
            $place->delete();
        }
        return response()->json(["status" => true]);
    }

    public function subscription($id)
    {
        if ($place = Place::find($id)) {
            if ($user = PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
                $isSub = false;
                $user->delete();
            } else {
                $isSub = true;
//                if($place->is_open){
//                    PlaceUser::create(['place_id' => $place->id, 'user_id' => Auth::id()]);
//                }elseif ($invite = PlaceInvite::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()){
//                    $invite->delete();
                    PlaceUser::create(['place_id' => $place->id, 'user_id' => Auth::id()]);
//                }else{
//                    $result = [
//                        "status" => false,
//                        "error" => [
//                            'message' => "Permission denied",
//                            'code' => '8'
//                        ]
//                    ];
//                    return response()->json($result);
//                }
            }
            return response()->json(['status' => true, 'is_sub' => $isSub]);
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
    }

    public function setUserAdmin($placeId, $userId){
        if ($place = Place::find($placeId)) {
            if (!$placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            if ($user = PlaceUser::where(['place_id' => $place->id, 'user_id' => $userId])->first()){
                $user->is_admin = !$user->is_admin;
                $user->save();
                return response()->json(['status'=>true,'is_admin'=>$user->is_admin]);
            }else{
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Incorrect user id",
                        'code' => '6'
                    ]
                ];
                return response()->json($result);
            }
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
    }

    public function invite(Request $request, $placeId){
        try {
            $this->validate($request, [
                'user_id' => 'array'
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
        if ($place = Place::find($placeId)) {
            if (!$placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            foreach($request->input('user_id') as $userId) {
//                if ($invite = PlaceInvite::where(['place_id' => $place->id, 'user_id' => $userId])->first()) {
//                    $invite->delete();
//                } else {
//                    PlaceInvite::create(['place_id' => $place->id, 'inviter_user_id' => Auth::id(), 'user_id' => $userId]);
//                }
                if (!PlaceUser::where(['user_id' => $userId, 'place_id' => $placeId,])->first()){
                    NewPlace::create(['user_id' => $userId, 'place_id' => $placeId,]);
                    PlaceUser::create(['user_id' => $userId, 'place_id' => $placeId,]);
                }
            }
            return response()->json(['status' => true]);
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
    }

    public function admin_subscription_delete(Request $request, $placeId){
        try {
            $this->validate($request, [
                'user_id' => 'array'
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

        if ($place = Place::find($placeId)) {
            if ($placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true, 'is_creator' => true])->first()) {
                foreach($request->input('user_id') as $userId) {
                    if ($invite = PlaceUser::where(['place_id' => $place->id, 'user_id' => $userId])->first()) {
                        $invite->delete();
                    }
                }
                return response()->json(['status' => true]);
            } elseif (!$placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            foreach($request->input('user_id') as $userId) {
                if ($invite = PlaceUser::where(['place_id' => $place->id, 'user_id' => $userId, 'is_admin' => false])->first()) {
                    $invite->delete();
                }
            }
            return response()->json(['status' => true]);
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
    }

    public function setUserCreator($placeId,$userId)
    {
        if ($place = Place::find($placeId)) {
            if (!$creatorUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true, 'is_creator' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            if ($user = PlaceUser::where(['place_id' => $place->id, 'user_id' => $userId, 'is_admin' => true])->first()) {
                $user->is_creator = !$user->is_creator;
                $creatorUser->delete();
                $user->save();
                return response()->json(['status' => true, 'is_creator' => $user->is_creator]);
            } else {
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Incorrect group id",
                        'code' => '6'
                    ]
                ];
                return response()->json($result);
            }
        }
    }

    public function counter_new_place ()
    {
        $user = User::find(Auth::id());
        $scopes = $user->scopes()->pluck('scopes.id');
        $all_scope = false;
        foreach ($scopes as $scope) {
            if ($scope == 1)$all_scope = true;
        }
        if ($all_scope == true) {
            return NewPlace::where(['user_id' => Auth::id()])->count();
        } else {
            return NewPlace::where(['user_id' => Auth::id()])
                ->join('places', 'new_places.place_id', '=', 'places.id')
                ->join('scope_places', 'places.id', '=', 'scope_places.place_id')
                ->where(function ($query) use ($scopes) {
                    $query->whereIn('scope_places.scope_id', $scopes)
                        ->orWhere('scope_places.scope_id', 1);
                })
                ->groupBy('new_places.place_id')
                ->get()
                ->count();
        }
    }

    public function add_city(Request $request)
    {
        $country_id = $request->input('country_id');
        $city_name = $request->input('city_name');
        $region_name = $request->input('region_name');
        $area_name = $request->input('area_name');
        if (isset($region_name)) {
            $region = Region::firstOrCreate(['name' => $region_name, 'country_id' => $country_id]);
            if (isset($area_name)) {
                $area = Area::firstOrCreate(['name' => $area_name, 'region_id' => $region->id]);
            }
        }
        $area_id = (isset($area->id)) ? $area->id : null;
        $region_id = (isset($region->id)) ? $region->id : null;
        $city = City::firstOrCreate(['country_id'=>$country_id, 'name'=>$city_name, 'region_id'=>$region_id, 'area_id'=>$area_id]);
        return response()->json(['status' => true, 'city_id' => $city->id]);

    }

    public function getCities(Request $request)
    {
        try {
            $this->validate($request, [
                'country_id' => 'required|numeric',
                'name' => 'required'
            ]);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => $ex->validator->errors(),
                    'code' => '1'
                ]
            ];
            return $result;
        }
        $id = $request->input('country_id');
        $search = $request->input('name');
        $cities = City::join('areas', 'areas.id', '=', 'cities.area_id')
            ->join('regions', 'regions.id', '=', 'cities.region_id')
            ->select ('cities.id as id','cities.name as name','areas.name as area','regions.name as region')
            ->where('cities.country_id',$id)->where('cities.name', 'LIKE', $search.'%')
            ->get();
        return $cities;
    }

    public function getPlaceScopes($id)
    {
        $place = Place::find($id);
        $scopes_places = $place->scopes()->pluck('scopes.id');
        $scopes = Scope::all();
        $all = false;
        foreach ($scopes_places as $scopes_place){
            if ($scopes_place == 1){
                $all = true;
            }
        }
        if ($all == true) {
            $data_scope = [];
            foreach ($scopes as $scope) {
                $scope['signed'] = true;
                $data_scope[] = $scope;
            }
            return $data_scope;
        } else {
            $data_scope = [];
            foreach ($scopes as $scope) {
                foreach ($scopes_places as $scopes_place){
                    if ($scope['id'] == $scopes_place) {
                        $scope['signed'] = true;
                    }
                }
                $data_scope[] = $scope;
            }
            return $data_scope;
        }
    }

    function transliterate($input)
    {
        $translite = array(
            "Є" => "ye", "І" => "i", "Ѓ" => "g", "і" => "i", "№" => "-", "є" => "ye", "ѓ" => "g",
            "А" => "a", "Б" => "b", "В" => "v", "Г" => "g", "Д" => "d",
            "Е" => "e", "Ё" => "yo", "Ж" => "zh",
            "З" => "z", "И" => "i", "Й" => "j", "К" => "k", "Л" => "l",
            "М" => "m", "Н" => "n", "О" => "o", "П" => "p", "Р" => "r",
            "С" => "s", "Т" => "t", "У" => "u", "Ф" => "f", "Х" => "x",
            "Ц" => "c", "Ч" => "ch", "Ш" => "sh", "Щ" => "shh", "Ъ" => "'",
            "Ы" => "y", "Ь" => "", "Э" => "e", "Ю" => "yu", "Я" => "ya",
            "а" => "a", "б" => "b", "в" => "v", "г" => "g", "д" => "d",
            "е" => "e", "ё" => "yo", "ж" => "zh",
            "з" => "z", "и" => "i", "й" => "j", "к" => "k", "л" => "l",
            "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r",
            "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "x",
            "ц" => "c", "ч" => "ch", "ш" => "sh", "щ" => "shh", "ъ" => "",
            "ы" => "y", "ь" => "", "э" => "e", "ю" => "yu", "я" => "ya",
            " " => "_", "—" => "_", "," => "_", "!" => "_", "@" => "_",
            "#" => "-", "$" => "", "%" => "", "^" => "", "&" => "", "*" => "",
            "(" => "", ")" => "", "+" => "", "=" => "", ";" => "", ":" => "",
            "'" => "", "\"" => "", "~" => "", "`" => "", "?" => "", "/" => "",
            "\\" => "", "[" => "", "]" => "", "{" => "", "}" => "", "|" => ""
        );

        return strtr($input, $translite);
    }
}
