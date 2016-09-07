<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccessCode extends Model
{
    protected $fillable = [
        'user_id','code','invited_user_id'
    ];

    public static function generateCode($id)
    {
        $i = 0;
        while ($i <= 9) {
            $code = self::generator();
            $exist = AccessCode::create(['code' => $code, 'user_id' => $id]);
            if ($exist) {
                $i++;
            }
        }
    }

    public static function generator()
    {
            $result = '';
            for ($i = 0; $i <= 8; $i++) {
                $result .= mt_rand (0,9);
            }
            return $result;
    }
}
