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

use App;
use Globals;
use Request;
use Session;
use Component\Member\MyPage;
use Component\Member\Member;
use Component\Member\Util\MemberUtil;
use Component\Donmmelier\Test;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * 한돈 소믈리에 마이 페이지
 *  - 로그인 필요
 * @author jw.lee
 */
class MypageController extends \Controller\Front\Controller
{

    /**
     * index
     *
     */
    public function index()
    {
      $session = \App::getInstance('session');
      if (!$session->has(Member::SESSION_MEMBER_LOGIN)) {
      
        $returnUrl = 'https://mall.han-don.com/donmmelier/index.php';
        $msg = 'alert(\'로그인이 필요합니다.\');parent.location.href=\'' . $returnUrl . '\';';
        $this->js($msg);
        exit;
      }
      
      /* 회원 로그인 정보 */
      $myPage = new MyPage();
      $memberData = $myPage->myInformation();
      $memNm = $memberData['memNm'];

      $this->setData('member', json_encode($memberData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
      $this->setData('member_name', $memNm);
    }
}
