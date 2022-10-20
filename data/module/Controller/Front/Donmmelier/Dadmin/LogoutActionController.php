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
 * 한돈 소믈리에 관리자 로그아웃
 * @author jw.lee
 */
class LogoutActionController extends \Controller\Front\Controller
{

  /**
   * index
   *
   */
  public function index()
  {
    $session = \App::getInstance('session');
    $session->del('donmm_is_login');
    $session->del('donmm_login_info');

    $msg = 'alert(\'로그아웃 되었습니다.\');parent.location.href=\'./login.php\';';

    $this->js($msg);
    exit;
  }
}
