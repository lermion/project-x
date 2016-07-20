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
        if(!empty($Data['usersearch']) ){
            $query = "SELECT * FROM pp_user WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));
        }

        elseif (!empty($Data['publicationsearch'])){
            $query = "SELECT * FROM pp_publication WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));
        }
        elseif (!empty($Data['publicationsearch'])){
            $query = "SELECT * FROM pp_publication WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));
        }
        elseif (!empty($Data['groupsearch'])){
            $query = "SELECT * FROM pp_group_publication WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));
        }
        elseif (!empty($Data['placesearch'])){
            $query = "SELECT * FROM pp_place_publication WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));
        }

        else{
            $query = "SELECT * FROM pp_user WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));
            $query = "SELECT * FROM pp_publication WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));
            $query = "SELECT * FROM pp_group_publication WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));
            $query = "SELECT * FROM pp_place_publication WHERE MATCH($sql)";
            $result[]=(sphinx_raw($query));

        }
        dd($result);

        }

    
        
    
}
