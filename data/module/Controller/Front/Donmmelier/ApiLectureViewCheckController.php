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
 * [API] 강의 시청 여부
 * @author jw.lee
 */
class ApiLectureViewCheckController extends \Controller\Front\Controller
{

  /**
   * index
   *
   */
  public function index()
  {
    $result_array = array();
    // if (!Request::isMethod('get')) {
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

    $myPage = new MyPage();
    $memberData = $myPage->myInformation();

    $lecture_info = [
        'memNo' => $memberData['memNo'], 
        'memId' => $memberData['memId'], 
        'season' => 1, 
        'num' => $params['lecture_index']
    ];

    $lecture_count = $donSvc->getCountDonmmRegistered($lecture_info);
    if($lecture_count > 0) {
        $result_array['result'] = true;
        $result_array['code'] = 1;
        $result_array['message'] = '시청 완료한 강의입니다.';
    }
    else {
        $result_array['result'] = true;
        $result_array['code'] = 0;
        $result_array['message'] = '시청하지 않은 강의입니다.';
    }

    $this->json($result_array);
    exit;
  }
}
