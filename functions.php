<?php


//this will be used in the curl peer server request
define("CERT_PATH", "/etc/pki/tls/cert.pem");
define("HKM_LANGUAGE_PACK", "hkm_app_vcoin");
define("HKM_LIBJS", get_stylesheet_directory_uri() . "/js/");
define("LIBJS_ADMIN_MODEL", get_stylesheet_directory_uri() . "/js/adminmodel/");
define("LIBJS_ADMIN", get_stylesheet_directory_uri() . "/js/admin/");
define("HKM_LIBCSS", get_stylesheet_directory_uri() . "/css/");
define("HKM_LIBFONTS", get_stylesheet_directory_uri() . "/fonts/");
define("HKM_IMG_PATH", get_stylesheet_directory_uri() . "/images/");
define("HKM_ART_PATH", get_stylesheet_directory_uri() . "/hkm/art/");
define('VCOIN_IMAGES_PATH', get_stylesheet_directory_uri() . '/images/');
define("EXTENSIONS_PATH", get_stylesheet_directory() . DIRECTORY_SEPARATOR . 'thirdparty' . DIRECTORY_SEPARATOR);
define("CORE_PATH", get_stylesheet_directory() . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR);
define("JSONAPI_PATH", CORE_PATH . "api/");

require_once EXTENSIONS_PATH . 'Mustache/Autoloader.php';
/*
require_once(EXTENSIONS_PATH . 'facebook/sdk/facebook.php');
require_once(EXTENSIONS_PATH . 'h2o/h2o.php');
//require_once(EXTENSIONS_PATH . 'jsonapi/innojson.php');
/*require_once(EXTENSIONS_PATH . 'metabox/init_metabox.php');
require_once(EXTENSIONS_PATH . 'sendgrid-google-php/SendGrid_loader.php');
require_once(EXTENSIONS_PATH . 'front_end_scripts.php');
require_once(EXTENSIONS_PATH . 'helpers.php');
require_once(EXTENSIONS_PATH . 'plugins-compat.php');
require_once(EXTENSIONS_PATH . 'video-functions.php');
require_once(EXTENSIONS_PATH . 'dp-render-query.php');
require_once(EXTENSIONS_PATH . 'dp-post-likes.php');
require_once(EXTENSIONS_PATH . 'dp-jplayer.php');
*/
define("INN_VIEW_VIDEO_ACTION", 1001);
define("INN_VIEW_OFFICIAL_VIDEO_ACTION", 1010);
define("INN_INVITE_FRIEND_ACTION", 1020);
define("INN_CAMERA_ROLL_ACTION", 1030);
define("INN_MISSION_RYAN_ACTION", 2000);
define("INN_MISSION_ADD_ACTION", 2001);
define("INN_MISSION_REMOVE_ACTION", 2002);

/**
 * DEFINED THE POST TYPE HERE
 */
define("HKM_ACTION", "act");
//define("INNGIFTS", "innocator_products");
//define("HKM_COUPON", "icoupon");
//define("HKM_EVENT", "hkmevent");
//settings
//define("VENDOR", "innoactor_loc");
//define("HKM_BLOG", "blog");
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
    foreach (glob(get_stylesheet_directory() . "/" . $folder . "/*.php") as $filename) {
        //  echo $filename . "\n";
        require_once $filename;
    }
}

/*define("GF_FORM_USER_REG", 1);
define("gf_user_registration_token", 6);
define("gf_field_email_token", 6);
define("gf_field_email", 3);
define("gf_field_login_name", 2);
define("gf_field_company", 1);
define("gf_field_password", 4);*/
//in response from autoloading Mustache module.
Mustache_Autoloader::register();
global $system_script_manager;
function child_create_objects()
{
    global $system_script_manager;
    install_db::install_db_manually();
    TitanPanelSetup::setup();
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
    $m11 = new application_user_profile();
    $m1 = $m2 = $m3 = $m4 = $m5 = $m6 = $m7 = $m8 = $m9 = $m11 = $m10 = $system_script_manager = NULL;


    CouponOperation::install_cron();
    gc_collect_cycles();
}

/*function email_activation_custom_label($label) {
    return "激活你的帳號";
}*/

add_action('wp_loaded', 'child_create_objects', 11);

?>