<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年2月17日
 * Time: 上午11:56
 */
if (!class_exists('inno_log_db')):
    class inno_log_db
    {
        /**
         * For all the event in 200
         * @param $claim
         * @param $hash
         * @param $ID
         * @return bool
         */
        public static function action_log_claim_reward($claim, $hash, $ID)
        {
            //imusicworld_reward_mgm_log
            $current_user = wp_get_current_user();
            $msg = $current_user->display_name . " changes redemption status to " . $claim . ". <br>Transaction id: " . $ID . ".<br>Hash ID = " . $hash;
            self::db_access($current_user->ID, $msg, 200, 0);
            return true;
        }

/**
*  For Redemption errors, log info to db
*  inno_log_db::log_vcoin_login($user_id, $hash_code_event_error, $msg = "")
*/
/*
* --------------------------------------------------------------------------------------------------------------------------
*/
        public static function log_admin_stock_management($user_id, $hash_code_event_error, $msg = "")
        {
            self::db_access($user_id, $msg, 920, $hash_code_event_error);
            return true;
        }

        public static function log_admin_coupon_management($user_id, $hash_code_event_error, $msg = "")
        {
            self::db_access($user_id, $msg, 921, $hash_code_event_error);
            return true;
        }

        public static function log_stock_count($user_id, $hash_code_event_error, $msg = "")
        {
            self::db_access($user_id, $msg, 922, $hash_code_event_error);
            return true;
        }

        public static function log_admin_vendor_management($user_id, $hash_code_event_error, $msg = "")
        {
            self::db_access($user_id, $msg, 923, $hash_code_event_error);
            return true;
        }

        public static function log_developer_app_management($user_id, $hash_code_event_error, $msg = "")
        {
            self::db_access($user_id, $msg, 924, $hash_code_event_error);
            return true;
        }

        public static function log_redemption($user_id, $hash_code_event_error, $msg = "")
        {
            self::db_access($user_id, $msg, 925, $hash_code_event_error);
            return true;
        }

/*
* --------------------------------------------------------------------------------------------------------------------------
*/

        public static function log_login_china_server_info($user_id, $hash_code_event_error, $message, $token)
        {
            $msg = !isset($token) ? " (No Token was submitted)" : " token = " . $token;
            self::db_access($user_id, $message . $msg, 500, $hash_code_event_error);
            return true;
        }

        public static function log_critical($line_code, $message)
        {
            self::db_access_extend(-1, $message, 404, $line_code);
            return true;
        }

        /**
         * @param $user_id
         * @param $hash_code_event_error
         * @param $message
         * @return bool
         */
        public static function log_redemption_error($user_id = -1, $hash_code_event_error = 0, $message = "")
        {
            self::db_access($user_id, $message, 509, intval($hash_code_event_error));
            return true;
        }

        public static function log_coupons($user_id, $hash_code_event_error, $message)
        {
            self::db_access($user_id, $message, 600, $hash_code_event_error);
            return true;
        }

        public static function log_china_server_video_uploads($user_id, $error_code_event_error, $msg)
        {
            self::db_access($user_id, "Fail to upload video to WP, v-coin server fail: " . VCOIN_SERVER . ". <br>" . $msg, 100, $error_code_event_error);
            return true;
        }

        public static function log_vcoin_error($user_id, $hash_code_event_error, $msg = "")
        {
            self::db_access($user_id, $msg, 521, $hash_code_event_error);
            return true;
        }

        public static function log_activity_api($user_id, $message)
        {
            self::db_access($user_id, $message, 558, 10);
            return true;
        }

        public static function log_stock_system($user_id = -1, $hash_code_event_error = 9002, $msg = "")
        {
            self::db_access($user_id, "Stock mgm: " . $msg, 700, $hash_code_event_error);
            return true;
        }

        public static function log_email_activity($message, $hash_code_event_error = 15801)
        {
            self::db_access(-1, $message, 104, $hash_code_event_error);
            return true;
        }

        private static function db_check_sql($event = 0, $error = 0)
        {
            $time_prep = "SELECT
                            CASE (SELECT count(*)>1 FROM imusicworld_reward_mgm_log WHERE

                            event_code=" . $event . "
                            AND error_code=" . $error . "

                            ORDER BY TIME DESC)
                            WHEN 1 THEN CEIL(TIME_TO_SEC(TIMEDIFF(
                                NOW(),
                                (SELECT time FROM imusicworld_reward_mgm_log WHERE

                                event_code=" . $event . "
                                AND error_code=" . $error . "

                                ORDER BY TIME DESC LIMIT 0,1)))/60)
                            WHEN 0 THEN -1
                            END AS result";
            return $time_prep;
        }

        private static function db_access_extend($user_id = -1, $comments = "", $event = 0, $error = 0)
        {

            global $wpdb;
            $log_table = $wpdb->prefix . "app_log";
            $interval_1 = get_option('db_log_interval', 5);
            $interval_2 = get_option('db_email_alert_interval', 5);
            $email = false;

            $var = intval($wpdb->getvar(self::db_check_sql(405, $error)));
            if ($var > $interval_2 || $var === -1) {
                $_k = array(
                    'user' => -1,
                    'comments' => "Email alert: " . $comments,
                    'event_code' => 405,
                    'error_code' => $error
                );
                $wpdb->insert($log_table, $_k);
                //  $attachments = array( WP_CONTENT_DIR . '/uploads/file_to_attach.zip' );
                $headers = 'From: InnoSys <info@innoactor.com>' . "\r\n";
                wp_mail(get_option('admin_email'), '[Innocator] Alert message from critical errors', $comments, $headers);
                $email = true;
            }
            $var = intval($wpdb->getvar(self::db_check_sql($event, $error)));
            if ($var > $interval_1 || $var === -1) {
                $_k = array(
                    'user' => $user_id,
                    'comments' => $comments . $email ? ". An alert email was sent." : "",
                    'event_code' => $event,
                    'error_code' => $error
                );
                $log_table = $wpdb->prefix . "app_log";
                $wpdb->insert($log_table, $_k);
            }
            return true;
        }

        private static function db_access($user_id = -1, $comments = "", $event = 0, $error = 0)
        {
            $_k = array(
                'user' => $user_id,
                'comments' => $comments,
                'event_code' => $event,
                'error_code' => $error
            );
            global $wpdb;
            $log_table = $wpdb->prefix . "app_log";
            $wpdb->insert($log_table, $_k);
            return true;
        }

        private static function remove_log_data($event_code, $date_before)
        {
            global $wpdb;
            $log_table = $wpdb->prefix . "app_log";
            $wpdb->query(
                $wpdb->prepare("
                DELETE FROM $log_table
                     WHERE event_code=%d AND time<%s", $event_code, $date_before
                ));
            return true;
        }

        /*protected function get_data_by_log_event($event)
        {
            global $wpdb;
            if ($_GET['user']) {
                $prepared = $wpdb->prepare('
                    SELECT * FROM imusicworld_reward_mgm_log
                    WHERE event_code=%d AND user=%d ORDER BY time DESC
            ', $event, intval($_GET['user']));
            } else {
                $prepared = $wpdb->prepare('
                    SELECT * FROM imusicworld_reward_mgm_log
                    WHERE event_code=%d ORDER BY time DESC
            ', $event);
            }

            $rprint = $wpdb->get_results($prepared);
            if ($wpdb->num_rows == 0) {
                return false;
            } else {
                return $rprint;
            }
        }*/

        /*protected function get_data_analysis_stock()
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM imusicworld_transaction_redeem WHERE claimed=%d ORDER BY DATE(time) DESC', 1);
            $rprint = $wpdb->get_results($prepared);
            $total_claimed = $wpdb->num_rows;
            $prepared = $wpdb->prepare('SELECT * FROM imusicworld_transaction_redeem WHERE claimed=%d ORDER BY DATE(time) DESC', 0);
            $rprint = $wpdb->get_results($prepared);
            $total_not_claimed = $wpdb->num_rows;
            return array(
                "t_claimed" => $total_claimed,
                "t_n_claimed" => $total_not_claimed,
            );
        }*/

        /*protected function get_data_by_product_c($location_id, $product_id, $claimed, $user_id = -1)
        {
            global $wpdb;
            //DATE(time)
            if ($user_id > -1) {
                $prepared = $wpdb->prepare('SELECT * FROM imusicworld_transaction_redeem
            WHERE claimed=%d AND claim_address=%s AND stockid=%d AND user=%d ORDER BY time DESC',
                    $claimed, $location_id, $product_id, $user_id);
            } else
                $prepared = $wpdb->prepare('SELECT * FROM imusicworld_transaction_redeem
            WHERE claimed=%d AND claim_address=%s AND stockid=%d ORDER BY time DESC',
                    $claimed, $location_id, $product_id);
            $rprint = $wpdb->get_results($prepared);
            return $rprint;
        }*/
    }
endif;