<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年10月3日
 * Time: 下午12:36
 */


/**
 * This script is not used within Titan Framework itself.
 *
 * This script is meant to be used with your Titan Framework-dependent theme or plugin,
 * so that your theme/plugin can verify whether the framework is installed.
 *
 * If Titan is not installed, then the script will display a notice with a link to
 * Titan.
 *
 * To use this script, just copy it into your theme/plugin directory and do a
 * require_once( 'titan-framework-checker.php' );
 */
if (!class_exists('TitanFramework')) {
    if (!class_exists('TitanFrameworkThemeChecker')) {
        class TitanFrameworkThemeChecker
        {
            function __construct()
            {
                if (!is_admin()) {
                    add_action('init', array($this, 'displaySiteNotification'));
                } else {
                    add_filter('admin_notices', array($this, 'displayAdminNotification'));
                }
            }

            public function displaySiteNotification()
            {
                die(__("This theme requires the plugin Titan Framework. Please install it in the admin first before continuing.", "default"));
            }

            public function displayAdminNotification()
            {
                echo "<div class='error'><p><strong>"
                    . __("This theme requires the Titan Framework plugin.", "default")
                    . sprintf(" <a href='%s'>%s</a>",
                        admin_url("plugin-install.php?tab=search&type=term&s=titan+framework"),
                        __("Click here to search for the plugin.", "default"))
                    . "</strong></p></div>";
            }
        }

        new TitanFrameworkThemeChecker();
    }
    return;
} else {

    /*
     * Create our admin page
     */

    $titan = TitanFramework::getInstance('vcoinset');
    $adminPanel = $titan->createAdminPanel(array(
        'name' => __('V-COIN', HKM_LANGUAGE_PACK),
        'icon' => 'dashicons-chart-area'
    ));


    /*
     * Create our normal options tab
     */


    $tab = $adminPanel->createTab(array(
        'name' => __('System Mode', HKM_LANGUAGE_PACK),
    ));


    $tab->createOption(array(
        'name' => 'Debug Reward Configuration',
        'id' => 'debug_reward_cfg',
        'type' => 'checkbox',
        'desc' => 'Check to Turn ON the Debug Mode',
        'default' => false,
    ));

    $tab->createOption(array(
        'name' => 'Debug Slider Configuration',
        'id' => 'debug_slider_cfg',
        'type' => 'checkbox',
        'desc' => 'Check to Turn ON the Debug Mode',
        'default' => false,
    ));

    $tab->createOption(array(
        'name' => 'Debug on Redemption Rewards',
        'id' => 'debug_redemption_reward',
        'type' => 'checkbox',
        'desc' => 'Check to Turn ON the Debug Mode',
        'default' => false,
    ));

    $tab->createOption(array(
        'type' => 'save'
    ));

    $tab = $adminPanel->createTab(array(
        'name' => 'Server EndPoint',
    ));
    $tab->createOption(array(
        'name' => 'vCoin Server Gateway',
        'type' => 'text',
        'id' => 'vcoin_service',
        'desc' => 'The API vcoin service domain'
    ));
    $tab->createOption(array(
        'name' => 'Login Server Gateway',
        'type' => 'text',
        'id' => 'login_service',
        'desc' => 'The API cms service domain'
    ));
    $tab->createOption(array(
        'name' => 'Push Server Gateway',
        'type' => 'text',
        'id' => 'push_service',
        'desc' => 'The API push service domain'
    ));

    $tab->createOption(array(
        'name' => 'CERT_PATH certification path for SSL',
        'type' => 'text',
        'id' => 'cert_path',
        'desc' => 'CERT_PATH'
    ));

    $tab->createOption(array(
        'name' => 'IMUSIC_UUID set uuid',
        'type' => 'text',
        'id' => 'imusic_uuid',
        'desc' => 'imusic uuid tutorial'
    ));

    $tab->createOption(array(
        'type' => 'save'
    ));


    $tab = $adminPanel->createTab(array(
        'name' => __('All items cate', HKM_LANGUAGE_PACK),
    ));
    $tab->createOption(array(
        'name' => 'Categories for All',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'All Cate English Label',
        'type' => 'text',
        'id' => 'all_cat_en',
    ));
    $tab->createOption(array(
        'name' => 'All Cate Japanese Label',
        'type' => 'text',
        'id' => 'all_cat_ja',
    ));
    $tab->createOption(array(
        'name' => 'All Cate Chinese Label',
        'type' => 'text',
        'id' => 'all_cat_zh',
    ));

    $tab->createOption(array(
        'name' => 'Unpressed Logo',
        'id' => 'all_cat_unpressed',
        'type' => 'upload',
        'desc' => 'Upload your image for the logo for unpressed'
    ));
    $tab->createOption(array(
        'name' => 'Pressed Logo',
        'id' => 'all_cat_pressed',
        'type' => 'upload',
        'desc' => 'Upload your image for the logo for pressed'
    ));

    $tab->createOption(array(
        'name' => 'Small Unpressed Logo',
        'id' => 'all_smcat_unpressed',
        'type' => 'upload',
        'desc' => 'Upload your image for the logo for unpressed'
    ));
    $tab->createOption(array(
        'name' => 'Small Pressed Logo',
        'id' => 'all_smcat_pressed',
        'type' => 'upload',
        'desc' => 'Upload your image for the logo for pressed'
    ));
    $tab->createOption(array(
        'name' => 'All Language Description',
        'type' => 'text',
        'id' => 'all_cat_desc',
    ));


    $tab->createOption(array(
        'name' => 'Countries for All',
        'type' => 'heading',
    ));

    $tab->createOption(array(
        'name' => 'All Country English Label',
        'type' => 'text',
        'id' => 'all_country_en',
    ));
    $tab->createOption(array(
        'name' => 'All Country Japanese Label',
        'type' => 'text',
        'id' => 'all_country_ja',
    ));
    $tab->createOption(array(
        'name' => 'All Country Chinese Label',
        'type' => 'text',
        'id' => 'all_country_zh',
    ));
    $tab->createOption(array(
        'name' => 'Unpressed Logo',
        'id' => 'all_country_unpressed',
        'type' => 'upload',
        'desc' => 'Upload your image for the logo for unpressed'
    ));
    $tab->createOption(array(
        'name' => 'Pressed Logo',
        'id' => 'all_country_pressed',
        'type' => 'upload',
        'desc' => 'Upload your image for the logo for pressed'
    ));
    $tab->createOption(array(
        'name' => 'Small Unpressed Logo',
        'id' => 'all_smcountry_unpressed',
        'type' => 'upload',
        'desc' => 'Upload your image for the logo for unpressed'
    ));
    $tab->createOption(array(
        'name' => 'Small Pressed Logo',
        'id' => 'all_smcountry_pressed',
        'type' => 'upload',
        'desc' => 'Upload your image for the logo for pressed'
    ));
    $tab->createOption(array(
        'name' => 'All Language Description',
        'type' => 'text',
        'id' => 'all_country_desc',
    ));
    $tab->createOption(array(
        'type' => 'save'
    ));

    $tab = $adminPanel->createTab(array(
        'name' => 'Text Templates',
    ));


    $tab->createOption(array(
        'name' => 'Reward Procedure Centralized',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'template in zh',
        'id' => 'rcprocedure_zh',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly. {{user}}, {{amount}}, {{qr_a}}, {{qr_b}}, {{trace_id}}, {{handle}}, {{username}}',
    ));
    $tab->createOption(array(
        'name' => 'template en',
        'id' => 'rcprocedure_en',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{user}}, {{amount}}, {{qr_a}}, {{qr_b}}, {{trace_id}}, {{handle}}, {{username}}',
    ));
    $tab->createOption(array(
        'name' => 'template ja',
        'id' => 'rcprocedure_ja',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{user}}, {{amount}}, {{qr_a}}, {{qr_b}}, {{trace_id}}, {{handle}}, {{username}}',
    ));

    $tab->createOption(array(
        'name' => 'Reward Procedure Decentralized',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'template in zh',
        'id' => 'rdprocedure_zh',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly. {{user}}, {{amount}}, {{qr_a}}, {{qr_b}}, {{trace_id}}, {{handle}}, {{username}}',
    ));
    $tab->createOption(array(
        'name' => 'template en',
        'id' => 'rdprocedure_en',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{user}}, {{amount}}, {{qr_a}}, {{qr_b}}, {{trace_id}}, {{handle}}, {{username}}',
    ));
    $tab->createOption(array(
        'name' => 'template ja',
        'id' => 'rdprocedure_ja',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{user}}, {{amount}}, {{qr_a}}, {{qr_b}}, {{trace_id}}, {{handle}}, {{username}}',
    ));


    $tab->createOption(array(
        'name' => 'Reward success confirmation',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'template in zh',
        'id' => 'rsuccess_zh',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template en',
        'id' => 'rsuccess_en',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template ja',
        'id' => 'rsuccess_ja',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));


    $tab->createOption(array(
        'name' => 'Default Reward T&C',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'template in zh',
        'id' => 'rtnc_zh',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly. {{additional}} - T&C text block of the individual reward in terms and conditions',
    ));
    $tab->createOption(array(
        'name' => 'template en',
        'id' => 'rtnc_en',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly. {{additional}} - T&C text block of the individual reward in terms and conditions',
    ));
    $tab->createOption(array(
        'name' => 'template ja',
        'id' => 'rtnc_ja',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly. {{additional}} - T&C text block of the individual reward in terms and conditions',
    ));

    $tab->createOption(array(
        'name' => 'Deduct vcoin confirmation',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'template in zh',
        'id' => 'rconfirmation_zh',
        'type' => 'text',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template en',
        'id' => 'rconfirmation_en',
        'type' => 'text',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template ja',
        'id' => 'rconfirmation_ja',
        'type' => 'text',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));

    $tab->createOption(array(
        'name' => 'Process vcoin dialog',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'template in zh',
        'id' => 'rprocessvcoin_zh',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template en',
        'id' => 'rprocessvcoin_en',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template ja',
        'id' => 'rprocessvcoin_ja',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));

    $tab->createOption(array(
        'name' => 'Default Coupon T&C',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'template in zh',
        'id' => 'ctnc_zh',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template en',
        'id' => 'ctnc_en',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template ja',
        'id' => 'ctnc_ja',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));


    $tab->createOption(array(
        'name' => 'Success Coupon Redemption Message',
        'type' => 'heading',
    ));
    $tab->createOption(array(
        'name' => 'template in zh',
        'id' => 'csuccess_zh',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template en',
        'id' => 'csuccess_en',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));
    $tab->createOption(array(
        'name' => 'template ja',
        'id' => 'csuccess_ja',
        'type' => 'textarea',
        'desc' => 'Please use the template accordingly.  {{amount}}',
    ));


    $tab->createOption(array(
        'type' => 'save'
    ));

    /*******************************************************
     * TITAN FRAMEWORK CODE END
     *******************************************************/

}

