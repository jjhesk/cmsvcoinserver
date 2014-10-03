<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月12日
 * Time: 下午4:50
 */
if (!class_exists('StockOperation')) {
    class StockOperation
    {
        private $vendor_choice_list = array();
        private $vendor_list = array();

        public function __construct()
        {

        }

        public function checkprice($stock_id, $price)
        {
            $price_db = get_post_meta($stock_id, "v_coin", true);
            if (intval($price_db) != intval($price)) throw new Exception("price is mismatched", 1005);
            return true;
        }

        public function check_count($stock_id, $location, $ext, $return_count_num = true)
        {
            global $wpdb;
            $table = $wpdb->prefix . "stock_count";
            $prepared = $wpdb->prepare("SELECT * FROM $table WHERE
            stock_id=%d AND location_id=%d AND extension=%d", $stock_id, $location, $ext);
            $results = $wpdb->get_row($prepared);
            if (!$return_count_num) {
                return intval($results->count);
            } else {
                return intval($results->count) > 0;
            }
        }

        /**
         * return a list of meta data for this stock ID
         * @param $stock_id
         * @return array
         */
        public function get_list_of_stock_meta($stock_id)
        {
            $base = new SingleReward($stock_id);
            $redemption_procedure = get_post_meta($stock_id, "redemption_procedure", true);
            $remarks = get_post_meta($stock_id, "extra_remarks", true);
            $expiration_date = get_post_meta($stock_id, "inn_exp_date", true);
            $vcoin_value = intval(get_post_meta($stock_id, "v_coin", true));
            // $image_small_thumb = $base->get_sq_image();
            $vendor_id = intval(get_post_meta($this->post_id, "innvendorid", true));
            // $vendor_name = get_the_title($vendor_id);
            $names = array(
                "sq_thumb" => $base->get_sq_image(),
                "vendor_name" => get_the_title($vendor_id),
                "product_name" => get_the_title($stock_id)
            );
            unset($base);
            unset($vendor_id);
            return get_defined_vars();
        }

        /**
         * list the stock count rows by the stock ID
         * @param $stock_id
         * @return mixed
         */
        public function list_stock_data($stock_id)
        {
            global $wpdb;
            $table = $wpdb->prefix . "stock_count";
            $prepared = $wpdb->prepare("SELECT * FROM $table WHERE stock_id=%d", $stock_id);
            $results = $wpdb->get_results($prepared);
            return $results;
        }

        /**
         * @param $stock_id
         * @param $location_id
         * @internal param $method
         * @return mixed
         */
        public function list_stock_location($stock_id, $location_id)
        {
            global $wpdb;
            $table = $wpdb->prefix . "stock_count";
            $prepared = $wpdb->prepare("SELECT * FROM $table WHERE stock_id=%d AND location_id=%d", $stock_id, $location_id);
            $results = $wpdb->get_results($prepared);
            return $results;
        }

        /**
         * @param $stock_id
         * @param $method
         * @return mixed
         */
        public function list_stock_method($stock_id, $method)
        {
            global $wpdb;
            $table = $wpdb->prefix . "stock_count";
            $prepared = $wpdb->prepare("SELECT * FROM $table WHERE stock_id=%d AND distribution=%s", $stock_id, $method);
            $results = $wpdb->get_results($prepared);
            return $results;
        }

        /**
         *  make random key
         * @param $length
         * @param bool $useupper
         * @param bool $usenumbers
         * @param bool $usespecial
         * @return string
         */
        private function str_makerand($length, $useupper = true, $usenumbers = true, $usespecial = false)
        {
            $charset = "abcdefghijklmnopqrstuvwxyz";
            if ($useupper)
                $charset .= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if ($usenumbers)
                $charset .= "0123456789";
            if ($usespecial)
                $charset .= "~@#$%^*()_+-={}|][";
            // Note: using all special characters this reads: "~!@#$%^&*()_+`-={}|\\]?[\":;'><,./";

            $key = '';
            for ($i = 0; $i < $length; $i++) {
                $key .= $charset[mt_rand(0, strlen($charset) - 1)];
            }
            return $key;
        }

        /**
         * only does this once per new stock post is created.
         * @param $stock_id
         * @param $method
         * @param array|int $extensions
         * @param array $location_id
         */
        public function add_stock_row($stock_id, $method, $extensions = 1, $location_id = array())
        {
            global $wpdb;
            $table = $wpdb->prefix . "stock_count";
            $hash = $this->str_makerand(36); // fixed size on the db
            $default_setting = array(
                "stock_id" => intval($stock_id),
                "distribution" => "CENTRAL",
                "count" => 0,
                "location_id" => -1, //ALL locations
                "qr" => $hash
            );
            if (intval($method) == 0) {
                for ($i = 0; $i < $extensions; $i++) {
                    $ext = array(
                        "extension" => $i,
                        //  "count" => $initial_count
                    );
                    $datainput = wp_parse_args($ext, $default_setting);
                    $wpdb->insert($table, $datainput);
                }
            } else {
                //method : 1
                foreach ($location_id as $locID) {
                    for ($i = 0; $i < $extensions; $i++) {
                        $ext = array(
                            "distribution" => "DECEN",
                            "extension" => $i,
                            //  "count" => $initial_count,
                            "location_id" => intval($locID)
                        );
                        $datainput = wp_parse_args($ext, $default_setting);
                        $wpdb->insert($table, $datainput);
                    }
                }
            }


        }

        /**
         * the new way to increase or decrease stock count
         * @param $stock_count_id
         * @param $new_count
         * @return bool
         */
        public function add_count_v2($stock_count_id, $new_count)
        {
            global $wpdb, $current_user;

            if (is_user_logged_in()) {
                $table = $wpdb->prefix . "stock_count";

                $prepared = $wpdb->prepare("SELECT * FROM $table WHERE ID=%d", $stock_count_id);
                $results = $wpdb->get_row($prepared);

                $mod_row_id = $results->ID;
                $mod_current_count = $results->count;
                $n_count = $mod_current_count + $new_count;

                $done = $wpdb->update($table,
                    array("count" => $n_count),
                    array("ID" => $mod_row_id));

                if ($done) {
                    inno_log_db::log_stock_count($current_user->ID, 10081, "add stock count added (" . $new_count . ")");
                    return true;
                } else return false;
            } else return false;
        }

        /**
         * ui generation
         * @param $stock_id
         * @return string
         */
        public function get_stock_count_ids($stock_id)
        {
            global $wpdb;

            $table = $wpdb->prefix . "stock_count";

            $prep = $wpdb->prepare("SELECT ID FROM $table WHERE stock_id=%d", $stock_id);
            $row = $wpdb->get_results($prep);

            $result = ui_handler::ui_select($row, "stock_count_id", "select an id", "stock_count_id");

            return $result;
        }

        /**
         * the old way to increase the stock count
         * @param $stock_id
         * @param $location
         * @param $extension
         * @param $count
         * @return bool
         */
        public function add_count($stock_id, $location, $extension, $count)
        {
            global $wpdb;
            $table = $wpdb->prefix . "stock_count";

            $prepared = $wpdb->prepare("SELECT * FROM $table WHERE
            stock_id=%d AND location_id=%d AND extension=%d", $stock_id, $location, $extension);
            $results = $wpdb->get_row($prepared);

            $mod_row_id = $results->ID;
            $mod_current_count = $results->count;
            $new_count = $mod_current_count + $count;

            $done = $wpdb->update($table,
                array("count" => $new_count),
                array("ID" => $mod_row_id));
            if ($done) {
                inno_log_db::log_stock_system(-1, 10081, "add stock count added (" . $count . ")");
            }
            return true;
        }

        /**
         * get the QR by the given hash code
         * @param $hash
         * @return mixed
         */
        public function get_count_row_by_qr($hash)
        {
            global $wpdb;
            $table = $wpdb->prefix . "stock_count";

            $prepared = $wpdb->prepare("SELECT * FROM $table WHERE qr=%s", $hash);
            $results = $wpdb->get_row($prepared);

            return $results;
        }

        public function fillqr(){

        }
    }
}