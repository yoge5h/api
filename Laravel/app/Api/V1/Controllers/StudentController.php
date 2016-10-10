<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Student;
use App\Section;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Requests;

class StudentController extends Controller
{
    use Helpers;

    public function index()
	{
	    //return Student::with('section')->orderBy('firstName', 'asc')->get();// IT WORKS!!!
	    return Student::get();
	}

	public function add(Request $request)
	{
	    $student = new Student;

	    $student->firstName = $request->get('firstName');
	    $student->lastName = $request->get('lastName');
	    $student->email = $request->get('email');
	    $student->phone = $request->get('phone');
	    $student->sectionId = $request->get('sectionId');

	   
	    if($student->save())
	        return response()
        			->json([]);
	    else
	        return $this->response->error('could not create student', 500);
	}

	public function get($id)
	{
		$search  = ['sectionId'=>$id];
	    $student = Student::where($search)->get();

	    if(!$student)
	        throw new NotFoundHttpException; 

	    return $student;
	}

	public function update(Request $request, $id)
	{
	    $student = Student::find($id);
	    if(!$student)
	        throw new NotFoundHttpException;

	    $student->fill($request->all());

	    if($student->save())
	         return response()
        			->json(['message' => 'Student updated successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not update student', 500);
	}

	public function delete($id)
	{
	    $student = Student::find($id);

	    if(!$student)
	        throw new NotFoundHttpException;

	    if($student->delete()) return response()
        			->json(['message' => 'Student deleted successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not delete student', 500);
	}
}
