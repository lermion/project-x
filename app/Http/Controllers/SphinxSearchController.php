<?php

namespace App\Http\Controllers;

use App\Online;
use Illuminate\Http\Request;

use App\Http\Requests;

class SphinxSearchController extends Controller
{
    public function search(Request $request){
        

        $Data = $request->all();
        $name = $Data['name'];
        $sql="'$name'";
        $result=[];
        $result[0]=[];
        $result[1]=[];
        $result[2]=[];
        $result[3]=[];
        if(!empty($Data['usersearch']) ){
            $query = "SELECT * FROM pp_user WHERE MATCH($sql)";
            $r=(sphinx_raw($query));
            $user = array();
            if ($r) {
                foreach ($r as $res) {
                    $res['online'] = Online::isOnline($res['id']);
                    $user[] = $res;
                }
            }
                $result[0]=$user;
        }

        if (!empty($Data['publicationsearch'])){
            $query = "SELECT * FROM pp_publication WHERE MATCH($sql)";
            $result[1]=(sphinx_raw($query));
        }
        if (!empty($Data['placesearch'])){
            $query = "SELECT * FROM pp_group_publication WHERE MATCH($sql)";
            $result[2]=(sphinx_raw($query));

        }
        if (!empty($Data['groupsearch'])){
            $query = "SELECT * FROM pp_place_publication WHERE MATCH($sql)";
            $result[3]=(sphinx_raw($query));
        }

        if((empty($Data['usersearch'])) && (empty($Data['publicationsearch'])) &&
            (empty($Data['groupsearch'])) && (empty($Data['placesearch'])) ){
            $query = "SELECT * FROM pp_user WHERE MATCH($sql)";
            $r=(sphinx_raw($query));
            $user = array();
            if ($r) {
                foreach ($r as $res) {
                    $res['online'] = Online::isOnline($res['id']);
                    $user[] = $res;
                }
            }
            $result[0]=$user;
            $query = "SELECT * FROM pp_publication WHERE MATCH($sql)";
            $result[1]=(sphinx_raw($query));
            $query = "SELECT * FROM pp_group_publication WHERE MATCH($sql)";
            $result[2]=(sphinx_raw($query));
            $query = "SELECT * FROM pp_place_publication WHERE MATCH($sql)";
            $result[3]=(sphinx_raw($query));

        }
        return response()->json($result);
    }

    public function geosearch(Request $request){
            try {
                $Data = $request->all();
                $x = deg2rad($Data['coordinate_x']);
                $y = deg2rad($Data['coordinate_y']);

                $query = 'SELECT *, GEODIST(' . $x . ', ' . $y . ',coordinates_x_rad, coordinates_y_rad) as distance FROM pp_near_coordinates WHERE distance < 10000  ORDER BY distance ASC LIMIT 0,20';

                $result = (sphinx_raw($query));
            }
           catch (\Exception $ex) {
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => 'something went wrong',
                        'code' => '5'
                    ]
                ];
            }

            return response()->json($result);

    }

    private function unique_array_by_key($array, $key) {
        $temp_array = array();
        $i = 0;
        $key_array = array();
        foreach($array as $val) {
            if (!in_array($val[$key], $key_array)) {
                $key_array[$i] = $val[$key];
                $temp_array[$i] = $val;
            }
            $i++;
        }
        return $temp_array;
    }

}
