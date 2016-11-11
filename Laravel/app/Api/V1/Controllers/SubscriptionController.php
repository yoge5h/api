<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Subscription;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Requests;

class SubscriptionController extends Controller
{
	use Helpers;
    public function save(Request $request)
	{
	    $subscription = Subscription::firstOrNew(array('deviceId' => $request->get('deviceId')));
		$subscription->deviceId = $request->get('deviceId');
		$subscription->sectionId = $request->get('sectionId');
		
		if($subscription->save())
	         return response()
        			->json(['message' => 'Subscription registered successfully.', 'status' => 200]);
	    else
	        return $this->response->error('could not register subscription', 500);
	}

	public function index(Request $request)
	{
		$subscription = $request->get('deviceId');
		$search  = ['deviceId'=>$subscription];
	    $subscription = Subscription::where($search)->get();

	    if(!$subscription)
	        throw new NotFoundHttpException; 

	    return $subscription;
	}
}
