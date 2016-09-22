<?php

namespace App\Http\Controllers;

use App\Online;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Requests;

class SphinxSearchController extends Controller
{
    public function search(Request $request){

        $user = User::find(Auth::id());
        $scopes = $user->scopes()->pluck('scopes.id')->toArray();
        $string_scopes = implode(",", $scopes);
        $all_scope = false;
        foreach ($scopes as $scope) {
            if ($scope == 1) $all_scope = true;
        }
        if ($all_scope == false) {
            $data = $request->all();
            $name = $data['name'];
            $sql = "'$name'";
            $result = [];
            $result[0] = [];
            $result[1] = [];
            $result[2] = [];
            $result[3] = [];
            if (!empty($data['usersearch'])) {
                $query = "SELECT * FROM pp_user WHERE scope IN ($string_scopes) and MATCH($sql)ORDER BY id DESC";
                $user_scope = (sphinx_raw($query));
                $query2 = "SELECT * FROM pp_user WHERE scope NOT IN ($string_scopes) and MATCH($sql)ORDER BY id DESC";
                $user_all = (sphinx_raw($query2));
                $user_scope = $user_scope->toArray();
                $user_all = $user_all->toArray();
                $r = array_merge ($user_scope, $user_all);
                $users = array();
                if ($r) {
                    foreach ($r as $res) {
                        $res['online'] = Online::isOnline($res['id']);
                        $users[] = $res;
                    }
                }
                $result[0] = $users;
            }

            if (!empty($data['publicationsearch'])) {
                $query = "SELECT * FROM pp_publication WHERE scope IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $publication_scope = (sphinx_raw($query));
                $query2 = "SELECT * FROM pp_publication WHERE scope NOT IN ($string_scopes) and MATCH($sql)ORDER BY id DESC";
                $publication_all = (sphinx_raw($query2));
                $publication_scope = $publication_scope->toArray();
                $publication_all = $publication_all->toArray();
                $result[1] = array_merge ($publication_scope, $publication_all);

            }
            if (!empty($data['groupsearch'])) {
                $query = "SELECT * FROM pp_group_publication WHERE scope IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $group_scope = (sphinx_raw($query));
                $query2 = "SELECT * FROM pp_group_publication WHERE scope NOT IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $group_all = (sphinx_raw($query2));
                $group_scope = $group_scope->toArray();
                $group_all = $group_all->toArray();
                $result[2] = array_merge ($group_scope, $group_all);

            }
            if (!empty($data['placesearch'])) {
                $query = "SELECT * FROM pp_place_publication WHERE scope IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $place_scope = (sphinx_raw($query));
                $query2 = "SELECT * FROM pp_place_publication WHERE scope NOT IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $place_all = (sphinx_raw($query2));
                $place_scope = $place_scope->toArray();
                $place_all = $place_all->toArray();
                $result[3] = array_merge ($place_scope, $place_all);
            }

            if ((empty($data['usersearch'])) && (empty($data['publicationsearch'])) &&
                (empty($data['groupsearch'])) && (empty($data['placesearch']))
            ) {
                $query = "SELECT * FROM pp_user WHERE scope IN ($string_scopes) and MATCH($sql)ORDER BY id DESC";
                $user_scope = (sphinx_raw($query));
                $query2 = "SELECT * FROM pp_user WHERE scope NOT IN ($string_scopes) and MATCH($sql)ORDER BY id DESC";
                $user_all = (sphinx_raw($query2));
                $user_scope = $user_scope->toArray();
                $user_all = $user_all->toArray();
                $r = array_merge ($user_scope, $user_all);
                $user = array();
                if ($r) {
                    foreach ($r as $res) {
                        $res['online'] = Online::isOnline($res['id']);
                        $user[] = $res;
                    }
                }
                $result[0] = $user;

                $query = "SELECT * FROM pp_publication WHERE scope IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $publication_scope = (sphinx_raw($query));
                $query2 = "SELECT * FROM pp_user WHERE scope NOT IN ($string_scopes) and MATCH($sql)ORDER BY id DESC";
                $publication_all = (sphinx_raw($query2));
                $publication_scope = $publication_scope->toArray();
                $publication_all = $publication_all->toArray();
                $result[1] = array_merge ($publication_scope, $publication_all);

                $query = "SELECT * FROM pp_group_publication WHERE scope IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $group_scope = (sphinx_raw($query));
                $query2 = "SELECT * FROM pp_group_publication WHERE scope NOT IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $group_all = (sphinx_raw($query2));
                $group_scope = $group_scope->toArray();
                $group_all = $group_all->toArray();
                $result[2] = array_merge ($group_scope, $group_all);

                $query = "SELECT * FROM pp_place_publication WHERE scope IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $place_scope = (sphinx_raw($query));
                $query2 = "SELECT * FROM pp_place_publication WHERE scope NOT IN ($string_scopes) and MATCH($sql) ORDER BY id DESC";
                $place_all = (sphinx_raw($query2));
                $place_scope = $place_scope->toArray();
                $place_all = $place_all->toArray();
                $result[3] = array_merge ($place_scope, $place_all);

            }
        } else {
            $Data = $request->all();
            $name = $Data['name'];
            $sql = "'$name'";
            $result = [];
            $result[0] = [];
            $result[1] = [];
            $result[2] = [];
            $result[3] = [];
            if (!empty($Data['usersearch'])) {
                $query = "SELECT * FROM pp_user WHERE MATCH($sql) ORDER BY id DESC ";
                $r = (sphinx_raw($query));
                $user = array();
                if ($r) {
                    foreach ($r as $res) {
                        $res['online'] = Online::isOnline($res['id']);
                        $user[] = $res;
                    }
                }
                $result[0] = $user;
            }

            if (!empty($Data['publicationsearch'])) {
                $query = "SELECT * FROM pp_publication WHERE MATCH($sql) ORDER BY id DESC";
                $result[1] = (sphinx_raw($query));
            }
            if (!empty($Data['placesearch'])) {
                $query = "SELECT * FROM pp_group_publication WHERE MATCH($sql) ORDER BY id DESC";
                $result[2] = (sphinx_raw($query));

            }
            if (!empty($Data['groupsearch'])) {
                $query = "SELECT * FROM pp_place_publication WHERE MATCH($sql) ORDER BY id DESC";
                $result[3] = (sphinx_raw($query));
            }

            if ((empty($Data['usersearch'])) && (empty($Data['publicationsearch'])) &&
                (empty($Data['groupsearch'])) && (empty($Data['placesearch']))
            ) {
                $query = "SELECT * FROM pp_user WHERE MATCH($sql) ORDER BY id DESC";
                $r = (sphinx_raw($query));
                $user = array();
                if ($r) {
                    foreach ($r as $res) {
                        $res['online'] = Online::isOnline($res['id']);
                        $user[] = $res;
                    }
                }
                $result[0] = $user;
                $query = "SELECT * FROM pp_publication WHERE MATCH($sql) ORDER BY id DESC";
                $result[1] = (sphinx_raw($query));
                $query = "SELECT * FROM pp_group_publication WHERE MATCH($sql) ORDER BY id DESC";
                $result[2] = (sphinx_raw($query));
                $query = "SELECT * FROM pp_place_publication WHERE MATCH($sql) ORDER BY id DESC";
                $result[3] = (sphinx_raw($query));

            }
        }
        return response()->json($result);

    }

    public function geosearch(Request $request){
            try {
                $data = $request->all();
                $x = deg2rad($data['coordinate_x']);
                $y = deg2rad($data['coordinate_y']);

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
