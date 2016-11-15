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
use Mail;
use stdClass;
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
		$messageContent = $request["message"];
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
			$mailingListTo = array();
			foreach ($toEmails as $email) {
				array_push($mailingListTo ,$email->email);
			}

			$setting = Setting::get(['email','cc']);

			$mailingListFrom = $setting[0]->email;
			$mailingListCC = $setting[0]->cc;


			$mailDetails = new stdClass();
			$mailDetails->subject = $subject;
			$mailDetails->mailingListCC = $mailingListCC;
			$mailDetails->messageContent = $messageContent;
			$mailDetails->toEmails = $mailingListTo;
			$mailDetails->mailingListFrom = $mailingListFrom;
			$mailDetails->files = $myFiles;
		
			Mail::raw($mailDetails->messageContent, function($message) use($mailDetails) {
			    $message
			        ->subject($mailDetails->subject)
			        ->to($mailDetails->toEmails)
			        ->cc(explode(";", $mailDetails->mailingListCC))
			        ->from($mailDetails->mailingListFrom);
			
			    if (count($mailDetails->files) > 0) {
			    	foreach($mailDetails->files as $file){
			        	$message->attach($file, array('as'=>$file->getClientOriginalName()));
			    	}
			    }
			});
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
				'message' 	=> $messageContent,
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
			curl_close( $ch );
		}
		

		

		dd('stop');

		$user = JWTAuth::parseToken()->authenticate(); 
	    $notice = new Notice;
	    $notice->addedBy = $user->id;
	    $notice->subject = $request->get('subject');
	    $notice->message = $messageContent;
	    
	   
	    if($notice->save())
	        return response()
        			->json(['message' => 'Notice entered successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not create notice', 500);
	}
}
