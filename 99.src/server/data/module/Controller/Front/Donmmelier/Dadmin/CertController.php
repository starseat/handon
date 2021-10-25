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

use Component\Member\Member;
use Component\Member\MyPage;
use Component\Donmmelier\Test;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * 한돈 소믈리에 관리자 자격증 관리
 * @author jw.lee
 */
class CertController extends \Controller\Front\Controller
{

  /**
   * index
   *
   */
  public function index()
  {
    $session = \App::getInstance('session');
    if (!$session->has('donmm_is_login') || $session->get('donmm_is_login') == 0) {
      $msg = 'alert(\'로그인이 필요합니다.\');parent.location.href=\'./login.php\';';
      $this->js($msg);
      exit;
    }
  }
}
