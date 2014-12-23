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
        private $stock_table;
        private $db, $single_reward, $stock_id, $current_stock_r, $check_amount;

        public function __construct()
        {
            global $wpdb;
            $this->db = $wpdb;
            $this->stock_table = $this->db->prefix . "stock_count";
            $this->address_table = $this->db->prefix . "stock_address";
        }

        public function __destruct()
        {
            $this->db = NULL;
            $this->stock_table = NULL;
            $this->address_table = NULL;
            $this->single_reward = NULL;
        }


        /**
         * remove from the post by post ID
         * @param $post_id
         * @return bool
         */
        public function remove_post($post_id)
        {
            $L = $this->db->prepare("DELETE FROM $this->stock_table WHERE stock_id=%d", (int)$post_id);
            $this->db->query($L);
            return true;
        }

        public function checkprice($stock_id, $price)
        {
            $price_db = get_post_meta($stock_id, "v_coin", true);
            if (intval($price_db) != intval($price)) throw new Exception("price is mismatched", 1005);
            return true;
        }

        /**
         * works for submission only
         * @param $stock_id
         * @param $location
         * @param $ext
         * @param bool $get_num
         * @param $take_amount
         * @throws Exception
         * @return bool|int
         */
        public function check_count($stock_id, $location, $ext, $get_num = true, $take_amount)
        {
            $this->stock_id = $stock_id;
            if (!isset($ext)) $ext = 0;
            $this->check_amount = (int)$take_amount;
            $prepared = $this->db->prepare("SELECT * FROM $this->stock_table WHERE stock_id=%d AND location_id=%d AND extension=%d", (int)$stock_id, (int)$location, (int)$ext);
            // inno_log_db::log_admin_stock_management(-1, 100199, $prepared);
            $this->current_stock_r = $this->db->get_row($prepared);
            if (!$this->current_stock_r) {
                inno_log_db::log_admin_stock_management(-1, 102556, "Unable to find the extension row by the given data, please double check the input: " . print_r($this->current_stock_r, true));
                throw new Exception("technical issue: cannot find the extension row by the given data", 1611);
            }
            // inno_log_db::log_admin_stock_management(-1, 100199, print_r($results, true));
            if ($get_num) {
                return intval($this->current_stock_r->count);
            } else {
                if (intval($this->current_stock_r->count) < $take_amount) {
                    throw new Exception("out of stock before transaction", 1610);
                } else {
                    return true;
                }
            }
        }

        /**
         * works for submission only
         */
        public function submission_countoff_stock()
        {
            $n = (int)$this->current_stock_r->count;
            $done = $this->db->update($this->stock_table,
                array("count" => $n - $this->check_amount),
                array("ID" => $this->current_stock_r->ID));

        }

        /**
         * works for submission only
         * @return int
         */
        public function get_stock_extension_spec()
        {
            return (int)$this->current_stock_r->ID;
        }

        /**
         * works for submission only
         * @return int
         */
        public function getStockId()
        {
            return (int)$this->stock_id;
        }

        /**
         * return the extension label on the spec
         * @return string
         */
        public function get_stock_extension_label()
        {
            return $this->current_stock_r->label;
        }

        public function get_vendor_name($stock_id)
        {
            $vendor_id = intval(get_post_meta($stock_id, "innvendorid", true));
            return get_the_title($vendor_id);
        }

        /**
         * return a list of meta data for this stock ID
         * @param $stock_id
         * @return array
         */
        public function get_list_of_stock_meta($stock_id)
        {
            $this->stock_id = (int)get_post_meta($stock_id, "stock_id", true);
            $this->single_reward = new SingleReward($stock_id);
            $redemption_procedure = get_post_meta($stock_id, "redemption_procedure", true);
            $remarks = get_post_meta($stock_id, "extra_remarks", true);
            $expiration_date = get_post_meta($stock_id, "inn_exp_date", true);
            $vcoin_value = intval(get_post_meta($stock_id, "v_coin", true));
            // $image_small_thumb = $this->single_reward->get_sq_image();
            $vendor_id = intval(get_post_meta($stock_id, "innvendorid", true));
            // $vendor_name = get_the_title($vendor_id);
            $names = array(
                "sq_thumb" => $this->single_reward->get_sq_image(),
                "vendor_name" => get_the_title($vendor_id),
                "product_name" => get_the_title($stock_id)
            );

            $vendor_id = NULL;
            return get_defined_vars();
        }

        /**
         * list the stock count rows by the stock ID
         * @param $stock_id
         * @param bool $display_label_as_location
         * @internal param bool $labelized
         * @return mixed
         */
        public function list_stock_data($stock_id, $display_label_as_location = false)
        {
            $display_last_column = $display_label_as_location ? "short_zh" : "ID";
            //  $second_column = boolval($display_label_as_location)? "t1.stock_id AS stock_id,":"t1.label AS label,";
            $query = "SELECT
                    t1.ID AS ID,
                    t1.label AS label,
                    t1.stock_id AS stock_id,
                    t1.extension AS extension,
                    t1.distribution AS distribution,
                    t1.count AS count,
                    IF(t1.location_id=-1, 'perpetual system', t2.$display_last_column) AS location_id
                 FROM $this->stock_table AS t1 LEFT JOIN $this->address_table AS t2
                 ON t1.location_id = t2.ID WHERE t1.stock_id=%d";
            $prepared = $this->db->prepare($query, (int)$stock_id);
            //inno_log_db::log_admin_stock_management(-1, 3332, $prepared);
            $results = $this->db->get_results($prepared);
            $prepared = NULL;
            return $results;
        }

        /**
         * list stock data v1 - without the complex structure
         * @param $stock_id
         * @return array
         */
        public function list_stock_data_v1($stock_id)
        {
            $list = array();
            $total = 0;
            foreach ($this->list_stock_data($stock_id, false) as $obj) {
                unset($obj->ID);
                unset($obj->stock_id);
                unset($obj->distribution);
                unset($obj->label);
                $count = (int)$obj->count;
                if ($count === 0) continue;
                $obj->location_id = (int)$obj->location_id;
                $obj->extension = (int)$obj->extension;
                $obj->count = $count;
                $list[] = $obj;
                $total += $count;
            }

            return array($list, $total);

        }

        /**
         * list stock data v2 - with the complex structure
         * @param $stock_id
         * @param $schema
         * @internal param bool $label
         * @return mixed
         */
        public function list_stock_data_v2($stock_id, $schema)
        {
            $list = array();
            $total = 0;
            foreach ($this->list_stock_data($stock_id, false) as $obj) {
                unset($obj->ID);
                unset($obj->stock_id);
                unset($obj->distribution);
                // unset($obj->label);
                $count = (int)$obj->count;
                if ($count === 0) continue;
                $obj->location_id = (int)$obj->location_id;
                $obj->extension = (int)$obj->extension;
                $obj->count = $count;
                $obj->label = trim($obj->label);
                if (isset($_REQUEST["keyval"])) {
                    $obj->el = $this->label2object($schema, $obj->label);
                }
                $list[] = $obj;
                $total += $count;
            }

            return array($list, $total);
        }

        private function label2object($schema, $label)
        {
            $keys = array();
            for ($i = 0; $i < count($schema); $i++) {
                $keys[] = $schema[$i]["id"];
            }
            $label_el = explode(" ", $label);
            return array_combine($keys, $label_el);
        }

        /**
         * @param $stock_id
         * @param $location_id
         * @internal param $method
         * @return mixed
         */
        public function list_stock_location($stock_id, $location_id)
        {
            $prepared = $this->db->prepare("SELECT * FROM $this->stock_table WHERE stock_id=%d AND location_id=%d", (int)$stock_id, (int)$location_id);
            $results = $this->db->get_results($prepared);
            return $results;
        }

        /**
         * @param $stock_id
         * @param $method
         * @return mixed
         */
        public function list_stock_method($stock_id, $method)
        {
            $prepared = $this->db->prepare("SELECT * FROM $this->stock_table WHERE stock_id=%d AND distribution=%s", (int)$stock_id, $method);
            $results = $this->db->get_results($prepared);
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
         * @param array $extension_array
         */
        private function add_rows_centralize($stock_id, $extension_array = array())
        {
            $default_setting_preset = array(
                "stock_id" => intval($stock_id),
                "distribution" => "CENTRAL",
                "count" => 0,
                "location_id" => -1, //ALL locations
                "label" => ""
            );
            for ($i = 0; $i < count($extension_array); $i++) {
                $ext = array(
                    "extension" => $i,
                    "qr" => $this->str_makerand(36),
                    "label" => $extension_array[0] == "na" ? "na" : $extension_array[$i]
                );
                $input = wp_parse_args($ext, $default_setting_preset);
                $this->db->insert($this->stock_table, $input);
            }
        }

        /**
         * only does this once per new stock post is created.
         * @param $stock_id
         * @param array $extension_array
         * @param array $location_ids
         */
        private function add_rows_decentralize($stock_id, $extension_array = array(), $location_ids = array())
        {
            $default_setting_preset = array(
                "stock_id" => intval($stock_id),
                "distribution" => "DECEN",
                "count" => 0,
                "label" => "",
                "location_id" => -1 //ALL locations
            );
            for ($h = 0; $h < count($location_ids); $h++) {
                for ($i = 1; $i <= count($extension_array); $i++) {
                    $ext = array(
                        "extension" => $i,
                        "qr" => $this->str_makerand(36),
                        "location_id" => $location_ids[$h],
                        "label" => $extension_array[0] == "na" ? "na" : $extension_array[$i - 1]
                    );
                    $input = wp_parse_args($ext, $default_setting_preset);
                    $this->db->insert($this->stock_table, $input);
                }
            }
        }

        /**
         * @param $stock_id
         * @param array $location_ids
         */
        private function add_rows_decentralize_na($stock_id, $location_ids = array())
        {
            $default_setting_preset = array(
                "stock_id" => intval($stock_id),
                "distribution" => "DECEN",
                "count" => 0,
                "label" => "",
                "location_id" => -1 //ALL locations
            );
            for ($h = 0; $h < count($location_ids); $h++) {
                $ext = array(
                    "extension" => -1,
                    "qr" => $this->str_makerand(36),
                    "location_id" => $location_ids[$h],
                    "label" => "na"
                );
                $input = wp_parse_args($ext, $default_setting_preset);
                $this->db->insert($this->stock_table, $input);
            }
        }

        /**
         * @param $stock_id
         */
        private function add_rows_centralize_na($stock_id)
        {
            $input = array(
                "stock_id" => intval($stock_id),
                "distribution" => "CENTRAL",
                "count" => 0,
                "location_id" => -1, //ALL locations
                "extension" => -1,
                "qr" => $this->str_makerand(36),
                "label" => "na"
            );
            $this->db->insert($this->stock_table, $input);
        }

        /**
         * the new way to increase or decrease stock count
         * @param $json_query
         * @throws exception
         * @internal param $stock_count_id
         * @return bool
         */
        public function add_count_v2($json_query)
        {
            global $current_user;

            if (is_user_logged_in()) {

                if (isset($json_query->stock_count_id)) {
                    $target_stock = $json_query->stock_count_id;
                } else if (isset($json_query->stock_ids))
                    $target_stock = $json_query->stock_ids;
                else throw new exception("Missing stock id", 90678);

                if (!isset($json_query->new_count)) throw new exception ("Missing amount to add", 90679);
                else $new_count = $json_query->new_count;

                $query = $this->db->prepare("UPDATE $this->stock_table SET count = count+%d
                where ID in ($target_stock)", (int)$new_count);

                $results = $this->db->query($query);

                inno_log_db::log_admin_stock_management(-1, 32131, print_r($results, true));
                /*$prepared = $this->db->prepare("SELECT * FROM $this->stock_table WHERE ID=%d", (int)$stock_count_id);
                $results = $this->db->get_row($prepared);

                $mod_row_id = $results->ID;
                $mod_current_count = $results->count;
                $n_count = $mod_current_count + $new_count;

                $done = $this->db->update($this->stock_table,
                    array("count" => $n_count),
                    array("ID" => $mod_row_id));*/

                if ($results) {
                    inno_log_db::log_stock_count($current_user->ID, 10081, "add stock count added (" . $new_count . ")");
                    return $results;
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

            $prep = $this->db->prepare("SELECT ID FROM $this->stock_table WHERE stock_id=%d", (int)$stock_id);
            $row = $this->db->get_results($prep);

            $result = ui_handler::ui_select($row, "stock_count_id",
                array("select an id", "select from checkbox")
                , "stock_count_id");

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
            $prepared = $this->db->prepare("SELECT * FROM $this->stock_table WHERE
            stock_id=%d AND location_id=%d AND extension=%d", (int)$stock_id, (int)$location, (int)$extension);
            $results = $this->db->get_row($prepared);

            $mod_row_id = $results->ID;
            $mod_current_count = $results->count;
            $new_count = $mod_current_count + $count;

            $done = $this->db->update($this->stock_table,
                array("count" => $new_count),
                array("ID" => $mod_row_id));
            if ($done) {
                inno_log_db::log_stock_system(-1, 10081, "add stock count added (" . $count . ")");
            }
            return true;
        }

        /**
         * query row
         * @param $qr
         * @internal param $ID
         * @return mixed
         */
        public static function getByVendorProductQR($qr)
        {
            $Row = new self();
            return $Row->get_count_row_by_qr($qr);
        }

        /**
         * query row
         * @param $ID
         * @return mixed
         */
        public static function getQRbyRow($ID)
        {
            $Row = new self();
            return $Row->get_count_row_by_id($ID);
        }

        public function getImage($stock_id)
        {
            //inno_video_cover_image
            $list = (int)get_post_meta($stock_id, "inno_image_thumb", true);
            // inno_log_db::log_admin_vendor_management(-1, 29112, print_r($list));
            // $arr = array();
            $image_attributes = wp_get_attachment_image_src((int)$list, 'large');
            if ($image_attributes) {
                $image = $image_attributes[0];
            } else $image = "";
            return $image;
        }

        public function get_count_row_by_id($ID)
        {
            $prepared = $this->db->prepare("SELECT * FROM $this->stock_table WHERE ID=%d", (int)$ID);
            $results = $this->db->get_row($prepared);
            return $results;
        }

        /**
         * get the QR by the given hash code
         * @param $hash
         * @return mixed
         */
        public function get_count_row_by_qr($hash)
        {
            $prepared = $this->db->prepare("SELECT * FROM $this->stock_table WHERE qr=%s", $hash);
            $results = $this->db->get_row($prepared);
            return $results;
        }

        public function add_stock_row_v2($item_features, $methods, $stock_id, $ids = array())
        {
            // $assigned_locations, $method_type, $post_id
            if ($item_features == "na") {
                if ($methods == 'perpetual') {
                    $this->add_rows_centralize_na($stock_id);
                } elseif ($methods == 'decentralized') {
                    $this->add_rows_decentralize_na($stock_id, $ids);
                }
            } else {
                $result = $this->list_combination($item_features);
                if ($methods == 'perpetual') {
                    $this->add_rows_centralize($stock_id, $result);
                } elseif ($methods == 'decentralized') {
                    $this->add_rows_decentralize($stock_id, $result, $ids);
                }
            }

            /**
             * SELECT location_id AS ids
             * FROM  `cms_stock_count`
             * WHERE stock_id =1673
             * GROUP BY location_id
             * LIMIT 0 , 30
             */
        }

        private function list_combination($option_array)
        {
            $N = 1;
            foreach ($option_array as $object) {
                $N *= count($object->tags);
            }

            $all_combinations = array();

            for ($i = 0; $i < $N; ++$i) {
                $all_combinations[$i] = array();
                $q = $i;
                for ($j = 0; $j <= count($option_array) - 1; ++$j) {
                    $opt = $option_array[$j];
                    $nopts = count($opt->tags);
                    $all_combinations[$i][$opt->label_new_name] = $opt->tags[$q % $nopts];
                    $q = floor($q / $nopts);
                }
            }

            $item_features_new = array();
            $i = 0;
            foreach ($all_combinations as $tags) {
                foreach ($tags as $features) {
                    $item_features_new[$i] .= $features . " ";
                }
                $item_features_new[$i] = rtrim($item_features_new[$i]);
                $i++;
            }
            return $item_features_new;
        }

        private function permuteUnique($items, $perms = array(), &$return = array())
        {
            if (empty($items)) {
                $return[] = $perms;
            } else {
                sort($items);
                $prev = false;
                for ($i = count($items) - 1; $i >= 0; --$i) {
                    $newitems = $items;
                    $tmp = array_splice($newitems, $i, 1);
                    $tmp = $tmp[0];
                    if ($tmp != $prev) {
                        $prev = $tmp;
                        $newperms = $perms;
                        array_unshift($newperms, $tmp);
                        $this->permuteUnique($newitems, $newperms, $return);
                    }
                }
                return $return;
            }
        }

        public function update_obtain_status($id, $status)
        {
            $table = $this->db->prefix . "post_redemption";
            $this->db->update(
                $table,
                array(
                    'action_taken_by' => "ADMIN",
                    'obtained' => (int)$status
                ),
                array('ID' => (int)$id));

            $query = $this->db->prepare("SELECT * FROM $table WHERE ID=%d", $id);
            return $this->db->get_row($query);
        }
    }
}