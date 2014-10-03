<?php
/**
 * Created by PhpStorm.
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
         *print comment table according to different post_type
         */
        public static function comment_table()
        {
            global $wpdb, $json_api;

            $post_type = $json_api->query->type;
            $app_comment_table = $wpdb->prefix . 'app_comment';
            $post_table = $wpdb->prefix . 'posts';

            $sql = $wpdb->prepare("SELECT * FROM $app_comment_table LEFT JOIN $post_table
            ON $app_comment_table.app_post_id=$post_table.id
             where $post_table.post_type=%s", $post_type);

            $results = $wpdb->get_results($sql);

            api_handler::outSuccessDataTable($results);
        }

        public static function get_coupon_analysis_chart_data()
        {
            global $wpdb, $json_api;

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
            header("Access-Control-Allow-Origin: *");
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
            return count($out) === 0 ? "nothing is available" : $out;
        }
    }
}