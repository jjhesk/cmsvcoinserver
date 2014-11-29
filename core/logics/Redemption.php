<?php
defined('ABSPATH') || exit;
if (!class_exists('Redemption')) {
    /**
     * Created by HKM Corporation.
     * User: Hesk
     * Date: 14年8月29日
     * Time: 上午10:07
     */
    class Redemption
    {
        protected $reward_item_id;
        protected $qr_code;
        protected $terminal_id;
        protected $extra_note;
        protected $redemption_base;
        protected $user_id;
        protected $vcoin_val;
        private $vcoin_module, $stock_operation;
        protected $transaction_result_success;
        protected $db;
        protected $transaction_table;

        public function __construct()
        {
            global $wpdb;
            $this->db = $wpdb;
            $this->transaction_table_product = $this->db->prefix . "post_redemption";
            $this->transaction_table_coupon = $this->db->prefix . "post_coupon_claim";

        }

        public function __destruct()
        {
            $this->db = NULL;
            $this->vcoin_module = NULL;
            $this->stock_operation = NULL;
        }

        private function get_game_type_int($coupon_id)
        {
            $value_gt = get_post_meta($coupon_id, "game_type", true);
            $game_type = 0;
            if ($value_gt == "web_stock_2") $game_type = 3;
            if ($value_gt == "web_stock_1") $game_type = 2;
            if ($value_gt == "luck_draw") $game_type = 1;
            return $game_type;
        }

        /**
         *
         * @param $query
         * @throws Exception
         * @return DB ROW mixed
         */
        private function check_available_coupon($query)
        {


            try {
                if (!isset($query->couponid)) throw new Exception("coupon id is missing.", 1001);
                $value = intval(get_post_meta($query->couponid, "v_coin", true));
                $sql = "SELECT COUNT(*) FROM $this->transaction_table_coupon WHERE coupon_id=%d AND redeem_agent=-1";
                $n = $this->db->get_var($this->db->prepare($sql, intval($query->couponid)));


                /** check for available  */
                if (intval($n) > 0) {
                    $sql = "SELECT * FROM $this->transaction_table_coupon WHERE coupon_id=%d AND redeem_agent=-1";
                    $first_row = $this->db->get_row($this->db->prepare($sql, $query->couponid));

                    $status = $this->db->update($this->transaction_table_coupon,
                        array(
                            'coupon_id' => $query->couponid,
                            'redeem_agent' => $this->user_id,
                            'coin_spent' => $value,
                            'vstatus' => 1,
                            'game_type' => $this->get_game_type_int($query->couponid)
                        ),
                        array('ID' => $first_row->ID),
                        array(
                            '%d', // value1
                            '%d', // value1
                            '%d', // value1
                            '%d', // value1
                        ),
                        array('%d'));
                    if (!$status) throw new Exception("sql update error for redeem coupon", 1081);
                    $first_row = $this->db->get_row($this->db->prepare($sql, $query->couponid));

                    return $first_row;
                } else {
                    throw new Exception("out of stock", 1099);
                }
            } catch (Exception $e) {
                throw $e;
            }
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
            // Note: using all special characters this reads: "~!@#$%^&*()_+`-={}|\\]?[\":;"><,./";

            $key = "";
            for ($i = 0; $i < $length; $i++) {
                $key .= $charset[mt_rand(0, strlen($charset) - 1)];
            }
            return $key;
        }

        /**
         * get the value of the coupon in vcoin
         * @param $row_id
         * @param $coupon_id
         * @throws Exception
         * @return int
         */
        private function claim_coupon($row_id, $coupon_id)
        {
            $value = get_post_meta($coupon_id, "v_coin", true);
            $status = $this->db->update($this->transaction_table_coupon,
                array(
                    'redeem_agent' => intval($this->user_id),
                    'coin_spent' => intval($value),
                    'vstatus' => 1
                ),
                array('ID' => $row_id),
                array(
                    '%d', // value1
                    '%d', // value1
                    '%d', // value1
                ),
                array('%d'));
            if ($status)
                $result = $this->db->get_row($this->db->prepare("SELECT * FROM $this->transaction_table_coupon WHERE ID=%d", (int)$row_id));
            else throw new Exception("unable to update claim data in the db", 16832);
            $amount = (int)$value;
            $code = $result->client_redeem_code;
            return array($amount, $code);
        }

        private function claim_coupon_fifo($coupon_id, $user_id)
        {
            $code = $this->str_makerand(10);
            $amount = get_post_meta($coupon_id, "v_coin", true);
            $content = array(
                "client_redeem_code" => $code,
                "coupon_id" => (int)$coupon_id,
                "redeem_agent" => (int)$user_id,
                "coin_spent" => (int)$amount,
                "vstatus" => 0,
                "exp_date" => get_post_meta($coupon_id, "inn_exp_date", true),
                "game_type" => $this->get_game_type_int($coupon_id)
            );
            $this->db->insert($this->transaction_table_coupon, $content);
            return array($amount, $code);
        }

        /**
         * redemption for coupon code
         * @param $Q
         * @return bool
         * @throws Exception
         */
        public function redeem_coupon($Q)
        {
            global $current_user, $app_merchan;
            try {
                if (!isset($Q->user_id)) throw  new Exception("user id is missing.", 1051);
                if (!isset($Q->couponid)) throw  new Exception("coupon id is missing.", 1052);
                if (!isset($Q->consumer_id)) throw new Exception("consumer id is missing.", 1053);
                $this->user_id = $Q->user_id;

                $game_options = get_post_meta($Q->couponid, "game_type", true);
                if ($game_options == "web_stock_2") {
                    list($amount, $code) = $this->claim_coupon_fifo($Q->couponid, $Q->user_id);
                } else {
                    /**check if the coupon is available **/
                    $data_row = $this->check_available_coupon($Q);
                    /**start to redeem the coupon **/
                    list($amount, $code) = $this->claim_coupon($data_row->ID, $Q->couponid);
                }
                /**
                 * transaction for vcoin deduction
                 */
                $coin_operation = new vcoinBase();
                $coin_operation
                    ->setAmount($amount)
                    ->setReceive(IMUSIC_UUID)
                    ->setSender($Q->consumer_id)
                    ->setTransactionReference("redemption coupon")
                    ->CommitTransaction();


                return array("code" => $code, "trace_id" => $coin_operation->get_transaction_reference());
            } catch (Exception $e) {


                throw $e;
            }
        }

        /**
         * redemption for rewards
         * @param $Q
         * @throws Exception
         */
        public function submission($Q)
        {
            try {
                if (!isset($Q->product_id)) throw new Exception("product id is missing.", 1001);
                if (!isset($Q->checkdoubles)) throw new Exception("check doubles is missing.", 1002);
                if (!isset($Q->price)) throw new Exception("price is missing.", 1003);
                if (!isset($Q->distribution)) throw new Exception("distribution is missing.", 1004);
                if (!isset($Q->offer_expiry_date)) throw new Exception("offer expiry date is missing.", 1006);
                // if (!isset($extension_id)) throw new Exception("extension is missing.", 1007);
                if (!isset($Q->address_id)) throw new Exception("address id is missing.", 1008);
                if (!isset($Q->user_uuid)) throw new Exception("user_uuid is missing.", 1009);
                if (!isset($Q->user_id)) throw new Exception("user id is missing.", 1010);

                $product_id = intval($Q->product_id);
                $check_double = $Q->checkdoubles;
                $money = intval($Q->price);
                $distribution = $Q->distribution;
                $this->user_id = $Q->user_id;
                $reference = "";
                $extension_id = $Q->extension_id;
                /**
                 * check for out of stock and product values in vcoin
                 */
                $this->stock_operation = new StockOperation();
                $this->stock_operation->check_count($product_id, $Q->address_id, $extension_id, false, 1);

                $method_key = $distribution == "decentralized" ? "DECEN" : "CENTRAL";
                $stock_meta_data = $this->stock_operation->get_list_of_stock_meta($product_id);
                $this->vcoin_val = $stock_meta_data['vcoin_value'];
                /**
                 * transaction for vcoin deduction
                 */
                $this->vcoin_module = new vcoinBase();
                $this->vcoin_module
                    ->setAmount((int)$this->vcoin_val)
                    ->setReceive(IMUSIC_UUID)
                    ->setSender($Q->user_uuid)
                    ->setTransactionReference("redemption submission")
                    ->CommitTransaction();
                /**
                 * to retrieve the transaction UUID from the vcoin server
                 */
                $receipt = $this->vcoin_module->get_transaction_reference();
                //  inno_log_db::log_admin_stock_management(-1, 839285, print_r($receipt, true));
                if (isset($receipt)) {
                    $submission_data = array(
                        "distribution" => $method_key,
                        "user" => $this->user_id,
                        "stock_id" => $product_id,
                        "vcoin" => $this->vcoin_val,
                        "trace_id" => $receipt,
                        "address" => $Q->address_id,
                        "offer_expiry_date" => $Q->offer_expiry_date,
                        "handle_requirement" => $stock_meta_data['redemption_procedure'],
                        "vstatus" => 0,
                        "stock_ext_id" => $this->stock_operation->get_stock_extension_spec()
                    );
                    /**
                     * carry out the count off of the stock
                     */
                    $this->stock_operation->submission_countoff_stock();
                    /**
                     * declare the transaction result to the user api
                     */
                    $this->declare_reward_queue($submission_data);
                } else throw new Exception("vcoin transaction no response", 1615);
            } catch (Exception $e) {
                throw $e;
            }
        }

        private function declare_reward_queue($submission_list)
        {
            /**
             * generate the qr codes for the redemption scanning process #2
             */
            // inno_log_db::log_admin_stock_management(-1, 839285, print_r($submission_list, true));
            list($q1, $q2) = $this->generate_qr();
            $list = wp_parse_args(array("qr_a" => $q1, "qr_b" => $q2), $submission_list);
            /**
             * record to the db for the new claim history
             */
            inno_log_db::log_admin_stock_management(-1, 839285, print_r($list, true));
            $this->db->insert($this->transaction_table_product, $list);

            /**
             * return the organized transaction records
             */
            $this->transaction_result_success = array(
                "user" => (int)$this->user_id,
                "amount" => (int)$submission_list["vcoin"],
                "qr_a" => $q1,
                "qr_b" => $q2,
                "trace_id" => $submission_list["trace_id"],
                "handle" => (int)$submission_list["handle_requirement"],
                "ext" => (int)$this->stock_operation->get_stock_extension_spec(),
                "title" => get_the_title($this->stock_operation->getStockId())
            );
            inno_log_db::log_admin_stock_management(-1, 839285, print_r($this->transaction_result_success, true));
        }

        /**
         * @param $transaction_vcoin_id
         * @param $reference
         * @param $status
         * 1: complete
         * 2: error - incomplete
         * 3: unknown
         * @throws Exception
         */
        protected $transaction_reference, $transaction_vcoin_id;

        public function change_status($transaction_vcoin_id, $reference, $status)
        {
            try {
                $this->transaction_reference = $reference;
                $this->transaction_vcoin_id = $transaction_vcoin_id;
                if ($reference == "redemption_submission") {
                    $this->find_transaction_on_rewards_update($transaction_vcoin_id, $status);
                    $this->check_vcoin_status($status);
                } elseif ($reference == "redemption_coupon") {
                    $this->find_transaction_on_coupons_update($transaction_vcoin_id, $status);
                    $this->check_vcoin_status(3);
                } else {
                    throw new Exception("unknown transaction reference.", 1075);
                }
            } catch (Exception $e) {
                throw $e;
            }
        }

        private function find_transaction_on_coupons_update($transaction_vcoin_id, $status)
        {
            $get_first_row = $this->db->prepare("SELECT * FROM $this->transaction_table_coupon WHERE trace_id=%s", $transaction_vcoin_id);
            $results = $this->db->get_row($get_first_row);
            if (!$results) throw new Exception("no such transaction recorded from the redemption coupons.", 1091);
            $this->user_id = $results->user;
            $this->db->update($this->transaction_table_coupon, array("vstatus" => $status), array("ID" => $results->ID));
            $this->check_vcoin_status($status);
        }

        private function find_transaction_on_rewards_update($transaction_vcoin_id, $status)
        {
            $get_first_row = $this->db->prepare("SELECT * FROM $this->transaction_table_product WHERE trace_id=%s", $transaction_vcoin_id);
            $results = $this->db->get_row($get_first_row);
            if (!$results) throw new Exception("no such transaction recorded from the redemption rewards.", 1092);
            $this->user_id = $results->redeem_agent;
            $this->db->update($this->transaction_table_product, array("vstatus" => $status), array("ID" => $results->ID));
            $this->check_vcoin_status($status);
        }

        private function check_vcoin_status($n)
        {
            /**
             * SMSmd::InitiateSMS(array(
             *   "number" => "56923181",
             *   "content" => "submission successfully. vcoin has been deducted. 贖回成功 "
             * ));
             */
            if (intval($n) == 0) {
                $this->transaction_result_success = array();
            } elseif (intval($n) == 1) {
                $this->transaction_result_success = array(
                    "user_id" => $this->user_id,
                    "sms_message" => "vcoin transaction complete. Transaction code:" . $this->transaction_vcoin_id,
                );
            } elseif (intval($n) == 2) {
                $this->transaction_result_success = array(
                    "user_id" => $this->user_id,
                    "push_message" => "vcoin transaction complete. Transaction code:" . $this->transaction_vcoin_id,
                );
            } elseif (intval($n) == 3) {
                $this->transaction_result_success = array();
            }
        }

        /**
         * @return array
         */
        private function generate_qr()
        {
            $date = new DateTime();
            $q1 = md5($date->getTimestamp());
            $q2 = md5($date->getTimestamp());
            return array($q1, $q2);
        }



        /**
         * @return mixed
         */
        public function get_result()
        {
            return $this->transaction_result_success;
        }

        /**
         * list
         * @param $Q
         * @throws Exception
         */
        public function listing($Q)
        {
            global $current_user, $app_merchan;
            if (!isset($Q->type)) throw new Exception("query type is missing.", 1001);

            $additional_query = "";

            if (!isset($Q->stock_id)) {
                $additional_query .= " AND stock_id=" . $Q->stock_id;
            }

            if (!isset($Q->distribution)) {
                $additional_query .= " AND distribution='" . $Q->distribution . "'";
            }

            if (!isset($Q->vcoin)) {
                $additional_query .= " AND vcoin=" . $Q->vcoin;
            }

            if (!isset($Q->address)) {
                $additional_query .= " AND address=" . $Q->address;
            }

            if (!isset($Q->obtained)) {
                $additional_query .= " AND obtained=" . $Q->obtained;
            }

            $SQL = $this->db->prepare("SELECT * FROM $this->transaction_table_product WHERE user=%d $additional_query ORDER BY time DESC", $current_user->ID);
            $redeem_record = $this->db->get_results($SQL);
            $this->transaction_result_success = $redeem_record;
        }

        /**
         * user to scan the product and make the redemption of the pick up of the item
         *
         * input params
         * note
         * qr
         * user
         *
         *
         * @param $Q
         * @return array
         * @throws Exception
         */
        public function redeemobtain_user_scan($Q)
        {

            if (!isset($Q->qr)) throw new Exception("the QR code is missing.", 1069);

            if (!isset($Q->user)) throw new Exception("user ID is missing.", 10788);
            /**
             * To retrieve the qr data from the cms server
             */
            $count_R = StockOperation::getByVendorProductQR($Q->qr);
            if (!$count_R) {
                inno_log_db::log_admin_stock_management(-1, 101022, $Q->qr);
                throw new Exception("External QR Error", 1074);
            }
            /**
             * got the stock ID and the count ID
             */
            $prepared = $this->db->prepare("SELECT * FROM $this->transaction_table_product WHERE stock_id=%d AND obtained=0 AND user=%d",
                (int)$count_R->stock_id, (int)$Q->user);
            /**
             * project the detail of the pending redemption item
             */
            $redeem_record = $this->db->get_row($prepared);
            if (!$redeem_record) {
                inno_log_db::log_admin_stock_management(-1, 101022, $prepared);
                throw new Exception("This redemption is not available to you or it has been redeemed, please try to check out our redemption products first.", 1071);
            }
            if (Date_Difference::western_time_past_event($redeem_record->offer_expiry_date) == 2) throw new Exception("The offer is expired", 1067);

            $time_now = current_time('timestamp');

            //update existing row
            $done = $this->db->update($this->transaction_table_product,
                array(
                    "obtained" => 1,
                    "action_taken_by" => "RESTAURANT",
                    "claim_time" => $time_now,
                ),
                array("ID" => (int)$redeem_record->ID));

            if (!$done) throw new Exception("cannot make the redemption based on technical issue on SQL", 1072);
            $address = new VendorRequest();
            $terminal_number = $address->get_phone_number_by_address_id((int)$count_R->location_id);
            if (!empty($terminal_number)) {
                if (isset($Q->note)) {
                    $this->send_sms($terminal_number, $Q->note);
                } else {
                    /**
                     * send data to the push notification
                     */
                    $this->send_sms($terminal_number, get_the_title((int)$redeem_record->stock_id));
                }
            }


            /**
             * print out the result
             */
            $this->transaction_result_success = array(
                "user_id" => (int)$Q->user,
                "stock_id" => (int)$redeem_record->stock_id,
                "claim_time" => $time_now,
                "processed_by" => "RESTAURANT",
                "address_id" => (int)$count_R->location_id,
                "trace_id" => $redeem_record->trace_id
            );
        }

        /**
         * this scan will only need to scan once from the vendor's device and it will not need to have
         * the second verification from user to provide additional supporting document or code
         *
         * input params
         * qr
         * user
         *
         * @param $Q
         * @throws Exception
         */
        public function redeemobtain_vendor_scan($Q)
        {
            if (!isset($Q->user)) throw new Exception("user step is missing.", 1065);
            if (!isset($Q->qr)) throw new Exception("QR code is missing.", 1062);
            $sql = "SELECT * FROM $this->transaction_table_product WHERE user=" . $Q->user . " AND (qr_a='" . $Q->qr . "' OR qr_b='" . $Q->qr . "') ";
            $redeem_record = $this->db->get_row($sql);
            if (!$redeem_record) throw new Exception("This redemption product is not available to you, please try to check out our redemption products first.", 1063);
            //got the redemption row now

            if (intval($redeem_record->obtained) == 1) throw new Exception("This redemption has been claimed", 1066);

            $done = $this->db->update($this->transaction_table_product,
                array(
                    "obtained" => 1,
                    "action_taken_by" => "STRAIGHT",
                    "claim_time" => current_time('timestamp'),
                ),
                array("ID" => (int)$redeem_record->ID));


            $this->transaction_result_success = boolval($done) ? $redeem_record : false;

        }

        /**
         * this scan will need to scan once from the vendor's device with additional
         * proofing document or code
         *
         * input params
         * step
         * user
         * qr
         * trace_id
         *
         *
         * @param $Q
         * @throws Exception
         */
        public function redeemobtain_vendor_scan_advanced($Q)
        {
            if (!isset($Q->step)) throw new Exception("process step is missing.", 1061);
            if (!isset($Q->user)) throw new Exception("user step is missing.", 1065);
            $step_process = intval($Q->step);
            if ($step_process == 1) {
                if (!isset($Q->qr)) throw new Exception("QR code is missing.", 1062);
                $get_first_row = "SELECT * FROM $this->transaction_table_product WHERE user=" . $Q->user . " AND (qr_a='" . $Q->qr . "' OR qr_b='" . $Q->qr . "') ";
                $redeem_record = $this->db->get_row($get_first_row);
                if (!$redeem_record) throw new Exception("This redemption product is not available to you, please try to check out our redemption products first.", 1063);
                //got the redemption row now
                $this->transaction_result_success = $redeem_record;
            } else if ($step_process == 2) {
                if (!isset($Q->trace_id)) throw new Exception("the trace ID is missing.", 1064);
                $get_first_row = $this->db->prepare("SELECT * FROM $this->transaction_table_product WHERE user=%d AND trace_id=%s", (int)$Q->user, $Q->trace_id);
                $redeem_record = $this->db->get_row($get_first_row);
                if (!$redeem_record) throw new Exception("redemption data is not verified or found", 1068);
                if (intval($redeem_record->obtained) == 1) throw new Exception("This redemption has been claimed", 1066);
                if (Date_Difference::western_time_past_event($redeem_record->offer_expiry_date) == 2) throw new Exception("The offer is expired", 1067);


                //todo: need to build the feature for location trap
                if ($redeem_record->distribution == "DECEN") {
                    //need to verify the location ID
                    $address = $redeem_record->address;
                    if (!isset($Q->handle_mac_address)) throw new Exception("the mac address is missing.", 1669);


                }
                /**
                 * need to adding more references on the action taken by column
                 */

                $done = $this->db->update($this->transaction_table_product,
                    array(
                        "obtained" => 1,
                        "action_taken_by" => "ADVANCE",
                        "claim_time" => current_time('timestamp'),
                    ),
                    array("ID" => (int)$redeem_record->ID));

                if (!$done) throw new Exception("failure to update the claim record, technical issue:$redeem_record->ID", 1668);
                $get_first_row = $this->db->prepare("SELECT * FROM $this->transaction_table_product WHERE ID=%d", (int)$redeem_record->ID);
                $redeem_record = $this->db->get_row($get_first_row);
                $this->transaction_result_success = $redeem_record;
                //  unset($step_process);
            } else {
                throw new Exception("step val is invalid.", 1667);
            }


            $step_process = NULL;
            $get_first_row = NULL;
            $redeem_record = NULL;
        }


        private function send_smss()
        {
            SMSmd::InitiateSMS(array(
                "number" => intval(get_user_meta($this->user_id, "sms_number", true)),
                "content" => "redemption is done"
            ));
        }

        private function send_sms($number, $content = "redemption done")
        {
            SMSmd::InitiateSMS(array(
                "number" => $number,
                "content" => $content
            ));
        }

        public function get_redemption_count($stock_id)
        {

            $transaction_table = $this->db->prefix . "post_redemption";
            $getcount = $this->db->prepare("SELECT COUNT(*) FROM $transaction_table WHERE stock_id=%d", $stock_id);
            $t = $this->db->get_var($getcount);
            return !$t ? 0 : intval($t);
        }

        public function get_issued_coupons_count($post_coupon_id)
        {

            $table_coupon = $this->db->prefix . "post_coupon_claim";
            $template_prepared = $this->db->prepare("SELECT COUNT(*) FROM $table_coupon WHERE redeem_agent<>-1 AND coupon_id=%d", intval($post_coupon_id));
            $found = $this->db->get_var($template_prepared);


            $table_coupon = NULL;
            $template_prepared = NULL;
            return $found;
        }


    }
}