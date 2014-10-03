<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 13年12月9日
 * Time: 下午12:36
 */
class hkm_mobile_detection
{
    private $is_mobile = false;
    private $agent = "";
    private $canTouch = false;
    private $mobile_types = array(
        'Mobile', 'Android', 'BlackBerry', 'iPhone', 'Windows Phone',
        "iPhone", // Apple iPhone
        "iPod", // Apple iPod touch
        "Android", // 1.5+ Android
        "dream", // Pre 1.5 Android
        "CUPCAKE", // 1.5+ Android
        "blackberry9500", // Storm
        "blackberry9530", // Storm
        "blackberry9520", // Storm v2
        "blackberry9550", // Storm v2
        "blackberry9800", // Torch
        "webOS", // Palm Pre Experimental
        "incognito", // Other iPhone browser
        "webmate", // Other iPhone browser
        "s8000", // Samsung Dolphin browser
        "bada" // Samsung Dolphin browser
    );

    public function detect()
    {

        /**
         * Better browser detection
         * with language_attributes() filter in WordPress
         * http://simplemediacode.info/?p=1006
         */

        if (!empty($_SERVER['HTTP_USER_AGENT'])) {

            add_filter('language_attributes', array('hkm_mobile_detection', 'smc_language_attributes'));
            remove_action('wp_head', 'wp_generator');

            $this->agent = $_SERVER['HTTP_USER_AGENT'];
            if (preg_match("/Mobile|Android|BlackBerry|iPhone|Windows Phone/", $this->agent) ||
                strstr($this->agent, 'iPhone') || strstr($this->agent, 'Android') || $this->bnc_wptouch_get_user_agents()
            ) {
                $this->is_mobile = true;
            } else {
                $this->is_mobile = false;
            }
            $this->canTouch = $this->bnc_wptouch_get_user_agents();
        }
    }

    public function setMobile($conf)
    {
        $this->is_mobile = $conf;
    }

    /**
     * @return bool
     */
    public function isMobile()
    {
        return $this->is_mobile;
    }

    /**
     * @return array
     */
    private function bnc_wptouch_get_user_agents()
    {

        foreach ($this->mobile_types as $device) {
            if (strstr($this->agent, $device)) {
                return true;
            }
        }
        return false;
    }

    public function smc_language_attributes($content)
    {
        global $is_IE;
        $browser = $_SERVER['HTTP_USER_AGENT'];
        $iev = '';
        if (isset($browser)) {
            if ((strpos($browser, 'MSIE') !== false)) {
                preg_match('/MSIE (.*?);/', $browser, $matches);
                if (count($matches) > 1) {
                    $iev = $matches[1];
                }
            }
            //Detect special conditions devices
            $iPod = stripos($browser, "iPod");
            $iPhone = stripos($browser, "iPhone");
            $iPad = stripos($browser, "iPad");
            if (stripos($browser, "Android") && stripos($browser, "mobile")) {
                $Android = true;
            } else if (stripos($browser, "Android")) {
                $Android = false;
                $AndroidTablet = true;
            } else {
                $Android = false;
                $AndroidTablet = false;
            }
            $webOS = stripos($browser, "webOS");
            $BlackBerry = stripos($browser, "BlackBerry");
            $RimTablet = stripos($browser, "RIM Tablet");
        }
        if ($is_IE) {
            return $content . ' id="ie' . $iev . '" class="ie" ';
        } else {

            if ($iPod) {
                $and = "ipod";
            } else if ($iPhone) {
                $and = "iphone";
            } else if ($iPad) {
                $and = "ipad";
            } else if ($Android) {
                $and = "android";
            } else if ($AndroidTablet) {
                $and = "androidtable";
            } else if ($webOS) {
                $and = "webos";
            } else if ($BlackBerry) {
                $and = "blackberry";
            } else if ($RimTablet) {
                $and = "rimtable";
            }
            if (isset($and)) {
                return $content . " class=\"" . $and . "\" ";
            } else {
                return $content;
            }
        }
    }
}
