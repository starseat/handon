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
namespace Controller\Front\Donmmelier\Dadmin;

use Request;
use Component\Member\Member;
use Component\Member\MyPage;
use Component\Donmmelier\DonSVC;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * [API] 한돈 소믈리에 관리자 모든 회원 정보
 * @author jw.lee
 */
class ApiMemberTotalDataController extends \Controller\Front\Controller
{

  /**
   * index
   *
   */
  public function index()
  {
    $result_array = array();
    $session = \App::getInstance('session');
    if (!$session->has('donmm_is_login') || $session->get('donmm_is_login') == 0) {
      $result_array['result'] = false;
      $result_array['code'] = 1001;
      $result_array['message'] = '잘못된 요청입니다.';
      $this->json($result_array);
      exit;
    }
    
    $donSvc = \App::load('\\Component\\Donmmelier\\DonSVC');
    $result_array = [
      'result' => true, 
      'code' => 0, 
      'data' => $donSvc->getMemberInfoTotalList()
    ];

    $this->json($result_array);
    exit;
  }
}
