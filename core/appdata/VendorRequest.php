<?php
/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年1月15日
 * Time: 下午4:00
 */
if (!class_exists('VendorRequest')) {
    class VendorRequest extends inno_db
    {
        private $vendor_choice_list = array();
        private $vendor_list = array();

        /**
         * cms_gifts option list
         * @return array
         */
        public static function requestlist()
        {

            $list = array();
            $str = api_handler::curl_get(VCOIN_SERVER . "getvendorlist");
            $j = json_decode($str);
            $list[-1] = 'select one';
            if (intval($j->result) == 1) {
                //success
                foreach ($j->vendor_list as $vendordetail) {
                    // $t = (array) $vendordetail;
                    $list[$vendordetail->vendor_id] = $vendordetail->vendor_name;
                }
            }

            return $list;
        }

        /**
         *
         * cms_location drop down selection box content
         * @return array
         */
        public static function select_list_addresses()
        {
            $list = array();
            $address = parent::get_all_addresses();
            $list[-1] = 'select one';
            if ($address) {
                foreach ($address as $ads) {
                    $list[$ads->ID] = $ads->zh;
                }
            }
            return $list;
        }


        /**
         * by vendor id
         * @param $post_id
         * @return array
         */
        public static function get_addresses_list_by_post_id($post_id)
        {
            global $wpdb;
            //  $vendor = VendorRequest::get_vendor_by_product_id($post_id);
            $addresses_config = get_post_meta($post_id, "assign_location_ids", true);
            $arr = json_decode($addresses_config, true);
            $address = array();
            //print_r($addresses_config[0]);
            /* foreach ($arr as $k => $v) {
                 $prep = $wpdb->prepare("SELECT * FROM cms_stock_address WHERE ID=%d", $k);
                 $row = $wpdb->get_row($prep);
                 if (intval($v) > -1) {
                     $address[$v] = $row->zh;
                 }
                 $address[$v] = $row->zh;

             }*/
            return $arr;
        }

        /**
         * get list of address from the vendor post ID
         * @param $post_id
         * @return array
         */
        public static function get_address_list_for_cms_chocies($post_id)
        {
            global $wpdb;
            //$vendor = VendorRequest::get_vendor_by_product_id($post_id);

            $vendor = get_post_meta($post_id, "location_ids", false);
            $address = array();
            foreach ($vendor[0] as $k => $v) {
                $prep = $wpdb->prepare("SELECT * FROM cms_stock_address WHERE ID=%d", $v);
                $row = $wpdb->get_row($prep);
                if (intval($v) > -1) {
                    $address[$v] = $row->zh;
                }
                $address[$v] = $row->zh;

            }
            return $address;
        }

        /**
         * function get_address_detail
         *
         * 1    ID    bigint(20)            No    None    AUTO_INCREMENT     Change Change     Drop Drop     Browse distinct values Browse distinct values    Primary Primary    Unique Unique     Index Index    Spatial Spatial    Show more actions More
         * 2    zh    text    utf8_unicode_ci        No    None         Change Change     Drop Drop     Browse distinct values Browse distinct values    Primary Primary    Unique Unique    Index Index    Spatial Spatial    Show more actions More
         * 3    cn    text    utf8_unicode_ci        No    None         Change Change     Drop Drop     Browse distinct values Browse distinct values    Primary Primary    Unique Unique    Index Index    Spatial Spatial    Show more actions More
         * 4    en    text    latin1_swedish_ci        No    None         Change Change     Drop Drop     Browse distinct values Browse distinct values    Primary Primary    Unique Unique    Index Index    Spatial Spatial    Show more actions More
         * 5    contact_number    varchar(20)    latin1_swedish_ci        No    None         Change Change     Drop Drop     Browse distinct values Browse distinct values     Primary Primary     Unique Unique     Index Index    Spatial Spatial    Show more actions More
         * 6    business_hour    varchar(30)    utf8_unicode_ci        No    None         Change Change     Drop Drop     Browse distinct values Browse distinct values     Primary Primary     Unique Unique     Index Index    Spatial Spatial    Show more actions More
         * 7    country    enum('macau', 'hongkong', 'china', 'usa')    hp8_english_ci        No    hongkong         Change Change     Drop Drop     Browse distinct values Browse distinct values     Primary Primary     Unique Unique     Index Index    Spatial Spatial    Show more actions More
         * 8    date    timestamp        on update
         *
         * @param $address_id
         * @return mixed
         *
         */
        public static function get_address_detail($address_id)
        {
            global $wpdb;
            $prep_bone = $wpdb->prepare('SELECT * FROM cms_stock_address WHERE ID=%d', $address_id);
            $row = $wpdb->get_row($prep_bone);
            return $row;
        }

        private static function get_field_address_stock_count_web_ui($stock_id)
        {
            $ui = '<option value="none">please select a field</option>';
            $stockf = new inno_db_stock($stock_id);
            if ($stockf->get_stock_type() == "decentralized") {
                //LOC_STOCK_COUNT_MAX
                for ($i = 1; $i < 10 + 1; $i++) {
                    $location_key = 'loc_' . $i;
                    $address_id = get_post_meta($stockf->getVendorID(), $location_key, true);
                    //$ui .= "loc key: " . $address_id;
                    if ($address_id > 0) {
                        $row = self::get_address_detail($address_id);
                        if (!$row) {
                            // $ui .= ", no detail found.";
                        } else {
                            $key = 'amount_' . $i;
                            $ui .= '<option value="' . $key . '">' . $row->short_zh . '</option>';
                            // $ui .= ", detail found.";
                        }
                    }
                }
            } else {
                $ui .= '<option value="amount_c">Centralized Stock Amount</option>';
            }

            return $ui;
        }

        /**
         *
         * addresses of the vendor provided by post ID
         *
         * @param $vendor_post_id
         * @param string $lang
         * @return array
         */
        public static function get_addresses_list_for_options($vendor_post_id, $lang = "zh")
        {

            $arr = array();
            for ($i = 1; $i < LOC_STOCK_COUNT_MAX + 1; $i++) {
                $location_key = 'loc_' . $i;
                $address_id = get_post_meta($vendor_post_id, $location_key, true);
                if (is_numeric($address_id) && $address_id > 0) {
                    $row = self::get_address_detail(intval($address_id));
                    if (!$row) {
                    } else {
                        $arr[$address_id] = $row->{$lang};
                    }
                }
            }
            return $arr;
        }

        /**
         *
         * @param $address_id
         * @return mixed
         */
        public static function get_phone_number_by_address_id($address_id)
        {
            $row = self::get_address_detail(intval($address_id));
            return $row->contact_number;
        }

        /**
         *
         * @param $address_id
         * @return mixed
         */
        public static function get_working_hours_by_address_id($address_id)
        {
            $row = self::get_address_detail(intval($address_id));
            return $row->business_hour;
        }

        /**
         * addresses of the vendor provided by UUID
         * @param $uuid
         * @return array|bool
         */
        private static function find_address_from_uuid_vendor($uuid)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM ' . $wpdb->postmeta . '  WHERE meta_key="vendid" AND meta_value=%s', $uuid);
            $row = $wpdb->get_row($prepared);
            $vendor_internal_id = $row->post_id;
            $arr = array();
            for ($i = 1; $i < 6; $i++) {
                $mkey = 'loc_' . $i;
                $address_id = get_post_meta($vendor_internal_id, $mkey, true);
                $prep = $wpdb->prepare('SELECT * FROM cms_stock_address WHERE ID=%d', $address_id);
                $row = $wpdb->get_row($prep);
                if (intval($address_id) > -1) {
                    $arr[$address_id] = $row->zh;
                }
            }

            /* if ($rows) {
                 foreach ($rows as $row) {
                     $arr[$row->meta_key] = $row->post_id;
                 }
                 if (isset($arr["vendid"])) {
                     return self::retrieve_address_by_vendor($arr["vendid"]);
                 } else {
                     return false;
                 }
             } else {
                 return false;
             }*/
            return $arr;
        }

        /**
         * get the address by given specific location name and the vendor id
         * @param $vendor_post_id
         * @param $location
         * @return mixed
         */
        public static function get_address($vendor_post_id, $location)
        {
            $converted_field_name = substr($location, 0, -6);
            return get_post_meta($vendor_post_id, $converted_field_name, true);
        }

        /**
         * get a list of locations from the vendor ID
         * @param $wp_post_vend_id
         * @return array
         */
        public static function retrieve_address_by_vendor($wp_post_vend_id)
        {
            $total = LOC_STOCK_COUNT_MAX + 1;
            $arr = array();
            for ($i = 1; $i < $total; $i++) {
                if (trim(get_post_meta($wp_post_vend_id, "loc_" . $i, true)) != '') {
                    $arr["loc_" . $i . "_count"] = get_post_meta($wp_post_vend_id, "loc_" . $i, true);
                }
            }
            return $arr;
        }

        /**
         * @param $wp_post_vend_id
         * @return array
         */
        public static function retrieve_address_id_list_by_vendor($wp_post_vend_id)
        {
            $total = LOC_STOCK_COUNT_MAX + 1;
            $arr = array();
            for ($i = 1; $i < $total; $i++) {
                if (intval(get_post_meta($wp_post_vend_id, "loc_" . $i, true)) > 0) {
                    $arr[] = get_post_meta($wp_post_vend_id, "loc_" . $i, true);
                }
            }
            return $arr;
        }

        /**
         * @param bool $selection_ui_list
         * @return array
         * @throws Exception
         */
        public static function get_wp_vendor_list($selection_ui_list = true)
        {
            if ($selection_ui_list) {
                $query = new WP_Query(array(
                    "post_type" => VENDOR,
                    "posts_per_page" => -1,
                    'post_status' => 'publish',
                ));

                $result = array();
                $result[-1] = "vendor selection";
                // Output nothing if there is no posts
                if ($query->have_posts()) {
                    while ($query->have_posts()) : $query->the_post();
                        $result[$query->post->ID] = get_the_title($query->post->ID);
                    endwhile;
                    return $result;
                } else {
                    return false;
                }
            } else {
                throw new Exception("no post", -1);
            }
        }


        /**
         * @param $field_name
         * @param null $val_pre
         * @param bool $readonly
         * @return string
         */
        public static function request_select_ui_option($field_name, $val_pre = null, $readonly = false)
        {
            try {

                $arr = self::get_wp_vendor_list();
                $readonly_text = $readonly ? ' disabled="disabled"' : '';
                $ui = '<select name="' . $field_name . '"' . $readonly_text . '>';
                foreach ($arr as $vendor_id => $vendor_name) {
                    $selected = ($val_pre > 0) ? selected(intval($val_pre), intval($vendor_id), false) : "";
                    $ui .= '<option value="' . $vendor_id . '" ' . $selected . '>' . $vendor_name . '</option>';
                }
                $ui .= '</select>';
            } catch (Exception $e) {
                $ui = "no vendors found";
            }
            return $ui;
        }

        public static function get_all_vendor_addresses()
        {
            global $wpdb;
            $table = $wpdb->prefix . "stock_address";
            $query = $wpdb->prepare("SELECT * FROM $table");
            return $wpdb->get_results($query);
        }

        public static function insert_vendor_address($Q)
        {
            global $wpdb;

            if (!isset($Q->zh_short)) throw new Exception ("Missing Chinese Traditional short name", 100120);
            if (!isset($Q->ja_short)) throw new Exception ("Missing Japanese short name", 100121);
            if (!isset($Q->en_short)) throw new Exception ("Missing English short name", 100122);
            if (!isset($Q->zh)) throw new Exception ("Missing Chinese Traditional full name", 100123);
            if (!isset($Q->ja)) throw new Exception ("Missing Japanese full name", 100124);
            if (!isset($Q->en)) throw new Exception ("Missing English full name", 100125);
            if (!isset($Q->sms_no)) throw new Exception ("Missing Terminal Number (phone number for sms)", 100126);
            if (!isset($Q->contact_no)) throw new Exception ("Missing Contact Number", 100127);
            if (!isset($Q->email)) throw new Exception ("Missing Email", 100128);
            if (!isset($Q->business_hr)) throw new Exception ("Missing Office Hours For Redemption Operations", 100129);
            if (!isset($Q->country)) throw new Exception ("Missing Country", 100130);

            $table = $wpdb->prefix . "stock_address";
            return $wpdb->insert(
                $table,
                array(
                    'short_zh' => $Q->zh_short,
                    'short_ja' => $Q->ja_short,
                    'short_en' => $Q->en_short,
                    'zh' => $Q->zh,
                    'ja' => $Q->ja,
                    'en' => $Q->en,
                    'terminal' => (int)$Q->sms_no,
                    'contact_number' => (int)$Q->contact_no,
                    'email' => $Q->email,
                    'business_hour' => $Q->business_hr,
                    'country' => $Q->country
                ),
                array(
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                    '%d',
                    '%d',
                    '%s',
                    '%s',
                    '%s'
                )
            );
        }

        public static function action_request_stock_addresses_ui_json()
        {
            try {
                if (!is_user_logged_in())
                    throw new Exception("needs to login", 1101);

                if (!api_account::has_role("administrator"))
                    throw new Exception("needs the right permission", 1103);

                if (!isset($_POST['stock_id']))
                    throw new Exception("parameters are not given", 1102);

                //starting doing the progress of the API
                api_handler::outputJson(array(
                        "result" => 1,
                        "data" => self::get_field_address_stock_count_web_ui($_POST['stock_id']),
                        "message" => "success")
                );
            } catch (Exception $e) {
                api_handler::outputJson(array("result" => $e->getCode(), "message" => $e->getMessage()));
            }
        }

        function frontend()
        {
            return api_handler::outputJson(self::requestlist());
        }

    }
}