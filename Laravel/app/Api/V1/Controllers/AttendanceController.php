<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Attendance;
use App\Student;
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
		$user = JWTAuth::parseToken()->authenticate(); 
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
		    $attendance->addedBy = $user->id;
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
						->where('subjects.isActive','=',true)
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
						->where('subjects.isActive','=',true)
						->select('attendances.date','attendances.isPresent','subjects.name AS subject')
						->get();
		}

		 return response()
        			->json($report);

	}

	public function section(Request $request){
		$sectionId = $request->get('section');		
		$from = date('Y-m-d', strtotime($request->get('fromDate')));
		$to = date('Y-m-d', strtotime($request->get('toDate')));
		$fromStart = $request->get('isFromStart');

		$search  = ['sectionId'=>$sectionId];
		$response["students"] = Student::where($search)->get(['id']);

		if($fromStart){
			$response["report"] = DB::select('
				        SELECT students.id, CONCAT(students.firstName," " ,students.lastName) AS name, subjects.name AS subject, CEILING(SUM(IF(attendances.isPresent = 1,1,0))/SUM(IF(attendances.isPresent IS NOT NULL,1,0)) * 100) AS attendance FROM `sections` 
						JOIN `subjects` ON sections.id = subjects.sectionId 
						JOIN `students` ON sections.id = students.sectionId
						LEFT JOIN `attendances` ON sections.id = attendances.sectionId AND subjects.id = attendances.subjectId AND students.id = attendances.studentId
						WHERE sections.id = ? AND attendances.date <= ? AND subjects.isActive = true
						GROUP BY subjects.id, students.id', 
				        [$sectionId, $to]
				     );
		}
		else{
			$response["report"] = DB::select('
				        SELECT students.id, CONCAT(students.firstName," " ,students.lastName) AS name, subjects.name AS subject, CEILING(SUM(IF(attendances.isPresent = 1,1,0))/SUM(IF(attendances.isPresent IS NOT NULL,1,0)) * 100) AS attendance FROM `sections` 
						JOIN `subjects` ON sections.id = subjects.sectionId 
						JOIN `students` ON sections.id = students.sectionId
						LEFT JOIN `attendances` ON sections.id = attendances.sectionId AND subjects.id = attendances.subjectId AND students.id = attendances.studentId
						WHERE sections.id = ? AND attendances.date <= ? AND attendances.date >= ?  AND subjects.isActive = true
						GROUP BY subjects.id, students.id', 
				        [$sectionId, $to,$from]
				     );
		}

		 return response()
        			->json($response);


	}
}
