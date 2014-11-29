<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年11月10日
 * Time: 上午11:39
 */
class TitanPanelSetup
{
    private $titan;

    public function  __construct($instance_name)
    {
        $this->titan = TitanFramework::getInstance($instance_name);
    }

    public function __destruct()
    {
        $this->titan = NULL;
    }

    public function load_settings()
    {
        define("DOMAIN_API", site_url() . "/api/");
        $vcoin_gateway = $this->titan->getOption("vcoin_service");
        if (isset($vcoin_gateway) && $vcoin_gateway != "") {
            define("VCOIN_SERVER", $vcoin_gateway);
        } else define("VCOIN_SERVER", "https://54.186.64.145:8057");
        $cms_service = $this->titan->getOption("cms_service");
        if (isset($cms_service) && $cms_service != "") {
            define("CMS_SERVER", $cms_service);
        } else define("CMS_SERVER", "http://devcms.vcoinapp.com");
        $login_service = $this->titan->getOption("login_service");
        if (isset($login_service) && $login_service != "") {
            define("AUTH_SERVER", $login_service);
        } else define("AUTH_SERVER", "http://devlogin.vcoinapp.com");
        $push_service = $this->titan->getOption("push_service");
        if (isset($push_service) && $push_service != "") {
            define("PUSH_SERVER", $push_service);
        } else define("PUSH_SERVER", "http://54.68.77.115");
        $imusic_uuid = $this->titan->getOption("imusic_uuid");
        if (isset($imusic_uuid) && $imusic_uuid != "") {
            define("IMUSIC_UUID", $imusic_uuid);
        } else define("IMUSIC_UUID", "13EFFA66-052D-E411-8F85-3085A9B355FC");
        $app_key = $this->titan->getOption("imusic_ak");
        if (isset($app_key) && $app_key != "") {
            define("APPKEY_VCOINAPP", $app_key);
        } else define("APPKEY_VCOINAPP", "yoqzLezk");
        $app_secret = $this->titan->getOption("imusic_as");
        if (isset($app_secret) && $app_secret != "") {
            define("APPSECRET_VCOINAPP", $app_secret);
        } else define("APPSECRET_VCOINAPP", "oW7C5ADpUiMr9ouz");
        //  $vcoin_gateway = $cms = $push = $uuid = $app_key = $app_secret = NULL;
    }

    public static function setup()
    {
        // if (self::$instance == NULL)
        $instance = new self("vcoinset");
        // $instance->create_panel();
        $instance->load_settings();
        $instance = NULL;
    }


}