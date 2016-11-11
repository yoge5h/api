<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Section;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Requests;

class SectionController extends Controller
{
    use Helpers;

    public function index()
	{
	    return Section::get();
	}

	public function add(Request $request)
	{
	    $section = new Section;
	    $section->name = $request->get('name');
	   
	    if($section->save())
	        //return $this->response->created();
	        return response()
        			->json(Section::find($section->id));
	    else
	        return $this->response->error('could not create section', 500);
	}

	public function get($id)
	{
	    $section = Section::find($id);

	    if(!$section)
	        throw new NotFoundHttpException; 

	    return $section;
	}

	public function update(Request $request, $id)
	{
	    $section = Section::find($id);
	    if(!$section)
	        throw new NotFoundHttpException;

	    $section->fill($request->all());

	    if($section->save())
	         return response()
        			->json(['message' => 'Section updated successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not update section', 500);
	}

	public function delete($id)
	{
	    $section = Section::find($id);

	    if(!$section)
	        throw new NotFoundHttpException;

	    if($section->delete()) return response()
        			->json(['message' => 'Section deleted successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not delete book', 500);
	}	
}
