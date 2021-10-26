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
use Component\Donmmelier\Test;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * 한돈 소믈리에 관리자 로그인
 * @author jw.lee
 */
class LoginActionController extends \Controller\Front\Controller
{

  /**
   * index
   *
   */
  public function index()
  {
    $session = \App::getInstance('session');
    $donSvc = \App::load('\\Component\\Donmmelier\\DonSVC');
    $params = Request::post()->toArray();

    $result_array = $donSvc->loginAction($params['login_id'], $params['login_pw']);
    $msg = '';
    if($result_array['result']) {
        $session->set('donmm_is_login', 1);
        $session->set('donmm_login_info', $result_array);

        $msg = 'alert(\'로그인 성공하였습니다.\');parent.location.href=\'./member.php\';';
    }
    else {
        $session->del('donmm_is_login');
        $session->del('donmm_login_info');

        if($result_array['code'] == -1) {
            $msg = 'alert(\'아이디가 일치하지 않습니다.\');parent.location.href=\'./login.php\';';
        }
        else { // ($result_array['code'] == -2) {
            $msg = 'alert(\'비밀번호가 일치하지 않습니다.\');parent.location.href=\'./login.php\';';            
        }
    }

    $this->js($msg);
    exit;
  }
}
