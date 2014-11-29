<?php
defined('ABSPATH') || exit;
/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月8日
 * Time: 下午4:14
 */
if (!class_exists('vcoinBase')) {
    class vcoinBase
    {
        private
            $user_less_coin,
            $user_gain_coin,
            $send_uuid,
            $receive_uuid,
            $amount,
            $reference,
            $transaction_reference;

        /**
         * vcoin action base account
         */
        public function __construct()
        {

        }

        /**
         * @param $uuid
         * @return $this
         */
        public function setSender($uuid)
        {
            $this->send_uuid = $uuid;
            return $this;
        }

        /**
         * @param $uuid
         * @return $this
         */
        public function setReceive($uuid)
        {
            $this->receive_uuid = $uuid;
            return $this;
        }

        /**
         * @param $amount
         * @return $this
         */
        public function setAmount($amount)
        {
            $this->amount = $amount;
            return $this;
        }

        /**
         * @param $reference
         * @return $this
         */
        public function setTransactionReference($reference)
        {
            $this->reference = $reference;
            return $this;
        }

        /**
         * @throws Exception
         */
        public function CommitTransaction()
        {
            if (!isset($this->send_uuid) && !isset($this->user)) throw new Exception("sender not set", 1093);
            if (!isset($this->receive_uuid)) throw new Exception("receiver not set", 1094);
            if (!isset($this->amount)) throw new Exception("amount not set", 1095);
            if (intval($this->amount) <= 0) throw new Exception("invalid amount of coin", 1096);
            if (!isset($this->reference)) throw new Exception("reference not set", 1097);

            if (!isset($this->send_uuid) && isset($this->user_less_coin))
                $this->send_uuid = userBase::getVal($this->user_less_coin->ID, "uuid_key");
            if ($this->send_uuid == "") throw new Exception("less coin user account key is missing.", 1020);

            if (!isset($this->receive_uuid) && isset($this->user_gain_coin))
                $this->receive_uuid = userBase::getVal($this->user_gain_coin->ID, "uuid_key");
            if ($this->receive_uuid == "") throw new Exception("gain coin user account key is missing.", 1020);

            //inno_log_db::log_admin_stock_management(-1,15333303,"eeeee");
            $json = api_handler::curl_post(VCOIN_SERVER . "/api/coin/move/",
                array(
                    "debit" => $this->receive_uuid,
                    "credit" => $this->send_uuid,
                    "ref_code" => $this->reference,
                    "amount" => $this->amount
                ),
                array(
                    CURLOPT_TIMEOUT => 30,
                )
            );

            $res = json_decode($json);
            //unset($uuid);
            unset($json);

            if (intval($res->result) > 0) {
                throw new Exception($res->msg, intval($res->result));
            } else {
                $this->transaction_reference = $res->transid;
            }
        }

        /**
         * @return mixed
         */
        public function get_transaction_reference()
        {
            // while (isset($this->transaction_reference)) {
            return $this->transaction_reference;
            // }
        }


        /**
         * there is only thing we need to create vcoin account
         * that is when a new application user is created.
         *
         * @param $email
         * @return mixed
         * @throws Exception
         */
        public function create_new_user($email)
        {
            $comeback = api_handler::curl_post(VCOIN_SERVER . "api/account/create",
                array(
                    "email" => $email
                ));
            $comeback = json_decode($comeback);
            if (intval($comeback->result) > 0)
                throw new Exception($comeback->msg, $comeback->result);
            else return $comeback->data->accountid;
        }


    }
}