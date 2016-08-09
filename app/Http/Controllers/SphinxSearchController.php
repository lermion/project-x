<?php

namespace App\Http\Controllers;

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
            $result[0]=(sphinx_raw($query));
        }

        if (!empty($Data['publicationsearch'])){
            $query = "SELECT * FROM pp_publication WHERE MATCH($sql)";
            $result[1]=(sphinx_raw($query));
        }
        if (!empty($Data['placesearch'])){
            $query = "SELECT * FROM pp_group_publication WHERE MATCH($sql)";
            $result[2]=(sphinx_raw($query));
            //dd($result[2]=(sphinx_raw($query)));
        }
        if (!empty($Data['groupsearch'])){
            $query = "SELECT * FROM pp_place_publication WHERE MATCH($sql)";
            $result[3]=(sphinx_raw($query));
        }

        if((empty($Data['usersearch'])) && (empty($Data['publicationsearch'])) &&
            (empty($Data['groupsearch'])) && (empty($Data['placesearch'])) ){
            $query = "SELECT * FROM pp_user WHERE MATCH($sql)";
            $result[0]=(sphinx_raw($query));
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
                $x = $Data['coordinate_x'];
                $y = $Data['coordinate_y'];

                $query = 'SELECT *, GEODIST(' . $x . ', ' . $y . ',coordinates_x, coordinates_y) as distance FROM pp_near_coordinates ORDER BY distance ASC LIMIT 0,20';


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


        
    
}
