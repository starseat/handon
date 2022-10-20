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
namespace Controller\Front\Event;

use Component\Member\MyPage;
use Component\Donmmelier\Test;
use Framework\Debug\Exception\AlertBackException;
use Framework\Debug\Exception\RedirectLoginException;

/**
 * 이벤트 페이지 - 2021 한돈데이 랜선 페스티벌
 * @author Kwon
 */
class TestController extends \Controller\Front\Controller
{

    /**
     * index
     *
     */
    public function index()
    {
      /* 회원 로그인 정보 */
      $myPage = new MyPage();
      $memberData = $myPage->myInformation();

      $share = new Test();
      $total = $share->getCommentTotal();

      $this->setData('commentList', $commentList);
      $this->setData('getCommentTotal', $getCommentTotal);
    }
}
