<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Notice;
use App\Student;
use App\Subscription;
use App\Setting;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests;

class NoticeController extends Controller
{
	use Helpers;
    public function index($id)
	{
		$search  = ['sectionId'=>$id];
	    return Notice::where($search)->orderBy('created_at', 'desc')->take(10)->get();// IT WORKS!!!
	    //return Notice::orderBy('name', 'asc')->get();
	}

	public function add(Request $request)
	{
		//core message
		$noOfFiles = intval($request["noOfFiles"]);
		$section = $request["to"];
		$subject = $request["subject"];
		$message = $request["message"];
		$isEmail = $request["sendEmail"];
		$isMobile = $request["sendToMobile"];

		$myFiles = array();
		for ($x = 0; $x < $noOfFiles; $x++) {
			$key = "file_".strval($x);
		    $myFiles[] = $request[$key];
		} 	

		if($isEmail == 'true')
		{
			//email part
			$search  = ['sectionId'=>$section];
			$toEmails = Student::where($search)->get(['email']);
			$mailingListTo = '';
			foreach ($toEmails as $email) {
				$mailingListTo = $mailingListTo.$email->email.';';
			}

			$setting = Setting::get(['email','cc']);

			$mailingListFrom = $setting[0]->email;
			$mailingListCC = $setting[0]->cc;

			//dd($mailingListCC);
		}

		if($isMobile == 'true')
		{
			//notification part
			$gcmKey = config('app.SECRET_API_KEY');
			$search  = ['sectionId'=>$section];
			$toMobiles = Subscription::where($search)->get(['deviceId']);
			$mobileListTo = '';
			$registrationIds = array();
			foreach ($toMobiles as $mobile) {
				$registrationIds[] = $mobile->deviceId;
			}

			$msg = array
			(
				'message' 	=> $message,
				'title'		=> $subject
			);

			$fields = array
			(
				'registration_ids' 	=> $registrationIds,
				'data'			=> $msg
			);

			$headers = array
			(
				'Authorization: key=' . $gcmKey,
				'Content-Type: application/json'
			);

			$ch = curl_init();
			curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
			curl_setopt( $ch,CURLOPT_POST, true );
			curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
			curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
			curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
			$result = curl_exec($ch );
			dd($result);
			curl_close( $ch );
		}
		

		

		dd('stop');

		$user = JWTAuth::parseToken()->authenticate(); 
	    $notice = new Notice;
	    $notice->addedBy = $user->id;
	    $notice->subject = $request->get('subject');
	    $notice->message = $request->get('message');
	    
	   
	    if($notice->save())
	        return response()
        			->json(['message' => 'Notice entered successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not create notice', 500);
	}
}
