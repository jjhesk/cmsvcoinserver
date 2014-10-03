<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年7月31日
 * Time: 上午11:47
 */
defined('ABSPATH') || exit;

include_once(ABSPATH . 'wp-admin/includes/plugin.php');
if (!class_exists('gfUserRegistration')) {
    class gfUserRegistration extends gformBase
    {

        public function __construct()
        {

            add_action('gform_pre_submission_' . GF_FORM_USER_REG, array(__CLASS__, 'userRegistrationInit'), 10, 1);
            //add_filter('gform_pre_submission_filter_'.GF_FORM_USER_REG, array(__CLASS__, "userRegistrationInit"), 10, 1);

        }

        public static function isEmailVerified($confirmation_token, $entry_id)
        {
            $token = self::gf_get_entry_value(GF_FORM_USER_REG, $entry_id, gf_user_registration_token);
            return $token == $confirmation_token;
        }

        public static function userRegistrationInit($form)
        {

            /*
            $gf_field_email_token = parent::getPostVal(gf_field_email_token);
            $gf_field_password = parent::getPostVal(gf_field_password);
            $gf_field_email = parent::getPostVal(gf_field_email);
            $gf_field_login_name = parent::getPostVal(gf_field_login_name);
            $gf_field_company = parent::getPostVal(gf_field_company);*/

            //parent::filter_form_value($form, gf_field_email_token, parent::gen_order_num());
            parent::set_input_value(gf_field_email_token, parent::gen_order_num());
        }
    }
}