<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = [
        'name', 'url_name', 'description', 'is_open', 'avatar', 'card_avatar', 'room_id'
    ];

    public function users()
    {
        return $this->belongsToMany('App\User', 'group_users')->withTimestamps();
    }

    public function publications()
    {
        return $this->belongsToMany('App\Publication', 'group_publications')->withTimestamps();
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
