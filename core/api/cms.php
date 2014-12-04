<?php
/**
 * Created by HKM Corporation.
 * User: ryo
 * Date: 14年9月8日
 * Time: 上午10:34
 */

/*
  Controller name: CMS
  Controller description: For CMS use only.<br>Author: Ryo
 */

if (!class_exists('JSON_API_Cms_Controller')) {
    class JSON_API_Cms_Controller
    {
        /**
         * Print comment tables according to different post types
         */
        public static function comment_table()
        {
            global $wpdb, $json_api;
            try {
                $post_type = $json_api->query->type;
                $app_comment_table = $wpdb->prefix . 'app_comment';

                $sql = $wpdb->prepare("SELECT * FROM $app_comment_table
             where post_type=%s", $post_type);

                $results = $wpdb->get_results($sql);
                api_handler::outSuccessDataTable($results);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * Delete comment in table according to different post types.
         */
        public static function delete_comments()
        {
            global $wpdb, $json_api;
            try {
                $app_comment_table = $wpdb->prefix . 'app_comment';
                $ids = $json_api->query->ids;

                $query = $wpdb->prepare("DELETE FROM $app_comment_table WHERE ID IN ($ids)");
                inno_log_db::log_admin_stock_management(-1, 5423523, print_r($query, true));
                $result = $wpdb->query($query);

                api_handler::outSuccessData($result);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        public static function get_coupon_analysis_chart_data()
        {
            global $wpdb, $json_api;
            try {
                $table = $wpdb->prefix . 'post_coupon_claim';
                $claimed = $json_api->query->claimed;
                $coupon_id = $json_api->query->id;

                if ($claimed == 1) {
                    $query = $wpdb->prepare("SELECT COUNT(*) FROM $table where coupon_id=%d
                AND redeem_agent<>-1", $coupon_id);
                } else {
                    $query = $wpdb->prepare("SELECT COUNT(*) FROM $table where coupon_id=%d
                AND redeem_agent=-1", $coupon_id);
                }
                $results = $wpdb->get_var($query);
                api_handler::outSuccessData($results);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /*
                    IFC MGAF2ZP/A – iPhone 6 Plus Gold 128GB
                    IFC MG492ZP/A – iPhone 6 Gold 16GB
                    IFC MG4F2ZP/A – iPhone 6 Black 64GB
                    IFC MG472ZP/A – iPhone 6 Black 16GB
                    IFC MG4A2ZP/A – iPhone 6 Black 128GB
                    IFC MGAA2ZP/A – iPhone 6 Plus Gold 16GB
                    IFC MG4J2ZP/A – iPhone 6 Gold 64GB
                    IFC MG4H2ZP/A – iPhone 6 Silver 16GB
                    IFC MG4E2ZP/A – iPhone 6 Gold 128GB
                    IFC MG482ZP/A – iPhone 6 Silver 64GB
                    IFC MG4C2ZP/A – iPhone 6 Silver 128GB
                    IFC MGA82ZP/A – iPhone 6 Plus Black 16GB

                    FW R485
                    CWB R409
                    IFC R428
                */

        public static function get_iphone_check()
        {

            $dictionary = array(
                "MGAF2ZP/A" => "iPhone 6 Plus Gold 128GB",
                "MG492ZP/A" => "iPhone 6 Gold 16GB",
                "MG4F2ZP/A" => "iPhone 6 Black 64GB",
                "MG472ZP/A" => "iPhone 6 Black 16GB",
                "MG4A2ZP/A" => "iPhone 6 Black 128GB",
                "MGAA2ZP/A" => "iPhone 6 Plus Gold 16GB",
                "MG4J2ZP/A" => "iPhone 6 Gold 64GB",
                "MG4H2ZP/A" => "iPhone 6 Silver 16GB",
                "MG4E2ZP/A" => "iPhone 6 Gold 128GB",
                "MG482ZP/A" => "iPhone 6 Silver 64GB",
                "MG4C2ZP/A" => "iPhone 6 Silver 128GB",
                "MGA82ZP/A" => "iPhone 6 Plus Black 16GB",
            );


            $h = api_handler::curl_get("https://reserve.cdn-apple.com/HK/zh_HK/reserve/iPhone/availability.json");
            $g = json_decode($h);
            unset($h);
            $out = array();
            if (isset($g->R485)) {
                //  FW R485
                foreach ($g->R485 as $code => $available) {
                    if ($available)
                        $out["FW"][] = $dictionary[$code];

                }
            }
            if (isset($g->R409)) {
                //  FW R485
                foreach ($g->R409 as $code => $available) {
                    if ($available)
                        $out["CWB"][] = $dictionary[$code];
                }
            }
            if (isset($g->R428)) {
                //  FW R485
                foreach ($g->R428 as $code => $available) {
                    if ($available)
                        $out["IFC"][] = $dictionary[$code];
                }
            }

            header("Access-Control-Allow-Origin: *");
            return count($out) === 0 ? "nothing is available" : $out;
        }

        public static function get_testing_coupon_prizer()
        {
            global $wpdb, $json_api;
            try {
                $d = CouponOperation::_coupon_operation();
                api_handler::outSuccessData($d);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        public static function get_admin_scanner_table_data()
        {
            global $wpdb, $current_user, $json_api;
            try {
                //     $user_id = $current_user->ID;
                /*$user_role = $current_user->roles[0];
                if ($user_role != "administrator") throw new Exception("you are not permitted to use this API", 101011);*/

                $primaryKey = 'ID';

                $columns = array(
                    array('db' => 'ID', 'dt' => 'ID'),
                    array('db' => 'trace_id', 'dt' => 'trace_id'),
                    array('db' => 'stock_ext_id', 'dt' => 'stock_ext_id'),
                    array('db' => 'vstatus', 'dt' => 'vstatus'),
                    array('db' => 'qr_a', 'dt' => 'qr_a'),
                    array('db' => 'qr_b', 'dt' => 'qr_b'),
                    array('db' => 'distribution', 'dt' => 'distribution'),
                    array('db' => 'handle_mac_address', 'dt' => 'handle_mac_address'),
                    array('db' => 'handle_terminal_id', 'dt' => 'handle_terminal_id'),
                    array('db' => 'handle_requirement', 'dt' => 'handle_requirement'),
                    array('db' => 'names', 'dt' => 'names'),
                    array('db' => 'action_taken_by', 'dt' => 'action_taken_by'),
                    array('db' => 'user', 'dt' => 'user'),
                    array('db' => 'stock_id', 'dt' => 'stock_id'),
                    array('db' => 'vcoin', 'dt' => 'vcoin'),
                    array('db' => 'obtained', 'dt' => 'obtained'),
                    array('db' => 'address', 'dt' => 'address'),
                    array('db' => 'offer_expiry_date', 'dt' => 'offer_expiry_date'),
                    array('db' => 'claim_time', 'dt' => 'claim_time'),
                    array('db' => 'time', 'dt' => 'time'),
                );
                $data_result = sspclass::simple($_GET, $wpdb, $wpdb->prefix . "post_redemption",
                    $primaryKey, $columns, $json_api->query);

                inno_log_db::log_admin_stock_management(-1, 8888, print_r($data_result, true));

                api_handler::outSuccessPagingDataTable($data_result);

            } catch (Exception $e) {
                api_handler::outFailWeSoft($e->getCode(), $e->getMessage());
            }
        }

        /** scanner cms */
    }
}