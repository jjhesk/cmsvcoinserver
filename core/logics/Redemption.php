<?php
defined('ABSPATH') || exit;
if (!class_exists('Redemption')) {
    /**
     * Created by PhpStorm.
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
        protected $transaction_result_success;

        public function __construct()
        {

        }

        /**
         *
         * @param $query
         * @throws Exception
         * @return DB ROW mixed
         */
        private function check_available_coupon($query)
        {
            global $wpdb;
            $table = $wpdb->prefix . "post_coupon_claim";
            try {
                if (!isset($query->couponid)) throw new Exception("coupon id is missing.", 1001);
                $value = intval(get_post_meta($query->couponid, "v_coin", true));


                $sql = "SELECT COUNT(*) FROM $table WHERE coupon_id=%d AND redeem_agent=-1";
                $n = $wpdb->get_var($wpdb->prepare($sql, $query->couponid));


                /** check for available  */
                if (intval($n) > 0) {
                    $sql = "SELECT * FROM $table WHERE coupon_id=%d AND redeem_agent=-1";
                    $first_row = $wpdb->get_row($wpdb->prepare($sql, $query->couponid));
                    $status = $wpdb->update($table,
                        array(
                            'coupon_id' => $query->couponid,
                            'redeem_agent' => $this->user_id,
                            'coin_spent' => $value,
                            'vstatus' => 1
                        ),
                        array('ID' => $first_row->ID),
                        array(
                            '%d', // value1
                            '%d', // value1
                            '%d', // value1
                        ),
                        array('%d'));
                    if (!$status) throw new Exception("sql update error for redeem coupon", 1081);
                    $first_row = $wpdb->get_row($wpdb->prepare($sql, $query->couponid));

                    return $first_row;
                } else {
                    throw new Exception("out of stock", 1099);
                }
            } catch (Exception $e) {
                throw $e;
            }
        }

        /**
         * get the value of the coupon in vcoin
         * @param $row_id
         * @param $coupon_id
         * @return int
         */
        private function claim_coupon($row_id, $coupon_id)
        {
            global $wpdb;
            $table = $wpdb->prefix . "post_coupon_claim";
            $value = get_post_meta($coupon_id, "v_coin", true);
            $status = $wpdb->update($table,
                array(
                    'redeem_agent' => $this->user_id,
                    'coin_spent' => $value,
                    'vstatus' => 1
                ),
                array('ID' => $row_id),
                array(
                    '%d', // value1
                    '%d', // value1
                    '%d', // value1
                ),
                array('%d'));
            return intval($value);
        }

        /**
         * redemption for coupon code
         * @param $jsonqapi
         * @return bool
         * @throws Exception
         */
        public function redeem_coupon($jsonqapi)
        {
            global $current_user, $app_merchan, $wpdb;
            try {
                if (!isset($jsonqapi->user_id)) throw  new Exception("user id is missing.", 1051);
                if (!isset($jsonqapi->couponid)) throw  new Exception("coupon id is missing.", 1051);
                if (!isset($jsonqapi->consumer_id)) throw new Exception("consumer id is missing.", 1052);
                $this->user_id = $jsonqapi->user_id;

                /**check if the coupon is available **/
                $data_row = $this->check_available_coupon($jsonqapi);

                /**start to redeem the coupon **/
                $value = $this->claim_coupon($data_row->ID, $jsonqapi->couponid);

                /**
                 * transaction for vcoin deduction
                 */
                $coin_operation = new vcoinBase();
                $coin_operation
                    ->setAmount($value)
                    ->setReceive(IMUSIC_UUID)
                    ->setSender($current_user)
                    ->setTransactionReference("redemption_coupon")
                    ->CommitTransaction();

                return true;
            } catch (Exception $e) {
                throw $e;
            }
        }

        /**
         * redemption for rewards
         * @param $jsonqapi
         * @throws Exception
         */
        public function submission($jsonqapi)
        {
            try {
                if (!isset($jsonqapi->product_id)) throw new Exception("product id is missing.", 1001);
                if (!isset($jsonqapi->checkdoubles)) throw new Exception("check doubles is missing.", 1002);
                if (!isset($jsonqapi->price)) throw new Exception("price is missing.", 1003);
                if (!isset($jsonqapi->distribution)) throw new Exception("distribution is missing.", 1004);
                if (!isset($jsonqapi->offer_expiry_date)) throw new Exception("offer expiry date is missing.", 1006);
                if (!isset($jsonqapi->extension_id)) throw new Exception("extension is missing.", 1007);
                if (!isset($jsonqapi->address_id)) throw new Exception("address id is missing.", 1008);
                if (!isset($jsonqapi->user_uuid)) throw new Exception("user_uuid is missing.", 1009);
                if (!isset($jsonqapi->user_id)) throw new Exception("user id is missing.", 1010);

                $product_id = intval($jsonqapi->product_id);
                $check_double = $jsonqapi->checkdoubles;
                $money = intval($jsonqapi->price);
                $distribution = $jsonqapi->distribution;
                $this->user_id = $jsonqapi->user_id;
                $reference = "";
                /**
                 * check for out of stock and product values in vcoin
                 */

                $method_key = $distribution == "decentralized" ? "DECEN" : "CENTRAL";


                $j_stock_operation = new StockOperation();
                $stock = $j_stock_operation->check_count($product_id, $jsonqapi->address_id, $jsonqapi->extension_id, false);
                $stock_meta_data = $j_stock_operation->get_list_of_stock_meta($product_id);
                $this->vcoin_val = $stock_meta_data['vcoin_value'];

                /**
                 * transaction for vcoin deduction
                 */
                $coin_operation = new vcoinBase();
                $coin_operation
                    ->setAmount($this->vcoin_val)
                    ->setReceive(IMUSIC_UUID)
                    ->setSender($jsonqapi->user_uuid)
                    ->setTransactionReference("redemption_submission")
                    ->CommitTransaction();

                $receipt = $coin_operation->get_tranaction_reference();
                $submission_data = array(
                    "distribution" => $method_key,
                    "user" => $this->user_id,
                    "stock_id" => $product_id,
                    "vcoin" => $stock_meta_data['vcoin_value'],
                    "trace_id" => $receipt,
                    "address" => $jsonqapi->address_id,
                    "offer_expiry_date" => $jsonqapi->offer_expiry_date,
                    "handle_requirement" => $stock_meta_data['redemption_procedure'],
                    "vstatus" => 1
                );

                $this->declare_reward_queue($submission_data);

            } catch (Exception $e) {
                throw $e;
            }
        }

        private function declare_reward_queue($subission_list)
        {
            global $wpdb;
            $transaction_table = $wpdb->prefix . "post_redemption";
            list($q1, $q2) = $this->generate_qr();
            $list = wp_parse_args(
                array("qr_a" => $q1, "qr_b" => $q2),
                $subission_list
            );

            $wpdb->insert($transaction_table, $list);

            /**
             * record transaction
             */
            $this->transaction_result_success = array(
                "user" => $this->user_id,
                "amount" => $subission_list["vcoin"],
                "qr_a" => $q1,
                "qr_b" => $q2,
                "trace_id" => $subission_list["trace_id"],
                "handle" => intval($subission_list["handle_requirement"])
            );
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
            global $wpdb;
            $transaction_table = $wpdb->prefix . "post_coupon_claim";
            $get_first_row = $wpdb->prepare("SELECT * FROM $transaction_table WHERE trace_id=%s", $transaction_vcoin_id);
            $results = $wpdb->get_row($get_first_row);
            if (!$results) throw new Exception("no such transaction recorded from the redemption coupons.", 1091);
            $this->user_id = $results->user;
            $wpdb->update($transaction_table, array("vstatus" => $status), array("ID" => $results->ID));
            $this->check_vcoin_status($status);
        }

        private function find_transaction_on_rewards_update($transaction_vcoin_id, $status)
        {
            global $wpdb;
            $transaction_table = $wpdb->prefix . "post_redemption";
            $get_first_row = $wpdb->prepare("SELECT * FROM $transaction_table WHERE trace_id=%s", $transaction_vcoin_id);
            $results = $wpdb->get_row($get_first_row);
            if (!$results) throw new Exception("no such transaction recorded from the redemption rewards.", 1092);
            $this->user_id = $results->redeem_agent;
            $wpdb->update($transaction_table, array("vstatus" => $status), array("ID" => $results->ID));
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
                $this->transaction_result_success = array();
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

        private function get_reward_detail($post_id)
        {

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
         * @param $jsonqapi
         * @throws Exception
         */
        public function listing($jsonqapi)
        {
            global $current_user, $app_merchan, $wpdb;
            if (!isset($jsonqapi->type)) throw new Exception("query type is missing.", 1001);
            $transaction_table = $wpdb->prefix . "post_redemption";
            $additional_query = "";

            if (!isset($jsonqapi->stock_id)) {
                $additional_query .= " AND stock_id=" . $jsonqapi->stock_id;
            }

            if (!isset($jsonqapi->distribution)) {
                $additional_query .= " AND distribution='" . $jsonqapi->distribution . "'";
            }

            if (!isset($jsonqapi->vcoin)) {
                $additional_query .= " AND vcoin=" . $jsonqapi->vcoin;
            }

            if (!isset($jsonqapi->address)) {
                $additional_query .= " AND address=" . $jsonqapi->address;
            }

            if (!isset($jsonqapi->obtained)) {
                $additional_query .= " AND obtained=" . $jsonqapi->obtained;
            }

            $SQL = $wpdb->prepare("SELECT * FROM $transaction_table WHERE user=%d $additional_query ORDER BY time DESC", $current_user->ID);
            $results = $wpdb->get_results($SQL);
            $this->transaction_result_success = $results;
        }

        public function pickup($jsonqapi)
        {
            global $wpdb;
            $transaction_table = $wpdb->prefix . "post_redemption";

            if (!isset($jsonqapi->redemption_procedure)) throw new Exception("query redemption procedure is missing.", 1001);
            if (!isset($jsonqapi->user_id)) throw new Exception("WPUser id is missing.", 1002);

            $user = intval($jsonqapi->user_id);

            if (intval($jsonqapi->redemption_procedure) === 91) {
                //do the works for the traditional redemption pick up processes
                if (!isset($jsonqapi->step)) throw new Exception("process step is missing.", 1003);
                if (intval($jsonqapi->step) == 1) {
                    if (!isset($jsonqapi->qr)) throw new Exception("QR code is missing.", 1004);
                    $qr = $jsonqapi->qr;
                    $sql = "SELECT * FROM $transaction_table WHERE user=" . $user . " AND (qr_a='" . $qr . "' OR qr_b='" . $qr . "') ";
                    $results = $wpdb->get_row($sql);
                    if (!$results) throw new Exception("This redemption product is not available to you, please try to check out our redemption products first.", 1013);
                    //got the redemption row now
                    $this->transaction_result_success = $results;
                    //end for the first step
                } else if (intval($jsonqapi->step) == 2) {
                    if (!isset($jsonqapi->trace_id)) throw new Exception("the trace ID is missing.", 1011);
                    $get_first_row = $wpdb->prepare("SELECT * FROM $transaction_table WHERE user=%d AND trace_id=%s", $user, $jsonqapi->trace_id);
                    $results = $wpdb->get_row($get_first_row);
                    if (!$results) throw new Exception("redemption failure", 1012);
                    if (intval($results->obtained) == 1) throw new Exception("This redemption has been claimed", 1013);
                    if (Date_Difference::western_time_past_event($results->offer_expiry_date) == 2) throw new Exception("The offer is expired", 1014);
                    //todo: need to build the feature for location trap
                    if ($results->distribution == "DECEN") {
                        //need to verify the location ID
                        $address = $results->address;
                        if (!isset($jsonqapi->handle_mac_address)) throw new Exception("the mac address is missing.", 1015);
                    }

                    $this->transaction_result_success = array(
                        "message" => "successfully redeemed."
                    );
                    //end for the second step
                }
            } else if (intval($jsonqapi->redemption_procedure) === 92) {
                //do the restaurant flow
                if (!isset($jsonqapi->qr)) throw new Exception("the QR code is missing.", 1031);
                if (!isset($jsonqapi->note)) throw new Exception("extra note code is missing.", 1032);

                /**
                 * To retrieve the qr data from the cms server
                 */
                $j_stock_operation = new StockOperation();
                $stock_count_detail = $j_stock_operation->get_count_row_by_qr($jsonqapi->qr);


                /**
                 * got the stock ID and the count ID
                 */
                /*               $get_first_row = $wpdb->prepare("SELECT * FROM $transaction_table WHERE ID=%d", $stock_count_detail->ID);
                                $results = $wpdb->get_row($get_first_row);*/

                $prepared = $wpdb->prepare("SELECT * FROM $transaction_table WHERE stock_id=%d AND obtained=0 AND user=%d",
                    $stock_count_detail->stock_id, $user);

                $result_r = $wpdb->get_row($prepared);
                if (!$result_r) throw new Exception("This redemption is not available to you or it has been redeemed, please try to check out our redemption products first.", 1037);

                //update existing row
                $done = $wpdb->update($transaction_table,
                    array(
                        "obtained" => 1,
                        "action_taken_by" => "RESTAURANT",
                        "claim_time" => current_time('timestamp'),
                    ),
                    array("ID" => $result_r->ID));

                $address = new VendorRequest();
                $terminal_number = $address->get_phone_number_by_address_id($stock_count_detail->location_id);
                //send data to the push notification
                $this->send_sms($terminal_number);
            }
        }

        private function send_smss()
        {
            SMSmd::InitiateSMS(array(
                "number" => intval(get_user_meta($this->user_id, "sms_number", true)),
                "content" => "redemption is done"
            ));
        }

        private function send_sms($number)
        {
            SMSmd::InitiateSMS(array(
                "number" => $number,
                "content" => "redemption is done"
            ));
        }

        public function get_redemption_count($stock_id)
        {
            global $wpdb;
            $transaction_table = $wpdb->prefix . "post_redemption";
            $getcount = $wpdb->prepare("SELECT COUNT(*) FROM $transaction_table WHERE stock_id=%d", $stock_id);
            $t = $wpdb->get_var($getcount);
            return !$t ? 0 : intval($t);
        }
    }
}