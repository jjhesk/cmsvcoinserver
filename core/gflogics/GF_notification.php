<?php

/**
 * Created by HKM Corporation.
 * User: hesk
 * Date: 4/15/14
 * Time: 12:30 AM
 */
defined('ABSPATH') || exit;
if (!class_exists('GF_notification')) {
    class GF_notification extends gformBase
    {
        public function __construct() {

            add_filter("gform_notification_" . GF_FORM_USER_REG,
                array(__CLASS__, "notification_user_registration"), 10, 3);

        }

        private static function watch_final_result($entry, $field_name)
        {
            return $entry[parent::convert_field_name_to_id($field_name)] == "success";
        }

        private static function apply_filer_mustache(&$field_message, $context)
        {
            $m = new Mustache_Engine;
            $new_content = $m->render($field_message, $context);
            $field_message = $new_content;
        }

        public static function notification_user_registration($notification, $form, $entry)
        {
            /*if (!self::watch_final_result($entry, c_final_transaction_result)) {
                $notification["to"] = "";
                $msg = "User email aborted: because the transaction result is failure.";
                $msg .= "<br>email template: " . $notification["name"];
                inno_log_db::log_email_activity($msg, 19351);
                return $notification;
            }*/

            //activation_endpoint

            /*$json = json_decode($entry[self::convert_field_name_to_id(c_json_field)]);
            $coupon_id = $json->cid;
            $user_id = $json->uid;
            $code = $entry[self::convert_field_name_to_id(c_redemption_code_field)];
            $prep = parent::find_coupon_record($user_id, $coupon_id, $code);
            $vendor = new inno_db_vendor($coupon_id);*/

            //User Notification

            if (strtolower($notification["name"]) == "user send verification notification") {
                $email = $entry[gf_field_email];
                $token = $entry[gf_field_email_token];

                //$text = "Please click here to verify your user account.";
                $url = DOMAIN_API."email/verify/?email=".$email."&hash=".$token."&rgi=".$entry["id"];

                /*$endpoint = "<a href=\"".$url."\">";
                $endpoint.= apply_filters("email_activation_label", $text);
                $endpoint.= "</a>";*/

                $context = array(
                    //"activation_endpoint" => $endpoint,
                    //"coupon_name" => get_the_title($coupon_id),
                    "url" => $url,
                );
                /*inno_log_db::log_vcoin_email(-1,"testing_email", "");
                inno_log_db::log_vcoin_error(-1,"testing_vcoin", "");
                inno_log_db::log_vcoin_new_account(-1,"testing_new_account", "");
                inno_log_db::log_vcoin_redemption_verification(-1,"testing_redemption_verification", "");
                inno_log_db::log_vcoin_redemption_verify(-1,"testing_redemption_verify", "");
                inno_log_db::log_vcoin_third_party_app_transaction(-1,"testing_third_party_app_transaction", "");*/

                self::apply_filer_mustache($notification["message"], $context);
            }




            //Vendor Notification
            //if (strtolower($notification["name"]) == "vendor notification") {
               // $context = array(
                    //  "exp" => $prep->exp_date,
                    //"vendor_name" => $vendor->getName(),
                    //"trans_id" => $prep->ID,
                    //"user_email" => api_account::getEmail_by_id($user_id),
                    //"coupon_name" => get_the_title($coupon_id)
                //);
                /*  $m = new Mustache_Engine;
                  $new_content = $m->render($notification["message"], $context);
                  $notification["message"] = $new_content;*/
                //self::apply_filer_mustache($notification["message"], $context);
                //$notification["to"] = $vendor->get_email();
                //$notification['toType'] = "email";
            //}

            return $notification;
        }

            }
}