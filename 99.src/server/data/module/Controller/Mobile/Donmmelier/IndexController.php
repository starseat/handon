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
namespace Controller\Mobile\Donmmelier;

use Component\Member\Member;
use Component\Member\MyPage;
use Component\Donmmelier\DonSVC;
use Component\Donmmelier\Test;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * 한돈 소믈리에 자격 페이지 (메인, 이벤트)
 *  - 로그인 X
 * @author jw.lee
 */
class IndexController extends \Controller\Mobile\Controller
{

  /**
   * index
   *
   */
  public function index()
  {
    $isLogin = 0;
    $isRegistered = 0;
    $regi_name = '';
    $regi_phone = '';
    $session = \App::getInstance('session');
    $donSvc = \App::load('\\Component\\Donmmelier\\DonSVC');
    if ($session->has(Member::SESSION_MEMBER_LOGIN)) {
      $isLogin = 1;

      $myPage = new MyPage();
      $memberData = $myPage->myInformation();
      $memId = $memberData['memId'];

      $isRegistered = $donSvc->getCountDonmmRegisteredFromId($memId);
      if($isRegistered > 0) {
        $isRegistered = 1;

        $regi_info = $donSvc->getDonmmRegisteredInfoFromId($memId);
        $regi_name = $regi_info['name'];
        $regi_phone = $regi_info['phone'];
      }      
    }    

    $this->setData('is_login', $isLogin);
    $this->setData('is_registered', $isRegistered);
    $this->setData('regi_name', $regi_name);
    $this->setData('regi_phone', $regi_phone);
    $this->setData('login_url', $donSvc->getLoginUrl('m'));
  }
}
