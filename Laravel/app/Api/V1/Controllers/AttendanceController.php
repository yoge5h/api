<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Attendance;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

use App\Http\Requests;

class AttendanceController extends Controller
{
    use Helpers;

    public function attendanceExists(Request $request)
	{
		$filterDate = date('Y-m-d', strtotime($request->get('date')));
		$search  = ['sectionId'=>$request->get('sectionId'), 'subjectId'=>$request->get('subjectId'), 'date'=>$filterDate];
	    $attendance = Attendance::where($search)->get();

	    return response()->json(['status' => $attendance->isEmpty()]);

	   
	}

	public function add(Request $request)
	{	
		$sectionId = $request->get('section');
	    $subjectId = $request->get('subject');
	    $date = $request->get('date');

		$filterDate = date('Y-m-d', strtotime($request->get('date')));
		$search  = ['sectionId'=>$sectionId, 'subjectId'=>$subjectId, 'date'=>$filterDate];
	    $attendance = Attendance::where($search)->get();

	    if(!$attendance->isEmpty()){
	    	return response()
    			->json(['message' => 'Attendance already marked for the date and subject.', 'status' => 'error']);
	    }

	    
	    foreach ($request->get('students') as $key => $value) {
	    	$attendance = new Attendance;
	    	$attendance->studentId = $value['studentId'];	    
		    $attendance->isPresent = $value['isPresent'];
		    $attendance->sectionId = $sectionId;
		    $attendance->subjectId = $subjectId;
		    $attendance->date = $date;

		    $attendance->save();
	    }

        return response()
    			->json(['message' => 'Attendance marked successfully.', 'status' => 'success']);
	   
	}

	public function student(Request $request)
	{
		$sectionId = $request->get('section');
		$studentId = $request->get('student')["id"];
		$from = date('Y-m-d', strtotime($request->get('fromDate')));
		$to = date('Y-m-d', strtotime($request->get('toDate')));
		$fromStart = $request->get('isFromStart');



		if($fromStart){
			$report = DB::table('attendances')
						->join('sections','sections.id','=','attendances.sectionId')
						->join('subjects','subjects.id','=','attendances.subjectId')
						->join('students','students.id','=','attendances.studentId')
						->where('attendances.sectionId','=',$sectionId)
						->where('attendances.studentId','=',$studentId)
						->where('attendances.date','<=',$to)
						->select('attendances.date','attendances.isPresent','subjects.name AS subject')
						->get();
		}
		else{
			$report = DB::table('attendances')
						->join('sections','sections.id','=','attendances.sectionId')
						->join('subjects','subjects.id','=','attendances.subjectId')
						->join('students','students.id','=','attendances.studentId')
						->where('attendances.sectionId','=',$sectionId)
						->where('attendances.studentId','=',$studentId)
						->where('attendances.date','<=',$to)
						->where('attendances.date','>=',$from)
						->select('attendances.date','attendances.isPresent','subjects.name AS subject')
						->get();
		}

		 return response()
        			->json($report);

	}
}
