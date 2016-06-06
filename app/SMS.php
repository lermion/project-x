<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SMS extends Model
{
    public static function sendSMS($message, $phone)
    {
        $src = self::getSMSSource($message, $phone);
        $Curl = curl_init();
        $CurlOptions = self::getCurlOptions($src);
        curl_setopt_array($Curl, $CurlOptions);
        if (false === ($Result = curl_exec($Curl))) {
            throw new \Exception('Http request failed');
        }

        curl_close($Curl);

        $result = simplexml_load_string($Result)->status;
        
        return $result;
    }

    private static function getSMSSource($message, $phone){
        $src = '<?xml version="1.0" encoding="UTF-8"?>
            <SMS>
                <operations>
                <operation>SEND</operation>
                </operations>
                <authentification>
                <username>'.env('SMS_LOGIN').'</username>
                <password>'.env('SMS_PASSWORD').'</password>
                </authentification>
                <message>
                <sender>PlacePeople</sender>
                <text>'.$message.'</text>
                </message>
                <numbers>
                <number messageID="msg11">'.$phone.'</number>
                </numbers>
            </SMS>';
        return $src;
    }

    private static function getCurlOptions($src){
        $CurlOptions = array(
            CURLOPT_URL => 'http://api.atompark.com/members/sms/xml.php',
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_POST => true,
            CURLOPT_HEADER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 15,
            CURLOPT_TIMEOUT => 100,
            CURLOPT_POSTFIELDS => array('XML' => $src),
        );
        return $CurlOptions;
    }
}
