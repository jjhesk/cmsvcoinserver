<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月6日
 * Time: 下午4:41
 */
if (!class_exists('tokenBase')):
    class tokenBase
    {
        public function __construct()
        {
            //gen_new_auth_token
            add_filter("gen_new_auth_token", array(__CLASS__, "newtoken"), 10, 1);
            add_filter("api_token_authen", array(__CLASS__, "authen"), 10, 1);
            add_filter("token_auth_api_check", array(__CLASS__, "checktoken"), 10, 1);

        }

        public static function checktoken($token_input)
        {
            global $wpdb;
            $table = $wpdb->prefix . "app_login_token_banks";
            $verbose = $wpdb->prepare("SELECT * FROM $table WHERE token=%s", $token_input);
            $result_r = $wpdb->get_row($verbose);
            if (!$result_r) {
                return -1;
            } else {
                return $result_r->user;
            }
        }

        public static function authen($token)
        {
            global $wpdb;
            $table = $wpdb->prefix . "app_login_token_banks";
            $verbose = $wpdb->prepare("SELECT * FROM $table WHERE token=%s", $token);
            //  $wpdb->select();
            $result_r = $wpdb->get_row($verbose);
            if (!$result_r) throw new Exception("Invalid authentication token. Use the `generate_auth_cookie` Auth API method.", 1001);
            $exp = $result_r->exp;
            if ($exp > time()) throw new Exception("Invalid, expired token.", 1002);
            // $verbose_2 = $wpdb->prepare("SELECT * FROM $table WHERE token=%s", $token);
            return $result_r->user;
        }

        private static function sha1_64bitInt($str)
        {
            $u = unpack('N2', sha1($str, true));
            return ($u[1] << 32) | $u[2];
        }

        private static function token_model_2($str)
        {
            return hash_hmac('ripemd160', $str, LOGGED_IN_SALT);
        }

        public static function newtoken($output)
        {
            global $wpdb;
            $user_ID = $output['user']['id'];
            $expiration = $output['exp'];

            $table = $wpdb->prefix . "app_login_token_banks";
            // $verbose = $wpdb->prepare("SELECT * FROM $table WHERE id=%d AND token=%s", $user_ID, $token);
            //  $result = $wpdb->get_row($verbose);
            $newtoken = self::token_model_2($expiration . '.');
            $insert = array(
                "token" => $newtoken,
                "exp" => $expiration,
                "user" => $user_ID
            );
            // if (!$result) {
            $rs = $wpdb->insert($table, $insert);

            $output['token'] = $newtoken;
            return $output;
            // } else {
            //    unset($insert['user']);
            //     $rs = $wpdb->update($table, $insert, array('user' => $user_ID));
            // }

        }
    }
endif;