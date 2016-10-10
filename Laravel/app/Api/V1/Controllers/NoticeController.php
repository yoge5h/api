<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Notice;
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
	    return Notice::where($search)->orderBy('created_at', 'desc')->get();// IT WORKS!!!
	    //return Notice::orderBy('name', 'asc')->get();
	}

	public function add(Request $request)
	{
	    $notice = new Notice;

	    $notice->subject = $request->get('subject');
	    $notice->message = $request->get('message');
	    
	   
	    if($notice->save())
	        return response()
        			->json(['message' => 'Notice entered successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not create notice', 500);
	}
}
