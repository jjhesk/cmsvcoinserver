<?php
defined('ABSPATH') || exit;

/**
 * Created by HKM Corporation.
 * the basic db handling and data exchange
 * User: hesk
 * Date: 4/23/14
 * Time: 10:36 PM
 */
if (!class_exists('gformBase')) {
    class gformBase
    {
        private static function get_mac()
        {
            exec("ipconfig /all", $arr, $retval);
            $arr[14];
            $ph = explode(":", $arr[14]);
            return trim($ph[1]);
        }

        public static function gen_order_num()
        {
            function make_seed()
            {
                list($usec, $sec) = explode(' ', microtime());
                return (float)$sec + ((float)$usec * 100000);
            }

            mt_srand(make_seed());
            return $randval = mt_rand();

        }

        public static function gen_order_str()
        {
            /* Generated a unique order number */

            $str = session_id();
            $str .= (string)time();
            $checksum = crc32($str);
            $date = date('Y-m-d');
            $order_number = $date . $checksum;

            return substr($order_number, 0, 19);
        }

        /**
         * if the entry row exist or not come to here
         * @param $form_id
         * @param $lead_id
         * @return bool
         */
        protected static function gf_entry_row_exist($form_id, $lead_id)
        {
            global $wpdb;
            $sql = $wpdb->prepare("SELECT COUNT(*)
                                   FROM {$wpdb->prefix}rg_lead
                                   WHERE form_id=%d AND id=%d", $form_id, $lead_id);
            $value = $wpdb->get_var($sql);
            if (intval($value) > 0) return true;
            else return false;

        }

        /**
         * @param $field_name
         * @return int
         */
        protected static function convert_field_name_to_id($field_name)
        {
            preg_match('/^\w+(\d+)$/U', $field_name, $match);
            $entry_index = strtolower($match[1]);
            return $entry_index;
        }

        /**
         * get list from gform entries with the form ID
         * @param $form_id
         * @return mixed
         */
        protected static function gf_get_form_entries($form_id)
        {
            global $wpdb;
            $listed = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "rg_lead WHERE form_id=" . $form_id . " AND status='active' ORDER BY date_created DESC");
            return $listed;
        }

        protected static function gf_update_field_value($form_id, $lead_id, $field_id, $value_replacement)
        {
            global $wpdb;

            $sql = "SELECT * FROM {$wpdb->prefix}rg_lead_detail WHERE id=%d AND form_id=%d AND field_number=%d";
            $sql = $wpdb->prepare($sql, $form_id, $lead_id, $field_id);
            $result = $wpdb->get_row($sql);

            $insert = array(
                "form_id" => $form_id,
                "lead_id" => $lead_id,
                "field_number" => $field_id,
                "value" => $value_replacement,
            );

            if (!$result) {
                $rs = $wpdb->insert($wpdb->prefix . "rg_lead_detail", $insert);
            } else {
                $rs = $wpdb->update($wpdb->prefix . "rg_lead_detail", $insert, array('id' => $result->id));
            }
            return $rs;
        }

        public static function gf_get_entry_value($form_id, $lead_id, $field_id)
        {
            global $wpdb;
            /*       $sql =  $wpdb->prepare("SELECT l.*, d.field_number, d.value
                                          FROM {$wpdb->prefix}rg_lead l
                                          INNER JOIN {$wpdb->prefix}rg_lead_detail d ON l.id = d.lead_id
                                          INNER JOIN {$wpdb->prefix}rg_lead_meta m ON l.id = m.lead_id
                                          WHERE m.meta_key=%s AND m.meta_value=%s", $meta_key, $meta_value);*/
            $sql = $wpdb->prepare("SELECT value
                                   FROM {$wpdb->prefix}rg_lead_detail
                                   WHERE form_id=%d AND lead_id=%d AND field_number=%d", $form_id, $lead_id, $field_id);
            $value = $wpdb->get_var($sql);
            return $value;
        }

        /**
         * @param $field_id
         * @return mixed
         */
        protected static function getPostJson($field_id)
        {
            return json_decode(trim(rgpost("input_" . $field_id)));
        }

        /**
         * @param $field_id
         * @return string
         */
        protected static function getPostVal($field_id)
        {
            return trim(rgpost("input_" . $field_id));
        }

        /**
         * confirmation message template
         * @param $lead_id
         * @param null $format
         * @return string
         */
        protected static function confirm_msg($lead_id, $format = null)
        {
            if ($format == null) {
                $msg_format = __("Thank you for you registeration and we will process your application soon. ref. no # %d", HKM_LANGUAGE_PACK);
            } else $msg_format = $format;
            return sprintf($msg_format, $lead_id);
        }

        protected static function filter_form_value($form, int $field_id, $value)
        {

            foreach ($form["fields"] as $field) {

                if ($field_id == $field["id"]) {

                    $field["value"] = $value;
                }
            }

            return $form;
        }

        protected static function set_input_value($field_id, $value)
        {
            if (isset($_POST["input_" . $field_id]))
                $_POST["input_" . $field_id] = $value;
        }

        /**}
         * ignore
         * @param $forms_id
         * @return array
         */
        /*   protected static function getSettingParams($forms_id)
           {
               $forms = array(
                   "service_order_cr" => GF_SERVICE_ORDER_FORM,
                   "service_order_internal" => GF_SERVICE_ORDER_FORM_INTERNAL,
               );
               $head = "#input_" . $forms_id . "_";
               switch ($forms_id) {
                   case GF_SERVICE_ORDER_FORM:

                       if (is_user_logged_in() && parent::has_role("cr")) {
                           $memberid = get_current_user_id();
                       } else {
                           $memberid = "";
                       }
                       return array(
                           "head" => $head,
                           "ff_geoloc" => $head . ff_geoloc,
                           "ff_expectdate" => $head . ff_expectdate,
                           "ff_expectedtime" => $head . ff_expectedtime,
                           "ff_cr_id" => $head . ff_cr_id,
                           "field_value_cr_id" => $memberid,
                           "form_id" => $forms_id,
                           "form_type" => $forms,
                           "ff_order_service_detail" => $head . ff_table_service
                       );
                   case GF_SERVICE_ORDER_FORM_INTERNAL:
                       if (is_user_logged_in() && parent::has_role("ocstaff")) {
                           $memberid = get_current_user_id();
                       } else {
                           $memberid = "";
                       }
                       return array(
                           "head" => $head,
                           "ff_geoloc" => $head . ff_geoloc,
                           "ff_expectdate" => $head . ff_expectdate,
                           "ff_expectedtime" => $head . ff_expectedtime,
                           "ff_staff_id" => $head . ff_staff_id,
                           "ff_client_id" => $head . ff_client_company,
                           "field_value_staff_id" => $memberid,
                           "form_id" => $forms_id,
                           "form_type" => $forms,
                           "ff_order_service_detail" => $head . ff_table_service,
                           "company_selection_html" => oc_project::select_ui()
                       );
                   case GF_REP_REGISTRATION_FORM:
                       $head = "#input_" . GF_REP_REGISTRATION_FORM . "_";
                       return array(
                           "head" => $head,
                           "ff_nicename" => $head . fieldid_nicename,
                           "ff_displayname" => $head . fieldid_displayname,
                           "ff_expectedtime" => $head . fieldid_useremail,
                           "ff_phonenumber" => $head . fieldid_phonenumber,
                           "ff_name" => $head . fieldid_name,
                           "ff_companyname" => $head . fieldid_companyname,

                       );
                   case GF_NEW_COM_FORM:
                       $head = "#input_" . GF_NEW_COM_FORM . "_";
                       return array(
                           "head" => $head,
                           "nc_comfullname" => $head . nc_comfullname,
                           "nc_conshortname" => $head . nc_conshortname,
                           "nc_contactemail" => $head . nc_contactemail,
                           "nc_contactfax" => $head . nc_contactfax,
                           "nc_contactnumber" => $head . nc_contactnumber,
                           "nc_contactname" => $head . nc_contactname,

                           "nc_cr_reg_info_json" => $head . nc_cr_reg_info_json,


                           "nc_brfile" => $head . nc_brfile,
                           "nc_brissuedate" => $head . nc_brissuedate,
                           "nc_brnumber" => $head . nc_brnumber,

                           "form_id" => $forms_id,
                           "form_type" => $forms,
                       );

                   default:
                       return array();
               }
           }*/
    }
}