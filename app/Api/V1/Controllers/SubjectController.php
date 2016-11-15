<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Subject;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Requests;

class SubjectController extends Controller
{
    use Helpers;

    public function index()
	{
	    return Subject::with('section')->get();// IT WORKS!!!
	    //return Subject::orderBy('name', 'asc')->get();
	}

	public function add(Request $request)
	{
	    $subject = new Subject;

	    $subject->name = $request->get('name');
	    $subject->code = $request->get('code');
	    $subject->sectionId = $request->get('sectionId');

	   
	    if($subject->save())
	        return response()
        			->json(Subject::with('section')->find($subject->id));
	    else
	        return $this->response->error('could not create subject', 500);
	}

	public function get($id)
	{
		$search  = ['sectionId'=>$id,'isActive'=>true];
	    $subject = Subject::where($search)->with('section')->get();

	    if(!$subject)
	        throw new NotFoundHttpException; 

	    return $subject;
	}

	public function getAll($id)
	{
		$search  = ['sectionId'=>$id];
	    $subject = Subject::where($search)->with('section')->get();

	    if(!$subject)
	        throw new NotFoundHttpException; 

	    return $subject;
	}

	public function update(Request $request, $id)
	{
	    $subject = Subject::find($id);
	    if(!$subject)
	        throw new NotFoundHttpException;

	    $subject->fill($request->all());

	    if($subject->save())
	         return response()
        			->json(['message' => 'Subject updated successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not update subject', 500);
	}

	public function delete($id)
	{
	    $subject = Subject::find($id);

	    if(!$subject)
	        throw new NotFoundHttpException;

	    if($subject->delete()) return response()
        			->json(['message' => 'Subject deleted successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not delete subject', 500);
	}

	public function changeActiveStatus($id){
		$subject = Subject::find($id);
		if(!$subject)
	        throw new NotFoundHttpException;
	    $subject->isActive = !$subject->isActive;
	    if($subject->save())
	        return response()
        		->json(['message' => 'Subject updated successfully.', 'status' => 200]);
	}
}
