<?php
/**
 * Created by HKM PhpStorm.
 * User: Heskemo Oyen The Developer God
 * Date: 13年12月9日
 * Time: 下午2:44
 */
if (!class_exists('inno_db')):
    class inno_db
    {
        /**
         * for the staff android application
         * @param $string_md5
         * @return int
         */
        private static function isRedeemed($string_md5)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE verification_md5=%s', $string_md5);
            $mobile_code = $wpdb->get_row($prepared);

            // print_r($prepared);
            if (!$mobile_code) {
                // record not found
                $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE emailcode=%s', $string_md5);
                $email_code = $wpdb->get_row($prepared);
                if (!$email_code) return -1;
                $time_check = time_hkm_cal::western_time_past_event($email_code->offer_expiry_date);
                if ($time_check == 2) return 2;

                $device_or_email = 3;
                $claimed = $email_code->claimed;
            } else {
                //this product is unclaimed and then we will check the expiry date now
                $time_check = time_hkm_cal::western_time_past_event($mobile_code->offer_expiry_date);
                if ($time_check == 2) return 2;

                $device_or_email = 4;
                $claimed = $mobile_code->claimed;
            }

            if ($claimed == 1) {
                // this is already claimed.
                return 1;
            } else {
                //  assume claim is 0
                //3:from the email
                //4:from the device
                return $device_or_email;
            }
        }

        /**
         *
         * @param $input_hash_code
         * @return mixed
         * @throws Exception
         */
        protected static function check_redemption_status($input_hash_code)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE verification_md5=%s', $input_hash_code);
            $mobile_code = $wpdb->get_row($prepared);

            // print_r($prepared);
            if (!$mobile_code) {
                // record not found
                $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE emailcode=%s', $input_hash_code);
                $email_code = $wpdb->get_row($prepared);
                if (!$email_code) {
                    throw new Exception("Record not found", 1001);
                }
                $time_check = time_hkm_cal::western_time_past_event($email_code->offer_expiry_date);

                if ($time_check == 2) {
                    throw new Exception("Too late, this benefit offer is expired.", 1005);
                }
                $device_or_email = 3;
                $claimed = $email_code->claimed;
            } else {
                //this product is unclaimed and then we will check the expiry date now
                $time_check = time_hkm_cal::western_time_past_event($mobile_code->offer_expiry_date);
                if ($time_check == 2) {
                    throw new Exception("Check the date, this benefit offer period is already over.", 1005);
                }
                $device_or_email = 4;
                $claimed = $mobile_code->claimed;
            }
            if ($claimed == 1) {
                // this is already claimed.
                throw new Exception("This benefit is taken by the customer already.", 1003);
            } else {
                //  assume claim is 0
                //3:from the email
                //4:from the device
                if ($device_or_email == 3) {
                    return intval($email_code->transaction_id);
                }
                if ($device_or_email == 4) {
                    return intval($mobile_code->transaction_id);
                }
            }
        }

        /**
         *
         * for the staff android application
         *
         * @param $userid
         * @param $string_md5
         * @param bool $redeem_action
         * @return array|bool
         */
        protected function getVerified($userid, $string_md5, $redeem_action = false)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE verification_md5=%s', $string_md5);
            $r = $wpdb->get_row($prepared);
            //  echo $prepared;
            //$wpdb->num_rows
            if ($r == 0) {
                return false;
            } else {
                if ($redeem_action) {
                    //$prepared = $wpdb->prepare('SELECT * FROM $this->tbe WHERE verification_md5=%s AND fbid=%d', $userid, $string_md5);
                    // $r = $wpdb->get_row($prepared);
                    $prepared = $wpdb->prepare("
                            UPDATE cms_transaction_redeem
                            SET claimed = 1
                            WHERE verification_md5 = %s
                            ", $string_md5);
                    $r = $wpdb->query($prepared);

                    return array(
                        "id" => $r->stockid,
                        "claimed" => $r->claimed
                    );
                } else {
                    return array(
                        "title" => get_the_title($r->stockid),
                        "id" => $r->stockid,
                        "expiry" => $r->offer_expiry_date,
                        "transact" => $r->transaction_id,
                        "hash" => $r->verification_md5,
                        "emailhash" => $r->emailcode,
                        "claimed" => $r->claimed
                    );
                }

            }
        }

        /**
         * for the staff android application
         * to verify the data set of the redemption code
         * assume the code is valid
         */
        protected function get_row_redemption_by_code($string_md5)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE verification_md5=%s', $string_md5);
            $object = $wpdb->get_row($prepared);
            $user_id = api_account::get_user_id_by_fbid($object->fbid);
            $object->id_code = get_user_meta($user_id, 'id4digit', TRUE);
            $object->user_name = api_account::get_id_name($user_id);
            $object->stock_name = get_the_title($object->stockid);

            unset($object->claimed);
            unset($object->verification_md5);
            unset($object->handler_mac_address);
            return $object;
        }

        /**
         * for the staff android application
         * get verify code for the second step
         * to verify the data set of the redemption code
         * assume the code is valid
         */
        protected function get_redemption_detail_for_step2($str_md5_32, $method_code)
        {
            //3:from the email
            //4:from the device

            global $wpdb;

            if ($method_code == 3)
                $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE emailcode=%s', $str_md5_32);
            if ($method_code == 4)
                $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE verification_md5=%s', $str_md5_32);

            $object = $wpdb->get_row($prepared);
            $user_id = api_account::get_user_id_by_fbid($object->fbid);
            $object->id_code = get_user_meta($user_id, 'id4digit', TRUE);
            $object->user_name = api_account::get_id_name($user_id);
            $object->stock_name = get_the_title($object->stockid);

            if ($method_code == 3) {
                $object->ver_on_2_step = $object->verification_md5;
                $object->instruction = "please scan the QR code from the phone";
                $object->instruction_code = "4";
            }

            if ($method_code == 4) {
                $object->ver_on_2_step = $object->emailcode;
                $object->instruction = "please scan the QR code from the email";
                $object->instruction_code = "3";
            }

            unset($object->claimed);
            unset($object->verification_md5);
            unset($object->emailcode);
            unset($object->handler_mac_address);
            return $object;
        }

        protected function get_email_or_phone($transaction_id, $hash)
        {
            global $wpdb;
            $prep = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE transaction_id=%d AND verification_md5=%s', $transaction_id, $hash);
            if ($wpdb->get_row($prep)) {
                return 'verification_md5';
            } else {
                return 'emailcode';
            }
            /*  $prep = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE transaction_id=%d AND emailcode=%s', $transaction_id, $hash);
              if($wpdb->get_row($prep)){

              }*/
        }


        /**
         * this is the second step of the verification
         * machine redemption code
         * this will be the replacement of redeem_v2
         * @param $code
         * @param $action_code
         * @param $mac_address
         * @return array
         * @throws Exception
         */
        protected function redeem_new_v2($code, $action_code, $mac_address)
        {
            global $wpdb;

            try {
                $transaction_id = self::check_redemption_status($code);

                $error = self::verify_gift_with_from_given_mac_address($code, $mac_address, $transaction_id);
                if (!$error) {
                    throw new Exception("unable to handle this request with this device", 1010);
                }

                $email_or_phone = self::get_email_or_phone($transaction_id, $code);

                /**
                 * end of the coding block here
                 */
                $prep = $wpdb->prepare("
                            UPDATE cms_transaction_redeem
                            SET claimed=1,
                                handler_mac_address=%s,
                                claim_time=NOW(),
                                action_taken_by=%s
                            WHERE " . $email_or_phone . "=%s", $mac_address, $action_code, $code);

                $r = $wpdb->query($prep);

                return array("content" => self::get_row_redemption_by_code($code), "result" => 1, "msg" => "success");

            } catch (Exception $e) {
                throw $e;
            }
        }

        /**
         * this is the second step of the verification
         * machine redemption code
         * @param $code
         * @param $verify_method
         * @param $mac_address
         * @return array
         * @throws Exception
         */
        protected function redeem_v2($code, $verify_method, $mac_address)
        {
            if (strlen(trim($code)) != 32)
                throw new Exception("Please find the right QR code and try it again.", 1002);
            $redeem_status_code = intval(self::isRedeemed($code));
            if ($redeem_status_code == -1) {
                throw new Exception("record not found", 1001);
            } else if ($redeem_status_code == 1) {
                throw new Exception("This product is already redeemed.", 1003);
            } else if ($redeem_status_code == 3 || $redeem_status_code == 4) {
                global $wpdb;
                //handler_mac_address
                //3:from the email
                //4:from the device
                //$action_code = "NA";
                if ($verify_method == 5) {
                    $action_code = "ID";
                } else {
                    $action_code = "QR";
                }
                if ($redeem_status_code == 4 && $verify_method == $redeem_status_code || $redeem_status_code == 4 && $verify_method == 5) {

                    /**
                     * adding location base control
                     */
                    try {
                        $tran_id = self::check_redemption_status($code);
                        $error = self::verify_gift_with_from_given_mac_address($code, $mac_address, $tran_id);
                        if (!$error) {
                            throw new Exception("unable to handle this request", 1010);
                        }
                    } catch (Exception $e) {
                        throw $e;
                    }
                    /**
                     * end of the coding block here
                     */
                    $prepared = $wpdb->prepare("
                            UPDATE cms_transaction_redeem
                            SET claimed=1,
                                handler_mac_address=%s,
                                claim_time=NOW(),
                                action_taken_by=%s
                            WHERE verification_md5=%s", $mac_address, $action_code, $code);

                    $r = $wpdb->query($prepared);
                    return array("content" => self::get_row_redemption_by_code($code), "result" => 1, "msg" => "success");
                } else if ($redeem_status_code == 3 && $verify_method == $redeem_status_code || $redeem_status_code == 3 && $verify_method == 5) {

                    /**
                     * adding location base control
                     */
                    try {
                        $tran_id = self::check_redemption_status($code);
                        $error = self::verify_gift_with_from_given_mac_address($code, $mac_address, $tran_id);
                        if (!$error) {
                            throw new Exception("unable to handle this request", 1010);
                        }
                    } catch (Exception $e) {
                        throw $e;
                    }
                    /**
                     * end of the coding block here
                     */
                    $prepared = $wpdb->prepare("
                            UPDATE cms_transaction_redeem
                            SET claimed=1,
                                handler_mac_address=%s,
                                claim_time=NOW(),
                                action_taken_by=%s
                            WHERE email_code=%s", $mac_address, $action_code, $code);
                    $r = $wpdb->query($prepared);
                    inno_log_db::log_stock_system(-1, 101, "Successful redemption on mac:" . $mac_address . ", transaction ID:" . $r->transaction_id);
                    return array("content" => self::get_row_redemption_by_code($code), "result" => 1, "msg" => "success");
                } else {
                    if ($verify_method == 3) {
                        // - 3
                        throw new Exception("Pleaes verify with the email QR code.", 1006);
                    } else {
                        // - 4
                        throw new Exception("Pleaes verify with the device (android or iphone) app QR code. method code:" . $verify_method, 1007);
                    }
                }
            } else if ($redeem_status_code == 2) {
                throw new Exception("Too late, this product offer is expired.", 1005);
            } else {
                throw new Exception("unknown error found with the redeem code :" . $redeem_status_code, 1004);
            }
        }

        /**
         * for the staff android application
         * this is the first step of the verification
         * just to read the bar but no action is taken
         * @param $code
         * @return mixed
         * @throws Exception
         */
        protected function redeem_V3($code)
        {
            if (strlen(trim($code)) != 32)
                throw new Exception("Please find the right QR code and try it again. code:" . $code, 1002);
            $redeem_status_code = intval(self::isRedeemed($code));
            if ($redeem_status_code == -1) {
                throw new Exception("There is no record not found", 1001);
            } else if ($redeem_status_code == 1) {
                throw new Exception("This product is already redeemed.", 1003);
            } else if ($redeem_status_code == 3 || $redeem_status_code == 4) {
                /*try {
                    $error = self::verify_gift_with_from_given_mac_address($code, $mac_address);
                    if (!$error) {
                        throw new Exception("unable to handle this request", 1010);
                    }
                } catch (Exception $e) {
                    throw $e;
                }
                */
                return array("content" => self::get_redemption_detail_for_step2($code, $redeem_status_code), "result" => 1, "msg" => "success");
            } else if ($redeem_status_code == 2) {
                throw new Exception("Too late, this product offer is expired.", 1005);
            } else {
                throw new Exception("unknown error found with the redeem code :" . $redeem_status_code, 1004);
            }
        }


        /**
         * assume db is already redeem
         * @param $string_md5
         * @return mixed
         */
        /*

        protected function to_verification_md5($string_md5)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT verification_md5 FROM cms_transaction_redeem WHERE verification_md5=%s OR email_code=%s', $string_md5, $string_md5);
            $var_code = $wpdb->get_var($prepared);
            return $var_code;
        }

        */
        /**
         * @param $string_md5
         * @return mixed
         */
        public static function get_transaction_row_by_email_secret($string_md5)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT transaction_id FROM cms_transaction_redeem WHERE emailcode=%s', $string_md5);
            $var_code = $wpdb->get_var($prepared);
            return $var_code;
        }

        public static function get_transaction_row_by_machine_secret($string_md5)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT transaction_id FROM cms_transaction_redeem WHERE verification_md5=%s', $string_md5);
            $var_code = $wpdb->get_var($prepared);
            return $var_code;
        }

        /**
         * this is the transaction of addition new redemption record to the db from the submission of the post form
         * @param $args
         * @return bool
         * @throws Exception
         */
        protected function setNewTransaction($args)
        {
            extract($args);
            // if (empty($userid) || empty($productid) || empty($address)) return false;
            global $wpdb;
            $date = new DateTime();
            $new_redemption_key = md5($date->getTimestamp() . $facebook_id . $product_id . $address);

            //

            /* $offerexp = get_post_meta($product_id, 'inn_exp_date', true);

             if (empty($offerexp)) {
                 //  $date->modify('next month');

             } else {
                 $date = new DateTime($offerexp);
             }*/
            $n = intval(get_post_meta($product_id, 'rdays', true));
            $day = $n == 1 || $n == -1 ? "day" : "days";
            $date->modify('+' . $n . ' ' . $day);
            //  "exp_date";
            $enter_data_object = array(
                'stockid' => intval($product_id),
                'fbid' => $facebook_id,
                'payment_done' => 1,
                'verification_md5' => $new_redemption_key,
                'country' => $country,
                'claim_address' => $address,
                'emailcode' => $emailcode,
                'offer_expiry_date' => $date->format('Y-m-d'),
                'cost_spent' => $vcoin
            );
            $wpdb->insert("cms_transaction_redeem", $enter_data_object);
            if ($wpdb->insert_id > 0) {
                return $wpdb->insert_id;
            } else {
                throw new Exception("fail to insert redemption record cased : " . json_encode($enter_data_object), 101);
                return false;
            }
        }

        /**
         * @param int $address_id
         * @param int $vendor_id
         * @return string
         */
        public static function get_product_loc_count_field_name_by_address_id($address_id = 0, $vendor_id = 0)
        {
            global $wpdb, $current_user;
            $prep = "SELECT * FROM " . $wpdb->postmeta . "  WHERE post_id=" . intval($vendor_id) . " AND meta_key LIKE 'loc_%' AND meta_value=" . intval($address_id);
            $row = $wpdb->get_row($prep);
            //   $location_order = substr($row->meta_key, 4, -1);
            preg_match('/^\w+(\d+)$/U', $row->meta_key, $match);
            $location_order = (int)$match[1];
            $name_loc_field = 'loc_' . $location_order . '_count';
            // inno_log_db::log_redemption_error(intval($current_user->ID) == 0 ? -1 : $current_user->ID, 2071241, $prep);
            return $name_loc_field;
        }

        /**
         * used for the product gift redemption process
         * @param $address_id
         * @param $product_id
         * @return bool
         */
        protected static function check_product_decentralized_in_stock($address_id, $product_id)
        {
            $vendor_wp_post_id = get_post_meta($product_id, 'innvendorid', true);
            $product_count_field_name = self::get_product_loc_count_field_name_by_address_id($address_id, $vendor_wp_post_id);
            $number_available = intval(get_post_meta($product_id, $product_count_field_name, true));
            if ($number_available > 1) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * @param $product_id
         * @return bool
         */
        protected static function check_product_perpetual_in_stock($product_id)
        {
            $count = get_post_meta($product_id, 'central_count', true);
            if (intval($count) > 1) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * get a list of pending delivering product form the list
         * @param $userid
         * @param int $claimed
         * @return bool
         */
        protected function getListingPendingDelivery($userid, $claimed = 0)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE fbid=%s AND claimed=%d ORDER BY %s', $userid, $claimed, 'time');
            $rprint = $wpdb->get_results($prepared);
            // echo $wpdb->num_rows;
            if ($wpdb->num_rows == 0) {
                return false;
            } else {
                //  print_r($rprint);
                return $rprint;
            }
        }

        /**
         * get the transaction list for the user
         * @param $user_id
         * @return mixed
         */
        protected function get_transaction_list_by_user($user_id)
        {
            global $wpdb;
            $fbid = api_account::get_fb_id_by_user_id($user_id);
            $prep = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE fbid=%d ORDER BY %s', $fbid, 'time');
            return $wpdb->get_results($prep);
        }

        /**
         * working on the redemption table products
         * @return array|bool
         */
        protected function get_listing_simple()
        {
            global $wpdb;
            // $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem ORDER BY DATE(time) DESC LIMIT 0, 10', 'time');
            $r = $wpdb->get_results('SELECT * FROM cms_transaction_redeem ORDER BY DATE(time) DESC LIMIT 0, 10');
            if ($wpdb->num_rows == 0) {
                return false;
            } else {
                $i = 0;
                $rg = array();
                foreach ($r as $key => $row) {
                    $obje = array(
                        "title" => get_the_title($row->stockid)
                    );
                    $rg[$i] = array_merge((array)$row, $obje);
                    $i++;
                }
                return array_values($rg);
            }
        }

        /**
         *  working on the redemption table products
         * @param $fbid
         * @return bool
         */
        protected function get_listing_by_fbid($fbid)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE fbid=%s ORDER BY %s', $fbid, 'time');
            $rprint = $wpdb->get_results($prepared);
            if ($wpdb->num_rows == 0) {
                return false;
            } else {
                return $rprint;
            }
        }

        /**
         *  working on the redemption table products
         * @param $claim
         * @return bool
         */
        protected function get_listing_by_claim($claim)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE claimed=%d ORDER BY %s', $claim, 'time');
            $rprint = $wpdb->get_results($prepared);
            if ($wpdb->num_rows == 0) {
                return false;
            } else {
                return $rprint;
            }
        }

        /**
         * video redemption ID
         * @param $address_id
         * @return array
         */
        protected static function get_vendor_ids_by_address_id($address_id)
        {
            global $wpdb;
            $prep = $wpdb->prepare("
                    SELECT DISTINCT(post_id),  meta_key, meta_value
                    FROM $wpdb->postmeta
                    WHERE meta_key
                    IN (
                     'loc_1', 'loc_2', 'loc_3', 'loc_4', 'loc_5',
                     'loc_6', 'loc_7', 'loc_8', 'loc_9', 'loc_10'
                    )
                    AND meta_value = %s
                    group by post_id
            ", $address_id);

            $result = $wpdb->get_results($prep);
            $output = array();
            if ($result) {
                foreach ($result as $ob) {
                    //post id: vendor id
                    $output[] = $ob->post_id;
                }
            }
            return $output;
        }

        protected static function get_all_addresses()
        {
            global $wpdb;
            $result = $wpdb->get_results("SELECT * FROM cms_stock_address ORDER BY date DESC");
            return $result;
        }

        /**
         * retrieve the address object from ID
         * @param $address_id
         * @param string $lang
         * @return mixed
         */
        protected static function get_address_object($address_id, $lang = 'zh')
        {
            global $wpdb;
            $prep = $wpdb->prepare("SELECT * FROM cms_stock_address WHERE ID=%d", $address_id);
            $result = $wpdb->get_row($prep);
            return $result;
        }


        /**
         *  change the redemption status by staff manually and this will be logged on the system automatically
         * @param $hash
         * @param $update_claim
         * @return string
         */
        protected function change_redemption_status($hash, $update_claim)
        {
            global $wpdb;
            $prepared = $wpdb->prepare("
                            UPDATE cms_transaction_redeem
                            SET
                            claimed = %d,
                            action_taken_by='ADMIN'
                            WHERE verification_md5 = %s
                            ", $update_claim, $hash);
            $r = $wpdb->query($prepared);

            return $r;
        }

        /**
         * add record on staff management log on admin changes
         * @param $claim
         * @param $hash
         * @return bool
         */
        protected function action_log_claim_reward($claim, $hash)
        {
            //imusicworld_reward_mgm_log
            $current_user = wp_get_current_user();
            $current_user->ID;
            $kp = array(
                'user' => $current_user->ID,
                'comments' => $current_user->display_name . " changes redemption status to " . $claim . " with hash ID of " . $hash,
            );
            global $wpdb;
            $wpdb->insert("imusicworld_reward_mgm_log", $kp);
            return true;
        }

        /**
         * check if the email is already verified
         * @param $userid
         * @return bool
         */
        public static function isEmailVerified($userid)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT email_verified FROM ' . $wpdb->users . ' WHERE ID=%d', $userid);
            $rprint = $wpdb->get_var($prepared);
            return $rprint == 'Y';
        }

        /**
         * handle email verification as a part of activation check
         * @param $userid
         * @return string
         */
        protected static function set_activation_key($userid)
        {
            global $wpdb;
            $date = new DateTime();
            $new_redemption_key = md5($date->getTimestamp() . $userid);
            $hash = base64_encode(hash('sha256', $new_redemption_key, true));
            $hash = rtrim(strtr(base64_encode($hash), '+/', '-_'), '=');

            $prepared = $wpdb->prepare("
                            UPDATE " . $wpdb->users . "
                            SET user_activation_key = %s
                            WHERE ID=%d
                            ", $hash, $userid);
            $r = $wpdb->query($prepared);
            return $hash;
        }

        /**
         * check action handled for email verifications only
         * @param $rgid
         * @param $email
         * @param $hash
         * @return int
         */
        public static function email_action_verify($rgid, $email, $hash)
        {
            global $wpdb;
            $table_lead = $wpdb->prefix . "rg_lead";
            $table_lead_detail = $wpdb->prefix . "rg_lead_detail";
            $prepared = $wpdb->prepare('SELECT date_created FROM $table_lead WHERE id=%d', $rgid);
            $time_ = $wpdb->get_var($prepared);

            $prepared = $wpdb->prepare('SELECT value FROM $table_lead_detail WHERE field_number=1 AND lead_id=%d', $rgid);
            $email_ = $wpdb->get_var($prepared);

            if ($email != $email) {
                //email verification: email not matched
                return 995126;
            }

            $prepared = $wpdb->prepare('SELECT value FROM $table_lead_detail WHERE field_number=3 AND lead_id=%d', $rgid);
            $hkidname = $wpdb->get_var($prepared);
            if (!$hkidname) {
                //email verification: ID name not found
                return 995027;
            }
            $prepared = $wpdb->prepare('SELECT value FROM $table_lead_detail WHERE field_number=4 AND lead_id=%d', $rgid);
            $hkidcode = $wpdb->get_var($prepared);
            if (!$hkidcode) {
                //email verification: HKID not found
                return 995138;
            }
            $prepared = $wpdb->prepare('SELECT value FROM $table_lead_detail WHERE field_number=5 AND lead_id=%d', $rgid);
            $password = $wpdb->get_var($prepared);
            if (!$password) {
                //the password code does not match
                return 995165;
            }
            $prepared = $wpdb->prepare("SELECT ID FROM $wpdb->users WHERE user_activation_key=%s", $hash);
            $user_id_ = $wpdb->get_var($prepared);

            //  echo "\n";
            /* print_r(array(
                 "lead_id" => $rgid,
                 "t" => $time_,
                 "e1" => $email_,
                 "e2" => $email,
                 "hash" => $hash,
                 "user_id" => $user_id_
             ));*/
            if ($user_id_) {
                if (!empty($password)) {
                    $hash = wp_hash_password($password);
                    $prepared = $wpdb->prepare("
                  UPDATE $wpdb->users SET
                         user_pass=%s,
                         email_verified='Y',
                         user_email=%s,
                         user_activation_key=''
                  WHERE ID=%d", $hash, $email_, $user_id_);
                } else {
                    $prepared = $wpdb->prepare("
                  UPDATE $wpdb->users SET
                         email_verified='Y',
                         user_email=%s,
                         user_activation_key=''
                  WHERE ID=%d", $email_, $user_id_);
                }

                $r = $wpdb->query($prepared);
                //http://codex.wordpress.org/Function_Reference/wp_update_user
                if ($hkidname && $hkidcode) {
                    if (!empty($hkidname)) {
                        $name_d = explode(" ", $hkidname);
                        wp_update_user(
                            array('ID' => $user_id_,
                                'first_name' => $name_d[0],
                                'last_name' => $name_d[1]
                            ));
                        update_user_meta($user_id_, 'id4digit', $hkidcode);
                    }
                }
                return 1;
            } else {
                //the specific user did not found
                return 995125;
            }

        }

        /**
         *
         * @param array $args
         * @return mixed
         */
        public static function manager_stock_normal(array $args = NULL)
        {
            global $wpdb;
            $state = "SELECT * FROM cms_transaction_redeem";
            if ($args == NULL) {
                $state = 'SELECT * FROM cms_transaction_redeem ORDER BY claim_time DESC';
            } else {
                if (isset($args['query'])) {
                    $state .= " WHERE " . $args['query'];
                }
                if (isset($args['sort'])) {
                    if ($args['sort'] == "claim_time") {
                        $state .= " ORDER BY claim_time DESC";
                    }
                    /*    if ($args['sort'] == "claim_time") {
                            $state .= " ORDER BY claim_time DESC";
                        }
                        if ($args['sort'] == "claim_time") {
                            $state .= " ORDER BY claim_time DESC";
                        }*/
                }
                if (isset($args['sort_time_claim'])) {
                    $state .= " ORDER BY claim_time DESC";
                }
            }
            $state1 = 'SELECT * FROM cms_transaction_redeem WHERE claim_address=%s';
            $state2 = 'SELECT * FROM cms_transaction_redeem ORDER BY claim_time DESC';
            $state3 = 'SELECT * FROM cms_transaction_redeem WHERE country=%s AND claim_address=%s';
            $state4 = 'SELECT * FROM cms_transaction_redeem WHERE country=%s ORDER BY claim_time DESC';
            $prepared = $wpdb->prepare($state);
            $r = $wpdb->get_results($prepared);
            // echo $prepared;
            if (is_wp_error($r)) {
                echo $r->get_error_message();
            }
            //   print_r($r);
            return $r;
        }


        /**
         * check if the post type is matching to the given param
         * @param $post_id
         * @param null $type
         * @return bool
         */
        public static function check_post_type($post_id, $type = null)
        {
            global $wpdb;
            $pre = $wpdb->prepare("SELECT * FROM " . $wpdb->posts . " WHERE ID=%d AND post_type=%s", $post_id, $type);
            $result = $wpdb->get_row($pre);
            return $result;
        }

        /**
         * check the post status for specific ID
         * @param $post_id
         * @param string $status
         * @return bool
         */
        public static function check_post_status($post_id, $status = 'publish')
        {
            global $wpdb;
            $pre = $wpdb->prepare("SELECT * FROM " . $wpdb->posts . " WHERE ID=%d AND post_status=%s", $post_id, $status);
            $result = $wpdb->get_row($pre);
            return $result;
        }

        /**
         * check of the coupons is sufficient for the user to redeem
         *
         * @param $coupon_id
         * @return bool
         */
        public static function check_sufficient_coupons($coupon_id)
        {
            global $wpdb;
            $pre = $wpdb->prepare("SELECT count(*) FROM cms_transaction_coupon
             WHERE coupon_id=%d AND redeem_agent=-1", intval($coupon_id));
            $result = $wpdb->get_var($pre);
            return intval($result) > 1;
        }

        /**
         * check if the user has enough vcoin for the price of the given item ID
         * @param null $item_id
         * @param null $user_id
         * @param bool $boolean_output
         * @return bool|int
         */
        protected static function check_sufficient_vcoin_for_item($item_id = null, $user_id = null, $boolean_output = false)
        {
            if ($user_id == null) {
                $cu = wp_get_current_user();
                $user_id = $cu->ID;
            }
            $cost = intval(get_post_meta($item_id, 'v_coin', true));
            $onhand = db_user_account::get_vcoin($user_id);


            //currently there is a bug needs to be fixed from get update coins

            if ($boolean_output) {
                $can = intval($onhand) >= intval($cost);
            } else {
                $can = intval($onhand) >= intval($cost) ? 1 : 0;
            }


            return $can;
        }

        /**
         * check if the mac address has an record in our system
         * @param $mac_address
         * @return bool
         */
        protected static function check_store_manager_device($mac_address)
        {
            global $wpdb;
            $managers = self::request_stock_manger_query(array(), true);
            foreach ($managers as $manager) {
                $prep = $wpdb->prepare('
                SELECT *
                FROM ' . $wpdb->usermeta . '
                WHERE user_id=%d AND meta_key="mac_id" ', $manager);
                $row = $wpdb->get_row($prep);
                if ($row->meta_value == $mac_address) {
                    return $manager;
                }
            }
            return false;
        }

        /**
         * do the checking if this user has been checked for this product previously
         * @param $coupon_id
         * @param $user_id
         * @return mixed
         */
        public static function check_has_redemption_previously($coupon_id, $user_id)
        {
            global $wpdb;
            $prep = $wpdb->prepare('
                SELECT * FROM cms_transaction_coupon
                WHERE redeem_agent=%d AND coupon_id=%d', $user_id, $coupon_id);
            $row = $wpdb->get_row($prep);
            return $row;
        }

        /**
         * the actual redemption mechanism for processing coupon
         * @param $user_id
         * @param $coupon_id
         * @return bool
         */
        public static function do_claim_coupon($user_id, $coupon_id)
        {
            global $wpdb;


            if (!self::check_sufficient_coupons($coupon_id)) {
                //there more no coupons can be redeem
                return false;
            } else {
                $coin_cost = intval(get_post_meta($coupon_id, "v_coin", true));


                $date = new DateTime();
                $n = intval(get_post_meta($coupon_id, 'rdays', true));
                $day = $n == 1 || $n == -1 ? "day" : "days";
                $date->modify('+' . $n . ' ' . $day);
                $exp = $date->format('Y-m-d');
                $time = current_time('mysql');
                //   inno_log_db::log_redemption_error(-m, 342422, "exp dat set:" . $exp);

                $pre = $wpdb->prepare("SELECT ID FROM cms_transaction_coupon
             WHERE coupon_id=%d AND redeem_agent=-1 LIMIT 0, 1", $coupon_id);
                $available_coupon_id = intval($wpdb->get_var($pre));

                $prepared = $wpdb->prepare("
                 UPDATE cms_transaction_coupon
                 SET
                 redeem_agent=%d,
                 coin_spent=%d,
                 claim_time=%s,
                 exp_date=%s
                 WHERE ID=%d",
                    $user_id, $coin_cost,
                    $time, $exp,
                    $available_coupon_id);
                $r = $wpdb->query($prepared);

                inno_log_db::log_redemption_error(-1, 342422, "row:" . $prepared . "<br>" . print_r($r, true));

                if ($r) {
                    return self::get_coupon_record($user_id, $time, $coupon_id);
                } else {
                    return false;
                }

                //   $find_row = $wpdb->get_row($prepared);

            }
        }

        protected static function get_coupon_record($user_id, $time, $coupon_id)
        {
            global $wpdb;
            $prepared = $wpdb->prepare("
                            SELECT * FROM cms_transaction_coupon
                            WHERE
                            redeem_agent=%d AND
                            coupon_id=%d AND
                            claim_time=%s
                            ", $user_id, $coupon_id, $time);
            $find_row = $wpdb->get_row($prepared);
            return $find_row;
        }

        /**
         * look up the transaction record with the required information
         * @param $user_id
         * @param $coupon_id
         * @param $code
         * @return mixed
         */
        protected static function find_coupon_record($user_id, $coupon_id, $code)
        {
            global $wpdb;
            $prepared = $wpdb->prepare("
                            SELECT * FROM cms_transaction_coupon
                            WHERE
                            redeem_agent=%d AND
                            coupon_id=%d AND
                            client_redeem_code=%s
                            ", $user_id, $coupon_id, $code);
            $find_row = $wpdb->get_row($prepared);
            // inno_log_db::log_redemption_error(-1, 1010101, "mustach_engine context" . print_r($find_row, true) . "<br>" . $prepared);
            return $find_row;
        }

        protected static function undo_claim_coupon($ID)
        {
            global $wpdb;
            $prepared = $wpdb->prepare("
                            UPDATE cms_transaction_coupon
                            SET
                            redeem_agent = '',
                            coin_spent='',
                            claim_time='',
                            exp_date=''
                            WHERE ID = %d
                            ", $ID);

            $updated = $wpdb->query($prepared);
            return true;
        }

        /**
         * string set address
         * @param string $lang
         */
        protected static function set_address($lang = 'zh')
        {
            global $wpdb;

            $prepared = $wpdb->prepare("
                            UPDATE cms_stock_address
                            SET
                            redeem_agent = %d,
                            coin_spent=%d,
                            claim_time=CURRENT_TIMESTAMP()

                            WHERE ID = %d
                            ", '', '', '');
        }


        /**
         * a request from getting users by specific condition
         * @param array $meta_query
         * @param bool $user_id_only
         * @return array|bool
         */
        protected static function request_stock_manger_query($meta_query = array(), $user_id_only = false)
        {
            // prepare arguments

            if (count($meta_query) > 0) {
                $args = array(
                    'role' => 'store_manager',
                    'fields' => 'all_with_meta',
                    // order results by display_name
                    // 'orderby' => 'display_name',
                    // check for two meta_values
                    'meta_query' => $meta_query
                );
            } else {
                $args = array(
                    'role' => 'store_manager',
                );
            }
            // Create the WP_User_Query object
            $loc_users = new WP_User_Query($args);
            // Check for results
            $return_list = array();
            if (!empty($loc_users->results)) {
                if ($loc_users->total_users > 0) {
                    foreach ($loc_users->results as $person) {
                        // get all the user's data
                        // $author_info = get_userdata($person->ID);
                        // echo '<li>' . $author_info->first_name . ' ' . $author_info->last_name . '</li>';
                        if ($user_id_only) {
                            $return_list[] = $person->ID;
                        } else {
                            $return_list[$person->ID] = array(
                                'id' => $person->ID,
                                'name' => $person->display_name
                            );
                        }

                    }
                    // inno_log_db::log_stock_system(-1, 93200, "people found : " . $loc_users->total_users . " mac id is ");
                    return $return_list;
                } else {

                    return false;
                }
                // loop trough each author
                //  inno_log_db::log_stock_system(-1, 932001, printf($persons, true) . "stock id is " . $stock_id . " mac id is " . $mac_address);

            } else {
                return false;
            }
        }

        /**
         * is the location has that gift location?
         * @param $hash
         * @param $mac_address
         * @param $transaction_id
         * @return bool
         * @throws Exception
         */
        protected static function verify_gift_with_from_given_mac_address($hash, $mac_address, $transaction_id)
        {
            global $wpdb;
            //$stock_id = self::find_stock_id_by_hash($hash);

            $only_user_id = self::check_store_manager_device($mac_address);
            if (!$only_user_id) {
                inno_log_db::log_stock_system(-1, 1079, "unauthorized device attempted to redeem the benefit. Device:" . $mac_address);
                throw new Exception("Sorry, this is an unauthorized device.", 7011);
            } else {
                $prep = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE transaction_id=%d', $transaction_id);
                $row = $wpdb->get_row($prep);
                $address_location_code = $row->claim_address;
                $vendor_id = VendorRequest::get_vendor_by_product_id($row->stockid);
                $location_address_id = get_user_meta($only_user_id, 'vendor_loc_center', true);

                //   $ven_ids = self::get_vendor_ids_by_address_id($location_address_id);
                $message = "this user has the mac address to request redemption system:" . $mac_address . "<br>location address ID from this staff:" . $location_address_id .
                    "<br>vendor id:" . $vendor_id['name'];


                if ($address_location_code == 'loc_centralized') {
                    $loc_ids = VendorRequest::retrieve_address_id_list_by_vendor($vendor_id['wp_post_id']);

                    $message .= "<br>addresses comparision:" . print_r($loc_ids, true) . ":" . $vendor_id['wp_post_id'];
                    inno_log_db::log_stock_system($only_user_id, 7014, $message);

                    if (!in_array($location_address_id, $loc_ids)) {
                        //debug     throw new Exception("You are not at the right location to redeem this product!" . print_r($loc_ids, true) . " : " . $location_address_id, 7012);
                        throw new Exception("You are not at the right location to redeem this benefit!", 7012);
                    } else {
                        inno_log_db::log_stock_system(-1, 93202, "success redemption. detail{ location : " . $address_location_code . " on ID = " . $transaction_id . "}");
                        return true;
                    }
                } else if (intval($address_location_code) > -1) {
                    // inno_log_db::log_stock_system(-1, 93200, "people found : " . $user_id . " as the user");
                    $message .= "<br>product :" . $vendor_id['wp_post_id'];
                    $message .= "success-failure:" . $location_address_id == $address_location_code;
                    inno_log_db::log_stock_system($only_user_id, 7014, $message);
                    if ($location_address_id != $address_location_code) {
                        throw new Exception("You are not at the right location to pick up this benefit!", 7012);
                    } else {
                        inno_log_db::log_stock_system(-1, 93201, "success redemption. detail{ location : " . $address_location_code . " on ID = " . $transaction_id . "}");
                        return true;
                    }
                } else {
                    inno_log_db::log_stock_system(-1, 93201, "old redemption {location : " . $address_location_code . " on ID = " . $transaction_id . "}");
                    return true;
                }
            }
        }

        /**
         * simply get the transaction row form the given ID
         * @param $transaction_id
         * @return mixed
         */
        protected static function get_transaction_row($transaction_id)
        {
            global $wpdb;
            $prep = $wpdb->prepare('SELECT * FROM cms_transaction_redeem WHERE transaction_id=%d', $transaction_id);
            $row = $wpdb->get_row($prep);
            return $row;
        }


        /**
         *
         * check email for doubled, yes for double and no for no double
         * @param $email
         * @param $user_id
         * @return bool
         */
        public static function check_email_for_double($email, $user_id)
        {
            global $wpdb;
            $prepared = $wpdb->prepare('SELECT * FROM ' . $wpdb->users . '  WHERE user_email=%s', $email);
            $row = $wpdb->get_row($prepared);
            if ($row) {
                return intval($row->ID) != intval($user_id);
            } else {
                //there is no existing email in the system
                return false;
            }
        }

    }
endif;

