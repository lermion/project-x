<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    protected $fillable = [
        'avatar','cover','original_avatar', 'original_cover', 'description','name','url_name','address','coordinates_x','coordinates_y','dynamic','expired_date','city_id','type_place_id', 'room_id', 'is_block', 'block_message'
    ];

    public function users()
    {
        return $this->belongsToMany('App\User', 'place_users');
    }

    public function creator()
    {
        return $this->belongsToMany('App\User', 'place_users')->wherePivot('is_creator', true);
    }

    public function publications()
    {
        return $this->belongsToMany('App\Publication', 'place_publications')->withTimestamps();
    }

    public function scopes()
    {
        return $this->belongsToMany('App\Scope', 'scope_places')->withTimestamps();
    }

    public function count_chat_files($room_id)
    {
        $image = Image::join('message_images','message_images.image_id','=', 'images.id')
            ->join('user_rooms_messages','user_rooms_messages.message_id','=','message_images.message_id')
            ->where('user_rooms_messages.room_id',$room_id)
            ->count();

        $video = Video::join('message_videos','message_videos.video_id','=', 'videos.id')
            ->join('user_rooms_messages','user_rooms_messages.message_id','=','message_videos.message_id')
            ->where('user_rooms_messages.room_id',$room_id)
            ->count();
        $count = $image+$video;
        return $count;
    }

}
