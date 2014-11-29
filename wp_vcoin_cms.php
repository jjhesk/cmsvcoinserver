<?php
/*
  Plugin Name: VCOIN CMS SERVER 2014
  Plugin URI: https://github.com/jjhesk/cmsvcoinserver
  Description: In order to run this module the server will need to activate the mentioned modules as list below: Titan Framework, WordPress Importer, Meta Box, JSON API, JSON API Auth, Email Login, Gravity Forms
  Version: 1.01
  Author: Heskeyo Kam, Ryo
  Author URI:
  License: GPLv3
 */


define('CMS_SERVER_URI', plugins_url("wp_vcoin_cms"));
define('CMS_SERVER_PATH', dirname(__FILE__));
define("EXTENSIONS_PATH", CMS_SERVER_PATH . DIRECTORY_SEPARATOR . 'thirdparty' . DIRECTORY_SEPARATOR);
define("CORE_PATH", CMS_SERVER_PATH . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR);
define("JSONAPI_PATH", CORE_PATH . "api/");
define("HKM_LIBJS", CMS_SERVER_URI . "/js/");
define("LIBJS_ADMIN_MODEL", CMS_SERVER_URI . "/js/adminmodel/");
define("LIBJS_ADMIN", CMS_SERVER_URI . "/js/admin/");
define("HKM_LIBCSS", CMS_SERVER_URI . "/css/");
define("HKM_LIBFONTS", CMS_SERVER_URI . "/fonts/");
define("HKM_IMG_PATH", CMS_SERVER_URI . "/images/");
define("HKM_ART_PATH", CMS_SERVER_URI . "/hkm/art/");
define('VCOIN_IMAGES_PATH', CMS_SERVER_URI . '/images/');
define("HKM_LANGUAGE_PACK", "hkm_app_vcoin");

require_once EXTENSIONS_PATH . 'Mustache/Autoloader.php';
/**
 * DEFINED THE POST TYPE HERE
 */
define("HKM_ACTION", "act");
//settings
define("VPRODUCT", "pdt");
define("VCOUPON", "cpn");
define("VSLIDER", "slider");
define("VENDOR", "ven");
define("APPDISPLAY", "aph");
define("LOC_STOCK_COUNT_MAX", 10);
/**
 * load all the modules
 */
$destinations = array('core', 'core/reuseable', 'core/shortcodes', 'core/logics', 'core/gflogics', 'core/appdata', 'core/api', 'core/cms');
foreach ($destinations as $folder) {
    foreach (glob(CMS_SERVER_PATH . "/" . $folder . "/*.php") as $filename) {
        //  echo $filename . "\n";
        require_once $filename;
    }
}
unset($destinations);
//in response from autoloading Mustache module.
Mustache_Autoloader::register();
global $system_script_manager;
function child_create_objects()
{
    global $system_script_manager;
    $system_script_manager = new system_frontend();
    $m1 = new taxonomy_develop();
    $m2 = new connect_json_api();
    $m3 = new tokenBase();
    $m4 = new system_log_display();
    $m5 = new vcoin_product();
    $m6 = new vendor_cms();
    $m7 = new vcoin_coupon();
    $m8 = new app_host();
    $m9 = new vslider();
    $m10 = new dashboard();
    $m1 = $m2 = $m3 = $m4 = $m5 = $m6 = $m7 = $m8 = $m9 = $m10 = $system_script_manager = NULL;

    install_db::registration_plugin_hooks(__FILE__);
    CouponOperation::registration_plugin_hooks(__FILE__);
    gc_collect_cycles();
}

/*function email_activation_custom_label($label) {
    return "激活你的帳號";
}*/

add_action('wp_loaded', 'child_create_objects', 11);

?>