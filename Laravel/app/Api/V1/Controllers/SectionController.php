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
	    return Section::orderBy('name', 'acc')->get();
	}

	public function store(Request $request)
	{
	    $section = new Section;

	    $section->name = $request->get('name');
	   
	    if($section->save())
	        //return $this->response->created();
	        return response()
        			->json(['message' => 'Section entered successfully.'], 200);
	    else
	        return $this->response->error('could_not_create_section', 500);
	}

	public function show($id)
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
	        return $this->response->noContent();
	    else
	        return $this->response->error('could not update section', 500);
	}

	public function destroy($id)
	{
	    $section = Section::find($id);

	    if(!$section)
	        throw new NotFoundHttpException;

	    if($section->delete())
	        return $this->response->noContent();
	    else
	        return $this->response->error('could not delete book', 500);
	}
}
