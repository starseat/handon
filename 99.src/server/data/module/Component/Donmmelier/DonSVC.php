<?php

namespace Component\Donmmelier;

use App;
use Component\Database\DBTableField;
use Framework\Database\DBTool;
use Framework\Object\SingletonTrait;
use Framework\Utility\DateTimeUtils;
use Framework\Utility\StringUtils;

class DonSVC 
{
    public function getLoginUrl() {
        // 통합 로그인 전
        $returnUrl = 'https://www.han-don.com/member/index.php?mode=login&tabst=donmmelier';

        // 통합 로그인 후
        // $donmmelierUrl = 'https://mall.han-don.com/donmmelier/index.php';
        // $returnUrl = 'https://mall.han-don.com/member/hdlogin.php?returnUrl=' . $donmmelierUrl;

        return $returnUrl;
    }
}
