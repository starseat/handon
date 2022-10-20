<?php

/**
 * This is commercial software, only users who have purchased a valid license
 * and accept to the terms of the License Agreement can install and use this
 * program.
 *
 * Do not edit or add to this file if you wish to upgrade Godomall5 to newer
 * versions in the future.
 *
 * @copyright ⓒ 2016, NHN godo: Corp.
 * @link http://www.godo.co.kr
 */
namespace Controller\Front\Donmmelier;

use Request;
use Component\Member\MyPage;
use Component\Member\Member;
use Component\Donmmelier\DonSVC;
use Component\Donmmelier\Test;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * [API] 수강 신청 등록
 * @author jw.lee
 */
class ApiRegistrationController extends \Controller\Front\Controller
{

  /**
   * index
   *
   */
  public function index()
  {
    $result_array = array();
    if(!Request::isAjax()) {
        $result_array['result'] = false;
        $result_array['code'] = 1001;
        $result_array['message'] = '잘못된 요청입니다.';
        $this->json($result_array);
        exit;
    }

    $session = \App::getInstance('session');
    if (!$session->has(Member::SESSION_MEMBER_LOGIN)) {
        $result_array['result'] = false;
        $result_array['code'] = 1002;
        $result_array['message'] = '로그인 되지 않았습니다.';
        $this->json($result_array);
        exit;
    }

    $donSvc = \App::load('\\Component\\Donmmelier\\DonSVC');
    
    $params = Request::post()->toArray();
    $regi_name = $params['regi_name'];
    $regi_phone = $params['regi_phone'];

    $regi_count = $donSvc->getCountDonmmRegistered($regi_phone);
    if($regi_count > 0) {
        $result_array['result'] = true;
        $result_array['code'] = 1;
        $result_array['message'] = '이미 수강신청 되어 있습니다.';
        $this->json($result_array);
        exit;
    }

    $myPage = new MyPage();
    $memberData = $myPage->myInformation();

    $insert_info = [
        'phone' => $regi_phone, 
        'name' => $regi_name, 
        'memNo' => $memberData['memNo'], 
        'memId' => $memberData['memId']
    ];

    $insert_result = $donSvc->insertDonmmRegistered($insert_info);

    if($insert_result == -1) {
        $result_array['result'] = false;
        $result_array['code'] = 1003;
        $result_array['message'] = '전화번호가 올바른 형식이 아닙니다.';
        $this->json($result_array);
        exit;
    }

    if($insert_result == -2) {
        $result_array['result'] = false;
        $result_array['code'] = 1004;
        $result_array['message'] = '이름이 올바른 형식이 아닙니다.';
        $this->json($result_array);
        exit;
    }

    $result_array['result'] = true;
    $result_array['code'] = 0;
    $result_array['message'] = '수강 신청 되었습니다.';
    $this->json($result_array);
    exit;
  }
}
